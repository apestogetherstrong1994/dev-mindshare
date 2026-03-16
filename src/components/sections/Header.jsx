const NAV_ITEMS = [
  { id: 'scoreboard', label: '01 Executive Scoreboard' },
  { id: 'sdk-trends', label: '02 SDK Trends' },
  { id: 'github', label: '03 GitHub Health' },
  { id: 'discourse', label: '04 Discourse' },
  { id: 'jobs', label: '05 Job Market' },
  { id: 'mcp', label: '06 MCP Ecosystem' },
  { id: 'composite', label: '07 Composite Index' },
  { id: 'insights', label: '08 Key Takeaways' },
  { id: 'sources', label: '09 Sources' },
];

export default function Header() {
  return (
    <>
      <header className="mb-6">
        {/* Top bar */}
        <div className="flex items-start justify-between mb-4 pb-4 border-b border-terminal-border">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[10px] font-mono text-terminal-muted uppercase tracking-widest">
                Live Intelligence Dashboard
              </span>
            </div>
            <h1 className="text-2xl font-mono font-bold text-terminal-bright tracking-tight">
              Developer Ecosystem & Mindshare Tracker
            </h1>
            <p className="text-sm font-mono text-terminal-muted mt-1">
              Cross-Provider Adoption Intelligence — March 2026
            </p>
          </div>
          <div className="text-right shrink-0 ml-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-red-500/30 bg-red-500/10 mb-2">
              <span className="text-[9px] font-mono text-red-400 uppercase tracking-widest font-semibold">
                Confidential
              </span>
            </div>
            <p className="text-[10px] font-mono text-terminal-muted">
              Prepared by Dev Gupta
            </p>
            <p className="text-[10px] font-mono text-terminal-muted">
              Last updated: March 13, 2026
            </p>
          </div>
        </div>
      </header>

      {/* Sticky navigation — outside header so it sticks independently */}
      <nav className="sticky top-0 z-50 bg-terminal-bg/90 backdrop-blur-md -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-2 mb-8 border-b border-terminal-border/50 flex flex-wrap gap-1">
        {NAV_ITEMS.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="px-3 py-1.5 text-[10px] font-mono text-terminal-muted uppercase tracking-wider hover:text-terminal-bright hover:bg-terminal-elevated/50 rounded transition-colors"
          >
            {item.label}
          </a>
        ))}
      </nav>
    </>
  );
}
