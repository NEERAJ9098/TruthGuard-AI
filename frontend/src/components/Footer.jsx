import React from 'react';
import { ShieldCheck, Heart, Sparkles, ExternalLink, Cpu, Globe2, BookOpen } from 'lucide-react';

export default function Footer({ setActivePage }) {
  return (
    <footer className="border-t border-slate-800/80 bg-navy-950/90 text-slate-400 text-xs mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand & Hackathon info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              <span className="text-base font-bold text-white tracking-tight">TruthGuard AI</span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30">
                HackNova 2K26
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              A responsible artificial intelligence verification platform combating digital misinformation through 
              multi-stage linguistic profiling, cross-referenced global fact-checking repositories, and Google Gemini AI reasoning.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="px-2 py-1 rounded bg-navy-900 border border-slate-800 text-[11px] text-cyan-300">FastAPI</span>
              <span className="px-2 py-1 rounded bg-navy-900 border border-slate-800 text-[11px] text-purple-300">Google Gemini</span>
              <span className="px-2 py-1 rounded bg-navy-900 border border-slate-800 text-[11px] text-blue-300">GDELT Global News</span>
              <span className="px-2 py-1 rounded bg-navy-900 border border-slate-800 text-[11px] text-emerald-300">Google Fact Check</span>
              <span className="px-2 py-1 rounded bg-navy-900 border border-slate-800 text-[11px] text-amber-300">Scikit-learn TF-IDF</span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setActivePage('landing')} className="hover:text-cyan-400 transition-colors">
                  Home Landing
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('analyze')} className="hover:text-cyan-400 transition-colors">
                  Analyze News
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('history')} className="hover:text-cyan-400 transition-colors">
                  Verification History
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('dashboard')} className="hover:text-cyan-400 transition-colors">
                  Analytics Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('about')} className="hover:text-cyan-400 transition-colors">
                  About Methodology
                </button>
              </li>
            </ul>
          </div>

          {/* Ethical AI Disclaimer */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">Responsible AI</h4>
            <p className="text-[11px] text-slate-400 leading-normal mb-2">
              TruthGuard AI strictly distinguishes writing style from factual ground truth. Uncorroborated claims are categorized as <strong>UNVERIFIED</strong> to prevent misinformation suppression bias.
            </p>
            <p className="text-[10px] text-slate-500">
              Built for HackNova Bhopal 2K26. Always confirm critical claims with primary accredited institutions.
            </p>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500">
          <div>
            &copy; 2026 TruthGuard AI. Built with precision for HackNova Bhopal 2K26.
          </div>
          <div className="mt-2 sm:mt-0 flex items-center space-x-1">
            <span>Powered by</span>
            <span className="text-cyan-400 font-medium">Google Gemini</span>
            <span>&amp; Open News Standards</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
