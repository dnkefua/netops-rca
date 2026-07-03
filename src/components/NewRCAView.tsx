import React, { useState, useRef } from 'react';
import { 
  FileText, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Upload, 
  Sliders, 
  Users, 
  Globe, 
  Play,
  FileCheck,
  AlertCircle
} from 'lucide-react';
import { Incident, WhyStep } from '../types';

interface NewRCAViewProps {
  onAddIncident: (inc: Incident) => void;
  onNavigateToSection: (section: string) => void;
  onInitWorkspace: (id: string, title: string, initialWhys: WhyStep[]) => void;
}

export default function NewRCAView({ onAddIncident, onNavigateToSection, onInitWorkspace }: NewRCAViewProps) {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form Fields - Step 1: Incident Details
  const [ticketId, setTicketId] = useState(`INC-2023-${Math.floor(1000 + Math.random() * 9000)}`);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'RAN' | 'Core' | 'Fiber' | 'Power' | 'Cloud' | 'OSS'>('Core');
  const [region, setRegion] = useState('North America (NE)');
  const [siteId, setSiteId] = useState('NYC-NODE-04');
  const [technology, setTechnology] = useState('BGP Routing Protocol');
  const [services, setServices] = useState('Northeast Transit Backbone');

  // Form Fields - Step 2: Impact Assessment
  const [impactCustomers, setImpactCustomers] = useState<number>(450000);
  const [slaImpact, setSlaImpact] = useState('-12.4%');
  const [financialImpact, setFinancialImpact] = useState('$650,000');
  const [duration, setDuration] = useState('2h 15m');

  // Form Fields - Step 3: Problem Builder (What, Where, When, Who, Scale)
  const [what, setWhat] = useState('');
  const [where, setWhere] = useState('');
  const [when, setWhen] = useState('');
  const [who, setWho] = useState('');
  const [scale, setScale] = useState('');

  // Form Fields - Step 4: Team & Evidence
  const [owner, setOwner] = useState('Alex Rivera');
  const [collaborators, setCollaborators] = useState('S. Chen, Network Security Team');
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; size: string }[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Problem statement stitching logic
  const getProblemStatement = () => {
    if (!what && !where && !when && !who && !scale) {
      return "Begin filling the builder fields above to stitch a compliant problem statement according to ITU-T operations guidelines...";
    }
    return `On ${when || '[Date/Time]'}, ${what || '[Technical Event]'} occurred at ${where || '[Location/Site]'}, causing severe outage to ${who || '[Affected Group]'} of scale ${scale || '[Traffic/Customers Impacted]'}.`;
  };

  // Drag and Drop Handling for Evidence
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files).map((f: any) => ({
        name: f.name,
        size: `${(f.size / 1024).toFixed(1)} KB`
      }));
      setUploadedFiles(prev => [...prev, ...filesArray]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files).map((f: any) => ({
        name: f.name,
        size: `${(f.size / 1024).toFixed(1)} KB`
      }));
      setUploadedFiles(prev => [...prev, ...filesArray]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Next/Back Actions
  const handleNext = () => {
    if (currentStep === 1 && !title.trim()) {
      setErrorMsg("Please enter an incident title or summary to proceed.");
      return;
    }
    setErrorMsg(null);
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setErrorMsg(null);
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Final Action: Complete form, trigger analysis
  const handleStartAnalysis = () => {
    setErrorMsg(null);
    
    // Create new Incident payload
    const initials = owner.split(' ').map(n => n[0]).join('').toUpperCase();
    const newIncident: Incident = {
      id: ticketId,
      title: title,
      description: getProblemStatement(),
      severity: 'Critical',
      region: region,
      owner: owner,
      ownerInitials: initials,
      status: 'In Review',
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      category: category,
      impactCustomers: impactCustomers,
      financialImpact: financialImpact,
      duration: duration,
      siteId: siteId,
      startTime: `${new Date().toISOString().split('T')[0]} | ${new Date().toLocaleTimeString()} UTC`,
      slaImpact: slaImpact
    };

    // Construct initial 5 Whys template for workspace based on builder
    const initialWhys: WhyStep[] = [
      {
        index: 1,
        type: "Why 1: Problem Symptom",
        statement: what || "High volume of dropped packet streams",
        evidence: uploadedFiles[0]?.name || "None",
        confidence: 100,
        status: "Validated"
      },
      {
        index: 2,
        type: "Why 2: Logical Link",
        statement: "Routing metrics destabilized on edge hubs",
        evidence: "None",
        confidence: 90,
        status: "Draft"
      },
      {
        index: 3,
        type: "Why 3: Technical Failure",
        statement: "",
        evidence: "None",
        confidence: 80,
        status: "Draft"
      },
      {
        index: 4,
        type: "Why 4: Physical Trigger",
        statement: "",
        evidence: "None",
        confidence: 70,
        status: "Draft"
      },
      {
        index: 5,
        type: "Why 5: Root Cause",
        statement: "",
        evidence: "None",
        confidence: 60,
        status: "Draft"
      }
    ];

    // Push into app state
    onAddIncident(newIncident);
    onInitWorkspace(ticketId, title, initialWhys);

    // Navigate to 5 Whys workspace
    onNavigateToSection('workspace');
  };

  return (
    <div id="new-rca-wizard-wrapper" className="p-6 space-y-6 overflow-y-auto h-full bg-slate-50 font-sans select-none">
      {/* Wizard Header */}
      <div>
        <h1 id="wizard-title" className="text-2xl font-bold text-slate-800 tracking-tight">Root Cause Registration Wizard</h1>
        <p id="wizard-subtitle" className="text-xs text-slate-500 mt-1">Register a new network outage event, assess baseline impact metrics, and compile audit trails.</p>
      </div>

      {/* Animated Step Tracker Nodes (Image 3) */}
      <div id="wizard-step-tracker-bar" className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between gap-4">
        {[
          { step: 1, name: 'Incident Details', icon: FileText },
          { step: 2, name: 'Impact Assessment', icon: Sliders },
          { step: 3, name: 'Problem Builder', icon: Globe },
          { step: 4, name: 'Team & Evidence', icon: Users }
        ].map((item, idx) => {
          const isCompleted = currentStep > item.step;
          const isActive = currentStep === item.step;
          
          return (
            <React.Fragment key={item.step}>
              <div className="flex items-center gap-3.5 flex-1 justify-center first:justify-start last:justify-end">
                <div className={`w-8.5 h-8.5 rounded-full flex items-center justify-center font-bold text-xs border transition-all ${
                  isCompleted 
                    ? 'bg-blue-600 border-blue-600 text-white shadow' 
                    : isActive 
                    ? 'bg-blue-50 border-blue-500 text-blue-600 ring-4 ring-blue-50' 
                    : 'bg-white border-slate-200 text-slate-400'
                }`}>
                  {isCompleted ? <Check className="w-4.5 h-4.5" /> : item.step}
                </div>
                <div className="hidden md:flex flex-col text-left">
                  <span className={`text-xs font-bold ${isActive ? 'text-slate-800 font-bold' : 'text-slate-400'}`}>{item.name}</span>
                  <span className="text-[10px] text-slate-400">Step {item.step} of 4</span>
                </div>
              </div>
              {idx < 3 && (
                <div className={`hidden md:block h-0.5 flex-1 rounded ${
                  currentStep > item.step ? 'bg-blue-600' : 'bg-slate-200'
                }`} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Main Form Box */}
      <div id="wizard-form-body" className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[400px]">
        
        {/* Step Contents */}
        <div className="flex-1 p-6 space-y-5">
          
          {/* STEP 1: INCIDENT DETAILS */}
          {currentStep === 1 && (
            <div id="step-1-form" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide font-mono">Incident Ticket ID</label>
                  <input 
                    type="text" 
                    value={ticketId}
                    onChange={(e) => setTicketId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide font-mono">Network Domain</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Core">Core Routing Core Network</option>
                    <option value="Fiber">Fiber Backbone Optical Segment</option>
                    <option value="RAN">Radio Access RAN Systems</option>
                    <option value="Power">Power Plant Auxiliary Generators</option>
                    <option value="OSS">Operational Support OSS DBs</option>
                    <option value="Cloud">Virtualization Cloud Cluster</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide font-mono">Incident Summary Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Optical attenuation anomalies on Douala ring backup"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide font-mono">Impacted Region</label>
                  <input 
                    type="text" 
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide font-mono">Site ID Reference</label>
                  <input 
                    type="text" 
                    value={siteId}
                    onChange={(e) => setSiteId(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide font-mono">Core Protocol / Technology</label>
                  <input 
                    type="text" 
                    value={technology}
                    onChange={(e) => setTechnology(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide font-mono">Impacted Services Segment</label>
                <input 
                  type="text" 
                  value={services}
                  onChange={(e) => setServices(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* STEP 2: IMPACT ASSESSMENT */}
          {currentStep === 2 && (
            <div id="step-2-form" className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-150">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-500 uppercase font-mono">Total Impacted Customers</span>
                    <span className="font-mono text-blue-600 font-extrabold">{impactCustomers.toLocaleString()}</span>
                  </div>
                  <input 
                    type="range" 
                    min="10000" 
                    max="2000000" 
                    step="10000" 
                    value={impactCustomers}
                    onChange={(e) => setImpactCustomers(Number(e.target.value))}
                    className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                    <span>10k threshold</span>
                    <span>2M maximum</span>
                  </div>
                </div>

                <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-150">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide font-mono block">Estimated Outage Duration</label>
                  <input 
                    type="text" 
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide font-mono">SLA Breach Delta Impact</label>
                  <input 
                    type="text" 
                    value={slaImpact}
                    onChange={(e) => setSlaImpact(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide font-mono">Estimated Financial Impact ($)</label>
                  <input 
                    type="text" 
                    value={financialImpact}
                    onChange={(e) => setFinancialImpact(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: PROBLEM STATEMENT BUILDER */}
          {currentStep === 3 && (
            <div id="step-3-form" className="space-y-5">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide font-mono block">Structured Input Parameters</span>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 font-mono">WHAT: What technical fault happened?</span>
                  <input 
                    type="text" 
                    placeholder="e.g. Signal loss in Douala fiber backbone ring" 
                    value={what}
                    onChange={(e) => setWhat(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 font-mono">WHERE: Where was the fault localized?</span>
                  <input 
                    type="text" 
                    placeholder="e.g. Sector B civil corridor, near YDE-NODE-12" 
                    value={where}
                    onChange={(e) => setWhere(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 font-mono">WHEN: When did the telemetry trigger alarms?</span>
                  <input 
                    type="text" 
                    placeholder="e.g. Oct 24, 2023 | 14:22 UTC" 
                    value={when}
                    onChange={(e) => setWhen(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 font-mono">WHO: Who suffered service degradation?</span>
                  <input 
                    type="text" 
                    placeholder="e.g. 450k prepaid data nodes in littoral region" 
                    value={who}
                    onChange={(e) => setWho(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 font-mono">SCALE: What scale of throughput was degraded?</span>
                <input 
                  type="text" 
                  placeholder="e.g. 1.2 Terabits per second throughput loss" 
                  value={scale}
                  onChange={(e) => setScale(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-800"
                />
              </div>

              {/* Reactive Stitching Preview Box */}
              <div className="p-4 bg-slate-900 text-slate-200 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-blue-400 font-mono uppercase tracking-wider">
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>Stitched problem statement output</span>
                </div>
                <p className="text-xs font-medium leading-relaxed font-sans">{getProblemStatement()}</p>
              </div>
            </div>
          )}

          {/* STEP 4: TEAM & EVIDENCE */}
          {currentStep === 4 && (
            <div id="step-4-form" className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide font-mono">RCA Lead Investigator</label>
                  <input 
                    type="text" 
                    value={owner}
                    onChange={(e) => setOwner(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide font-mono">Active Collaborators</label>
                  <input 
                    type="text" 
                    value={collaborators}
                    onChange={(e) => setCollaborators(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none"
                  />
                </div>
              </div>

              {/* DRAG AND DROP / CLICK TO CHOOSE UPLOADER */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide font-mono">Network Evidence Attachments</span>
                
                <div 
                  id="evidence-drag-drop-zone"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={triggerFileInput}
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-3.5 ${
                    isDragging 
                      ? 'border-blue-500 bg-blue-50/55' 
                      : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50/50'
                  }`}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    multiple 
                    className="hidden" 
                  />
                  <Upload className={`w-8 h-8 ${isDragging ? 'text-blue-600' : 'text-slate-400'}`} />
                  <div>
                    <p className="text-xs font-bold text-slate-700">Drag & drop technical telemetry logs here</p>
                    <p className="text-[10px] text-slate-400 mt-1">Accepts CSV, PCAP, LOG, PDF format, maximum 50MB single file size</p>
                  </div>
                  <button 
                    type="button"
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] px-3.5 py-1.5 rounded-lg border transition-all cursor-pointer"
                  >
                    Select File Manually
                  </button>
                </div>

                {/* Uploaded Files Feed */}
                {uploadedFiles.length > 0 && (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase font-mono block">Selected Attachments ({uploadedFiles.length})</span>
                    <div className="space-y-1.5">
                      {uploadedFiles.map((file, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs bg-white p-2 border border-slate-100 rounded-lg">
                          <span className="font-semibold text-slate-700 truncate max-w-xs">{file.name}</span>
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-slate-400 text-[10px]">{file.size}</span>
                            <button 
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setUploadedFiles(prev => prev.filter((_, i) => i !== idx));
                              }}
                              className="text-slate-400 hover:text-rose-500 font-bold font-mono text-[10px] cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Wizard Footer Controls */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center shrink-0">
          <div>
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-1.5 border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
            ) : (
              <div className="w-10" />
            )}
          </div>

          <div className="flex items-center gap-4">
            {errorMsg && (
              <div className="text-rose-500 font-medium text-xs flex items-center gap-1.5">
                <AlertCircle className="w-4.5 h-4.5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
            
            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer transition-all"
              >
                Continue
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleStartAnalysis}
                className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-5 py-2 rounded-lg cursor-pointer shadow-md transition-all font-mono uppercase tracking-wide font-bold"
              >
                <Play className="w-4 h-4 fill-white" />
                Start 5 Whys Analysis
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
