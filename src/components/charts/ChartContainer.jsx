import { ResponsiveContainer } from 'recharts';

export default function ChartContainer({ height = 300, title, subtitle, children }) {
  return (
    <div className="bg-terminal-surface/50 border border-terminal-border rounded-lg p-5">
      {title && (
        <h3 className="text-[10px] font-mono text-terminal-muted uppercase tracking-widest mb-1">
          {title}
        </h3>
      )}
      {subtitle && (
        <p className="text-xs font-mono text-terminal-muted/70 mb-4">{subtitle}</p>
      )}
      <ResponsiveContainer width="100%" height={height}>
        {children}
      </ResponsiveContainer>
    </div>
  );
}
