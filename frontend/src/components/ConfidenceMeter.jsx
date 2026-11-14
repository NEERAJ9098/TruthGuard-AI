import React from 'react';
import { HelpCircle, Shield, Award, Layers } from 'lucide-react';

export default function ConfidenceMeter({ score = 0, coverage = 'LOW', verdict = 'UNVERIFIED' }) {
  const rounded = Math.round(score);

  const getScoreColor = () => {
    if (verdict === 'LIKELY_REAL') return 'text-emerald-400 stroke-emerald-400';
    if (verdict === 'LIKELY_FAKE') return 'text-rose-400 stroke-rose-400';
    if (verdict === 'UNVERIFIED') return 'text-amber-400 stroke-amber-400';
    return 'text-purple-400 stroke-purple-400';
  };

  const getCoverageColor = () => {
    switch (coverage.toUpperCase()) {
      case 'HIGH':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'MEDIUM':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'LOW':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      default:
        return 'bg-slate-700/30 text-slate-400 border-slate-600/30';
    }
  };

  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Award className="w-4 h-4 text-cyan-400" />
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Model-Estimated Confidence
          </h4>
        </div>
        <div className="group relative cursor-help">
          <HelpCircle className="w-4 h-4 text-slate-400 hover:text-slate-200 transition-colors" />
          <div className="absolute right-0 bottom-6 hidden group-hover:block w-64 p-2.5 bg-navy-900 border border-slate-700 rounded-lg text-[11px] text-slate-300 shadow-xl z-20 leading-relaxed">
            <strong>Model-Estimated Confidence:</strong> Represents the algorithmic certainty of the AI based on the available evidence and linguistic patterns. It is <em>not</em> mathematical certainty of historical fact.
          </div>
        </div>
      </div>

      {/* Progress Bar & Score */}
      <div>
        <div className="flex items-baseline justify-between mb-1.5">
          <span className={`text-3xl font-extrabold tracking-tight ${getScoreColor()}`}>
            {rounded}%
          </span>
          <span className="text-xs text-slate-400">
            {score >= 80 ? 'High Confidence' : score >= 60 ? 'Moderate Confidence' : 'Cautious / Low'}
          </span>
        </div>

        <div className="w-full bg-navy-950 rounded-full h-2.5 border border-slate-800 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${
              verdict === 'LIKELY_REAL' ? 'bg-gradient-to-r from-emerald-500 to-teal-400' :
              verdict === 'LIKELY_FAKE' ? 'bg-gradient-to-r from-rose-500 to-red-400' :
              verdict === 'UNVERIFIED' ? 'bg-gradient-to-r from-amber-500 to-yellow-400' :
              'bg-gradient-to-r from-purple-500 to-indigo-400'
            }`}
            style={{ width: `${Math.max(5, rounded)}%` }}
          ></div>
        </div>
      </div>

      {/* Evidence Coverage Indicator */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-1.5 text-slate-400">
          <Layers className="w-3.5 h-3.5 text-slate-400" />
          <span>Evidence Depth:</span>
        </div>
        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${getCoverageColor()}`}>
          {coverage} COVERAGE
        </span>
      </div>

      <p className="text-[10px] text-slate-400 italic leading-snug">
        *Confidence reflects internal model certainty based on cross-referenced external documents, not mathematical certainty.
      </p>
    </div>
  );
}
