const SEVERITY_STYLES = {
  high: 'border-l-amber-400 bg-amber-400/5',
  medium: 'border-l-blue-400 bg-blue-400/5',
  low: 'border-l-terminal-muted bg-terminal-surface/30',
};

const TYPE_LABELS = {
  growth: 'GROWTH',
  ecosystem: 'ECOSYSTEM',
  competition: 'COMPETITION',
  trend: 'TREND',
  jobs: 'JOB MARKET',
};

export default function InsightCard({ type, severity, text }) {
  return (
    <div className={`border-l-2 rounded-r-lg p-4 ${SEVERITY_STYLES[severity] || SEVERITY_STYLES.low}`}>
      <span className="text-[9px] font-mono uppercase tracking-widest text-terminal-muted">
        {TYPE_LABELS[type] || type?.toUpperCase()}
      </span>
      <p className="text-sm font-mono text-terminal-text mt-1 leading-relaxed">
        {text}
      </p>
    </div>
  );
}
