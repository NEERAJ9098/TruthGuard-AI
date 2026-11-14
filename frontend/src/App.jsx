import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import AnalyzePage from './pages/AnalyzePage';
import ResultsPage from './pages/ResultsPage';
import HistoryPage from './pages/HistoryPage';
import DashboardPage from './pages/DashboardPage';
import AboutPage from './pages/AboutPage';

export default function App() {
  const [activePage, setActivePage] = useState('landing');
  const [currentReport, setCurrentReport] = useState(null);
  const [prefillNews, setPrefillNews] = useState(null);

  const handleAnalysisComplete = (report) => {
    setCurrentReport(report);
    setActivePage('results');
  };

  const handleSelectHistoryReport = (report) => {
    setCurrentReport(report);
    setActivePage('results');
  };

  return (
    <div className="min-h-screen flex flex-col bg-navy-950 text-slate-100 selection:bg-cyan-500/20 selection:text-cyan-300">
      
      {/* Top Navigation Bar */}
      <Navbar activePage={activePage} setActivePage={setActivePage} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activePage === 'landing' && (
          <LandingPage
            setActivePage={setActivePage}
            setPrefillNews={setPrefillNews}
          />
        )}

        {activePage === 'analyze' && (
          <AnalyzePage
            onAnalysisComplete={handleAnalysisComplete}
            prefillNews={prefillNews}
            setPrefillNews={setPrefillNews}
          />
        )}

        {activePage === 'results' && (
          <ResultsPage
            report={currentReport}
            onBackToAnalyze={() => setActivePage('analyze')}
            onOpenHistory={() => setActivePage('history')}
          />
        )}

        {activePage === 'history' && (
          <HistoryPage
            onSelectReport={handleSelectHistoryReport}
            onNewAnalysis={() => setActivePage('analyze')}
          />
        )}

        {activePage === 'dashboard' && (
          <DashboardPage
            onNewAnalysis={() => setActivePage('analyze')}
          />
        )}

        {activePage === 'about' && (
          <AboutPage />
        )}
      </main>

      {/* Persistent Footer */}
      <Footer setActivePage={setActivePage} />

    </div>
  );
}
