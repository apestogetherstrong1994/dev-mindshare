export default function Footnote({ lines }) {
  if (!lines || lines.length === 0) return null;
  return (
    <div className="mt-3 pt-2 border-t border-terminal-border/30">
      {lines.map((line, i) => (
        <p key={i} className="text-[9px] font-mono text-terminal-muted/70 leading-relaxed">
          <span className="text-terminal-muted/50 mr-1">*</span>
          {line}
        </p>
      ))}
    </div>
  );
}
