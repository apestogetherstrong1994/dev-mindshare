import DashboardSwitcher from '../layout/DashboardSwitcher';
import ConfidenceBadge from '../ui/ConfidenceBadge';

const NAV_ITEMS = [
  { id: 'overview', label: '01 Market Overview' },
  { id: 'trajectory', label: '02 Revenue Trajectory' },
  { id: 'decomposition', label: '03 Decomposition' },
  { id: 'mix', label: '04 Revenue Mix' },
  { id: 'unit-economics', label: '05 Unit Economics' },
  { id: 'forward-model', label: '06 Forward Model' },
  { id: 'milestones', label: '07 Milestones' },
  { id: 'positioning', label: '08 Positioning' },
  { id: 'insights', label: '09 Insights' },
  { id: 'sources', label: '10 Sources' },
];

export default function RevenueHeader() {
  return (
    <>
      <DashboardSwitcher active="revenue" />

      <header className="mb-6">
        <div className="flex items-start justify-between mb-4 pb-4 border-b border-terminal-border">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-[10px] font-mono text-terminal-muted uppercase tracking-widest">
                Financial Analysis Dashboard
              </span>
            </div>
            <h1 className="text-2xl font-mono font-bold text-terminal-bright tracking-tight">
              AI Revenue Model Decomposition
            </h1>
            <p className="text-sm font-mono text-terminal-muted mt-1">
              How Frontier AI Labs Make Money — Revenue Architecture, Q1 2026
            </p>
          </div>
          <div className="text-right shrink-0 ml-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-amber-500/30 bg-amber-500/10 mb-2">
              <span className="text-[9px] font-mono text-amber-400 uppercase tracking-widest font-semibold">
                Financial Analysis
              </span>
            </div>
            <p className="text-[10px] font-mono text-terminal-muted">
              Prepared by Dev Gupta
            </p>
            <p className="text-[10px] font-mono text-terminal-muted">
              Data as of March 2026
            </p>
          </div>
        </div>

        {/* Confidence Legend */}
        <div className="flex items-center gap-6 py-2 px-4 bg-terminal-surface/30 rounded border border-terminal-border/50 mb-4">
          <span className="text-[9px] font-mono text-terminal-muted uppercase tracking-widest mr-2">
            Data Confidence:
          </span>
          <div className="flex items-center gap-1.5">
            <ConfidenceBadge level="confirmed" showLabel />
            <span className="text-[9px] font-mono text-terminal-muted ml-1">Official disclosure / 3+ Tier 1 sources</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ConfidenceBadge level="estimated" showLabel />
            <span className="text-[9px] font-mono text-terminal-muted ml-1">Triangulated / 1-2 sources</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ConfidenceBadge level="speculative" showLabel />
            <span className="text-[9px] font-mono text-terminal-muted ml-1">Model-derived / user assumptions</span>
          </div>
        </div>
      </header>

      {/* Sticky navigation — uses scrollIntoView to avoid hash conflicts with router */}
      <nav className="sticky top-0 z-50 bg-terminal-bg/90 backdrop-blur-md -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-2 mb-8 border-b border-terminal-border/50 flex flex-wrap gap-1">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' })}
            className="px-3 py-1.5 text-[10px] font-mono text-terminal-muted uppercase tracking-wider hover:text-terminal-bright hover:bg-terminal-elevated/50 rounded transition-colors cursor-pointer"
          >
            {item.label}
          </button>
        ))}
      </nav>
    </>
  );
}
