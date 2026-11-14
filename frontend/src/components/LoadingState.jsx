import React, { useState, useEffect } from 'react';
import { ShieldCheck, Cpu, Search, Sparkles, Check } from 'lucide-react';

const STEPS = [
  { label: 'Cleaning and preprocessing article text & structure...', icon: Cpu },
  { label: 'Extracting verifiable factual claims & entities...', icon: Search },
  { label: 'Scanning for sensationalism & emotional clickbait markers...', icon: Sparkles },
  { label: 'Cross-querying Google Fact Check Tools database...', icon: Search },
  { label: 'Searching GDELT Global Knowledge Graph for media coverage...', icon: Search },
  { label: 'Prompting Google Gemini AI for evidence-backed assessment...', icon: Sparkles },
];

export default function LoadingState() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-slate-800 text-center max-w-xl mx-auto space-y-8 animate-pulse-slow">
      
      {/* Animated Glowing Shield Radar */}
      <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-cyan-500/20 animate-ping"></div>
        <div className="absolute inset-2 rounded-full bg-purple-500/20 animate-pulse"></div>
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-purple-600 p-[2px] shadow-xl shadow-cyan-500/30">
          <div className="w-full h-full bg-navy-950 rounded-[14px] flex items-center justify-center">
            <ShieldCheck className="w-8 h-8 text-cyan-400 animate-spin-slow" />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-bold text-white tracking-tight">
          TruthGuard AI Verification Pipeline Running
        </h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Conducting multi-tiered forensic analysis across linguistic classifiers, certified fact-check archives, and live news databases.
        </p>
      </div>

      {/* Step Checklist */}
      <div className="space-y-2 text-left bg-navy-950/60 p-5 rounded-2xl border border-slate-800/80">
        {STEPS.map((step, idx) => {
          const isDone = idx < currentStep;
          const isCurrent = idx === currentStep;

          return (
            <div
              key={idx}
              className={`flex items-center space-x-3 text-xs transition-colors py-1 ${
                isDone
                  ? 'text-emerald-400'
                  : isCurrent
                  ? 'text-cyan-300 font-semibold'
                  : 'text-slate-500'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] ${
                  isDone
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : isCurrent
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 animate-pulse'
                    : 'bg-slate-800 text-slate-500'
                }`}
              >
                {isDone ? <Check className="w-3 h-3" /> : idx + 1}
              </div>
              <span className="truncate">{step.label}</span>
            </div>
          );
        })}
      </div>

      <div className="text-[11px] text-slate-500">
        Engine: Google Gemini 2.5 Flash + GDELT Global Doc Index + Scikit-learn TF-IDF
      </div>

    </div>
  );
}
