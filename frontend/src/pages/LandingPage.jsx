import React from 'react';
import { 
  ShieldCheck, Sparkles, ArrowRight, Layers, Database, 
  Search, CheckCircle2, AlertTriangle, FileText, Globe2, 
  Cpu, Lock, HelpCircle 
} from 'lucide-react';
import { SAMPLE_NEWS_ITEMS } from '../utils/sampleNews';

export default function LandingPage({ setActivePage, setPrefillNews }) {
  const handleTrySample = (sample) => {
    setPrefillNews(sample);
    setActivePage('analyze');
  };

  return (
    <div className="space-y-24 py-6">
      
      {/* Hero Section */}
      <section className="relative text-center max-w-4xl mx-auto space-y-6 pt-8 sm:pt-14">
        
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none -z-10"></div>
        <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl pointer-events-none -z-10"></div>

        {/* HackNova Badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-navy-900/90 border border-cyan-500/30 text-cyan-300 text-xs font-semibold shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>HackNova Bhopal 2K26 Finalist Project</span>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
          <span className="text-slate-400">Track: AI / Responsible Tech</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Next-Generation News Verification with{' '}
          <span className="gradient-text">TruthGuard AI</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Combat misinformation with multi-tier forensic intelligence. Combining Google Gemini AI, 
          GDELT real-time coverage, Google Fact Check Tools, and Scikit-learn linguistic profiling.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => setActivePage('analyze')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
          >
            <span>Start Analyzing News</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActivePage('dashboard')}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl glass-panel text-slate-200 hover:text-white hover:bg-slate-800/60 font-semibold text-sm transition-all border border-slate-700/80"
          >
            View Live Analytics
          </button>
        </div>

        {/* Responsible AI Disclaimer Pill */}
        <div className="pt-2">
          <p className="text-xs text-slate-400 inline-flex items-center space-x-1.5 bg-navy-900/60 px-4 py-1.5 rounded-full border border-slate-800">
            <ShieldCheck className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <span>Ethical AI Standard: We clearly separate writing style from factual ground truth.</span>
          </p>
        </div>

      </section>

      {/* Quick Try Demo Samples Section */}
      <section className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4 max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Instant 1-Click Verification Test Cases</span>
            </h3>
            <p className="text-xs text-slate-400">Click any preset story to test the multi-modal detection engine immediately.</p>
          </div>
          <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950/60 px-2.5 py-1 rounded-lg border border-cyan-800/50">
            Preloaded Hackathon Demos
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {SAMPLE_NEWS_ITEMS.map((sample) => (
            <div
              key={sample.id}
              onClick={() => handleTrySample(sample)}
              className="p-3.5 rounded-xl bg-navy-950/60 border border-slate-800 hover:border-cyan-500/40 hover:bg-navy-900/80 transition-all cursor-pointer group space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${sample.badgeColor}`}>
                  {sample.expectedVerdict.replace(/_/g, ' ')}
                </span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider">{sample.type}</span>
              </div>
              <h4 className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors line-clamp-2">
                {sample.title}
              </h4>
              <div className="text-[11px] text-cyan-400 group-hover:translate-x-1 transition-transform flex items-center space-x-1 font-medium">
                <span>Analyze this case</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Pipeline */}
      <section className="space-y-8 max-w-6xl mx-auto">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            How TruthGuard AI Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            A responsible 4-stage pipeline that avoids knee-jerk style bias and verifies facts against accredited records.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3 relative group">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold text-sm border border-cyan-500/20">
              01
            </div>
            <h4 className="text-sm font-bold text-white">Input Ingestion</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Submit a headline, complete article text, or any news URL. Safe URL extraction isolates article text and guards against SSRF.
            </p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3 relative group">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold text-sm border border-purple-500/20">
              02
            </div>
            <h4 className="text-sm font-bold text-white">Linguistic &amp; ML Profiling</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Scikit-learn TF-IDF classifies sensationalism and flags clickbait or hyperbolic patterns as secondary linguistic signals.
            </p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3 relative group">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-sm border border-blue-500/20">
              03
            </div>
            <h4 className="text-sm font-bold text-white">External Fact-Check Search</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Cross-references Google Fact Check Tools API and GDELT Global Knowledge Graph for independent corroboration or debunks.
            </p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3 relative group">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-sm border border-emerald-500/20">
              04
            </div>
            <h4 className="text-sm font-bold text-white">Cautious Gemini Synthesis</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Google Gemini evaluates all evidence under strict system prompts, returning UNVERIFIED if proof is insufficient.
            </p>
          </div>

        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="space-y-8 max-w-6xl mx-auto">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Architected for Modern Media Forensics
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Engineered from ground up with enterprise-grade standards, REST APIs, and transparent explainability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
            <Globe2 className="w-6 h-6 text-cyan-400" />
            <h4 className="text-sm font-bold text-white">Tri-Modal News Ingestion</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Verify breaking headlines, complete multi-paragraph investigative reports, or live web links with automated SSRF protection.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
            <Database className="w-6 h-6 text-purple-400" />
            <h4 className="text-sm font-bold text-white">Persistent SQLite History</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              All previous analyses are indexed with timestamp, model confidence, and full evidence traces for auditability and review.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
            <FileText className="w-6 h-6 text-emerald-400" />
            <h4 className="text-sm font-bold text-white">Exportable PDF Reports</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Generate clean, formatted, printer-friendly PDF intelligence reports with one click for research, verification, or journalism.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
}
