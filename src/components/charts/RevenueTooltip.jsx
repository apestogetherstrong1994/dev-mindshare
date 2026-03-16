import { formatCurrency } from '../../utils/formatters';
import ConfidenceBadge from '../ui/ConfidenceBadge';

export default function RevenueTooltip({ active, payload, label, formatter }) {
  if (!active || !payload || payload.length === 0) return null;

  const formatValue = formatter || formatCurrency;

  return (
    <div className="bg-terminal-elevated border border-terminal-border rounded-lg p-3 shadow-xl">
      <p className="text-[10px] font-mono text-terminal-muted mb-2">{label}</p>
      {payload.map((entry, i) => {
        if (!entry.value && entry.value !== 0) return null;
        // Skip high/low bands and confidence keys
        if (entry.dataKey?.includes('_high') || entry.dataKey?.includes('_low') || entry.dataKey?.includes('_confidence')) return null;

        // Find confidence for this entry
        const confidenceKey = `${entry.dataKey}_confidence`;
        const confidence = entry.payload?.[confidenceKey];

        return (
          <div key={i} className="flex items-center gap-2 py-0.5">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: entry.color || entry.stroke }}
            />
            <span className="text-[10px] font-mono text-terminal-muted capitalize">
              {entry.name || entry.dataKey}
            </span>
            <span className="text-xs font-mono text-terminal-bright font-semibold ml-auto">
              {formatValue(entry.value)}
            </span>
            {confidence && confidence !== 'confirmed' && (
              <ConfidenceBadge level={confidence} />
            )}
          </div>
        );
      })}
    </div>
  );
}
