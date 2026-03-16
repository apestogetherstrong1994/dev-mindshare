export default function DashboardSwitcher({ active }) {
  const tabs = [
    { id: 'ecosystem', label: 'Developer Ecosystem', hash: '#/' },
    { id: 'revenue', label: 'Revenue Model', hash: '#/revenue' },
  ];

  return (
    <div className="flex items-center gap-1 mb-6 pb-4 border-b border-terminal-border/50">
      <span className="text-[9px] font-mono text-terminal-muted/50 uppercase tracking-widest mr-3">
        Dashboards
      </span>
      {tabs.map((tab) => (
        <a
          key={tab.id}
          href={tab.hash}
          className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider rounded transition-colors ${
            active === tab.id
              ? 'bg-terminal-elevated text-terminal-bright border border-terminal-border'
              : 'text-terminal-muted hover:text-terminal-text hover:bg-terminal-elevated/50'
          }`}
        >
          {tab.label}
        </a>
      ))}
    </div>
  );
}
