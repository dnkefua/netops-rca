import React, { useState } from 'react';
import ThreeDLogo from './ThreeDLogo';
import { 
  Shield, 
  Zap, 
  Cpu, 
  Terminal, 
  Network, 
  Activity, 
  ArrowRight,
  Server,
  Database,
  CheckCircle,
  FileText
} from 'lucide-react';

interface LandingViewProps {
  onLaunchConsole: () => void;
}

export default function LandingView({ onLaunchConsole }: LandingViewProps) {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const features = [
    {
      icon: Cpu,
      title: "AI-Powered 5 Whys Engine",
      description: "Harness Gemini 3.5 Flash to automatically suggest logical linkages, assess evidence reliability, and score the quality of root cause chains.",
      color: "from-cyan-500 to-blue-500",
      glow: "rgba(34, 211, 238, 0.15)"
    },
    {
      icon: Zap,
      title: "Predictive Mitigation Planning",
      description: "Instantly draft step-by-step incident isolation and remediation plans with responsibilities and targeted operational timeframes.",
      color: "from-blue-500 to-indigo-500",
      glow: "rgba(59, 130, 246, 0.15)"
    },
    {
      icon: Network,
      title: "Cross-Layer SLA Mapping",
      description: "Correlate fiber cuts, hardware degradation, and BGP flaps with real-time customer SLA impacts to prioritize resolution efforts.",
      color: "from-indigo-500 to-purple-500",
      glow: "rgba(99, 102, 241, 0.15)"
    },
    {
      icon: FileText,
      title: "NOC Publication-Ready Reports",
      description: "Convert informal engineering findings into structured executive-level summaries, formal root cause statements, and tracked action plans.",
      color: "from-purple-500 to-pink-500",
      glow: "rgba(168, 85, 247, 0.15)"
    }
  ];

  const stats = [
    { label: "AI RCA Accuracy", value: "94.2%" },
    { label: "Mean Time to Isolate", value: "1.4m" },
    { label: "Monitored Telemetry Nodes", value: "248k" },
    { label: "Active SLA Protection", value: "99.999%" }
  ];

  return (
    <div id="landing-page-root" className="min-h-screen w-full bg-slate-950 text-slate-100 font-sans overflow-x-hidden relative">
      
      {/* Background Matrix/Grid Overlay */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-35"
        style={{ maskImage: 'radial-gradient(ellipse 60% 50% at 50% 0%, #000 70%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse 60% 50% at 50% 0%, #000 70%, transparent 100%)' }}
      />

      {/* Floating Glowing Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[45%] h-[45%] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Navbar */}
      <nav className="relative z-10 max-w-7xl mx-auto px-6 h-20 flex items-center justify-between border-b border-slate-900">
        <div className="flex items-center gap-3">
          <ThreeDLogo size="md" />
          <div className="flex flex-col">
            <span className="font-bold text-slate-100 tracking-tight text-lg leading-none">NetOps RCA</span>
            <span className="font-mono text-[9px] text-cyan-400 mt-1 uppercase tracking-widest font-semibold">Reliability Engine</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <span className="text-xs font-mono text-slate-400 border border-slate-800 px-3 py-1 rounded-full bg-slate-900/40">
            NOC NODE: ONLINE
          </span>
          <button 
            onClick={onLaunchConsole}
            className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-xs font-medium text-slate-100 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-600 group-hover:from-cyan-500 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-800 cursor-pointer"
          >
            <span className="relative px-4 py-2 transition-all ease-in duration-75 bg-slate-950 rounded-md group-hover:bg-opacity-0 font-semibold tracking-wide">
              Launch Console
            </span>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-24 grid lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Side Info */}
        <div className="lg:col-span-7 space-y-8 text-left">
          
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 text-xs font-semibold uppercase tracking-wider font-mono">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            Next-Gen Telco Incident Operations
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-50 tracking-tight leading-[1.1]">
            Automate Network <br/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-400">
              Root Cause Analysis
            </span>
          </h1>

          <p className="text-base md:text-lg text-slate-400 max-w-2xl leading-relaxed">
            Diagnose service outages, flashtip failures, and routing loops in seconds. NetOps RCA integrates telemetry parsing with generative artificial intelligence to drive lightning-fast, structured 5 Whys analysis.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button 
              onClick={onLaunchConsole}
              className="flex items-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 rounded-xl font-bold text-sm tracking-wide shadow-[0_4px_20px_rgba(6,182,212,0.3)] hover:shadow-[0_4px_30px_rgba(6,182,212,0.55)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer group"
            >
              Enter Operations Console
              <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <a 
              href="https://github.com/dnkefua/netops-rca"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-5 py-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-slate-100 rounded-xl font-semibold text-sm transition-all"
            >
              View GitHub Repo
            </a>
          </div>

          {/* Core Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-slate-900">
            {stats.map((s, idx) => (
              <div key={idx} className="space-y-1">
                <div className="text-2xl md:text-3xl font-black text-slate-100 tracking-tight font-mono">
                  {s.value}
                </div>
                <div className="text-[10px] uppercase tracking-widest font-mono text-slate-500 font-bold">
                  {s.label}
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Right Side 3D Hero Graphic */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
          {/* Neon backdrop glow for the logo */}
          <div className="absolute w-72 h-72 bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 rounded-full blur-[80px] -z-10 animate-pulse-slow" />
          
          {/* Main 3D Rotating Logo */}
          <ThreeDLogo size="xl" className="z-10" />

          {/* High-tech status display cards floating around */}
          <div className="absolute top-10 right-0 md:right-4 bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-xl p-3.5 text-left shadow-2xl z-20 hover:-translate-y-1 transition-transform select-none max-w-[200px]">
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold mb-1">
              <Server className="w-3.5 h-3.5" />
              RCA Engine v2.4
            </div>
            <p className="text-[10px] text-slate-400 font-medium font-sans">
              Analyzing active BGP flap in Frankfurt 3...
            </p>
          </div>

          <div className="absolute bottom-10 left-0 md:left-4 bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-xl p-3.5 text-left shadow-2xl z-20 hover:translate-y-1 transition-transform select-none max-w-[200px]">
            <div className="flex items-center gap-2 text-purple-400 font-mono text-xs font-bold mb-1">
              <Shield className="w-3.5 h-3.5" />
              SLA Guarantee
            </div>
            <p className="text-[10px] text-slate-400 font-medium font-sans">
              99.9% uptime compliance verified by system.
            </p>
          </div>
        </div>

      </section>

      {/* Feature Cards Grid */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24 border-t border-slate-900">
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-50 tracking-tight">
            Designed for Critical Network Infrastructure
          </h2>
          <p className="text-sm md:text-base text-slate-400 leading-relaxed">
            Every minute of downtime impacts thousands of users. NetOps RCA bridges raw network signals and human-understandable diagnostics to accelerate incident response.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, idx) => {
            const Icon = f.icon;
            const isHovered = hoveredCard === idx;
            
            return (
              <div 
                key={idx}
                onMouseEnter={() => setHoveredCard(idx)}
                onMouseLeave={() => setHoveredCard(null)}
                className="relative bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6.5 text-left hover:-translate-y-1.5 transition-all duration-300 select-none group cursor-default"
                style={{ 
                  boxShadow: isHovered ? `0 10px 30px -10px ${f.glow}` : 'none'
                }}
              >
                {/* Neon Top Border Highlight */}
                <div className={`absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r ${f.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${f.color} text-slate-950 font-bold mb-5 shadow-lg group-hover:scale-105 transition-transform duration-300`}>
                  <Icon className="w-5 h-5" />
                </div>

                <h3 className="text-lg font-bold text-slate-100 mb-3 group-hover:text-cyan-400 transition-colors">
                  {f.title}
                </h3>
                
                <p className="text-xs text-slate-400 leading-relaxed">
                  {f.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Futuristic Interactive Preview Box */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-12 mb-20">
        <div className="w-full bg-slate-900/30 border border-slate-800 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-600/5 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/5 rounded-full blur-[80px] pointer-events-none" />

          <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex justify-center mb-2">
              <div className="p-2.5 bg-slate-950 rounded-2xl border border-slate-800">
                <Terminal className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-50 tracking-tight">
              Ready to streamline your incident reviews?
            </h2>
            
            <p className="text-xs md:text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
              Launch the NetOps console locally, select an incident, and kick off a 5 Whys workspace. The backend LLM pipeline will auto-fill hypotheses and draft resolution templates.
            </p>

            <div className="pt-4">
              <button 
                onClick={onLaunchConsole}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-slate-50 hover:bg-slate-200 text-slate-950 rounded-xl font-extrabold text-sm tracking-wide transition-all duration-150 cursor-pointer shadow-lg hover:shadow-white/5 active:scale-[0.98]"
              >
                Launch Operations Console
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-900 max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <ThreeDLogo size="sm" />
          <span className="font-mono text-xs text-slate-500">
            © 2026 NDN Analytics - NetOps RCA Engine
          </span>
        </div>

        <div className="flex items-center gap-6 font-mono text-xs text-slate-500">
          <a href="https://ai.studio/apps/f01238e5-c4b8-42fd-a3f2-1ffe8015350c" target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition-colors">
            AI Studio App
          </a>
          <span className="text-slate-800">•</span>
          <a href="https://github.com/dnkefua/netops-rca" target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition-colors">
            GitHub Repo
          </a>
          <span className="text-slate-800">•</span>
          <span className="text-slate-600">v2.4.2-stable</span>
        </div>
      </footer>

    </div>
  );
}
