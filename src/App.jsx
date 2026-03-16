import Header from './components/sections/Header';
import ExecutiveScoreboard from './components/sections/ExecutiveScoreboard';
import SdkDownloadTrends from './components/sections/SdkDownloadTrends';
import GitHubHealthMatrix from './components/sections/GitHubHealthMatrix';
import DeveloperDiscourse from './components/sections/DeveloperDiscourse';
import JobMarketSignals from './components/sections/JobMarketSignals';
import McpEcosystem from './components/sections/McpEcosystem';
import CompositeIndex from './components/sections/CompositeIndex';
import TrendInflections from './components/sections/TrendInflections';
import SourcesMethodology from './components/sections/SourcesMethodology';

export default function App() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Header />
      <ExecutiveScoreboard />
      <SdkDownloadTrends />
      <GitHubHealthMatrix />
      <DeveloperDiscourse />
      <JobMarketSignals />
      <McpEcosystem />
      <CompositeIndex />
      <TrendInflections />
      <SourcesMethodology />

      {/* Footer */}
      <footer className="mt-16 pt-6 border-t border-terminal-border text-center">
        <p className="text-[10px] font-mono text-terminal-muted uppercase tracking-widest">
          Developer Ecosystem & Mindshare Tracker — Supplemental Application Material
        </p>
        <p className="text-[10px] font-mono text-terminal-muted mt-1">
          Prepared by Dev Gupta · March 2026 · All data from public sources
        </p>
      </footer>
    </div>
  );
}
