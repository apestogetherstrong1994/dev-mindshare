import { formatCurrency, formatPercent } from '../../utils/formatters';

function formatSliderValue(value, format) {
  switch (format) {
    case 'percent': return formatPercent(value, 0);
    case 'currency': return formatCurrency(value, 0);
    case 'multiplier': return `${value.toFixed(1)}x`;
    default: return value.toLocaleString();
  }
}

export default function AssumptionSlider({ id, label, value, min, max, step, format, onChange, color }) {
  const accentColor = color || '#D4A574';
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className="py-2">
      <div className="flex items-center justify-between mb-1.5">
        <label
          htmlFor={id}
          className="text-[10px] font-mono text-terminal-muted uppercase tracking-widest"
        >
          {label}
        </label>
        <span
          className="text-xs font-mono font-semibold"
          style={{ color: accentColor }}
        >
          {formatSliderValue(value, format)}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(id, parseFloat(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-terminal-border/50"
        style={{
          accentColor,
          background: `linear-gradient(to right, ${accentColor} 0%, ${accentColor} ${pct}%, var(--color-terminal-border) ${pct}%, var(--color-terminal-border) 100%)`,
        }}
      />
      <div className="flex justify-between mt-0.5">
        <span className="text-[9px] font-mono text-terminal-muted/50">
          {formatSliderValue(min, format)}
        </span>
        <span className="text-[9px] font-mono text-terminal-muted/50">
          {formatSliderValue(max, format)}
        </span>
      </div>
    </div>
  );
}
