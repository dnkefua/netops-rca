import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  AlertTriangle, 
  Clock, 
  DollarSign, 
  TrendingDown, 
  Users, 
  Briefcase,
  Layers,
  CheckSquare,
  Square,
  Plus,
  Trash2,
  Calendar,
  Zap,
  ShieldAlert
} from 'lucide-react';
import { Incident, CAPAAction, ActionStatus } from '../types';

interface IncidentsViewProps {
  incidents: Incident[];
  capaActions: CAPAAction[];
  setCapaActions: React.Dispatch<React.SetStateAction<CAPAAction[]>>;
  selectedIncidentId: string;
  setSelectedIncidentId: (id: string) => void;
}

export default function IncidentsView({ 
  incidents, 
  capaActions, 
  setCapaActions, 
  selectedIncidentId, 
  setSelectedIncidentId 
}: IncidentsViewProps) {
  
  // Search and Filter States for left list
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'overview' | 'capa' | 'logs'>('overview');

  // Mini Form state for adding custom CAPA actions
  const [showAddCapa, setShowAddCapa] = useState(false);
  const [newCapaTitle, setNewCapaTitle] = useState('');
  const [newCapaOwner, setNewCapaOwner] = useState('');
  const [newCapaDept, setNewCapaDept] = useState('Network Ops');
  const [newCapaPriority, setNewCapaPriority] = useState<'Critical' | 'High' | 'Medium' | 'Low'>('Medium');
  const [newCapaType, setNewCapaType] = useState<'Corrective' | 'Preventive'>('Corrective');

  const selectedIncident = incidents.find(i => i.id === selectedIncidentId) || incidents[0];

  // Filter list
  const filteredIncidents = incidents.filter(inc => {
    const matchesSearch = inc.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          inc.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          inc.siteId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === 'All' || inc.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  // Filter CAPA actions associated with the active department / context
  // To make it look incredibly real, we distribute actions or display all actions with category splits
  const activeIncidentActions = capaActions; // Let's use the shared global state

  // Separation of actions
  const correctiveActions = activeIncidentActions.filter(a => a.priority === 'High' || a.priority === 'Critical');
  const preventiveActions = activeIncidentActions.filter(a => a.priority === 'Medium' || a.priority === 'Low');

  // Stats computation
  const totalActions = activeIncidentActions.length;
  const completedActionsCount = activeIncidentActions.filter(a => a.status === 'Completed').length;
  const overdueCount = activeIncidentActions.filter(a => a.status === 'Overdue').length;
  const inProgressCount = activeIncidentActions.filter(a => a.status === 'In Progress').length;
  const completionPercentage = totalActions > 0 ? Math.round((completedActionsCount / totalActions) * 100) : 0;

  // Toggle CAPA Action Completion
  const handleToggleCapaStatus = (id: string) => {
    setCapaActions(prev => prev.map(act => {
      if (act.id === id) {
        const nextStatus: ActionStatus = act.status === 'Completed' ? 'In Progress' : 'Completed';
        return { ...act, status: nextStatus };
      }
      return act;
    }));
  };

  // Add custom action
  const handleCreateCapaAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCapaTitle.trim() || !newCapaOwner.trim()) return;

    const newAction: CAPAAction = {
      id: `CAPA-${Math.floor(100 + Math.random() * 900)}`,
      title: newCapaTitle,
      status: 'In Progress',
      owner: newCapaOwner,
      department: newCapaDept,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      priority: newCapaPriority,
      description: `Emergency action item generated for incident mitigation context of ${selectedIncident.id}`
    };

    setCapaActions(prev => [newAction, ...prev]);
    setNewCapaTitle('');
    setNewCapaOwner('');
    setShowAddCapa(false);
  };

  // Delete CAPA action
  const handleDeleteCapaAction = (id: string) => {
    setCapaActions(prev => prev.filter(act => act.id !== id));
  };

  // Compute departmental workload counts
  const getDeptWorkload = (dept: string) => {
    const total = activeIncidentActions.filter(a => a.department === dept).length;
    const completed = activeIncidentActions.filter(a => a.department === dept && a.status === 'Completed').length;
    return {
      total,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  };

  const departments = ['Infrastructure', 'Network Ops', 'Cybersecurity', 'Maintenance', 'Operations'];

  return (
    <div id="incidents-workspace-container" className="flex h-full overflow-hidden bg-slate-50 font-sans select-none">
      
      {/* Left List Pane */}
      <div id="incidents-left-list-pane" className="w-80 border-r border-slate-200 bg-white flex flex-col h-full shrink-0">
        
        {/* List Header Search */}
        <div className="p-4 border-b border-slate-200 space-y-3 shrink-0">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">Incident Registry</span>
            <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">
              {filteredIncidents.length} active
            </span>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input 
              id="registry-search"
              type="text" 
              placeholder="Filter by ID, Title, Site..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>

          <div className="flex gap-2">
            <button 
              id="filter-severity-all"
              onClick={() => setSeverityFilter('All')}
              className={`flex-1 text-[10px] font-bold py-1 px-2.5 rounded border transition-all cursor-pointer ${
                severityFilter === 'All' 
                  ? 'bg-slate-900 text-white border-slate-900' 
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              All
            </button>
            <button 
              id="filter-severity-critical"
              onClick={() => setSeverityFilter('Critical')}
              className={`flex-1 text-[10px] font-bold py-1 px-2.5 rounded border transition-all cursor-pointer ${
                severityFilter === 'Critical' 
                  ? 'bg-rose-500 text-white border-rose-500' 
                  : 'bg-white text-rose-500 border-rose-100 hover:bg-rose-50/50'
              }`}
            >
              Critical
            </button>
            <button 
              id="filter-severity-high"
              onClick={() => setSeverityFilter('High')}
              className={`flex-1 text-[10px] font-bold py-1 px-2.5 rounded border transition-all cursor-pointer ${
                severityFilter === 'High' 
                  ? 'bg-amber-500 text-white border-amber-500' 
                  : 'bg-white text-amber-500 border-amber-100 hover:bg-amber-50/50'
              }`}
            >
              High
            </button>
          </div>
        </div>

        {/* List Content */}
        <div id="incident-items-scrollable" className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {filteredIncidents.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-xs">
              No matching incidents found.
            </div>
          ) : (
            filteredIncidents.map((inc) => {
              const isSelected = inc.id === selectedIncidentId;
              return (
                <div 
                  key={inc.id}
                  id={`incident-row-item-${inc.id}`}
                  onClick={() => {
                    setSelectedIncidentId(inc.id);
                    setActiveTab('overview'); // reset tab on change
                  }}
                  className={`p-4 cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-blue-50/70 border-l-4 border-blue-500' 
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] font-bold text-slate-500">{inc.id}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded font-mono ${
                      inc.severity === 'Critical' 
                        ? 'bg-rose-100 text-rose-700' 
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {inc.severity}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 mt-1 line-clamp-1">{inc.title}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{inc.description}</p>
                  
                  <div className="flex items-center justify-between mt-3 text-[9px] font-mono text-slate-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-2.5 h-2.5 shrink-0" />
                      {inc.siteId}
                    </span>
                    <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-bold uppercase">{inc.category}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right Details Pane */}
      <div id="incidents-right-details-pane" className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Detail Header Info */}
        <div className="bg-white p-6 border-b border-slate-200 shrink-0 space-y-4">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-blue-600">{selectedIncident.id}</span>
                <span className="text-[10px] text-slate-400 font-mono">• {selectedIncident.startTime}</span>
              </div>
              <h2 id="incident-detail-title" className="text-lg font-bold text-slate-800 tracking-tight">{selectedIncident.title}</h2>
              <p id="incident-detail-description" className="text-xs text-slate-500 leading-relaxed max-w-2xl">{selectedIncident.description}</p>
            </div>

            <div className="flex gap-2 shrink-0">
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold font-mono ${
                selectedIncident.severity === 'Critical' 
                  ? 'bg-rose-50 text-rose-600 border border-rose-200' 
                  : 'bg-amber-50 text-amber-600 border border-amber-200'
              }`}>
                <AlertTriangle className="w-3.5 h-3.5" />
                {selectedIncident.severity} Alert
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full border border-slate-200 font-mono">
                {selectedIncident.category} Network
              </span>
            </div>
          </div>

          {/* Details Navigation Tabs (Overview, CAPA Plan, Logs) */}
          <div className="flex gap-4 border-b border-slate-100">
            {[
              { id: 'overview', name: 'Overview' },
              { id: 'capa', name: 'CAPA Plan' },
              { id: 'logs', name: 'Logs' }
            ].map((tab) => (
              <button
                key={tab.id}
                id={`incident-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-2.5 text-xs font-bold relative transition-all cursor-pointer ${
                  activeTab === tab.id 
                    ? 'text-blue-600 font-semibold' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {tab.name}
                {tab.id === 'capa' && (
                  <span className="ml-1.5 px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded text-[9px] font-mono">
                    {completionPercentage}%
                  </span>
                )}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 inset-x-0 h-0.5 bg-blue-600 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Contents - Scrollable */}
        <div id="incident-tab-body-scrollable" className="flex-1 overflow-y-auto p-6">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div id="overview-tab-content" className="space-y-6">
              {/* Meta Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold font-mono">Affected Customers</span>
                  <p className="text-base font-extrabold text-slate-800">{selectedIncident.impactCustomers.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold font-mono">Financial Impact</span>
                  <p className="text-base font-extrabold text-rose-500">{selectedIncident.financialImpact}</p>
                </div>
                <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold font-mono">Outage Duration</span>
                  <p className="text-base font-extrabold text-slate-800">{selectedIncident.duration}</p>
                </div>
                <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold font-mono">SLA Impact Delta</span>
                  <p className="text-base font-extrabold text-rose-600">{selectedIncident.slaImpact}</p>
                </div>
              </div>

              {/* Extended Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Deployment Context */}
                <div className="bg-white p-5 border border-slate-200 rounded-xl space-y-4">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">Network Identity Context</h3>
                  <div className="divide-y divide-slate-150 text-xs">
                    <div className="py-2.5 flex justify-between">
                      <span className="text-slate-400">Target Node/Site ID:</span>
                      <span className="font-mono font-semibold text-slate-800">{selectedIncident.siteId}</span>
                    </div>
                    <div className="py-2.5 flex justify-between">
                      <span className="text-slate-400">Network Region:</span>
                      <span className="font-semibold text-slate-800">{selectedIncident.region}</span>
                    </div>
                    <div className="py-2.5 flex justify-between">
                      <span className="text-slate-400">Backbone Domain:</span>
                      <span className="font-semibold text-slate-800 uppercase font-mono">{selectedIncident.category} Segment</span>
                    </div>
                    <div className="py-2.5 flex justify-between">
                      <span className="text-slate-400">Assigned Case Lead:</span>
                      <span className="font-semibold text-blue-600">{selectedIncident.owner}</span>
                    </div>
                  </div>
                </div>

                {/* Operations Team Roster */}
                <div className="bg-white p-5 border border-slate-200 rounded-xl space-y-4">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">NOC Response Roster</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center font-bold text-xs text-blue-600 shrink-0">
                        SJ
                      </div>
                      <div className="text-xs">
                        <span className="font-bold text-slate-800 block">Sarah Jenkins</span>
                        <span className="text-slate-400">Incident Lead | Fiber Logistics</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-xs text-indigo-600 shrink-0">
                        AR
                      </div>
                      <div className="text-xs">
                        <span className="font-bold text-slate-800 block">Alex Rivera</span>
                        <span className="text-slate-400">Review Coordinator | Quality Assurance</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CAPA PLAN (Exactly matching Image 2!) */}
          {activeTab === 'capa' && (
            <div id="capa-tab-content" className="space-y-6">
              {/* Top stats block matching mockup 2 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Action Completion Circle/Bar */}
                <div className="bg-white p-5 border border-slate-200 rounded-xl flex items-center gap-4">
                  <div className="relative shrink-0">
                    <svg className="w-16 h-16">
                      <circle cx="32" cy="32" r="26" stroke="#f1f5f9" strokeWidth="4.5" fill="transparent" />
                      <circle cx="32" cy="32" r="26" stroke="#2563eb" strokeWidth="4.5" fill="transparent" 
                        strokeDasharray="163" strokeDashoffset={163 - (163 * completionPercentage) / 100} strokeLinecap="round" className="transform -rotate-90 origin-center" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center font-bold text-sm text-slate-800">
                      {completionPercentage}%
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase font-mono">Action Completion</span>
                    <h4 className="text-base font-extrabold text-slate-800 leading-tight mt-0.5">{completedActionsCount} of {totalActions} Items</h4>
                    <p className="text-[10px] text-slate-400">Completed in active iteration</p>
                  </div>
                </div>

                {/* Overdue Alerts count */}
                <div className="bg-white p-5 border border-slate-200 rounded-xl flex items-center gap-4">
                  <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center shrink-0">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase font-mono">Overdue Alerts</span>
                    <h4 className="text-base font-extrabold text-rose-600 leading-tight mt-0.5">{overdueCount.toString().padStart(2, '0')} critical</h4>
                    <p className="text-[10px] text-slate-400">Past target SLA resolution date</p>
                  </div>
                </div>

                {/* Pending Review count */}
                <div className="bg-white p-5 border border-slate-200 rounded-xl flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase font-mono">Pending Review</span>
                    <h4 className="text-base font-extrabold text-amber-600 leading-tight mt-0.5">05 actions</h4>
                    <p className="text-[10px] text-slate-400">Awaiting SQA Lead validation</p>
                  </div>
                </div>
              </div>

              {/* Departmental Workload & CAPA Lists Split layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Departmental Workload Bars (Left column) */}
                <div className="bg-white p-5 border border-slate-200 rounded-xl space-y-4">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-slate-500" />
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">Departmental Workload</span>
                  </div>
                  
                  <div className="space-y-4 pt-1">
                    {departments.map((dept) => {
                      const stats = getDeptWorkload(dept);
                      return (
                        <div key={dept} className="space-y-1.5">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-600 font-medium">{dept}</span>
                            <span className="font-mono text-slate-400 font-bold">{stats.total} tasks ({stats.percentage}% done)</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-500 ${
                                dept === 'Infrastructure' ? 'bg-blue-600' :
                                dept === 'Network Ops' ? 'bg-indigo-600' :
                                dept === 'Cybersecurity' ? 'bg-rose-500' :
                                dept === 'Maintenance' ? 'bg-teal-500' : 'bg-slate-400'
                              }`} 
                              style={{ width: `${stats.total > 0 ? stats.percentage : 0}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Interactive Lists of Corrective/Preventive CAPA items (Right 2 columns) */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Action Item Header Bar with "Add CAPA Action" button */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">CAPA Execution Registry</h3>
                    <button
                      onClick={() => setShowAddCapa(!showAddCapa)}
                      className="inline-flex items-center gap-1.5 bg-blue-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-blue-500 font-semibold cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      Add Corrective Action
                    </button>
                  </div>

                  {/* MINI FORM PANEL */}
                  {showAddCapa && (
                    <form onSubmit={handleCreateCapaAction} className="bg-slate-100 p-4 rounded-xl border border-slate-200 space-y-3">
                      <h4 className="text-xs font-bold text-slate-700">New CAPA Action Form</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input 
                          type="text" 
                          placeholder="Action Title (e.g. Upgrade hardware failover)" 
                          value={newCapaTitle}
                          onChange={(e) => setNewCapaTitle(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none"
                        />
                        <input 
                          type="text" 
                          placeholder="Owner Name" 
                          value={newCapaOwner}
                          onChange={(e) => setNewCapaOwner(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <select 
                          value={newCapaDept}
                          onChange={(e) => setNewCapaDept(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded px-2 py-1.5 text-xs text-slate-700"
                        >
                          {departments.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                        <select 
                          value={newCapaPriority}
                          onChange={(e) => setNewCapaPriority(e.target.value as any)}
                          className="w-full bg-white border border-slate-200 rounded px-2 py-1.5 text-xs text-slate-700"
                        >
                          <option value="Critical">Critical Priority</option>
                          <option value="High">High Priority</option>
                          <option value="Medium">Medium Priority</option>
                          <option value="Low">Low Priority</option>
                        </select>
                        <div className="flex gap-2">
                          <button 
                            type="submit"
                            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded py-1.5 cursor-pointer"
                          >
                            Create
                          </button>
                          <button 
                            type="button" 
                            onClick={() => setShowAddCapa(false)}
                            className="flex-1 border border-slate-200 bg-white text-slate-600 text-xs rounded py-1.5 cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </form>
                  )}

                  {/* Group 1: Immediate Corrective Actions (Critical/High Priority) */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-rose-500 font-mono uppercase">
                      <Zap className="w-3.5 h-3.5" />
                      <span>Immediate Corrective Actions</span>
                    </div>

                    <div className="space-y-2">
                      {correctiveActions.length === 0 ? (
                        <p className="text-xs text-slate-400 italic p-3 bg-white rounded border">No immediate actions mapped yet.</p>
                      ) : (
                        correctiveActions.map((act) => (
                          <div 
                            key={act.id} 
                            className={`p-3.5 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all flex items-start gap-3.5 ${
                              act.status === 'Completed' ? 'opacity-70' : ''
                            }`}
                          >
                            <button 
                              onClick={() => handleToggleCapaStatus(act.id)}
                              className="p-0.5 text-blue-600 hover:text-blue-500 cursor-pointer"
                            >
                              {act.status === 'Completed' ? (
                                <CheckSquare className="w-5 h-5 text-blue-600 shrink-0" />
                              ) : (
                                <Square className="w-5 h-5 text-slate-300 hover:text-slate-500 shrink-0" />
                              )}
                            </button>
                            
                            <div className="flex-1 min-w-0 space-y-1">
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-bold text-xs text-slate-800 truncate" style={{ textDecoration: act.status === 'Completed' ? 'line-through' : 'none' }}>
                                  {act.title}
                                </span>
                                <span className={`text-[9px] font-bold font-mono px-1.5 py-0.5 rounded uppercase ${
                                  act.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                                  act.status === 'Overdue' ? 'bg-rose-100 text-rose-800 animate-pulse' :
                                  'bg-blue-50 text-blue-800'
                                }`}>
                                  {act.status}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-400 line-clamp-1">{act.description}</p>
                              <div className="flex items-center gap-4 text-[10px] text-slate-400 font-mono pt-1">
                                <span className="text-slate-600 font-semibold">{act.owner} ({act.department})</span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3 text-slate-400" /> Target: {act.dueDate}
                                </span>
                              </div>
                            </div>

                            <button 
                              onClick={() => handleDeleteCapaAction(act.id)}
                              className="text-slate-300 hover:text-rose-500 p-1 rounded hover:bg-slate-50 transition-all cursor-pointer"
                              title="Delete action"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Group 2: Long-Term Preventive Actions (Medium/Low Priority) */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-500 font-mono uppercase">
                      <Layers className="w-3.5 h-3.5" />
                      <span>Long-Term Preventive Actions</span>
                    </div>

                    <div className="space-y-2">
                      {preventiveActions.length === 0 ? (
                        <p className="text-xs text-slate-400 italic p-3 bg-white rounded border">No preventive actions mapped yet.</p>
                      ) : (
                        preventiveActions.map((act) => (
                          <div 
                            key={act.id} 
                            className={`p-3.5 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all flex items-start gap-3.5 ${
                              act.status === 'Completed' ? 'opacity-70' : ''
                            }`}
                          >
                            <button 
                              onClick={() => handleToggleCapaStatus(act.id)}
                              className="p-0.5 text-blue-600 hover:text-blue-500 cursor-pointer"
                            >
                              {act.status === 'Completed' ? (
                                <CheckSquare className="w-5 h-5 text-blue-600 shrink-0" />
                              ) : (
                                <Square className="w-5 h-5 text-slate-300 hover:text-slate-500 shrink-0" />
                              )}
                            </button>
                            
                            <div className="flex-1 min-w-0 space-y-1">
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-bold text-xs text-slate-800 truncate" style={{ textDecoration: act.status === 'Completed' ? 'line-through' : 'none' }}>
                                  {act.title}
                                </span>
                                <span className={`text-[9px] font-bold font-mono px-1.5 py-0.5 rounded uppercase ${
                                  act.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                                  act.status === 'Overdue' ? 'bg-rose-100 text-rose-800' :
                                  'bg-blue-50 text-blue-800'
                                }`}>
                                  {act.status}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-400 line-clamp-1">{act.description}</p>
                              <div className="flex items-center gap-4 text-[10px] text-slate-400 font-mono pt-1">
                                <span className="text-slate-600 font-semibold">{act.owner} ({act.department})</span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3 text-slate-400" /> Target: {act.dueDate}
                                </span>
                              </div>
                            </div>

                            <button 
                              onClick={() => handleDeleteCapaAction(act.id)}
                              className="text-slate-300 hover:text-rose-500 p-1 rounded hover:bg-slate-50 transition-all cursor-pointer"
                              title="Delete action"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* TAB 3: LOGS */}
          {activeTab === 'logs' && (
            <div id="logs-tab-content" className="space-y-4">
              <div className="bg-white p-5 border border-slate-200 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">System Telemetry & Case Logs</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-full font-mono">
                    NOC Feed Verified
                  </span>
                </div>

                {/* Audit trail list */}
                <div className="space-y-4 relative pl-5 border-l border-slate-150">
                  <div className="relative">
                    <div className="absolute -left-[24px] top-1 w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-blue-50" />
                    <span className="font-mono text-[10px] text-slate-400">2023-10-24 | 18:30 UTC</span>
                    <p className="text-xs font-semibold text-slate-700 mt-0.5">5 Whys workspace initialized by Alex Rivera</p>
                    <p className="text-xs text-slate-400 mt-0.5">Initial RCA node chain generated and baseline quality score compiled to 82%.</p>
                  </div>

                  <div className="relative">
                    <div className="absolute -left-[24px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-50" />
                    <span className="font-mono text-[10px] text-slate-400">2023-10-24 | 16:15 UTC</span>
                    <p className="text-xs font-semibold text-slate-700 mt-0.5">Splicing operations completed in Sector 4</p>
                    <p className="text-xs text-slate-400 mt-0.5">Physical copper shielding reinforced. Signal attenuation telemetry verified back below standard margins.</p>
                  </div>

                  <div className="relative">
                    <div className="absolute -left-[24px] top-1 w-2.5 h-2.5 rounded-full bg-rose-500 ring-4 ring-rose-50" />
                    <span className="font-mono text-[10px] text-slate-400">2023-10-24 | 14:25 UTC</span>
                    <p className="text-xs font-semibold text-slate-700 mt-0.5">NOC Alert Triggered: Fiber Cable Severed</p>
                    <p className="text-xs text-slate-400 mt-0.5">Carrier routing failover timed out after 8 minutes. Core router logged 38,000 signal drops per second.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
