import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Network, 
  HelpCircle, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Plus, 
  Sparkles, 
  CheckSquare, 
  Square, 
  ChevronRight, 
  Loader2,
  FileText,
  X,
  FileCheck,
  PlusCircle,
  Eye,
  FileDown
} from 'lucide-react';
import { RCAWorkspace, WhyStep, Incident } from '../types';

interface WorkspaceViewProps {
  workspace: RCAWorkspace;
  setWorkspace: React.Dispatch<React.SetStateAction<RCAWorkspace>>;
  incidents: Incident[];
  onNavigateToReports: () => void;
  onAddGeneratedReport: (report: any) => void;
}

export default function WorkspaceView({ 
  workspace, 
  setWorkspace, 
  incidents, 
  onNavigateToReports,
  onAddGeneratedReport
}: WorkspaceViewProps) {
  
  const [summaryLoading, setSummaryLoading] = useState<boolean>(false);
  const [summaryData, setSummaryData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Active incident context
  const activeIncident = incidents.find(i => i.id === workspace.incidentId) || incidents[0];

  // Quality Checklist states
  const [checklist, setChecklist] = useState([
    { id: 'env-id', text: 'Cross-reference with target site telemetry logs', done: true, points: 5 },
    { id: 'evidence', text: 'Attach file evidence to at least 3 nodes', done: false, points: 15 },
    { id: 'confidence', text: 'Validate node confidence above 80% threshold', done: false, points: 10 },
    { id: 'peer-review', text: 'Submit final node to peer-review state', done: false, points: 12 },
  ]);

  // Compute live quality score
  const baseScore = 50;
  const checklistPoints = checklist.filter(item => item.done).reduce((acc, item) => acc + item.points, 0);
  const averageConfidence = workspace.whys.length > 0 
    ? Math.round(workspace.whys.reduce((acc, why) => acc + why.confidence, 0) / workspace.whys.length) 
    : 100;
  
  // Confidence score influence: weight it slightly
  const confidenceMod = Math.round((averageConfidence - 70) * 0.4);
  const liveScore = Math.min(Math.max(baseScore + checklistPoints + confidenceMod, 0), 100);

  // Toggle checklist tasks
  const handleToggleTask = (taskId: string) => {
    setChecklist(prev => prev.map(task => {
      if (task.id === taskId) {
        return { ...task, done: !task.done };
      }
      return task;
    }));
  };

  // Node editing actions
  const handleUpdateNode = (index: number, fields: Partial<WhyStep>) => {
    setWorkspace(prev => ({
      ...prev,
      whys: prev.whys.map(why => {
        if (why.index === index) {
          return { ...why, ...fields };
        }
        return why;
      })
    }));
  };

  // Generate Executive Summary via Gemini
  const handleGenerateSummary = async () => {
    setSummaryLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/gemini/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          chain: workspace.whys, 
          incidentInfo: activeIncident 
        }),
      });
      if (!res.ok) {
        throw new Error("Failed to contact server API. Please check your Gemini API Key in the Settings menu.");
      }
      const data = await res.json();
      setSummaryData(data);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "An error occurred while generating the summary report.");
    } finally {
      setSummaryLoading(false);
    }
  };

  // Transfer Gemini-generated report to master Report view
  const handlePublishReport = () => {
    if (!summaryData) return;

    const newReport = {
      id: workspace.incidentId,
      title: `NetOps RCA Report: ${activeIncident.title}`,
      caseId: `${workspace.incidentId}-REPORT`,
      incidentDate: "Today",
      reportDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      leadInvestigator: activeIncident.owner,
      status: "Approved",
      executiveSummary: summaryData.summary,
      timeline: [
        { time: "0h 00m", title: "Anomaly Detected", details: "Initial core system telemetry alert logged.", type: "error" },
        { time: "0h 12m", title: "NOC Intervention", details: "Assigned lead notified, failover triggers audited.", type: "info" },
        { time: activeIncident.duration, title: "Mitigation Stabilized", details: "Emergency corrective actions certified.", type: "success" }
      ],
      whys: workspace.whys.map(w => ({ num: w.index, text: w.statement, question: `Why? Because: ${w.statement}` })),
      rootCauseStatement: {
        title: summaryData.rootCauseStatement ? "Technical Process Root Cause" : "Technical Failure",
        body: summaryData.rootCauseStatement || "Outage caused by preventive maintenance failures on routing protocols."
      },
      actionPlan: summaryData.actionPlan || [
        { task: "Deploy firmware failover identity audit", owner: "DevOps Team", due: "10 Days", status: "In Progress" }
      ],
      approvers: [
        { role: "Investigator Signature", name: activeIncident.owner, date: "Today" },
        { role: "NOC Quality Certification", name: "Alex Rivera", date: "Today" }
      ]
    };

    onAddGeneratedReport(newReport);
    setSummaryData(null);
    onNavigateToReports();
  };

  return (
    <div id="workspace-layout-wrapper" className="flex h-full overflow-hidden bg-slate-50 font-sans select-none">
      
      {/* Center Canvas Workspace (2/3 width) */}
      <div id="workspace-center-canvas" className="flex-1 flex flex-col h-full overflow-hidden border-r border-slate-200">
        
        {/* Workspace Top Bar Context */}
        <div className="bg-white p-5 border-b border-slate-200 shrink-0 space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Active Case: {workspace.incidentId}</span>
            <span className="text-xs text-slate-400 font-mono">• Site ID: {activeIncident.siteId}</span>
          </div>
          <h2 className="text-base font-bold text-slate-800 tracking-tight">Structured 5 Whys Chain Analysis</h2>
          <p className="text-xs text-slate-500">Stitch causality links, document files, and monitor root-cause confidence margins.</p>
        </div>

        {/* The 5 Whys Chain visualizer area */}
        <div id="workspace-canvas-body" className="flex-1 overflow-y-auto p-6 space-y-5 flex flex-col items-center">
          
          {workspace.whys.map((why, idx) => {
            const isRoot = why.index === 5;
            const isFirst = why.index === 1;

            return (
              <React.Fragment key={why.index}>
                {/* Node Box */}
                <div 
                  id={`why-node-box-${why.index}`}
                  className={`w-full max-w-xl bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col gap-3 relative ${
                    isRoot 
                      ? 'border-indigo-500 bg-indigo-50/15' 
                      : 'border-slate-200'
                  }`}
                >
                  {/* Badge Header inside node */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold font-mono uppercase ${
                        isRoot ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'
                      }`}>
                        W{why.index}
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">{why.type}</span>
                    </div>

                    {/* Validation & Status Picker */}
                    <div className="flex items-center gap-2">
                      <select 
                        value={why.status}
                        onChange={(e) => handleUpdateNode(why.index, { status: e.target.value as any })}
                        className={`text-[9px] font-bold px-2 py-0.5 rounded border font-mono uppercase focus:outline-none ${
                          why.status === 'Validated' 
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-200' 
                            : 'bg-amber-50 text-amber-600 border-amber-200'
                        }`}
                      >
                        <option value="Validated">Validated</option>
                        <option value="Pending Peer Review">Peer Review</option>
                        <option value="Draft">Draft</option>
                      </select>
                    </div>
                  </div>

                  {/* Why Statement Editable Field */}
                  <div className="space-y-1">
                    <textarea
                      rows={1}
                      placeholder={isFirst ? "Describe the initial visible symptom..." : `Why did: "${workspace.whys[idx-1]?.statement || 'previous step'}" occur?`}
                      value={why.statement}
                      onChange={(e) => handleUpdateNode(why.index, { statement: e.target.value })}
                      className="w-full bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded px-3 py-1.5 text-xs text-slate-800 font-medium placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all resize-none"
                    />
                  </div>

                  {/* Footnote Evidence and Confidence slider inside node */}
                  <div className="flex items-center justify-between gap-4 pt-1 border-t border-slate-100 text-[10px]">
                    {/* Evidence file input */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400">Evidence:</span>
                      <input 
                        type="text" 
                        placeholder="Attach log file name..."
                        value={why.evidence}
                        onChange={(e) => handleUpdateNode(why.index, { evidence: e.target.value })}
                        className="bg-transparent border-b border-slate-150 hover:border-slate-300 focus:border-blue-500 focus:outline-none py-0.5 text-slate-700 font-semibold"
                      />
                    </div>

                    {/* Confidence Slider */}
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">Confidence:</span>
                      <input 
                        type="range" 
                        min="20" 
                        max="100" 
                        step="5"
                        value={why.confidence}
                        onChange={(e) => handleUpdateNode(why.index, { confidence: Number(e.target.value) })}
                        className="w-16 h-1 bg-slate-100 rounded-lg accent-blue-600 cursor-pointer"
                      />
                      <span className={`font-mono font-bold w-6 text-right ${
                        why.confidence >= 80 ? 'text-emerald-500' : 'text-amber-500'
                      }`}>
                        {why.confidence}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* SVG Connecting arrow index to next index */}
                {idx < workspace.whys.length - 1 && (
                  <svg className="w-12 h-6" viewBox="0 0 50 24">
                    <line x1="25" y1="0" x2="25" y2="24" stroke="#cbcdd5" strokeWidth="1.5" strokeDasharray="3 3" />
                    <polygon points="21,18 25,24 29,18" fill="#94a3b8" />
                  </svg>
                )}
              </React.Fragment>
            );
          })}

        </div>
      </div>

      {/* Right Assistant Sidebar (1/3 width) */}
      <div id="workspace-right-sidebar" className="w-96 bg-white flex flex-col h-full overflow-hidden">
        
        {/* NOC Quality Assistant Panel */}
        <div className="p-5 border-b border-slate-200 bg-slate-50/50 space-y-4">
          <div className="flex items-center gap-2">
            <Network className="w-5 h-5 text-indigo-600 animate-pulse" />
            <h3 className="text-sm font-bold text-slate-800 font-sans uppercase tracking-wider font-mono">NOC Quality Assistant</h3>
          </div>

          {/* Quality Circle Metric Progress */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase font-mono block">SQA Compliance Score</span>
              <h4 className="text-2xl font-extrabold text-slate-800 tracking-tight">{liveScore}% Accurate</h4>
              <p className="text-[10px] text-slate-400">Target score: 85% for report release</p>
            </div>
            
            <div className="relative">
              <svg className="w-16 h-16">
                <circle cx="32" cy="32" r="26" stroke="#f1f5f9" strokeWidth="5" fill="transparent" />
                <circle cx="32" cy="32" r="26" stroke="#4f46e5" strokeWidth="5" fill="transparent" 
                  strokeDasharray="163" strokeDashoffset={163 - (163 * liveScore) / 100} strokeLinecap="round" className="transform -rotate-90 origin-center transition-all duration-300" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-bold text-xs text-slate-800">
                {liveScore}%
              </div>
            </div>
          </div>
        </div>

        {/* Quality Tasks Checklist Scroll area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <div className="space-y-3">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono block">Verification Checklist</span>
            
            <div className="space-y-2">
              {checklist.map((task) => (
                <div 
                  key={task.id} 
                  id={`checklist-task-${task.id}`}
                  onClick={() => handleToggleTask(task.id)}
                  className="flex items-start gap-2.5 p-2.5 hover:bg-slate-50 rounded-lg cursor-pointer text-xs"
                >
                  <button type="button" className="text-indigo-600 p-0.5 shrink-0">
                    {task.done ? (
                      <CheckSquare className="w-4 h-4" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-300" />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <span className={`font-medium text-slate-700 ${task.done ? 'line-through text-slate-400' : ''}`}>
                      {task.text}
                    </span>
                    <span className="block font-mono text-[9px] text-indigo-500 mt-0.5 font-bold">+{task.points} QA pts</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Drawer Summary triggers */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-3 shrink-0">
          <button
            id="generate-executive-summary-button"
            onClick={handleGenerateSummary}
            disabled={summaryLoading}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-3 rounded-xl text-xs font-bold font-mono tracking-wide uppercase shadow-md transition-all cursor-pointer disabled:bg-indigo-800"
          >
            {summaryLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-300" />
                Drafting Formal Quality Report...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 fill-white" />
                <span>Generate Executive Summary</span>
              </>
            )}
          </button>
          <p className="text-[9px] text-slate-400 text-center font-medium">Stitches the 5 Whys chain into a legal publication-ready report.</p>
        </div>

      </div>

      {/* GEMINI REPORT DRAWER PREVIEW OVERLAY */}
      <AnimatePresence>
        {summaryData && (
          <div id="summary-drawer-backdrop" className="fixed inset-0 bg-slate-950/75 flex items-center justify-end z-50">
            <motion.div 
              id="summary-drawer-panel"
              initial={{ x: '100%', opacity: 0.5 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0.5 }}
              transition={{ type: 'spring', damping: 20, stiffness: 100 }}
              className="w-[600px] bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col"
            >
              {/* Drawer Header */}
              <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-slate-100 shrink-0">
                <div className="flex items-center gap-2.5">
                  <FileCheck className="w-5 h-5 text-emerald-400" />
                  <div>
                    <h3 className="text-sm font-bold font-sans uppercase tracking-wider">Quality Assurance Report Draft</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">Stitched via Gemini 3.5 Flash | Quality score certified at {summaryData.qualityScore}%</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSummaryData(null)}
                  className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Scrollable Body */}
              <div className="flex-1 p-6 overflow-y-auto space-y-6">
                
                {/* Executive Summary */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono block">Executive Summary</span>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans bg-slate-50 p-4 border rounded-xl">{summaryData.summary}</p>
                </div>

                {/* Root Cause Statement */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono block">Formal Root Cause Statement</span>
                  <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
                    <p className="text-xs font-bold text-indigo-950 leading-relaxed">{summaryData.rootCauseStatement}</p>
                  </div>
                </div>

                {/* Generated Action Plan Table */}
                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono block">Proposed Corrective Action Plan</span>
                  <div className="border border-slate-150 rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-150 text-[10px] font-bold text-slate-500 uppercase font-mono">
                          <th className="py-2.5 px-4">Action Item</th>
                          <th className="py-2.5 px-4">Department Owner</th>
                          <th className="py-2.5 px-4">Target Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-sans">
                        {summaryData.actionPlan?.map((item: any, idx: number) => (
                          <tr key={idx} className="hover:bg-slate-50/50">
                            <td className="py-3 px-4 font-semibold text-slate-800">{item.task}</td>
                            <td className="py-3 px-4 text-slate-500 font-medium">{item.owner}</td>
                            <td className="py-3 px-4 text-slate-500 font-mono font-bold">{item.dueDate}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Gemini Quality Feedback */}
                {summaryData.feedback && (
                  <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-xl space-y-1.5 text-xs text-slate-700 leading-relaxed">
                    <div className="flex items-center gap-1.5 text-amber-800 font-bold">
                      <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>Causality Feedback</span>
                    </div>
                    <p className="italic">{summaryData.feedback}</p>
                  </div>
                )}
              </div>

              {/* Drawer Footer controls */}
              <div className="p-4 border-t border-slate-200 bg-slate-50 flex gap-3 shrink-0 justify-end">
                <button
                  onClick={handlePublishReport}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-500 flex items-center gap-1.5 shadow cursor-pointer"
                >
                  <FileDown className="w-4 h-4" />
                  Publish to Final Reports
                </button>
                <button
                  onClick={() => setSummaryData(null)}
                  className="px-4 py-2 border border-slate-200 bg-white text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-100 cursor-pointer"
                >
                  Close Draft
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Error alert banner */}
      {errorMsg && (
        <div id="error-alert-banner" className="fixed bottom-4 right-4 bg-rose-50 border border-rose-200 p-4 rounded-xl text-rose-800 text-xs flex justify-between items-center z-50 shadow-lg">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4.5 h-4.5 text-rose-500" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg(null)} className="text-rose-500 hover:text-rose-700 font-bold font-mono ml-4">Dismiss</button>
        </div>
      )}

    </div>
  );
}
