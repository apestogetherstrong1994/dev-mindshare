import { useMemo } from 'react';
import Section from '../layout/Section';
import { MILESTONES } from '../../data/revenue/milestones';
import { REVENUE_COMPANIES } from '../../data/revenue/companies';
import { formatCurrency } from '../../utils/formatters';

const TYPE_STYLES = {
  revenue: { badge: 'bg-green-400/10 text-green-400 border-green-400/30', dot: 'bg-green-400' },
  product: { badge: 'bg-blue-400/10 text-blue-400 border-blue-400/30', dot: 'bg-blue-400' },
  funding: { badge: 'bg-amber-400/10 text-amber-400 border-amber-400/30', dot: 'bg-amber-400' },
};

export default function RevenueMilestones() {
  // Group milestones by year
  const grouped = useMemo(() => {
    const sorted = [...MILESTONES].sort((a, b) => a.date.localeCompare(b.date));
    const groups = {};
    sorted.forEach(m => {
      const year = m.date.substring(0, 4);
      if (!groups[year]) groups[year] = [];
      groups[year].push(m);
    });
    return groups;
  }, []);

  const years = Object.keys(grouped).sort();

  return (
    <Section
      number={7}
      title="Revenue Milestones & Key Events"
      subtitle="Chronological view of revenue achievements, product launches, and funding events"
      id="milestones"
    >
      <div className="space-y-8">
        {years.map(year => (
          <div key={year}>
            <h3 className="text-sm font-mono font-bold text-terminal-bright mb-4 flex items-center gap-3">
              <span className="w-8 h-px bg-terminal-border" />
              {year}
              <span className="flex-1 h-px bg-terminal-border" />
            </h3>

            <div className="relative ml-4 pl-6 border-l border-terminal-border/50">
              {grouped[year].map((milestone, i) => {
                const company = REVENUE_COMPANIES[milestone.company];
                const typeStyle = TYPE_STYLES[milestone.type] || TYPE_STYLES.product;
                const date = new Date(milestone.date + '-01');
                const monthStr = date.toLocaleDateString('en-US', { month: 'short' });

                return (
                  <div key={i} className="relative mb-4 last:mb-0 group">
                    {/* Timeline dot */}
                    <div
                      className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full border-2 border-terminal-bg"
                      style={{ backgroundColor: company?.color || '#64748b' }}
                    />

                    <div className="bg-terminal-surface/30 border border-terminal-border/50 rounded-lg p-3 hover:border-terminal-muted/30 transition-colors">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[9px] font-mono text-terminal-muted">{monthStr}</span>
                        <span
                          className="text-[9px] font-mono font-semibold"
                          style={{ color: company?.color }}
                        >
                          {company?.name || milestone.company}
                        </span>
                        <span className={`text-[8px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded border ${typeStyle.badge}`}>
                          {milestone.type}
                        </span>
                      </div>
                      <p className="text-xs font-mono text-terminal-text">
                        {milestone.event}
                      </p>
                      {milestone.value && (
                        <p className="text-[10px] font-mono text-terminal-muted mt-0.5">
                          {formatCurrency(milestone.value)} ARR
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
