import React, { useState, useEffect } from 'react';
import { 
  History, Search, Filter, Trash2, ExternalLink, 
  Calendar, Award, CheckCircle2, XCircle, AlertTriangle, 
  HelpCircle, Sparkles, RefreshCw 
} from 'lucide-react';
import { api } from '../services/api';

export default function HistoryPage({ onSelectReport, onNewAnalysis }) {
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVerdict, setSelectedVerdict] = useState('ALL');
  const [deletingId, setDeletingId] = useState(null);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await api.getHistory();
      setHistoryList(data);
    } catch (err) {
      console.error("Failed to load history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDeleteItem = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm(`Delete report #${id} from history?`)) return;

    setDeletingId(id);
    try {
      await api.deleteHistoryItem(id);
      setHistoryList(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      alert("Failed to delete report: " + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm("Are you sure you want to clear all analysis history records?")) return;
    try {
      await api.clearAllHistory();
      setHistoryList([]);
    } catch (err) {
      alert("Failed to clear history: " + err.message);
    }
  };

  const handleOpenDetail = async (id) => {
    try {
      const fullReport = await api.getHistoryById(id);
      onSelectReport(fullReport);
    } catch (err) {
      alert("Failed to load detailed report: " + err.message);
    }
  };

  // Filter and search
  const filtered = historyList.filter(item => {
    const matchesSearch = 
      (item.title && item.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.summary && item.summary.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesVerdict = 
      selectedVerdict === 'ALL' || item.verdict === selectedVerdict;

    return matchesSearch && matchesVerdict;
  });

  const getVerdictBadge = (verdict) => {
    switch (verdict) {
      case 'LIKELY_REAL':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">LIKELY REAL</span>;
      case 'LIKELY_FAKE':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">LIKELY FAKE</span>;
      case 'MIXED_OR_MISLEADING':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">MIXED</span>;
      case 'UNVERIFIED':
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">UNVERIFIED</span>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 py-4">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center space-x-2">
            <History className="w-6 h-6 text-cyan-400" />
            <span>Verification History Archive</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Browse and retrieve previous AI news forensics recorded in SQLite.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={fetchHistory}
            className="p-2.5 rounded-xl glass-panel text-slate-400 hover:text-white transition-colors"
            title="Refresh history"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {historyList.length > 0 && (
            <button
              onClick={handleClearAll}
              className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold transition-colors flex items-center space-x-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}

          <button
            onClick={onNewAnalysis}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-xs font-semibold shadow-md shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all flex items-center space-x-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>New Analysis</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search verified articles by headline keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-navy-950 border border-slate-700/80 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400"
          />
        </div>

        {/* Verdict Filter Buttons */}
        <div className="flex items-center space-x-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['ALL', 'LIKELY_REAL', 'LIKELY_FAKE', 'UNVERIFIED', 'MIXED_OR_MISLEADING'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedVerdict(cat)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all ${
                selectedVerdict === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              {cat === 'ALL' ? 'All Records' : cat.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Records List */}
      {loading ? (
        <div className="text-center py-16 space-y-3">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-400">Loading analysis history from database...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center space-y-4">
          <History className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No Verification Records Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {searchQuery || selectedVerdict !== 'ALL'
              ? 'No historical reports match the current query or verdict filter.'
              : 'You have not analyzed any news articles yet. Run your first analysis to see reports listed here.'}
          </p>
          <button
            onClick={onNewAnalysis}
            className="px-5 py-2 rounded-xl bg-cyan-500 text-white font-semibold text-xs"
          >
            Start First Analysis
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => handleOpenDetail(item.id)}
              className="glass-panel glass-panel-hover p-4 sm:p-5 rounded-2xl border border-slate-800 cursor-pointer transition-all group flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                  <span className="font-mono text-cyan-400 font-bold">#{item.id}</span>
                  <span>•</span>
                  <span className="uppercase text-[10px] tracking-wider px-1.5 py-0.2 rounded bg-navy-950 border border-slate-800">
                    {item.input_type}
                  </span>
                  <span>•</span>
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>{item.created_at}</span>
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                  {item.title}
                </h3>

                {item.summary && (
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {item.summary}
                  </p>
                )}
              </div>

              {/* Status and Action */}
              <div className="flex items-center justify-between sm:justify-end space-x-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-800/80">
                <div className="text-right">
                  <div className="mb-1">{getVerdictBadge(item.verdict)}</div>
                  <div className="text-[11px] font-mono text-slate-400">
                    Confidence: <span className="font-bold text-slate-200">{item.confidence_score}%</span>
                  </div>
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={(e) => handleDeleteItem(e, item.id)}
                    disabled={deletingId === item.id}
                    className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="p-2 rounded-lg text-slate-500 group-hover:text-cyan-400 transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
