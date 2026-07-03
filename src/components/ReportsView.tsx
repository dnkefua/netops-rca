import React, { useState } from 'react';
import { 
  BarChart3, 
  MapPin, 
  TrendingUp, 
  FileText, 
  Search, 
  ChevronRight, 
  CheckCircle, 
  Printer, 
  AlertCircle,
  Clock,
  ShieldCheck,
  Building,
  Info
} from 'lucide-react';

interface ReportsViewProps {
  reports: any[];
  selectedReportId: string;
  setSelectedReportId: (id: string) => void;
}

export default function ReportsView({ reports, selectedReportId, setSelectedReportId }: ReportsViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeMapNode, setActiveMapNode] = useState<string | null>(null);

  const selectedReport = reports.find(r => r.id === selectedReportId);

  // Map Hotspot Details for the Cameroon NOC Map (Image 5)
  const mapHotspots = [
    { id: 'douala', name: 'Douala Backbone Hub', x: 70, y: 140, breaches: 14, mttr: '112m', status: 'Warning', ip: '10.210.4.12' },
    { id: 'yaounde', name: 'Yaoundé Central Node', x: 110, y: 155, breaches: 8, mttr: '95m', status: 'Healthy', ip: '10.210.2.1' },
    { id: 'garoua', name: 'Garoua Transit Relay', x: 150, y: 60, breaches: 4, mttr: '180m', status: 'Critical', ip: '10.210.8.44' },
    { id: 'bamenda', name: 'Bamenda Regional Hub', x: 50, y: 105, breaches: 3, mttr: '142m', status: 'Healthy', ip: '10.210.5.18' }
  ];

  // Vendor SLA Penalties Table Data (Image 5)
  const vendorData = [
    { name: 'Huawei Networks', breaches: 18, mttr: '154m', penalty: '$45,000', status: 'Review' },
    { name: 'Cisco Systems', breaches: 11, mttr: '98m', penalty: '$18,500', status: 'Compliant' },
    { name: 'Nokia Solutions', breaches: 9, mttr: '124m', penalty: '$25,000', status: 'Review' },
    { name: 'Ericsson AG', breaches: 5, mttr: '82m', penalty: '$0', status: 'Compliant' }
  ];

  // Filter list of report records
  const filteredReportsList = reports.filter(r => 
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="reports-view-root" className="p-6 space-y-6 overflow-y-auto h-full bg-slate-50 font-sans select-none">
      
      {/* Top Breadcrumb Navigation & View Switcher */}
      <div className="flex items-center justify-between">
        <div>
          <h1 id="reports-title" className="text-2xl font-bold text-slate-800 tracking-tight">
            {selectedReportId ? `Reports > ${selectedReportId}` : 'Reports > Trends & Analytics'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {selectedReportId ? 'Print-ready formal SQA incident root cause document.' : 'Global telecom performance metrics, vendor compliance, and geographic hotspots.'}
          </p>
        </div>

        {selectedReportId && (
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedReportId('')}
              className="px-3.5 py-1.5 border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg cursor-pointer transition-all"
            >
              Back to Trends Dashboard
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-1.5 rounded-lg cursor-pointer shadow transition-all"
            >
              <Printer className="w-4 h-4" />
              Print / Export PDF
            </button>
          </div>
        )}
      </div>

      {/* VIEW A: TRENDS & ANALYTICS DASHBOARD */}
      {!selectedReportId ? (
        <div id="trends-dashboard-layout" className="space-y-6">
          {/* Search bar and case report index */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input 
                type="text" 
                placeholder="Search case report ledger..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            
            {/* Quick selectors for existing final reports */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase font-mono">Case Ledgers:</span>
              <div className="flex gap-1.5">
                {filteredReportsList.map(r => (
                  <button
                    key={r.id}
                    onClick={() => setSelectedReportId(r.id)}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-semibold rounded border border-blue-150 transition-all cursor-pointer font-mono"
                  >
                    <FileText className="w-3 h-3" />
                    {r.id}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Grid Layout: Maps, Vendors, and Custom bar charts (Image 5) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left 2 columns containing charts & vendor specs */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Visual Performance Charts split */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                
                {/* Chart 1: Root Causes by Category bar */}
                <div className="space-y-4">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono block">Root Causes by Category</span>
                  <div className="h-44 flex items-end justify-between px-2 border-b border-slate-200 pt-2">
                    {[
                      { label: 'Power', count: 18, pct: '100%', color: 'bg-indigo-500' },
                      { label: 'Hardware', count: 14, pct: '77%', color: 'bg-blue-500' },
                      { label: 'Config', count: 12, pct: '66%', color: 'bg-teal-500' },
                      { label: 'Human', count: 6, pct: '33%', color: 'bg-amber-500' },
                      { label: 'Vendor', count: 4, pct: '22%', color: 'bg-slate-400' }
                    ].map((item, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-1.5 group w-12">
                        <div className="relative w-full flex justify-center">
                          <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 bg-slate-800 text-white text-[9px] py-0.5 px-1.5 rounded font-mono font-bold transition-all z-10">
                            {item.count} cases
                          </div>
                          <div className="w-3 bg-slate-100 rounded-t-sm h-32 flex items-end">
                            <div className={`w-full ${item.color} rounded-t-sm`} style={{ height: item.pct }} />
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-500 font-semibold uppercase">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chart 2: Week-by-Week SLA Breaches bar */}
                <div className="space-y-4">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono block font-sans">SLA Breaches (Week-by-Week)</span>
                  <div className="h-44 flex items-end justify-between px-2 border-b border-slate-200 pt-2">
                    {[
                      { week: 'W38', count: 4, pct: '30%', isPeak: false },
                      { week: 'W39', count: 3, pct: '22%', isPeak: false },
                      { week: 'W40', count: 14, pct: '100%', isPeak: true }, // Highlighted red peak like mockup 5!
                      { week: 'W41', count: 8, pct: '57%', isPeak: false },
                      { week: 'W42', count: 5, pct: '35%', isPeak: false },
                      { week: 'W43', count: 2, pct: '15%', isPeak: false }
                    ].map((item, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-1.5 group w-10">
                        <div className="relative w-full flex justify-center">
                          <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 bg-slate-800 text-white text-[9px] py-0.5 px-1.5 rounded font-mono font-bold transition-all z-10">
                            {item.count} alerts
                          </div>
                          <div className="w-4 bg-slate-100 rounded-t-sm h-32 flex items-end">
                            <div className={`w-full rounded-t-sm ${item.isPeak ? 'bg-rose-500' : 'bg-blue-400'}`} style={{ height: item.pct }} />
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono font-bold">{item.week}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Vendor Performance Specifications (Image 5) */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-slate-500" />
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">Vendor SLA Penalty Matrix</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase font-mono">
                        <th className="py-2.5 px-4">Vendor Partner</th>
                        <th className="py-2.5 px-4">Core Breaches</th>
                        <th className="py-2.5 px-4">Resolution MTTR</th>
                        <th className="py-2.5 px-4">Assessed Penalties</th>
                        <th className="py-2.5 px-4 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-150 font-sans">
                      {vendorData.map((v, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="py-3 px-4 font-bold text-slate-800">{v.name}</td>
                          <td className="py-3 px-4 font-mono font-bold text-rose-500">{v.breaches} cases</td>
                          <td className="py-3 px-4 font-semibold text-slate-600">{v.mttr}</td>
                          <td className="py-3 px-4 font-mono font-bold text-slate-800">{v.penalty}</td>
                          <td className="py-3 px-4 text-right">
                            <span className={`px-2 py-0.5 rounded font-mono font-bold text-[9px] ${
                              v.status === 'Compliant' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {v.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* Right column containing Cameroon Map and Critical Site list */}
            <div className="space-y-6">
              
              {/* Cameroon Map Hotspot Card */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-rose-500 animate-bounce" />
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">Cameroon Region Hotspots</span>
                </div>

                {/* Simulated Geographic SVG Map */}
                <div className="h-64 bg-slate-50 rounded-xl relative border border-slate-150 flex items-center justify-center overflow-hidden">
                  {/* Cameroon Map Path Approximation */}
                  <svg className="w-full h-full p-4 text-slate-200" viewBox="0 0 200 200">
                    {/* Cameroon shape outline */}
                    <path 
                      d="M 50,110 L 45,95 L 60,85 L 80,70 L 110,65 L 125,40 L 150,10 L 165,15 L 160,35 L 145,55 L 140,80 L 155,100 L 140,120 L 125,145 L 120,175 L 100,185 L 80,180 L 75,150 L 55,140 Z" 
                      fill="#e2e8f0" 
                      stroke="#cbd5e1" 
                      strokeWidth="2" 
                    />
                    
                    {/* Hotspot Indicator Dots */}
                    {mapHotspots.map(spot => (
                      <g 
                        key={spot.id} 
                        className="cursor-pointer"
                        onMouseEnter={() => setActiveMapNode(spot.id)}
                        onMouseLeave={() => setActiveMapNode(null)}
                      >
                        <circle 
                          cx={spot.x} 
                          cy={spot.y} 
                          r={spot.status === 'Critical' ? '7' : '5'} 
                          className={`${
                            spot.status === 'Critical' ? 'fill-rose-500 animate-pulse' :
                            spot.status === 'Warning' ? 'fill-amber-500' : 'fill-blue-500'
                          }`}
                        />
                        <circle cx={spot.x} cy={spot.y} r="1" fill="white" />
                      </g>
                    ))}
                  </svg>

                  {/* Hotspot Tooltip overlay */}
                  {activeMapNode && (
                    (() => {
                      const spot = mapHotspots.find(s => s.id === activeMapNode);
                      if (!spot) return null;
                      return (
                        <div className="absolute inset-x-3 bottom-3 p-3 bg-slate-900 text-white rounded-lg border border-slate-800 flex flex-col gap-1 text-[10px] shadow-lg animate-fadeIn">
                          <div className="flex justify-between font-bold">
                            <span>{spot.name}</span>
                            <span className={`px-1.5 rounded uppercase font-mono text-[9px] ${
                              spot.status === 'Critical' ? 'bg-rose-500' :
                              spot.status === 'Warning' ? 'bg-amber-500' : 'bg-blue-500'
                            }`}>{spot.status}</span>
                          </div>
                          <div className="flex justify-between text-slate-400 font-mono mt-0.5">
                            <span>IP Address: {spot.ip}</span>
                            <span>Breaches: {spot.breaches}</span>
                          </div>
                          <div className="flex justify-between text-slate-400 font-mono">
                            <span>Mean MTTR: {spot.mttr}</span>
                          </div>
                        </div>
                      );
                    })()
                  )}

                  {!activeMapNode && (
                    <div className="absolute top-2 right-2 text-[9px] text-slate-400 font-mono flex items-center gap-1 bg-white px-2 py-0.5 rounded shadow-sm border">
                      <Info className="w-3 h-3 text-slate-400" />
                      Hover dots for ping stats
                    </div>
                  )}
                </div>
              </div>

              {/* Critical Site Alerts widget */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono block">Critical Site Watchlist</span>
                
                <div className="divide-y divide-slate-100 text-xs">
                  {[
                    { id: 'DLA-HUB-01', region: 'Douala Ring-A', breaches: '08 cases', status: 'Warning' },
                    { id: 'GAR-REL-44', region: 'Garoua North', breaches: '04 cases', status: 'Critical' },
                    { id: 'YDE-CORE-02', region: 'Yaoundé Central', breaches: '02 cases', status: 'Healthy' }
                  ].map((site) => (
                    <div key={site.id} className="py-2.5 flex items-center justify-between">
                      <div>
                        <span className="font-mono font-bold text-slate-800 block">{site.id}</span>
                        <span className="text-[10px] text-slate-400 font-medium">{site.region}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-slate-500 font-bold text-[10px]">{site.breaches}</span>
                        <span className={`w-2 h-2 rounded-full ${
                          site.status === 'Critical' ? 'bg-rose-500 animate-pulse' :
                          site.status === 'Warning' ? 'bg-amber-500' : 'bg-emerald-500'
                        }`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>
      ) : (
        /* VIEW B: DETAILED, PRINTABLE CASE REPORT (Image 6) */
        <div id="rca-printable-report" className="bg-white rounded-2xl border border-slate-200 shadow-lg p-8 max-w-4xl mx-auto space-y-8 print:border-none print:shadow-none print:p-0">
          
          {/* Document Header block */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-5">
            <div className="space-y-1.5">
              <span className="font-mono text-[10px] font-bold text-blue-600 tracking-wider uppercase bg-blue-50 px-2 py-0.5 rounded">QUALITY ASSURANCE CORE AUDIT FEED</span>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">{selectedReport.title}</h2>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span>Case ID: <strong className="font-mono text-slate-700">{selectedReport.caseId}</strong></span>
                <span>•</span>
                <span>Incident Date: <strong className="text-slate-700">{selectedReport.incidentDate}</strong></span>
                <span>•</span>
                <span>Release Date: <strong className="text-slate-700">{selectedReport.reportDate}</strong></span>
              </div>
            </div>

            <div className="shrink-0 text-right">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded border border-emerald-200 uppercase font-mono tracking-wider shadow-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                {selectedReport.status}
              </span>
            </div>
          </div>

          {/* Two column Meta details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Lead Investigator:</span>
                <span className="font-bold text-slate-800">{selectedReport.leadInvestigator}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Release Classification:</span>
                <span className="font-bold text-slate-800 uppercase font-mono">Restricted Technical</span>
              </div>
            </div>
            <div className="text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">SLA Recovery Certification:</span>
                <span className="font-bold text-emerald-600">COMPLETED</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Quality Index Assessment:</span>
                <span className="font-bold text-blue-600 font-mono">92/100 Compliance</span>
              </div>
            </div>
          </div>

          {/* Section 1: Executive Summary */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-extrabold text-slate-950 uppercase tracking-widest font-mono">1.0 Executive Incident Summary</h3>
            <p className="text-xs text-slate-600 leading-relaxed text-justify font-sans">{selectedReport.executiveSummary}</p>
          </div>

          {/* Section 2: Timeline of Events */}
          <div className="space-y-4">
            <h3 className="text-xs font-extrabold text-slate-950 uppercase tracking-widest font-mono">2.0 Operational Timeline of Events</h3>
            
            <div className="space-y-3 pl-4 border-l-2 border-slate-200 relative">
              {selectedReport.timeline?.map((evt: any, idx: number) => (
                <div key={idx} className="relative text-xs space-y-0.5">
                  <div className={`absolute -left-[22px] top-1 w-2.5 h-2.5 rounded-full ${
                    evt.type === 'error' ? 'bg-rose-500' :
                    evt.type === 'success' ? 'bg-emerald-500' : 'bg-blue-500'
                  }`} />
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900">{evt.time}</span>
                    <span className="font-bold text-slate-800">• {evt.title}</span>
                  </div>
                  <p className="text-slate-500 font-medium pl-6">{evt.details}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: 5 Whys Analysis Logic */}
          <div className="space-y-4">
            <h3 className="text-xs font-extrabold text-slate-950 uppercase tracking-widest font-mono">3.0 Structured 5 Whys Analysis</h3>
            
            <div className="divide-y divide-slate-150 border border-slate-150 rounded-xl overflow-hidden text-xs">
              {selectedReport.whys?.map((why: any) => (
                <div key={why.num} className="p-4 bg-white flex gap-4 hover:bg-slate-50/20 transition-all">
                  <div className="w-6 h-6 rounded-full bg-slate-900 text-white font-mono font-bold text-[10px] flex items-center justify-center shrink-0">
                    W{why.num}
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 font-mono uppercase block">{why.question}</span>
                    <p className="font-semibold text-slate-800 leading-relaxed">{why.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Root Cause Statement */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold text-slate-950 uppercase tracking-widest font-mono">4.0 Official Root Cause Statement</h3>
            <div className="p-5 bg-slate-900 text-slate-200 border border-slate-950 rounded-xl space-y-2">
              <span className="text-[10px] font-bold text-blue-400 font-mono uppercase tracking-wider block">
                {selectedReport.rootCauseStatement?.title}
              </span>
              <p className="text-xs leading-relaxed font-medium">{selectedReport.rootCauseStatement?.body}</p>
            </div>
          </div>

          {/* Section 5: Corrective and Preventive Action Plan */}
          <div className="space-y-4">
            <h3 className="text-xs font-extrabold text-slate-950 uppercase tracking-widest font-mono">5.0 Corrective & Preventive Action Plan (CAPA)</h3>
            
            <div className="border border-slate-150 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-150 text-[10px] font-bold text-slate-500 uppercase font-mono">
                    <th className="py-2.5 px-4">Action Item</th>
                    <th className="py-2.5 px-4">Owner Assignment</th>
                    <th className="py-2.5 px-4 text-center">Due Target</th>
                    <th className="py-2.5 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {selectedReport.actionPlan?.map((item: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-bold text-slate-800">{item.task}</td>
                      <td className="py-3 px-4 text-slate-600 font-medium">{item.owner}</td>
                      <td className="py-3 px-4 text-center text-slate-500 font-mono font-bold">{item.due}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-[9px] uppercase">
                        <span className={`px-2 py-0.5 rounded ${
                          item.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 6: Sign-off block with Dates */}
          <div className="pt-6 border-t border-slate-200">
            <h3 className="text-xs font-extrabold text-slate-950 uppercase tracking-widest font-mono mb-4">6.0 Certification & Sign-off</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs">
              {selectedReport.approvers?.map((app: any, idx: number) => (
                <div key={idx} className="border-t border-slate-300 pt-3 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">{app.role}</span>
                  <p className="font-mono font-bold italic text-slate-800 tracking-wider text-sm">{app.name}</p>
                  <span className="block font-mono text-[10px] text-slate-400">Date certified: {app.date}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
