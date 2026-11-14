import React, { useState } from 'react';
import { CheckCircle2, XCircle, ExternalLink, Globe, Calendar, FileText, Check, AlertCircle } from 'lucide-react';

export default function EvidenceViewer({
  claims = [],
  supporting = [],
  contradicting = [],
  sources = []
}) {
  const [activeTab, setActiveTab] = useState('evidence');

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
      
      {/* Tab Navigation */}
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => setActiveTab('evidence')}
          className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 flex items-center space-x-2 ${
            activeTab === 'evidence'
              ? 'border-cyan-400 text-cyan-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>Evidence Cross-Reference</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-slate-300">
            {supporting.length + contradicting.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('claims')}
          className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 flex items-center space-x-2 ${
            activeTab === 'claims'
              ? 'border-cyan-400 text-cyan-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>Extracted Claims</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-slate-300">
            {claims.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('sources')}
          className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 flex items-center space-x-2 ${
            activeTab === 'sources'
              ? 'border-cyan-400 text-cyan-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>Sources &amp; Publishers</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-slate-300">
            {sources.length}
          </span>
        </button>
      </div>

      {/* Tab 1: Evidence */}
      {activeTab === 'evidence' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Supporting Evidence Column */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <h4 className="text-xs font-bold uppercase tracking-wider">Supporting Evidence ({supporting.length})</h4>
              </div>

              {supporting.length > 0 ? (
                <div className="space-y-3">
                  {supporting.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-navy-900/60 border border-emerald-500/20 hover:border-emerald-500/40 transition-all space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-200 flex items-center space-x-1.5">
                          <Globe className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{item.source}</span>
                        </span>
                        {item.date && (
                          <span className="text-[11px] text-slate-400 flex items-center space-x-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span>{item.date}</span>
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed italic">
                        "{item.snippet}"
                      </p>

                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 text-[11px] text-cyan-400 hover:text-cyan-300 hover:underline pt-1"
                        >
                          <span>Inspect Source</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-navy-950/50 border border-slate-800/80 text-xs text-slate-400 italic">
                  No verified supporting evidence identified across indexed databases.
                </div>
              )}
            </div>

            {/* Contradicting Evidence Column */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-rose-400">
                <XCircle className="w-4 h-4" />
                <h4 className="text-xs font-bold uppercase tracking-wider">Contradicting / Debunking Evidence ({contradicting.length})</h4>
              </div>

              {contradicting.length > 0 ? (
                <div className="space-y-3">
                  {contradicting.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-navy-900/60 border border-rose-500/20 hover:border-rose-500/40 transition-all space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-rose-300 flex items-center space-x-1.5">
                          <Globe className="w-3.5 h-3.5 text-rose-400" />
                          <span>{item.source}</span>
                        </span>
                        {item.date && (
                          <span className="text-[11px] text-slate-400 flex items-center space-x-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span>{item.date}</span>
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed italic">
                        "{item.snippet}"
                      </p>

                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 text-[11px] text-rose-400 hover:text-rose-300 hover:underline pt-1"
                        >
                          <span>Review Fact-Check Article</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-navy-950/50 border border-slate-800/80 text-xs text-slate-400 italic">
                  No official debunking records or contradictory fact checks found.
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Tab 2: Claims */}
      {activeTab === 'claims' && (
        <div className="space-y-3">
          <p className="text-xs text-slate-400">
            Factual claims extracted and parsed from the news submission for verification against official knowledge bases:
          </p>
          <div className="space-y-2">
            {claims.map((claim, idx) => (
              <div
                key={idx}
                className="flex items-start space-x-3 p-3 rounded-xl bg-navy-900/60 border border-slate-800 text-xs text-slate-200"
              >
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center flex-shrink-0 text-[11px] font-bold">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{claim}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Sources */}
      {activeTab === 'sources' && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {sources.map((s, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-navy-900/60 border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between"
              >
                <div>
                  <h5 className="text-xs font-semibold text-slate-200">{s.name}</h5>
                  <div className="flex items-center space-x-2 text-[11px] text-slate-400 mt-0.5">
                    <span className="px-1.5 py-0.2 rounded bg-slate-800 text-cyan-300 text-[10px]">
                      {s.reliability_tier || 'Verified Media'}
                    </span>
                    {s.published_date && <span>{s.published_date}</span>}
                  </div>
                </div>

                {s.url && (
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-navy-950 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
