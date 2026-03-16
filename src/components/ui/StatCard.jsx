import { formatNumber, formatPercent } from '../../utils/formatters';

export default function StatCard({ label, value, formattedValue, delta, deltaLabel, color, small }) {
  const displayValue = formattedValue || formatNumber(value);

  return (
    <div className="bg-terminal-surface/50 border border-terminal-border rounded-lg p-4 hover:border-terminal-muted/50 transition-colors">
      <p className="text-[10px] text-terminal-muted uppercase tracking-widest font-mono mb-2">
        {label}
      </p>
      <p
        className={`font-bold font-mono ${small ? 'text-lg' : 'text-2xl'}`}
        style={color ? { color } : {}}
      >
        {displayValue}
      </p>
      {delta !== undefined && delta !== null && (
        <p className={`text-xs font-mono mt-1 ${delta > 0 ? 'text-green-400' : delta < 0 ? 'text-red-400' : 'text-terminal-muted'}`}>
          {formatPercent(delta)} {deltaLabel && <span className="text-terminal-muted">{deltaLabel}</span>}
        </p>
      )}
    </div>
  );
}
