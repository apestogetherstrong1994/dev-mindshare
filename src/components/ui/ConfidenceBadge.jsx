const STYLES = {
  confirmed: {
    dot: 'bg-green-400',
    border: 'border-green-400/30',
    bg: 'bg-green-400/10',
    text: 'text-green-400',
    label: 'Confirmed',
  },
  estimated: {
    dot: 'bg-amber-400',
    border: 'border-amber-400/30',
    bg: 'bg-amber-400/10',
    text: 'text-amber-400',
    label: 'Estimated',
  },
  speculative: {
    dot: 'bg-slate-400',
    border: 'border-slate-400/30',
    bg: 'bg-slate-400/10',
    text: 'text-slate-400',
    label: 'Speculative',
  },
};

export default function ConfidenceBadge({ level, showLabel = false }) {
  const style = STYLES[level] || STYLES.speculative;
  return (
    <span
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded border ${style.border} ${style.bg}`}
      title={style.label}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      {showLabel ? (
        <span className={`text-[9px] font-mono uppercase tracking-widest ${style.text}`}>
          {style.label}
        </span>
      ) : (
        level !== 'confirmed' && (
          <span className={`text-[9px] font-mono font-semibold ${style.text}`}>
            {level === 'estimated' ? 'E' : 'S'}
          </span>
        )
      )}
    </span>
  );
}
