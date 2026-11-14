import React from 'react';
import { 
  ShieldCheck, Cpu, Code2, Globe2, BookOpen, 
  Sparkles, CheckCircle2, AlertTriangle, Layers, Lock, Award 
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-12 py-6">
      
      {/* Hero Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
          <Award className="w-3.5 h-3.5 text-cyan-400" />
          <span>HackNova Bhopal 2K26 Submission</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          About TruthGuard AI
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
          An AI-powered digital media verification architecture designed to analyze sensationalism, cross-reference certified fact checks, and empower citizens with objective clarity.
        </p>
      </div>

      {/* Core Mission & Hackathon Context */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-cyan-400" />
          <span>Project Objective &amp; Problem Statement</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          In the contemporary hyper-connected digital landscape, misinformation, deepfake narratives, and sensationalized clickbait spread faster than verified journalistic truth. Most naive fake news detectors make a critical mistake: they treat dramatic or emotional writing styles as proof of factual falsehood. 
        </p>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          <strong>TruthGuard AI</strong> solves this fundamental flaw by decoupling linguistic stylistic markers (such as sensationalism and emotional language) from factual ground truth, cross-referencing global news feeds (GDELT), certified fact-checking registers (Google Fact Check Tools), and reasoning through <strong>Google Gemini AI</strong> under strict responsible system guidelines.
        </p>
      </div>

      {/* Ethical AI Charter */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-5">
        <div className="flex items-center space-x-2 text-purple-400">
          <BookOpen className="w-5 h-5" />
          <h3 className="text-base font-bold text-white">Responsible AI Verification Principles</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
          <div className="p-4 rounded-2xl bg-navy-950/70 border border-slate-800/80 space-y-1.5">
            <h4 className="font-bold text-white flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Separation of Style vs. Fact</span>
            </h4>
            <p className="text-slate-400 leading-relaxed">
              Sensationalism or exclamation marks never automatically classify news as fake. An emotional eyewitness account of a genuine natural disaster is still factually real.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-navy-950/70 border border-slate-800/80 space-y-1.5">
            <h4 className="font-bold text-white flex items-center space-x-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Mandatory UNVERIFIED Category</span>
            </h4>
            <p className="text-slate-400 leading-relaxed">
              If certified external evidence or news corroboration is insufficient, the system outputs UNVERIFIED rather than hallucinating or guessing.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-navy-950/70 border border-slate-800/80 space-y-1.5">
            <h4 className="font-bold text-white flex items-center space-x-1.5">
              <Lock className="w-4 h-4 text-cyan-400" />
              <span>Zero Hallucinated Sources</span>
            </h4>
            <p className="text-slate-400 leading-relaxed">
              Gemini AI is strictly instructed to never invent sources, URLs, or claims. Evidence cards link directly to indexed repositories.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-navy-950/70 border border-slate-800/80 space-y-1.5">
            <h4 className="font-bold text-white flex items-center space-x-1.5">
              <Layers className="w-4 h-4 text-purple-400" />
              <span>Model Confidence Labeling</span>
            </h4>
            <p className="text-slate-400 leading-relaxed">
              Confidence scores are clearly defined as model-estimated internal certainty, not mathematical probability that an event happened.
            </p>
          </div>
        </div>
      </div>

      {/* Technology Stack Grid */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center space-x-2">
          <Code2 className="w-5 h-5 text-cyan-400" />
          <span>Full-Stack Architecture &amp; Technologies</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-navy-950 border border-slate-800 space-y-1">
            <span className="text-[10px] text-cyan-400 uppercase font-mono block">Frontend</span>
            <span className="font-bold text-white block">React.js + Vite</span>
            <span className="text-slate-400 text-[11px]">Tailwind CSS &amp; Lucide</span>
          </div>

          <div className="p-3 rounded-xl bg-navy-950 border border-slate-800 space-y-1">
            <span className="text-[10px] text-purple-400 uppercase font-mono block">Backend</span>
            <span className="font-bold text-white block">Python FastAPI</span>
            <span className="text-slate-400 text-[11px]">Asynchronous REST APIs</span>
          </div>

          <div className="p-3 rounded-xl bg-navy-950 border border-slate-800 space-y-1">
            <span className="text-[10px] text-emerald-400 uppercase font-mono block">AI Core</span>
            <span className="font-bold text-white block">Google Gemini API</span>
            <span className="text-slate-400 text-[11px]">Configurable Provider Engine</span>
          </div>

          <div className="p-3 rounded-xl bg-navy-950 border border-slate-800 space-y-1">
            <span className="text-[10px] text-amber-400 uppercase font-mono block">ML &amp; DB</span>
            <span className="font-bold text-white block">Scikit-learn + SQLite</span>
            <span className="text-slate-400 text-[11px]">TF-IDF &amp; Persistent Records</span>
          </div>
        </div>
      </div>

      {/* Backend API Endpoints Reference */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center space-x-2">
          <Globe2 className="w-5 h-5 text-emerald-400" />
          <span>API Specification Reference</span>
        </h3>

        <div className="space-y-2 font-mono text-xs text-slate-300">
          <div className="p-2.5 rounded-lg bg-navy-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-emerald-400 font-bold mr-2">POST</span>
              <span>/api/analyze</span>
            </div>
            <span className="text-[11px] text-slate-400">Verifies headline or complete article text</span>
          </div>

          <div className="p-2.5 rounded-lg bg-navy-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-emerald-400 font-bold mr-2">POST</span>
              <span>/api/analyze-url</span>
            </div>
            <span className="text-[11px] text-slate-400">Extracts readable news from safe URL</span>
          </div>

          <div className="p-2.5 rounded-lg bg-navy-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-cyan-400 font-bold mr-2">GET</span>
              <span>/api/history</span>
            </div>
            <span className="text-[11px] text-slate-400">Lists past analysis reports from SQLite</span>
          </div>

          <div className="p-2.5 rounded-lg bg-navy-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-cyan-400 font-bold mr-2">GET</span>
              <span>/api/dashboard/stats</span>
            </div>
            <span className="text-[11px] text-slate-400">Aggregates statistical visual chart telemetry</span>
          </div>

          <div className="p-2.5 rounded-lg bg-navy-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-cyan-400 font-bold mr-2">GET</span>
              <span>/api/health</span>
            </div>
            <span className="text-[11px] text-slate-400">Service health &amp; API key readiness</span>
          </div>
        </div>
      </div>

    </div>
  );
}
