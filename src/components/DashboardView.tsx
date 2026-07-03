import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingDown, 
  TrendingUp, 
  CheckCircle, 
  AlertTriangle, 
  Sparkles, 
  ArrowRight,
  Loader2,
  X,
  FileCheck,
  MapPin,
  Clock,
  ExternalLink
} from 'lucide-react';
import { Incident } from '../types';

interface DashboardViewProps {
  incidents: Incident[];
  onSelectIncident: (id: string) => void;
  onSelectWorkspace: (id: string) => void;
}

export default function DashboardView({ incidents, onSelectIncident, onSelectWorkspace }: DashboardViewProps) {
  const [mitigationLoading, setMitigationLoading] = useState<boolean>(false);
  const [mitigationPlan, setMitigationPlan] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Hardcoded target scenario from mock
  const predictiveScenario = "14% increase in Fiber-related incidents next week due to scheduled regional roadworks in Sector B near Douala backbone line.";

  const handleGenerateMitigation = async () => {
    setMitigationLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/gemini/mitigation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario: predictiveScenario }),
      });
      if (!res.ok) {
        throw new Error("Failed to contact server API. Please check your Gemini API Key in the Settings menu.");
      }
      const data = await res.json();
      setMitigationPlan(data);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "An error occurred while generating the mitigation plan.");
    } finally {
      setMitigationLoading(false);
    }
  };

  // KPI Calculations based on state
  const totalIncidents = incidents.length;
  const criticalCount = incidents.filter(i => i.severity === 'Critical').length;
  const inReviewCount = incidents.filter(i => i.status === 'In Review').length;

  return (
    <div id="dashboard-view-wrapper" className="p-6 space-y-6 overflow-y-auto h-full bg-slate-50 font-sans select-none">
      {/* Top Banner / Welcome */}
      <div id="dashboard-welcome-header" className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 id="dashboard-title" className="text-2xl font-bold font-sans tracking-tight text-slate-800">Executive Performance Overview</h1>
          <p id="dashboard-subtitle" className="text-xs text-slate-500 mt-1">Real-time metrics, quality tracking, and predictive NOC failure indicators.</p>
        </div>
        <div className="flex gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            All Core Subsystems Operational
          </span>
        </div>
      </div>

      {/* Bento Grid KPIs */}
      <div id="bento-kpi-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* KPI 1: MTTR */}
        <div id="kpi-card-mttr" className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase font-mono">Mean Time to Resolve (MTTR)</span>
            <span className="p-1 bg-emerald-50 rounded-lg text-emerald-600">
              <TrendingDown className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-extrabold text-slate-800 tracking-tight font-sans">142 min</h3>
            <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1 mt-1.5">
              -15.4% <span className="text-slate-400 font-normal">from last cycle average (168 min)</span>
            </p>
          </div>
        </div>

        {/* KPI 2: SLA Compliance */}
        <div id="kpi-card-sla" className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase font-mono">SLA Compliance</span>
            <span className="p-1 bg-blue-50 rounded-lg text-blue-600">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-extrabold text-slate-800 tracking-tight font-sans">99.82%</h3>
            <p className="text-xs text-blue-600 font-semibold flex items-center gap-1 mt-1.5">
              +0.04% <span className="text-slate-400 font-normal">relative to NOC target (99.75%)</span>
            </p>
          </div>
        </div>

        {/* KPI 3: Action Completion */}
        <div id="kpi-card-capa" className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase font-mono">CAPA Action Score</span>
            <span className="p-1 bg-indigo-50 rounded-lg text-indigo-600">
              <CheckCircle className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-4 flex items-center gap-4">
            <div className="relative shrink-0">
              {/* Custom Circular Progress */}
              <svg className="w-14 h-14">
                <circle cx="28" cy="28" r="24" stroke="#f1f5f9" strokeWidth="4" fill="transparent" />
                <circle cx="28" cy="28" r="24" stroke="#4f46e5" strokeWidth="4" fill="transparent" 
                  strokeDasharray="150" strokeDashoffset="48" strokeLinecap="round" className="transform -rotate-90 origin-center" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-sans font-bold text-xs text-slate-800">
                68%
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 leading-tight">68.2% Total</h3>
              <p className="text-xs text-slate-400 mt-0.5">32 of 47 Actions Completed</p>
            </div>
          </div>
        </div>

        {/* KPI 4: Pending RCAs */}
        <div id="kpi-card-rcas" className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase font-mono">Recurring Incidents</span>
            <span className="p-1 bg-rose-50 rounded-lg text-rose-600">
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-extrabold text-slate-800 tracking-tight font-sans">04 <span className="text-sm font-normal text-slate-400">cases</span></h3>
            <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1 mt-1.5">
              -23% <span className="text-slate-400 font-normal">reduction due to automated hardening</span>
            </p>
          </div>
        </div>
      </div>

      {/* Main Charts & Predictive Section */}
      <div id="charts-predictive-row" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Visual Charts Card (2/3 width on desktop) */}
        <div id="dashboard-charts-panel" className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-800">Network Telemetry & Incident Trends</h2>
              <p className="text-xs text-slate-500">Weekly resolution capacity and incident classifications.</p>
            </div>
            <div className="flex gap-2 text-xs">
              <span className="px-2.5 py-1 bg-slate-100 rounded-md font-medium text-slate-600">Last 7 Days</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Custom SVG Bar Chart - Incidents by Category */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-600 uppercase font-mono">Incidents by Category</span>
                <span className="text-xs font-semibold text-slate-400">Total: 47 cases</span>
              </div>
              <div className="h-44 flex items-end justify-between px-2 pt-2 pb-1 border-b border-slate-200">
                {[
                  { label: 'Fiber', val: 18, pct: '100%', color: 'bg-blue-500' },
                  { label: 'Power', val: 12, pct: '66%', color: 'bg-indigo-500' },
                  { label: 'RAN', val: 9, pct: '50%', color: 'bg-teal-500' },
                  { label: 'Core', val: 5, pct: '28%', color: 'bg-amber-500' },
                  { label: 'OSS', val: 3, pct: '16%', color: 'bg-slate-400' }
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-2 group w-12">
                    <div className="relative w-full flex justify-center">
                      {/* Tooltip */}
                      <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 bg-slate-800 text-white text-[10px] py-1 px-2 rounded-md font-mono font-bold transition-all whitespace-nowrap z-10">
                        {item.val} cases
                      </div>
                      <div className="w-4 bg-slate-100 rounded-t-sm h-32 flex items-end">
                        <div className={`w-full ${item.color} rounded-t-sm`} style={{ height: item.pct }} />
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-tight">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom SVG Line Chart - SLA Breach Trend */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-600 uppercase font-mono">SLA Breach Incident Trend</span>
                <span className="text-xs font-semibold text-rose-500 font-mono">-14% Target Offset</span>
              </div>
              <div className="h-44 relative border-b border-l border-slate-200">
                {/* SVG Line path representation */}
                <svg className="w-full h-full" viewBox="0 0 200 100" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="slaAreaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity="0.2"/>
                      <stop offset="100%" stopColor="#ef4444" stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                  {/* Grid Lines */}
                  <line x1="0" y1="25" x2="200" y2="25" stroke="#f1f5f9" strokeWidth="0.5" />
                  <line x1="0" y1="50" x2="200" y2="50" stroke="#f1f5f9" strokeWidth="0.5" />
                  <line x1="0" y1="75" x2="200" y2="75" stroke="#f1f5f9" strokeWidth="0.5" />
                  
                  {/* Target line */}
                  <line x1="0" y1="60" x2="200" y2="60" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
                  
                  {/* Filled Area */}
                  <path d="M 0,90 L 25,65 L 50,75 L 75,40 L 100,55 L 125,30 L 150,22 L 175,10 L 200,5 L 200,100 L 0,100 Z" fill="url(#slaAreaGrad)" />
                  {/* Trend Line */}
                  <path d="M 0,90 L 25,65 L 50,75 L 75,40 L 100,55 L 125,30 L 150,22 L 175,10 L 200,5" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
                  
                  {/* Highlight dots */}
                  <circle cx="150" cy="22" r="3" fill="#ef4444" />
                  <circle cx="175" cy="10" r="3" fill="#ef4444" />
                  <circle cx="200" cy="5" r="3" fill="#ef4444" />
                </svg>
                {/* Horizontal Labels */}
                <div className="absolute inset-x-0 bottom-0 translate-y-full pt-1 flex justify-between text-[8px] font-mono font-bold text-slate-400">
                  <span>Wk 40</span>
                  <span>Wk 41</span>
                  <span>Wk 42</span>
                  <span>Wk 43</span>
                  <span>Wk 44 (Curr)</span>
                </div>
                {/* Target label */}
                <div className="absolute right-1 top-12 text-[8px] font-semibold text-slate-400 font-mono">
                  SLA Target Boundary
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gemini Predictive Insights Card (1/3 width) */}
        <div id="predictive-insights-panel" className="bg-gradient-to-br from-slate-900 to-indigo-950 p-6 rounded-xl border border-indigo-900 shadow-lg text-slate-100 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-500/20 text-blue-400 rounded-lg border border-blue-500/30">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-bold font-sans tracking-wide uppercase text-blue-400 font-mono">NOC Predictive Insights</h3>
                <p className="text-[10px] text-slate-400">AI Horizon Scan Engine</p>
              </div>
            </div>

            <div className="p-4 bg-slate-800/40 rounded-lg border border-slate-700/50 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase font-mono">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Medium-Term Alert</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                "{predictiveScenario}"
              </p>
            </div>

            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex justify-between">
                <span>Confidence Score:</span>
                <span className="font-mono text-emerald-400 font-bold">92.4%</span>
              </div>
              <div className="flex justify-between">
                <span>SLA Breach Risk:</span>
                <span className="font-mono text-rose-400 font-bold">CRITICAL</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80">
            <button
              id="generate-mitigation-plan-button"
              onClick={handleGenerateMitigation}
              disabled={mitigationLoading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-lg text-xs font-semibold shadow-md transition-all cursor-pointer disabled:bg-blue-800 disabled:text-slate-400"
            >
              {mitigationLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-300" />
                  Mapping Regional Topology...
                </>
              ) : (
                <>
                  <span>Generate Mitigation Plan</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
            <p className="text-[9px] text-slate-500 mt-2 text-center">Powered by Gemini 3.5 Flash | Zero Data Retention Policy</p>
          </div>
        </div>

      </div>

      {/* High Priority RCA Cases Table */}
      <div id="high-priority-rca-table-panel" className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 id="table-title" className="text-base font-bold text-slate-800">High-Priority RCA Cases</h2>
            <p id="table-subtitle" className="text-xs text-slate-500 mt-1">NOC Incident logs requiring structured 5 Whys and sign-off.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Active Review Pool:</span>
            <span className="bg-rose-500/10 text-rose-500 text-xs font-bold px-2.5 py-0.5 rounded-full font-mono">
              {criticalCount} Critical
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table id="rca-dashboard-table" className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                <th className="py-3 px-5">RCA Case ID</th>
                <th className="py-3 px-5">Incident Description</th>
                <th className="py-3 px-5">Severity</th>
                <th className="py-3 px-5">Region</th>
                <th className="py-3 px-5">Assigned Lead</th>
                <th className="py-3 px-5">Quality Target</th>
                <th className="py-3 px-5">SLA Impact</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150 text-xs">
              {incidents.slice(0, 5).map((inc) => (
                <tr key={inc.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-5 font-mono font-bold text-slate-700">
                    {inc.id}
                  </td>
                  <td className="py-3.5 px-5">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-800 line-clamp-1">{inc.title}</span>
                      <span className="text-[10px] text-slate-400 mt-0.5 font-mono">{inc.siteId} | {inc.category} segment</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-5">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                      inc.severity === 'Critical' 
                        ? 'bg-rose-500/10 text-rose-600' 
                        : 'bg-amber-500/10 text-amber-600'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${inc.severity === 'Critical' ? 'bg-rose-500' : 'bg-amber-500'}`} />
                      {inc.severity}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 font-medium text-slate-600">
                    {inc.region}
                  </td>
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-[9px] text-slate-600">
                        {inc.ownerInitials}
                      </div>
                      <span className="text-slate-700 font-medium">{inc.owner}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-5">
                    <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                      inc.status === 'Approved' 
                        ? 'bg-emerald-500/10 text-emerald-600' 
                        : inc.status === 'In Review' 
                        ? 'bg-blue-500/10 text-blue-600' 
                        : 'bg-slate-200 text-slate-600'
                    }`}>
                      {inc.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 font-mono font-bold text-rose-500">
                    {inc.slaImpact}
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => onSelectIncident(inc.id)}
                        className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-800 transition-all font-medium flex items-center gap-1 cursor-pointer"
                        title="View CAPA details"
                      >
                        <span>CAPA</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => onSelectWorkspace(inc.id)}
                        className="px-2.5 py-1 bg-slate-900 text-white rounded hover:bg-slate-800 text-[10px] font-bold font-mono transition-all cursor-pointer"
                      >
                        5 Whys
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MITIGATION PLAN DIALOG OVERLAY (AnimatePresence) */}
      <AnimatePresence>
        {mitigationPlan && (
          <div id="mitigation-modal-backdrop" className="fixed inset-0 bg-slate-950/75 flex items-center justify-center p-4 z-50">
            <motion.div 
              id="mitigation-modal"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl border border-slate-200 max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl"
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-slate-200 flex items-start justify-between bg-slate-50 rounded-t-2xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{mitigationPlan.title || 'Mitigation Plan'}</h3>
                    <p className="text-xs text-slate-500 font-mono mt-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" /> Sector B Douala | Target Risk: Roadworks excavation
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setMitigationPlan(null)}
                  className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-5">
                <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 text-xs text-slate-700 leading-relaxed">
                  <span className="font-bold text-blue-800 block mb-1">Executive Strategy Summary:</span>
                  {mitigationPlan.summary}
                </div>

                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono block">Tactical Actions</span>
                  <div className="divide-y divide-slate-150 border border-slate-150 rounded-xl overflow-hidden">
                    {mitigationPlan.steps?.map((step: any, idx: number) => (
                      <div key={idx} className="p-4 bg-white hover:bg-slate-50/50 transition-colors flex gap-4">
                        <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 font-mono font-bold text-[10px] flex items-center justify-center shrink-0">
                          {idx + 1}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-800">{step.phase}</span>
                            <span className="inline-flex items-center gap-1 text-[10px] text-slate-400 font-mono font-bold bg-slate-50 border border-slate-150 px-2 py-0.5 rounded">
                              <Clock className="w-3 h-3" /> {step.targetTime}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">{step.action}</p>
                          <div className="text-[10px] text-slate-400 font-semibold uppercase font-mono">
                            Assigned: <span className="text-blue-600">{step.responsibility}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {mitigationPlan.recommendations && mitigationPlan.recommendations.length > 0 && (
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <span className="text-xs font-bold text-slate-700 block">Long-Term Preventive Recommendations:</span>
                    <ul className="list-disc pl-4 space-y-1 text-xs text-slate-600 leading-relaxed">
                      {mitigationPlan.recommendations.map((rec: string, idx: number) => (
                        <li key={idx}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-slate-200 bg-slate-50 rounded-b-2xl flex justify-end gap-3">
                <button
                  onClick={() => {
                    alert("Exporting mitigation checklist to NOC playbook systems...");
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-500 cursor-pointer"
                >
                  Apply Plan to NOC Playbook
                </button>
                <button
                  onClick={() => setMitigationPlan(null)}
                  className="px-4 py-2 border border-slate-200 bg-white text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-100 cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ERROR MESSAGE IF CALL FAILS */}
      {errorMsg && (
        <div id="error-alert-banner" className="bg-rose-50 border border-rose-200 p-4 rounded-xl text-rose-800 text-xs flex justify-between items-center">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg(null)} className="text-rose-500 hover:text-rose-700 font-bold font-mono">Dismiss</button>
        </div>
      )}
    </div>
  );
}
