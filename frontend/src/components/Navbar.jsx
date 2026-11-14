import React, { useState, useEffect } from 'react';
import { ShieldCheck, Activity, History, BarChart3, Info, Sparkles, AlertCircle, Menu, X } from 'lucide-react';
import { api } from '../services/api';

export default function Navbar({ activePage, setActivePage }) {
  const [health, setHealth] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    api.getHealth()
      .then(data => setHealth(data))
      .catch(() => setHealth({ status: 'offline' }));
  }, []);

  const navItems = [
    { id: 'landing', label: 'Home', icon: ShieldCheck },
    { id: 'analyze', label: 'Analyze News', icon: Sparkles },
    { id: 'history', label: 'History', icon: History },
    { id: 'dashboard', label: 'Analytics', icon: BarChart3 },
    { id: 'about', label: 'About', icon: Info },
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 bg-navy-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Hackathon Tag */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => setActivePage('landing')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 p-[2px] shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all">
              <div className="w-full h-full bg-navy-950 rounded-[10px] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold tracking-tight text-white">TruthGuard</span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">AI</span>
              </div>
              <p className="text-[10px] text-slate-400 tracking-wider">HACKNOVA BHOPAL 2K26</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-500/10'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Backend Status Pill & Action CTA */}
          <div className="hidden sm:flex items-center space-x-3">
            {health && (
              <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-navy-900 border border-slate-700/60 text-xs text-slate-300">
                <span className={`w-2 h-2 rounded-full ${health.status === 'healthy' ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`}></span>
                <span className="font-mono text-[11px]">
                  {health.gemini_configured ? 'Gemini 2.5 Active' : 'Demo Engine Ready'}
                </span>
              </div>
            )}

            <button
              onClick={() => setActivePage('analyze')}
              className="relative group px-4 py-2 rounded-xl text-xs font-semibold text-white overflow-hidden shadow-md shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 transition-all group-hover:opacity-90"></div>
              <span className="relative flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
                <span>Verify News</span>
              </span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-navy-900"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-navy-950/95 px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActivePage(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-300 hover:bg-slate-800/50'
                }`}
              >
                <Icon className="w-5 h-5 text-cyan-400" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
