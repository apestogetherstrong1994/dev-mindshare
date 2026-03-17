import { formatNumber } from '../../utils/formatters';

export default function CustomTooltip({ active, payload, label, formatter }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-terminal-elevated border border-terminal-border rounded-lg p-3 shadow-xl">
      <p className="text-[10px] font-mono text-terminal-muted mb-2 uppercase tracking-wider">{label}</p>
      {[...payload].sort((a, b) => (b.value || 0) - (a.value || 0)).map((entry, i) => (
        <div key={i} className="flex items-center gap-2 text-xs font-mono mb-1">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-terminal-muted">{entry.name}:</span>
          <span className="text-terminal-bright font-semibold">
            {formatter ? formatter(entry.value) : formatNumber(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
}
