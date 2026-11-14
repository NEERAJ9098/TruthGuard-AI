import React, { useState, useEffect } from 'react';
import { 
  BarChart3, PieChart as PieIcon, TrendingUp, ShieldCheck, 
  CheckCircle2, XCircle, AlertTriangle, HelpCircle, 
  Layers, RefreshCw, Sparkles, Award 
} from 'lucide-react';
import { 
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area, Legend 
} from 'recharts';
import { api } from '../services/api';
import StatCard from '../components/StatCard';

export default function DashboardPage({ onNewAnalysis }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const data = await api.getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error("Failed to load dashboard stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20 space-y-3">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs text-slate-400">Loading live verification analytics...</p>
      </div>
    );
  }

  const verdictDistribution = stats?.verdict_distribution || [];
  const evidenceDistribution = stats?.evidence_coverage_distribution || [];
  const recentTimeline = stats?.recent_verdicts || [];

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-4">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>AI Forensics Telemetry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center space-x-2">
            <BarChart3 className="w-6 h-6 text-cyan-400" />
            <span>Analytics &amp; Misinformation Trends</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time aggregate distribution across all news reports processed by TruthGuard AI.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={fetchStats}
            className="p-2.5 rounded-xl glass-panel text-slate-400 hover:text-white transition-colors"
            title="Refresh metrics"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={onNewAnalysis}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-xs font-semibold shadow-md shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all flex items-center space-x-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Analyze News</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Analyzed"
          value={stats?.total_analyzed || 0}
          subtitle="Processed submissions"
          icon={ShieldCheck}
          color="cyan"
        />

        <StatCard
          title="Likely Real"
          value={stats?.likely_real_count || 0}
          subtitle="Factually corroborated"
          icon={CheckCircle2}
          color="emerald"
        />

        <StatCard
          title="Likely Fake"
          value={stats?.likely_fake_count || 0}
          subtitle="Directly debunked hoaxes"
          icon={XCircle}
          color="rose"
        />

        <StatCard
          title="Unverified"
          value={stats?.unverified_count || 0}
          subtitle="Insufficient external proof"
          icon={HelpCircle}
          color="amber"
        />

        <StatCard
          title="Avg Confidence"
          value={`${stats?.avg_confidence || 0}%`}
          subtitle="Model internal certainty"
          icon={Award}
          color="purple"
        />
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Verdict Distribution Donut */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <PieIcon className="w-4 h-4 text-cyan-400" />
              <span>Verdict Outcome Breakdown</span>
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">Categorical Split</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={verdictDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {verdictDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#070b19" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0b132b',
                    borderColor: '#1e293b',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#fff',
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => <span style={{ color: '#94a3b8', fontSize: '11px' }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Evidence Depth Distribution */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Layers className="w-4 h-4 text-purple-400" />
              <span>Evidence Corroboration Depth</span>
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">Archive Coverage</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={evidenceDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1c2541" />
                <XAxis dataKey="category" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0b132b',
                    borderColor: '#1e293b',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="count" fill="#8b5cf6" radius={[6, 6, 0, 0]}>
                  {evidenceDistribution.map((entry, index) => (
                    <Cell key={`cell-bar-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Recent Verifications Activity Timeline */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>Recent Analysis Stream</span>
          </h3>
          <span className="text-[11px] text-slate-400">Chronological history log</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-navy-950/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Headline / Story</th>
                <th className="py-3 px-4">Verdict</th>
                <th className="py-3 px-4">Confidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {recentTimeline.map((item) => (
                <tr key={item.id} className="hover:bg-navy-900/50 transition-colors">
                  <td className="py-3 px-4 font-mono text-cyan-400 font-bold">#{item.id}</td>
                  <td className="py-3 px-4 font-medium text-slate-200">{item.title}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.verdict === 'LIKELY_REAL' ? 'bg-emerald-500/20 text-emerald-300' :
                      item.verdict === 'LIKELY_FAKE' ? 'bg-rose-500/20 text-rose-300' :
                      item.verdict === 'UNVERIFIED' ? 'bg-amber-500/20 text-amber-300' : 'bg-purple-500/20 text-purple-300'
                    }`}>
                      {item.verdict.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-slate-200">
                    {item.confidence}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
