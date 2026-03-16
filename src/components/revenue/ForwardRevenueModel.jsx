import { useMemo } from 'react';
import {
  ComposedChart, Bar, Line, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, ReferenceLine,
} from 'recharts';
import Section from '../layout/Section';
import AssumptionSlider from '../ui/AssumptionSlider';
import { REVENUE_COMPANIES, REVENUE_PROVIDER_ORDER_NO_META } from '../../data/revenue/companies';
import { ASSUMPTION_CONFIGS } from '../../data/revenue/assumptions';
import { computeProjections } from '../../utils/revenue-calculations';
import { formatCurrency } from '../../utils/formatters';

function getLatestArr(company) {
  const timeline = company.revenue_timeline;
  if (!timeline?.length) return 0;
  const last = timeline[timeline.length - 1];
  return last.arr || last.revenue * 4 || 0;
}

export default function ForwardRevenueModel({ assumptions, onAssumptionChange, onReset }) {
  const projections = useMemo(() => computeProjections(assumptions), [assumptions]);

  // Build chart data: current + projected quarters
  const chartData = useMemo(() => {
    const data = [];

    // Current quarter (Q1 2026) as baseline
    data.push({
      quarter: 'Q1 2026',
      type: 'current',
      ...Object.fromEntries(
        REVENUE_PROVIDER_ORDER_NO_META.map(id => [id, getLatestArr(REVENUE_COMPANIES[id])])
      ),
    });

    // Projected quarters
    const quarters = assumptions.projection_quarters;
    for (let q = 0; q < quarters; q++) {
      const year = 2026 + Math.floor((q + 1) / 4);
      const qNum = ((q + 1) % 4) + 1;
      const label = `Q${qNum} ${year}`;

      const point = { quarter: label, type: 'projected' };
      REVENUE_PROVIDER_ORDER_NO_META.forEach(id => {
        if (projections[id]?.[q]) {
          point[id] = projections[id][q].arr;
          point[`${id}_high`] = projections[id][q].arrHigh;
          point[`${id}_low`] = projections[id][q].arrLow;
        }
      });
      data.push(point);
    }

    return data;
  }, [projections, assumptions.projection_quarters]);

  // Summary table: key milestones
  const summaryData = useMemo(() => {
    const milestones = ['EOY 2026', 'EOY 2027', 'EOY 2028'];
    return milestones.map((label, idx) => {
      const quarterIndex = (idx + 1) * 4 - 1; // Q4 of each year
      const row = { label };
      REVENUE_PROVIDER_ORDER_NO_META.forEach(id => {
        if (projections[id]?.[quarterIndex]) {
          row[id] = projections[id][quarterIndex].arr;
        } else {
          // If beyond projection horizon, extrapolate
          const lastProj = projections[id]?.[projections[id].length - 1];
          row[id] = lastProj?.arr || null;
        }
      });
      return row;
    });
  }, [projections]);

  const sliderGroups = [
    {
      title: 'Global',
      keys: ['market_growth_rate', 'token_price_deflation', 'projection_quarters'],
    },
    {
      title: 'Anthropic',
      color: REVENUE_COMPANIES.anthropic.color,
      keys: ['anthropic_growth_rate', 'anthropic_api_mix', 'anthropic_code_growth'],
    },
    {
      title: 'OpenAI',
      color: REVENUE_COMPANIES.openai.color,
      keys: ['openai_growth_rate', 'openai_msft_share'],
    },
    {
      title: 'Google / xAI',
      keys: ['google_cloud_ai_growth', 'xai_growth_rate'],
    },
  ];

  return (
    <Section
      number={6}
      title="Forward Revenue Model"
      subtitle="Interactive projections — adjust assumptions to stress-test revenue trajectories"
      id="forward-model"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Assumptions panel */}
        <div className="lg:col-span-1 space-y-4">
          {sliderGroups.map((group) => (
            <div key={group.title} className="bg-terminal-surface/50 border border-terminal-border rounded-lg p-4">
              <h4
                className="text-[10px] font-mono uppercase tracking-widest mb-3"
                style={{ color: group.color || '#64748b' }}
              >
                {group.title}
              </h4>
              {group.keys.map(key => {
                const config = ASSUMPTION_CONFIGS[key];
                if (!config) return null;
                return (
                  <AssumptionSlider
                    key={key}
                    id={key}
                    label={config.label}
                    value={assumptions[key]}
                    min={config.min}
                    max={config.max}
                    step={config.step}
                    format={config.format}
                    onChange={onAssumptionChange}
                    color={group.color || '#D4A574'}
                  />
                );
              })}
            </div>
          ))}

          <button
            onClick={onReset}
            className="w-full px-4 py-2 text-[10px] font-mono text-terminal-muted uppercase tracking-widest border border-terminal-border rounded hover:bg-terminal-elevated/50 hover:text-terminal-text transition-colors"
          >
            Reset to Defaults
          </button>
        </div>

        {/* Charts and summary */}
        <div className="lg:col-span-2 space-y-6">
          {/* Projection chart */}
          <div className="bg-terminal-surface/50 border border-terminal-border rounded-lg p-5">
            <h4 className="text-[10px] font-mono text-terminal-muted uppercase tracking-widest mb-4">
              Projected ARR by Quarter
            </h4>
            <ResponsiveContainer width="100%" height={380}>
              <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis
                  dataKey="quarter"
                  tick={{ fill: '#64748b', fontSize: 9, fontFamily: 'JetBrains Mono' }}
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
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null;
                    return (
                      <div className="bg-terminal-elevated border border-terminal-border rounded-lg p-3 shadow-xl">
                        <p className="text-[10px] font-mono text-terminal-muted mb-2">{label}</p>
                        {payload.filter(p => !p.dataKey.includes('_')).map((entry, i) => (
                          <div key={i} className="flex items-center gap-2 py-0.5">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.stroke || entry.color }} />
                            <span className="text-[10px] font-mono text-terminal-muted">{entry.name}</span>
                            <span className="text-xs font-mono text-terminal-bright font-semibold ml-auto">
                              {formatCurrency(entry.value)}
                            </span>
                          </div>
                        ))}
                      </div>
                    );
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 10, fontFamily: 'JetBrains Mono' }} iconType="circle" iconSize={6} />

                <ReferenceLine
                  x="Q1 2026"
                  stroke="#64748b"
                  strokeDasharray="6 3"
                  label={{ value: 'Current', position: 'top', fill: '#64748b', fontSize: 9, fontFamily: 'JetBrains Mono' }}
                />

                {REVENUE_PROVIDER_ORDER_NO_META.map(id => (
                  <Line
                    key={id}
                    dataKey={id}
                    name={REVENUE_COMPANIES[id].name}
                    stroke={REVENUE_COMPANIES[id].color}
                    strokeWidth={2}
                    strokeDasharray={id === 'google' || id === 'xai' ? '4 4' : undefined}
                    dot={{ r: 3, fill: REVENUE_COMPANIES[id].color }}
                    activeDot={{ r: 5, stroke: REVENUE_COMPANIES[id].color, strokeWidth: 2, fill: '#060810' }}
                    connectNulls={false}
                  />
                ))}
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Summary table */}
          <div className="bg-terminal-surface/50 border border-terminal-border rounded-lg overflow-x-auto">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="border-b border-terminal-border">
                  <th className="text-left px-4 py-3 text-[9px] text-terminal-muted uppercase tracking-widest">
                    Projected ARR
                  </th>
                  {REVENUE_PROVIDER_ORDER_NO_META.map(id => (
                    <th key={id} className="text-right px-4 py-3 text-[9px] uppercase tracking-widest"
                      style={{ color: REVENUE_COMPANIES[id].color }}>
                      {REVENUE_COMPANIES[id].name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Current row */}
                <tr className="border-b border-terminal-border/50 bg-terminal-elevated/20">
                  <td className="px-4 py-2.5 text-terminal-text font-semibold">Current (Q1 2026)</td>
                  {REVENUE_PROVIDER_ORDER_NO_META.map(id => (
                    <td key={id} className="px-4 py-2.5 text-right text-terminal-bright font-semibold">
                      {formatCurrency(getLatestArr(REVENUE_COMPANIES[id]))}
                    </td>
                  ))}
                </tr>
                {summaryData.map((row, i) => (
                  <tr key={i} className="border-b border-terminal-border/50 hover:bg-terminal-elevated/30">
                    <td className="px-4 py-2.5 text-terminal-muted">{row.label}</td>
                    {REVENUE_PROVIDER_ORDER_NO_META.map(id => (
                      <td key={id} className="px-4 py-2.5 text-right text-terminal-text">
                        {row[id] ? formatCurrency(row[id]) : '—'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Section>
  );
}
