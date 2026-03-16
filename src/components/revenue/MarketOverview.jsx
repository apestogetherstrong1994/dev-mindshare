import { useMemo } from 'react';
import Section from '../layout/Section';
import ConfidenceBadge from '../ui/ConfidenceBadge';
import { REVENUE_COMPANIES, REVENUE_PROVIDER_ORDER } from '../../data/revenue/companies';
import { formatCurrency, formatPercent, formatMultiple } from '../../utils/formatters';

function getLatestArr(company) {
  const timeline = company.revenue_timeline;
  if (!timeline || timeline.length === 0) return null;
  const last = timeline[timeline.length - 1];
  // For annual revenue entries (Meta, Google), use revenue directly if it's a full-year figure
  // Google Cloud entries are quarterly → annualize. Meta entries are already annual.
  let value;
  if (last.arr) {
    value = last.arr;
  } else if (last.segment === 'Total (Ads)') {
    value = last.revenue; // Already annual
  } else {
    value = last.revenue * 4; // Quarterly → annualize
  }
  return { value, confidence: last.confidence, source: last.source };
}

function getGrowth(company) {
  const timeline = company.revenue_timeline;
  if (!timeline || timeline.length < 2) return null;
  // Find a point roughly 12 months ago
  const last = timeline[timeline.length - 1];
  const lastDate = new Date(last.date);
  const yearAgo = new Date(lastDate);
  yearAgo.setFullYear(yearAgo.getFullYear() - 1);

  let closest = timeline[0];
  for (const p of timeline) {
    const d = new Date(p.date);
    if (Math.abs(d - yearAgo) < Math.abs(new Date(closest.date) - yearAgo)) {
      closest = p;
    }
  }
  const closestVal = closest.arr || closest.revenue * 4;
  const lastVal = last.arr || last.revenue * 4;
  if (!closestVal) return null;
  return (lastVal - closestVal) / closestVal;
}

function getValuation(company) {
  return company.valuation || company.market_cap || null;
}

function getRevenueModel(company) {
  const decomp = company.revenue_decomposition;
  if (!decomp) return 'N/A';
  return Object.values(decomp)
    .filter(d => d.pct > 0.10)
    .map(d => d.label)
    .slice(0, 3)
    .join(' + ');
}

export default function MarketOverview() {
  const cards = useMemo(() => {
    return REVENUE_PROVIDER_ORDER.map(id => {
      const company = REVENUE_COMPANIES[id];
      const arr = getLatestArr(company);
      const growth = getGrowth(company);
      const val = getValuation(company);
      const model = getRevenueModel(company);

      const arrVal = arr?.value || 0;
      const valVal = val?.value || 0;
      const multiple = arrVal > 0 && valVal > 0 ? valVal / arrVal : null;

      return { id, company, arr, growth, val, model, multiple };
    });
  }, []);

  return (
    <Section number={1} title="Market Overview" subtitle="Revenue landscape — frontier AI labs ranked by revenue scale" id="overview">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {cards.map(({ id, company, arr, growth, val, model, multiple }) => (
          <div
            key={id}
            className="bg-terminal-surface/50 border border-terminal-border rounded-lg p-5 hover:border-terminal-muted/30 transition-all"
            style={{ borderTopColor: company.color, borderTopWidth: '2px' }}
          >
            {/* Company name */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-mono font-bold" style={{ color: company.color }}>
                {company.name}
              </h3>
              <span className="text-[9px] font-mono text-terminal-muted uppercase">
                {company.type}
              </span>
            </div>

            {/* ARR */}
            <div className="mb-3">
              <div className="text-[9px] font-mono text-terminal-muted uppercase tracking-widest mb-0.5">
                {id === 'google' ? 'Cloud Revenue (Annual)' : id === 'meta' ? 'Total Revenue' : 'ARR'}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-mono font-bold text-terminal-bright">
                  {arr ? formatCurrency(arr.value, 1) : 'N/A'}
                </span>
                {arr && <ConfidenceBadge level={arr.confidence} />}
              </div>
            </div>

            {/* Growth */}
            {growth !== null && (
              <div className="mb-3">
                <div className="text-[9px] font-mono text-terminal-muted uppercase tracking-widest mb-0.5">
                  Growth (YoY)
                </div>
                <span className={`text-sm font-mono font-semibold ${growth > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {formatPercent(growth, 0)}
                </span>
              </div>
            )}

            {/* Revenue Model */}
            <div className="mb-3">
              <div className="text-[9px] font-mono text-terminal-muted uppercase tracking-widest mb-0.5">
                Revenue Model
              </div>
              <span className="text-[10px] font-mono text-terminal-text">
                {model}
              </span>
            </div>

            {/* Valuation */}
            {val && (
              <div className="mb-2">
                <div className="text-[9px] font-mono text-terminal-muted uppercase tracking-widest mb-0.5">
                  {company.type === 'public' ? 'Market Cap' : 'Valuation'}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono font-semibold text-terminal-text">
                    {formatCurrency(val.value, 0)}
                  </span>
                  <ConfidenceBadge level={val.confidence} />
                </div>
              </div>
            )}

            {/* Revenue Multiple */}
            {multiple && (
              <div className="pt-2 border-t border-terminal-border">
                <div className="flex justify-between items-baseline">
                  <span className="text-[9px] font-mono text-terminal-muted uppercase tracking-widest">
                    Revenue Multiple
                  </span>
                  <span className="text-sm font-mono font-bold" style={{ color: company.color }}>
                    {formatMultiple(multiple)}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </Section>
  );
}
