import React from 'react';

export default function StatCard({ title, value, subtitle, icon: Icon, color = 'cyan', change = null }) {
  const colorMap = {
    cyan: 'from-cyan-500/20 to-blue-500/10 text-cyan-400 border-cyan-500/30',
    purple: 'from-purple-500/20 to-indigo-500/10 text-purple-400 border-purple-500/30',
    emerald: 'from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/30',
    rose: 'from-rose-500/20 to-red-500/10 text-rose-400 border-rose-500/30',
    amber: 'from-amber-500/20 to-yellow-500/10 text-amber-400 border-amber-500/30',
  };

  const activeColor = colorMap[color] || colorMap.cyan;

  return (
    <div className="glass-panel glass-panel-hover p-5 rounded-2xl border border-slate-800/80 relative overflow-hidden group">
      <div className={`absolute top-0 right-0 w-28 h-28 bg-gradient-to-br ${activeColor} rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity`}></div>
      
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-extrabold text-white mt-1 tracking-tight">{value}</h3>
          {subtitle && <p className="text-[11px] text-slate-400 mt-1">{subtitle}</p>}
        </div>

        <div className={`p-3 rounded-xl bg-navy-950/80 border border-slate-800 ${colorMap[color].split(' ')[2]}`}>
          {Icon && <Icon className="w-5 h-5" />}
        </div>
      </div>
    </div>
  );
}
