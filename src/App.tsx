import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import IncidentsView from './components/IncidentsView';
import NewRCAView from './components/NewRCAView';
import WorkspaceView from './components/WorkspaceView';
import ReportsView from './components/ReportsView';
import LandingView from './components/LandingView';

import { 
  INITIAL_INCIDENTS, 
  INITIAL_CAPA_ACTIONS, 
  INITIAL_RCA_WORKSPACES, 
  INITIAL_REPORTS 
} from './data';
import { Incident, CAPAAction, RCAWorkspace, WhyStep } from './types';

export default function App() {
  // Navigation Section
  const [activeSection, setActiveSection] = useState<string>('landing');
  
  // State variables synchronized from localStorage if present
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [capaActions, setCapaActions] = useState<CAPAAction[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [workspace, setWorkspace] = useState<RCAWorkspace>({
    incidentId: '',
    title: '',
    whys: [],
    qualityScore: 50
  });

  // Selected details
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>('');
  const [selectedReportId, setSelectedReportId] = useState<string>('');

  // Initial Seed
  useEffect(() => {
    const cachedIncidents = localStorage.getItem('netops_incidents');
    const cachedCapa = localStorage.getItem('netops_capa');
    const cachedReports = localStorage.getItem('netops_reports');
    const cachedWorkspace = localStorage.getItem('netops_workspace');

    if (cachedIncidents) {
      setIncidents(JSON.parse(cachedIncidents));
    } else {
      setIncidents(INITIAL_INCIDENTS);
    }

    if (cachedCapa) {
      setCapaActions(JSON.parse(cachedCapa));
    } else {
      setCapaActions(INITIAL_CAPA_ACTIONS);
    }

    if (cachedReports) {
      setReports(JSON.parse(cachedReports));
    } else {
      setReports(INITIAL_REPORTS);
    }

    if (cachedWorkspace) {
      setWorkspace(JSON.parse(cachedWorkspace));
    } else {
      setWorkspace(INITIAL_RCA_WORKSPACES["RCA-9921-X"]);
    }

    // Set first incident as default selection
    setSelectedIncidentId(INITIAL_INCIDENTS[0].id);
  }, []);

  // Sync to local storage when state changes
  useEffect(() => {
    if (incidents.length > 0) localStorage.setItem('netops_incidents', JSON.stringify(incidents));
  }, [incidents]);

  useEffect(() => {
    if (capaActions.length > 0) localStorage.setItem('netops_capa', JSON.stringify(capaActions));
  }, [capaActions]);

  useEffect(() => {
    if (reports.length > 0) localStorage.setItem('netops_reports', JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    if (workspace.incidentId) localStorage.setItem('netops_workspace', JSON.stringify(workspace));
  }, [workspace]);

  // Actions
  const handleAddIncident = (newInc: Incident) => {
    setIncidents(prev => [newInc, ...prev]);
  };

  const handleInitWorkspace = (id: string, title: string, initialWhys: WhyStep[]) => {
    setWorkspace({
      incidentId: id,
      title: title,
      whys: initialWhys,
      qualityScore: 82
    });
  };

  const handleAddGeneratedReport = (newReport: any) => {
    setReports(prev => [newReport, ...prev]);
    setSelectedReportId(newReport.id);
  };

  // Nav helpers for cross-navigation
  const handleSelectIncidentFromDashboard = (id: string) => {
    setSelectedIncidentId(id);
    setActiveSection('incidents');
  };

  const handleSelectWorkspaceFromDashboard = (id: string) => {
    const inc = incidents.find(i => i.id === id);
    if (inc) {
      // Initialize an empty or pre-populated 5 whys logic chain
      const cached = INITIAL_RCA_WORKSPACES[id];
      if (cached) {
        setWorkspace(cached);
      } else {
        // Construct fresh 5 whys template
        const placeholderWhys: WhyStep[] = [
          { index: 1, type: "Why 1: Problem Symptom", statement: inc.title, evidence: "None", confidence: 100, status: "Draft" },
          { index: 2, type: "Why 2: Logical Link", statement: "", evidence: "None", confidence: 80, status: "Draft" },
          { index: 3, type: "Why 3: Technical Failure", statement: "", evidence: "None", confidence: 80, status: "Draft" },
          { index: 4, type: "Why 4: Physical Trigger", statement: "", evidence: "None", confidence: 70, status: "Draft" },
          { index: 5, type: "Why 5: Root Cause", statement: "", evidence: "None", confidence: 60, status: "Draft" }
        ];
        handleInitWorkspace(id, inc.title, placeholderWhys);
      }
    }
    setActiveSection('workspace');
  };

  if (activeSection === 'landing') {
    return <LandingView onLaunchConsole={() => setActiveSection('dashboard')} />;
  }

  return (
    <div id="application-root-container" className="flex h-screen w-screen overflow-hidden bg-slate-100 text-slate-800">
      
      {/* Shared Sidebar Component */}
      <Sidebar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
        onSelectReportById={setSelectedReportId}
      />

      {/* Main Content Area */}
      <main id="main-content-canvas" className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Shared Header Component */}
        <Header 
          activeSection={activeSection} 
          subSection={activeSection === 'reports' && selectedReportId ? 'Case Report' : undefined}
          detailId={activeSection === 'reports' && selectedReportId ? selectedReportId : activeSection === 'incidents' ? selectedIncidentId : undefined}
        />

        {/* Dynamic Route View rendering */}
        <div id="dynamic-view-viewport" className="flex-1 overflow-hidden">
          {activeSection === 'dashboard' && (
            <DashboardView 
              incidents={incidents} 
              onSelectIncident={handleSelectIncidentFromDashboard}
              onSelectWorkspace={handleSelectWorkspaceFromDashboard}
            />
          )}

          {activeSection === 'incidents' && incidents.length > 0 && (
            <IncidentsView 
              incidents={incidents}
              capaActions={capaActions}
              setCapaActions={setCapaActions}
              selectedIncidentId={selectedIncidentId}
              setSelectedIncidentId={setSelectedIncidentId}
            />
          )}

          {activeSection === 'new-rca' && (
            <NewRCAView 
              onAddIncident={handleAddIncident}
              onNavigateToSection={setActiveSection}
              onInitWorkspace={handleInitWorkspace}
            />
          )}

          {activeSection === 'workspace' && workspace.incidentId && (
            <WorkspaceView 
              workspace={workspace}
              setWorkspace={setWorkspace}
              incidents={incidents}
              onNavigateToReports={() => setActiveSection('reports')}
              onAddGeneratedReport={handleAddGeneratedReport}
            />
          )}

          {activeSection === 'reports' && (
            <ReportsView 
              reports={reports}
              selectedReportId={selectedReportId}
              setSelectedReportId={setSelectedReportId}
            />
          )}
        </div>
      </main>
    </div>
  );
}
