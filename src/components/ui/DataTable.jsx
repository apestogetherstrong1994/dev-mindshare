import { PROVIDERS } from '../../data/providers';

export default function DataTable({ columns, data, highlightLeader }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs font-mono">
        <thead>
          <tr className="border-b border-terminal-border">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`py-3 px-4 text-terminal-muted uppercase tracking-widest font-normal ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => {
            return (
              <tr key={i} className="border-b border-terminal-border/50 hover:bg-terminal-elevated/30">
                {columns.map((col) => {
                  const value = row[col.key];
                  const isLeader = highlightLeader && col.isMetric && value === Math.max(
                    ...data.map(r => typeof r[col.key] === 'number' ? r[col.key] : -Infinity)
                  ) && typeof value === 'number';
                  const providerColor = row.providerId ? PROVIDERS[row.providerId]?.color : null;

                  return (
                    <td
                      key={col.key}
                      className={`py-3 px-4 ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'} ${isLeader ? 'text-green-400 font-semibold' : ''}`}
                      style={col.key === 'provider' && providerColor ? { color: providerColor } : {}}
                    >
                      {col.format ? col.format(value, row) : value}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
