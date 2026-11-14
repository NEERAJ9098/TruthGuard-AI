import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Link2, FileText, Type, AlertCircle, 
  Trash2, ArrowRight, ShieldAlert, CheckCircle2, RotateCcw 
} from 'lucide-react';
import { api } from '../services/api';
import LoadingState from '../components/LoadingState';
import { SAMPLE_NEWS_ITEMS } from '../utils/sampleNews';

export default function AnalyzePage({ onAnalysisComplete, prefillNews, setPrefillNews }) {
  const [activeTab, setActiveTab] = useState('text'); // 'text', 'headline', 'url'
  const [inputText, setInputText] = useState('');
  const [inputUrl, setInputUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // If prefilled news was chosen from landing page
  useEffect(() => {
    if (prefillNews) {
      if (prefillNews.type === 'headline') {
        setActiveTab('headline');
        setInputText(prefillNews.text);
      } else {
        setActiveTab('text');
        setInputText(prefillNews.text);
      }
      setPrefillNews(null);
    }
  }, [prefillNews, setPrefillNews]);

  const handleClear = () => {
    setInputText('');
    setInputUrl('');
    setError(null);
  };

  const handleApplySample = (sample) => {
    setError(null);
    if (sample.type === 'headline') {
      setActiveTab('headline');
      setInputText(sample.text);
    } else {
      setActiveTab('text');
      setInputText(sample.text);
    }
  };

  const handleAnalyze = async (e) => {
    if (e) e.preventDefault();
    setError(null);

    if (activeTab === 'url') {
      const trimmedUrl = inputUrl.trim();
      if (!trimmedUrl) {
        setError('Please enter a valid HTTP or HTTPS news article URL.');
        return;
      }
      if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
        setError('URL must start with http:// or https://');
        return;
      }

      setLoading(true);
      try {
        const result = await api.analyzeUrl(trimmedUrl);
        onAnalysisComplete(result);
      } catch (err) {
        setError(err.message || 'Failed to analyze article URL. Please verify the URL or paste the text directly.');
      } finally {
        setLoading(false);
      }
    } else {
      const trimmedText = inputText.trim();
      if (!trimmedText || trimmedText.length < 5) {
        setError('Please enter at least 5 characters of news headline or article content to analyze.');
        return;
      }

      setLoading(true);
      try {
        const inputType = activeTab === 'headline' ? 'headline' : 'article';
        const result = await api.analyzeNews(trimmedText, inputType);
        onAnalysisComplete(result);
      } catch (err) {
        setError(err.message || 'Analysis engine encountered an error. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      
      {/* Title & Introduction */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI News Verification Console</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Verify News Authenticity
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
          Submit any headline, news copy, or public URL to cross-examine claims with Google Gemini AI and global fact-checking registers.
        </p>
      </div>

      {/* Preset Samples Selector */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-300 flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Load Quick Hackathon Demo Cases:</span>
          </span>
          <span className="text-[11px] text-slate-400">Click to autofill</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {SAMPLE_NEWS_ITEMS.map((sample) => (
            <button
              key={sample.id}
              onClick={() => handleApplySample(sample)}
              className="px-3 py-1.5 rounded-xl text-xs font-medium bg-navy-950 border border-slate-700/80 hover:border-cyan-500/50 hover:bg-slate-800 text-slate-200 transition-all flex items-center space-x-1.5"
            >
              <span className={`w-2 h-2 rounded-full ${
                sample.expectedVerdict === 'LIKELY_REAL' ? 'bg-emerald-400' :
                sample.expectedVerdict === 'LIKELY_FAKE' ? 'bg-rose-400' :
                sample.expectedVerdict === 'UNVERIFIED' ? 'bg-amber-400' : 'bg-purple-400'
              }`}></span>
              <span>{sample.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Analysis Form Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
        
        {/* Input Mode Tabs */}
        <div className="grid grid-cols-3 gap-2 p-1.5 bg-navy-950 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab('headline')}
            className={`flex items-center justify-center space-x-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'headline'
                ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Type className="w-4 h-4" />
            <span>Headline</span>
          </button>

          <button
            onClick={() => setActiveTab('text')}
            className={`flex items-center justify-center space-x-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'text'
                ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Full Article</span>
          </button>

          <button
            onClick={() => setActiveTab('url')}
            className={`flex items-center justify-center space-x-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'url'
                ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Link2 className="w-4 h-4" />
            <span>Article URL</span>
          </button>
        </div>

        {/* Input Area */}
        <form onSubmit={handleAnalyze} className="space-y-4">
          {activeTab === 'url' ? (
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">
                News Article URL (Protected against SSRF)
              </label>
              <div className="relative">
                <input
                  type="url"
                  placeholder="https://www.reuters.com/world/... or https://bbc.com/news/..."
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-navy-950/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                />
                <Link2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
              <p className="text-[11px] text-slate-400">
                Our backend URL extractor securely verifies target IP ranges, blocks internal subnets, and parses readable article paragraphs.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>
                  {activeTab === 'headline' ? 'Paste News Headline:' : 'Paste Complete News Article Content:'}
                </span>
                <span className="font-mono text-[11px]">
                  {inputText.length} / 15,000 chars
                </span>
              </div>

              <textarea
                rows={activeTab === 'headline' ? 3 : 7}
                placeholder={
                  activeTab === 'headline'
                    ? 'e.g., ISRO confirms historic Chandrayaan-3 soft landing near lunar south pole...'
                    : 'Paste the full article body text, quotes, and claims here for deep multi-paragraph verification...'
                }
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                maxLength={15000}
                className="w-full p-4 rounded-2xl bg-navy-950/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-sans leading-relaxed"
              ></textarea>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold">Verification Error:</span>
                <p className="leading-relaxed">{error}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleClear}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors flex items-center space-x-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-white font-bold text-sm shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/35 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4 text-cyan-200" />
              <span>Execute AI Analysis</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

      </div>

      {/* Verification Framework Notice */}
      <div className="p-4 rounded-2xl bg-navy-950/50 border border-slate-800/80 text-[11px] text-slate-400 space-y-1 leading-relaxed">
        <div className="font-semibold text-slate-300 flex items-center space-x-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
          <span>Evaluation Integrity Standard:</span>
        </div>
        <p>
          TruthGuard AI cross-checks assertions with Google Fact Check Tools and GDELT indexed news wires. 
          When reliable third-party verification is not yet published, the output verdict remains <strong>UNVERIFIED</strong> to uphold strict journalistic neutrality.
        </p>
      </div>

    </div>
  );
}
