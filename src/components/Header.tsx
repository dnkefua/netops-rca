import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  HelpCircle, 
  Globe, 
  Clock,
  ChevronRight,
  Database
} from 'lucide-react';

interface HeaderProps {
  activeSection: string;
  subSection?: string;
  detailId?: string;
}

export default function Header({ activeSection, subSection, detailId }: HeaderProps) {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toUTCString().replace('GMT', 'UTC'));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Format breadcrumbs based on navigation state
  const getBreadcrumbs = () => {
    const sectionLabels: { [key: string]: string } = {
      'dashboard': 'Dashboard',
      'incidents': 'Incidents',
      'new-rca': 'New RCA',
      'workspace': '5 Whys Workspace',
      'reports': 'Reports'
    };

    const path = [sectionLabels[activeSection] || activeSection];
    
    if (subSection) {
      path.push(subSection);
    }
    if (detailId) {
      path.push(detailId);
    }

    return path;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header id="global-header" className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 select-none z-10">
      {/* Breadcrumb Navigation */}
      <div id="breadcrumb-container" className="flex items-center gap-2 font-sans">
        <Database id="breadcrumb-db-icon" className="w-4 h-4 text-slate-400 shrink-0" />
        <span id="breadcrumb-root" className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">NETOPS</span>
        
        {breadcrumbs.map((crumb, idx) => (
          <React.Fragment key={idx}>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
            <span 
              id={`breadcrumb-crumb-${idx}`}
              className={`text-xs font-medium tracking-tight font-sans ${
                idx === breadcrumbs.length - 1 
                  ? 'text-slate-800 font-semibold' 
                  : 'text-slate-500 hover:text-slate-800 cursor-pointer'
              }`}
            >
              {crumb}
            </span>
          </React.Fragment>
        ))}
      </div>

      {/* Global Metadata & User Panel */}
      <div id="header-actions-panel" className="flex items-center gap-4.5">
        {/* Real-time UTC Timestamp Display */}
        <div id="header-clock-widget" className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200">
          <Clock id="clock-widget-icon" className="w-3.5 h-3.5 text-slate-500" />
          <span id="clock-widget-timestamp" className="font-mono text-xs text-slate-600 font-semibold leading-none">
            {currentTime || 'LOADING UTC...'}
          </span>
        </div>

        {/* Global Search Input Bar */}
        <div id="header-search-container" className="relative w-64 max-w-xs">
          <Search id="search-input-icon" className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input 
            id="header-search-input"
            type="text" 
            placeholder="Search tickets, IPs, or sites..." 
            className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-150"
          />
        </div>

        {/* Quick Help & Notification Icons */}
        <div id="header-icons-row" className="flex items-center gap-2">
          <button id="header-help-button" className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-all cursor-pointer">
            <HelpCircle className="w-4.5 h-4.5" />
          </button>
          
          <button id="header-notifications-button" className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-all relative cursor-pointer">
            <Bell className="w-4.5 h-4.5" />
            <span id="header-notification-indicator" className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border border-white"></span>
          </button>
        </div>
      </div>
    </header>
  );
}
