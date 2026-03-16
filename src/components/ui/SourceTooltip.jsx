import ConfidenceBadge from './ConfidenceBadge';

export default function SourceTooltip({ children, source, confidence, notes }) {
  return (
    <span className="relative group/source inline-flex items-center gap-1 cursor-help">
      {children}
      {confidence && confidence !== 'confirmed' && (
        <ConfidenceBadge level={confidence} />
      )}
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/source:block z-50 pointer-events-none">
        <span className="block bg-terminal-elevated border border-terminal-border rounded-lg p-3 shadow-xl min-w-[200px] max-w-[300px]">
          {confidence && (
            <span className="flex items-center gap-2 mb-1.5">
              <ConfidenceBadge level={confidence} showLabel />
            </span>
          )}
          {source && (
            <span className="block text-[10px] font-mono text-terminal-text leading-relaxed">
              {source}
            </span>
          )}
          {notes && (
            <span className="block text-[10px] font-mono text-terminal-muted mt-1 leading-relaxed italic">
              {notes}
            </span>
          )}
        </span>
      </span>
    </span>
  );
}
