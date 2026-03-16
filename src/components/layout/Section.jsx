export default function Section({ number, title, subtitle, children, id }) {
  return (
    <section id={id} className="mb-12">
      <div className="mb-6">
        <div className="flex items-baseline gap-3 mb-1">
          {number !== undefined && (
            <span className="text-xs font-mono text-terminal-muted tracking-widest">
              {String(number).padStart(2, '0')}
            </span>
          )}
          <h2 className="text-lg font-mono font-semibold text-terminal-bright tracking-wide uppercase">
            {title}
          </h2>
        </div>
        {subtitle && (
          <p className="text-xs font-mono text-terminal-muted ml-8">{subtitle}</p>
        )}
      </div>
      {children}
    </section>
  );
}
