import React from 'react';
import { AlertTriangle, Tag, Sparkles, CheckCircle2 } from 'lucide-react';

export default function SuspiciousWordsHighlighter({ phrases = [], mlSignal = null }) {
  const hasPhrases = phrases && phrases.length > 0;

  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Writing Style & Sensationalism Signals
          </h4>
        </div>
        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
          {phrases.length} {phrases.length === 1 ? 'flag' : 'flags'}
        </span>
      </div>

      {/* Phrases Tags */}
      <div>
        {hasPhrases ? (
          <div className="flex flex-wrap gap-1.5">
            {phrases.map((phrase, idx) => (
              <span
                key={idx}
                className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-rose-500/15 text-rose-300 border border-rose-500/30"
              >
                <Tag className="w-3 h-3 text-rose-400" />
                <span>{phrase}</span>
              </span>
            ))}
          </div>
        ) : (
          <div className="flex items-center space-x-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-xl">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>No hyperbolic clickbait or conspiratorial triggers detected.</span>
          </div>
        )}
      </div>

      {/* ML Writing Style Signal Box */}
      {mlSignal && (
        <div className="p-3 rounded-xl bg-navy-950/70 border border-slate-800/80 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Scikit-learn TF-IDF + Logistic Reg:</span>
            <span className={`font-semibold ${mlSignal.sensationalism_score > 50 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {mlSignal.style_label}
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Sensationalism Index:</span>
            <span className="font-mono font-bold text-slate-200">{mlSignal.sensationalism_score}%</span>
          </div>
          <p className="text-[10px] text-slate-400 leading-tight">
            Note: Writing-style classification is a complementary linguistic signal and does <strong>not</strong> prove whether the factual assertions are true or false.
          </p>
        </div>
      )}
    </div>
  );
}
