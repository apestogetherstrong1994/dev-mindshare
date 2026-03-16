import { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend,
} from 'recharts';
import Section from '../layout/Section';
import ConfidenceBadge from '../ui/ConfidenceBadge';
import { REVENUE_COMPANIES, REVENUE_PROVIDER_ORDER_NO_META } from '../../data/revenue/companies';
import { formatCurrency } from '../../utils/formatters';

// Color palette for revenue segments (distinct from provider colors)
const SEGMENT_COLORS = [
  '#D4A574', // warm gold
  '#10B981', // emerald
  '#4285F4', // blue
  '#F59E0B', // amber
  '#8B5CF6', // purple
  '#EF4444', // red
];

function getLatestArr(company) {
  const timeline = company.revenue_timeline;
  if (!timeline?.length) return 0;
  const last = timeline[timeline.length - 1];
  return last.arr || last.revenue * 4 || 0;
}

export default function RevenueDecomposition() {
  const chartData = useMemo(() => {
    return REVENUE_PROVIDER_ORDER_NO_META.map(id => {
      const company = REVENUE_COMPANIES[id];
      const totalArr = getLatestArr(company);
      const decomp = company.revenue_decomposition || {};

      const entry = { name: company.name, total: totalArr, id };

      Object.entries(decomp).forEach(([key, segment]) => {
        entry[key] = totalArr * segment.pct;
        entry[`${key}_label`] = segment.label;
        entry[`${key}_confidence`] = segment.confidence;
        entry[`${key}_pct`] = segment.pct;
      });

      return entry;
    });
  }, []);

  // Get all unique segment keys across companies
  const allSegments = useMemo(() => {
    const segments = new Set();
    chartData.forEach(entry => {
      Object.keys(entry).forEach(key => {
        if (!['name', 'total', 'id'].includes(key) && !key.includes('_label') && !key.includes('_confidence') && !key.includes('_pct')) {
          segments.add(key);
        }
      });
    });
    return [...segments];
  }, [chartData]);

  const CustomTooltipContent = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;

    const total = payload[0]?.payload?.total;
    return (
      <div className="bg-terminal-elevated border border-terminal-border rounded-lg p-3 shadow-xl max-w-[280px]">
        <p className="text-xs font-mono text-terminal-bright font-semibold mb-2">{label}</p>
        <p className="text-[10px] font-mono text-terminal-muted mb-2">Total: {formatCurrency(total)}</p>
        {payload.filter(p => p.value > 0).map((entry, i) => {
          const segLabel = entry.payload?.[`${entry.dataKey}_label`] || entry.dataKey;
          const confidence = entry.payload?.[`${entry.dataKey}_confidence`];
          const pct = entry.payload?.[`${entry.dataKey}_pct`];
          return (
            <div key={i} className="flex items-center gap-2 py-0.5">
              <span className="w-2 h-2 rounded-sm shrink-0" style={{ backgroundColor: entry.fill }} />
              <span className="text-[10px] font-mono text-terminal-muted flex-1 truncate">{segLabel}</span>
              <span className="text-[10px] font-mono text-terminal-text font-semibold">
                {formatCurrency(entry.value)} ({Math.round(pct * 100)}%)
              </span>
              {confidence && confidence !== 'confirmed' && (
                <ConfidenceBadge level={confidence} />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <Section
      number={3}
      title="Revenue Decomposition"
      subtitle="Revenue broken down by product line and business model"
      id="decomposition"
    >
      <div className="bg-terminal-surface/50 border border-terminal-border rounded-lg p-5">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis
              dataKey="name"
              tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'JetBrains Mono' }}
              axisLine={{ stroke: '#1e293b' }}
              tickLine={false}
            />
            <YAxis
              tickFormatter={(v) => formatCurrency(v, 0)}
              tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'JetBrains Mono' }}
              axisLine={{ stroke: '#1e293b' }}
              tickLine={false}
              width={70}
            />
            <Tooltip content={<CustomTooltipContent />} />

            {allSegments.map((segKey, i) => (
              <Bar
                key={segKey}
                dataKey={segKey}
                stackId="revenue"
                fill={SEGMENT_COLORS[i % SEGMENT_COLORS.length]}
                radius={i === allSegments.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>

        {/* Segment legend */}
        <div className="mt-4 flex flex-wrap gap-3">
          {allSegments.slice(0, 6).map((segKey, i) => {
            // Find a label for this segment
            const label = chartData.find(d => d[`${segKey}_label`])?.[`${segKey}_label`] || segKey;
            return (
              <span key={segKey} className="flex items-center gap-1.5 text-[9px] font-mono text-terminal-muted">
                <span
                  className="w-2.5 h-2.5 rounded-sm"
                  style={{ backgroundColor: SEGMENT_COLORS[i % SEGMENT_COLORS.length] }}
                />
                {label}
              </span>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
