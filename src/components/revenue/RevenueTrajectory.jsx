import { useMemo, useState } from 'react';
import {
  ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine, Legend,
} from 'recharts';
import Section from '../layout/Section';
import RevenueTooltip from '../charts/RevenueTooltip';
import { REVENUE_COMPANIES, REVENUE_PROVIDER_ORDER_NO_META } from '../../data/revenue/companies';
import { buildTrajectoryData } from '../../utils/revenue-calculations';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function RevenueTrajectory({ assumptions }) {
  const [logScale, setLogScale] = useState(false);

  const { combined } = useMemo(() => buildTrajectoryData(assumptions), [assumptions]);

  // Format date labels
  const formatXAxis = (dateStr) => {
    if (!dateStr) return '';
    return formatDate(dateStr + '-01');
  };

  return (
    <Section
      number={2}
      title="Revenue Trajectory"
      subtitle="Annual run rate (ARR) over time — confirmed data points with forward projections"
      id="trajectory"
    >
      {/* Controls */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => setLogScale(!logScale)}
          className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider rounded border transition-colors ${
            logScale
              ? 'bg-terminal-elevated text-terminal-bright border-terminal-border'
              : 'text-terminal-muted border-terminal-border/50 hover:text-terminal-text hover:bg-terminal-elevated/50'
          }`}
        >
          {logScale ? 'Log Scale' : 'Linear Scale'}
        </button>
        <span className="text-[9px] font-mono text-terminal-muted">
          Toggle to see growth dynamics across different revenue scales
        </span>
      </div>

      <div className="bg-terminal-surface/50 border border-terminal-border rounded-lg p-5">
        <ResponsiveContainer width="100%" height={420}>
          <ComposedChart data={combined} margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis
              dataKey="date"
              tickFormatter={formatXAxis}
              tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'JetBrains Mono' }}
              axisLine={{ stroke: '#1e293b' }}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              scale={logScale ? 'log' : 'auto'}
              domain={logScale ? [50e6, 'auto'] : [0, 'auto']}
              tickFormatter={(v) => formatCurrency(v, 0)}
              tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'JetBrains Mono' }}
              axisLine={{ stroke: '#1e293b' }}
              tickLine={false}
              width={70}
            />
            <Tooltip content={<RevenueTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: 10, fontFamily: 'JetBrains Mono' }}
              iconType="circle"
              iconSize={6}
            />

            {/* Reference line at current date boundary */}
            <ReferenceLine
              x="2026-03"
              stroke="#64748b"
              strokeDasharray="6 3"
              label={{ value: 'Now', position: 'top', fill: '#64748b', fontSize: 10, fontFamily: 'JetBrains Mono' }}
            />

            {/* Projection confidence bands */}
            {REVENUE_PROVIDER_ORDER_NO_META.map(id => {
              const company = REVENUE_COMPANIES[id];
              return (
                <Area
                  key={`${id}-band`}
                  dataKey={`${id}_high`}
                  fill={company.color}
                  fillOpacity={0.05}
                  stroke="none"
                  name={`${company.name} (range)`}
                  legendType="none"
                  connectNulls={false}
                />
              );
            })}

            {/* Main lines for each company */}
            {REVENUE_PROVIDER_ORDER_NO_META.map(id => {
              const company = REVENUE_COMPANIES[id];
              return (
                <Line
                  key={id}
                  dataKey={id}
                  name={company.name}
                  stroke={company.color}
                  strokeWidth={2}
                  dot={(props) => {
                    const { cx, cy, payload } = props;
                    const confidence = payload?.[`${id}_confidence`];
                    if (!cx || !cy || payload?.[id] === undefined || payload?.[id] === null) return null;
                    const isProjected = confidence === 'projected';
                    return (
                      <circle
                        cx={cx}
                        cy={cy}
                        r={isProjected ? 3 : 4}
                        fill={isProjected ? 'transparent' : company.color}
                        stroke={company.color}
                        strokeWidth={isProjected ? 1.5 : 0}
                      />
                    );
                  }}
                  strokeDasharray={(entry) => {
                    // Can't easily do per-segment dashing in Recharts
                    // We'll handle this visually with the dots
                    return undefined;
                  }}
                  connectNulls={false}
                  activeDot={{ r: 5, stroke: company.color, strokeWidth: 2, fill: '#060810' }}
                />
              );
            })}
          </ComposedChart>
        </ResponsiveContainer>

        {/* Legend note */}
        <div className="mt-3 flex items-center gap-4 text-[9px] font-mono text-terminal-muted">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-terminal-text" /> Confirmed data point
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full border border-terminal-muted" /> Projected (from assumptions)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-4 h-0 border-t border-dashed border-terminal-muted" /> Projection zone
          </span>
        </div>
      </div>
    </Section>
  );
}
