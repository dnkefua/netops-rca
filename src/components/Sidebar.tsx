import React from 'react';
import { 
  LayoutDashboard, 
  Activity, 
  PlusCircle, 
  Network, 
  BarChart3, 
  Settings, 
  ShieldCheck,
  Server
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  onSelectReportById?: (id: string) => void;
}

export default function Sidebar({ activeSection, setActiveSection, onSelectReportById }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'incidents', name: 'Incidents', icon: Activity },
    { id: 'new-rca', name: 'New RCA', icon: PlusCircle },
    { id: 'workspace', name: '5 Whys Workspace', icon: Network },
    { id: 'reports', name: 'Reports', icon: BarChart3 },
  ];

  const handleMenuClick = (id: string) => {
    setActiveSection(id);
    if (id === 'reports' && onSelectReportById) {
      onSelectReportById(''); // Reset to default Trends & Analytics view
    }
  };

  return (
    <aside id="sidebar-container" className="w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col h-full shrink-0 select-none">
      {/* Brand Header */}
      <div id="sidebar-brand-section" className="h-16 flex items-center px-6 gap-3 border-b border-slate-800 shrink-0">
        <div id="brand-icon-wrapper" className="p-1.5 bg-blue-600 rounded-lg text-white">
          <Server id="brand-network-icon" className="w-5 h-5" />
        </div>
        <div id="brand-text-wrapper" className="flex flex-col">
          <span id="brand-title" className="font-sans font-bold text-slate-100 tracking-tight text-base leading-none">NetOps RCA</span>
          <span id="brand-subtitle" className="font-mono text-[10px] text-blue-400 mt-1 uppercase tracking-wider font-semibold">Quality Engine v2.4</span>
        </div>
      </div>

      {/* Primary Navigation */}
      <nav id="sidebar-navigation" className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <div id="nav-section-title" className="px-3 mb-2 font-mono text-[10px] text-slate-500 uppercase tracking-widest font-bold">
          Operations Hub
        </div>
        
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <button
              key={item.id}
              id={`sidebar-item-${item.id}`}
              onClick={() => handleMenuClick(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                isActive 
                  ? 'bg-blue-600/15 text-blue-400 font-semibold border-l-4 border-blue-500 pl-2' 
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <Icon id={`sidebar-icon-${item.id}`} className={`w-4.5 h-4.5 transition-colors ${isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-400'}`} />
              <span id={`sidebar-text-${item.id}`}>{item.name}</span>
              {item.id === 'incidents' && (
                <span id="sidebar-badge-incidents" className="ml-auto bg-rose-500/15 text-rose-400 text-[10px] px-2 py-0.5 rounded-full font-mono font-bold">
                  2 NEW
                </span>
              )}
              {item.id === 'workspace' && (
                <span id="sidebar-badge-workspace" className="ml-auto bg-amber-500/15 text-amber-400 text-[10px] px-2 py-0.5 rounded-full font-mono font-bold">
                  82%
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* System Status Footer */}
      <div id="sidebar-footer" className="p-4 border-t border-slate-800 bg-slate-950/40 space-y-3">
        <div id="user-profile-summary" className="flex items-center gap-3">
          <div id="user-avatar-badge" className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-sans font-bold text-slate-200">
            AR
          </div>
          <div id="user-details-wrapper" className="flex flex-col min-w-0">
            <span id="user-display-name" className="text-xs font-semibold text-slate-200 truncate">Alex Rivera</span>
            <span id="user-display-role" className="text-[10px] text-slate-500 truncate">Quality Lead Investigator</span>
          </div>
        </div>

        <div id="system-health-display" className="p-2.5 bg-slate-900/50 rounded-lg border border-slate-800/60">
          <div id="health-metric-row" className="flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck id="status-shield" className="w-3.5 h-3.5 text-emerald-400" />
              <span>NOC Connectivity</span>
            </div>
            <span className="font-mono text-emerald-400 font-bold">ACTIVE</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
