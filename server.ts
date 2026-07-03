import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Shared Gemini client utility
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // API Route for Predictive Insights - Mitigation Plan
  app.post("/api/gemini/mitigation", async (req, res) => {
    try {
      const { scenario } = req.body;
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "GEMINI_API_KEY is not configured in environment." });
      }

      const prompt = `You are a Senior Network Operations Architect.
Generate a professional, highly detailed, step-by-step Network Mitigation and Resolution Plan for the following incident scenario:
"${scenario}"

The response should be structured as a JSON object with:
{
  "title": "A short clear title for the mitigation plan",
  "summary": "A brief executive summary of the target strategy",
  "steps": [
    {
      "phase": "Phase title (e.g. Isolation, Remediation, Hardening)",
      "action": "Detailed operational action items",
      "targetTime": "Estimated duration (e.g. 15 mins, 2 hours)",
      "responsibility": "Responsible team or lead"
    }
  ],
  "recommendations": ["A list of long-term prevention recommendations"]
}
Only output the JSON object, do not wrap it in markdown block quotes (like \`\`\`json) or extra text. Make sure it is valid JSON.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      const responseText = response.text || "{}";
      res.json(JSON.parse(responseText.trim()));
    } catch (error: any) {
      console.error("Gemini API error:", error);
      res.status(500).json({ error: error.message || "Failed to generate mitigation plan." });
    }
  });

  // API Route for 5 Whys Analysis - Executive Summary Generator
  app.post("/api/gemini/summary", async (req, res) => {
    try {
      const { chain, incidentInfo } = req.body; // chain of whys and metadata
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "GEMINI_API_KEY is not configured in environment." });
      }

      const prompt = `You are an expert Telecom NOC Quality Analyst.
Review the following incident info and "5 Whys" root cause analysis chain:

Incident: ${incidentInfo.title} (${incidentInfo.id})
Region: ${incidentInfo.region} | Site: ${incidentInfo.siteId} | SLA Impact: ${incidentInfo.slaImpact}
5 Whys Chain:
${chain.map((why: any, idx: number) => `Why ${idx + 1} (${why.type || 'Step'}): ${why.statement} (Evidence: ${why.evidence || 'None'}, Confidence: ${why.confidence || '100%'})`).join("\n")}

Generate a formal, publication-ready Root Cause Executive Summary and Statement.
The response must be a JSON object structured exactly as follows:
{
  "summary": "A concise executive summary describing the incident context, progression, and resolution",
  "rootCauseStatement": "A formal root cause statement detailing the core technical or process failure",
  "actionPlan": [
    {
      "task": "Remediation or preventive task description",
      "owner": "Department or role owner (e.g. S. Chen, DevOps Team, NOC Leads)",
      "dueDate": "Logical relative timeframe (e.g. Oct 30, Nov 15, etc.)",
      "status": "In Progress, Completed, or Pending"
    }
  ],
  "qualityScore": 88,
  "feedback": "A professional assessment of the 5 Whys logic and tips to improve it"
}
Only output the JSON object, do not wrap it in markdown block quotes or extra text. Make sure it is valid JSON.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      const responseText = response.text || "{}";
      res.json(JSON.parse(responseText.trim()));
    } catch (error: any) {
      console.error("Gemini API error:", error);
      res.status(500).json({ error: error.message || "Failed to generate executive summary." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
