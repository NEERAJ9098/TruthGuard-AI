import React, { useState } from 'react';
import { 
  CheckCircle2, XCircle, AlertTriangle, HelpCircle, 
  Copy, Check, Download, ArrowLeft, Share2, 
  Calendar, Cpu, FileText, Info, ShieldCheck, Sparkles 
} from 'lucide-react';
import ConfidenceMeter from '../components/ConfidenceMeter';
import SuspiciousWordsHighlighter from '../components/SuspiciousWordsHighlighter';
import EvidenceViewer from '../components/EvidenceViewer';
import { printOrDownloadReport } from '../utils/pdfExport';

export default function ResultsPage({ report, onBackToAnalyze, onOpenHistory }) {
  const [copied, setCopied] = useState(false);

  if (!report) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-slate-400 text-sm">No analysis report selected.</p>
        <button
          onClick={onBackToAnalyze}
          className="px-6 py-2.5 rounded-xl bg-cyan-500 text-white font-semibold text-xs"
        >
          Analyze News
        </button>
      </div>
    );
  }

  const handleCopyReport = () => {
    const textReport = `
=== TRUTHGUARD AI VERIFICATION REPORT ===
Event: HackNova Bhopal 2K26
Title: ${report.title || 'Untitled'}
Verdict: ${report.verdict}
Confidence Score: ${report.confidence_score}% (Model-Estimated)
Evidence Depth: ${report.evidence_coverage}
AI Engine: ${report.ai_provider || 'Gemini'}
Timestamp: ${report.created_at || new Date().toISOString()}

--- SUMMARY ---
${report.summary}

--- REASONING & FORENSICS ---
${report.reasoning}

--- EXTRACTED CLAIMS ---
${(report.claims || []).map((c, i) => `${i + 1}. ${c}`).join('\n')}

--- SUSPICIOUS PHRASES DETECTED ---
${(report.suspicious_phrases || []).join(', ') || 'None'}

--- CRITICAL LIMITATIONS & DISCLAIMER ---
${report.limitations}
=========================================
`;
    navigator.clipboard.writeText(textReport.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const getVerdictConfig = () => {
    switch (report.verdict) {
      case 'LIKELY_REAL':
        return {
          label: 'Likely Real',
          badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-emerald-500/20',
          gradientBg: 'from-emerald-950/40 via-navy-950 to-navy-950',
          borderClass: 'border-emerald-500/30',
          icon: CheckCircle2,
          iconColor: 'text-emerald-400',
          description: 'Corroborated by verified reporting and accredited documentation with neutral journalistic prose.'
        };
      case 'LIKELY_FAKE':
        return {
          label: 'Likely Fake',
          badgeClass: 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-rose-500/20',
          gradientBg: 'from-rose-950/40 via-navy-950 to-navy-950',
          borderClass: 'border-rose-500/30',
          icon: XCircle,
          iconColor: 'text-rose-400',
          description: 'Directly contradicted by credible fact-checking registries and exhibits manipulative fabrication markers.'
        };
      case 'MIXED_OR_MISLEADING':
        return {
          label: 'Mixed / Misleading',
          badgeClass: 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-purple-500/20',
          gradientBg: 'from-purple-950/40 via-navy-950 to-navy-950',
          borderClass: 'border-purple-500/30',
          icon: AlertTriangle,
          iconColor: 'text-purple-400',
          description: 'Contains a grain of authentic fact wrapped in exaggerated, hyperbolic, or scientifically distorted framing.'
        };
      case 'UNVERIFIED':
      default:
        return {
          label: 'Unverified',
          badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-amber-500/20',
          gradientBg: 'from-amber-950/40 via-navy-950 to-navy-950',
          borderClass: 'border-amber-500/30',
          icon: HelpCircle,
          iconColor: 'text-amber-400',
          description: 'Insufficient independent documentation or official evidence found. Cautiously reserved as unverified.'
        };
    }
  };

  const vConfig = getVerdictConfig();
  const VerdictIcon = vConfig.icon;

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4">
      
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <button
          onClick={onBackToAnalyze}
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Verify Another Article</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopyReport}
            className="px-3.5 py-2 rounded-xl glass-panel text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-all flex items-center space-x-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Summary'}</span>
          </button>

          <button
            onClick={() => printOrDownloadReport(report)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-xs font-semibold shadow-md shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all flex items-center space-x-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF Report</span>
          </button>
        </div>
      </div>

      {/* Main Verdict Hero Card */}
      <div className={`p-6 sm:p-8 rounded-3xl bg-gradient-to-b ${vConfig.gradientBg} border ${vConfig.borderClass} space-y-6 shadow-2xl`}>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-[11px] font-mono text-slate-400">
              <span>REPORT #{report.id || 'LIVE'}</span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <Calendar className="w-3 h-3 text-slate-400" />
                <span>{report.created_at || 'Just now'}</span>
              </span>
              <span>•</span>
              <span className="text-cyan-400">{report.ai_provider || 'Gemini 2.5'}</span>
            </div>

            <div className="flex items-center space-x-3">
              <span className={`inline-flex items-center space-x-2 px-4 py-1.5 rounded-2xl text-sm font-extrabold uppercase tracking-wide border shadow-md ${vConfig.badgeClass}`}>
                <VerdictIcon className="w-5 h-5" />
                <span>{vConfig.label}</span>
              </span>

              {report.is_demo && (
                <span className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Demo Mode
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
              {report.title || 'Extracted News Article'}
            </h1>

            <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
              {vConfig.description}
            </p>
          </div>

          {/* Quick Metrics Badge */}
          <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center p-4 rounded-2xl bg-navy-950/80 border border-slate-800 min-w-[210px] space-y-1">
            <div className="text-right">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Model Confidence</div>
              <div className="text-3xl font-black text-cyan-300">
                {report.confidence_score}%
              </div>
              <div className="text-[10px] text-slate-400 italic">Estimated by AI</div>
            </div>

            <div className="pt-2 text-right">
              <span className="text-[10px] text-slate-400 block">Fact Checks Found:</span>
              <span className="font-mono text-xs font-bold text-emerald-400">{report.fact_check_count || 0}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Grid: Confidence Meter + Suspicious Words */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ConfidenceMeter
          score={report.confidence_score}
          coverage={report.evidence_coverage}
          verdict={report.verdict}
        />

        <SuspiciousWordsHighlighter
          phrases={report.suspicious_phrases}
          mlSignal={report.ml_signal}
        />
      </div>

      {/* AI Summary & Detailed Forensics */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center space-x-2 text-cyan-400">
          <Sparkles className="w-4 h-4" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Executive Summary &amp; Forensic Explanation
          </h3>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-slate-200 leading-relaxed font-medium">
            {report.summary}
          </p>

          <div className="p-4 rounded-xl bg-navy-950/70 border border-slate-800/80 text-xs text-slate-300 space-y-1.5 leading-relaxed">
            <span className="font-semibold text-slate-200 block">Analytical Reasoning:</span>
            <p>{report.reasoning}</p>
          </div>
        </div>
      </div>

      {/* Evidence Viewer: Claims, Supporting, Contradicting, Sources */}
      <EvidenceViewer
        claims={report.claims}
        supporting={report.supporting_evidence}
        contradicting={report.contradicting_evidence}
        sources={report.sources}
      />

      {/* Critical Limitations & Responsible AI Disclaimer */}
      <div className="p-5 rounded-2xl bg-navy-950 border border-slate-800 text-xs text-slate-400 space-y-2 leading-relaxed">
        <div className="flex items-center space-x-2 text-slate-300 font-semibold">
          <Info className="w-4 h-4 text-cyan-400" />
          <span>System Limitations &amp; Ethical AI Boundary:</span>
        </div>
        <p>
          {report.limitations || 'Confidence is model-estimated and based solely on the documents available at time of query. Always verify breaking claims with accredited regulatory authorities.'}
        </p>
        <p className="text-[11px] text-slate-400">
          TruthGuard AI is developed as a collegiate demonstration for HackNova Bhopal 2K26. It serves as an assistive verification tool rather than an infallible arbiter of truth.
        </p>
      </div>

    </div>
  );
}
