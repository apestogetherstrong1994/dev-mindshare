import { useMemo } from 'react';
import {
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine, Label,
} from 'recharts';
import Section from '../layout/Section';
import { REVENUE_COMPANIES, REVENUE_PROVIDER_ORDER_NO_META } from '../../data/revenue/companies';
import { formatCurrency, formatPercent } from '../../utils/formatters';

function getLatestArr(company) {
  const timeline = company.revenue_timeline;
  if (!timeline?.length) return 0;
  const last = timeline[timeline.length - 1];
  return last.arr || last.revenue * 4 || 0;
}

function getGrowth(company) {
  const timeline = company.revenue_timeline;
  if (!timeline || timeline.length < 2) return 0;
  const last = timeline[timeline.length - 1];
  const lastDate = new Date(last.date);
  const yearAgo = new Date(lastDate);
  yearAgo.setFullYear(yearAgo.getFullYear() - 1);

  let closest = timeline[0];
  for (const p of timeline) {
    const d = new Date(p.date);
    if (Math.abs(d - yearAgo) < Math.abs(new Date(closest.date) - yearAgo)) closest = p;
  }
  const closestVal = closest.arr || closest.revenue * 4;
  const lastVal = last.arr || last.revenue * 4;
  if (!closestVal) return 0;
  return (lastVal - closestVal) / closestVal;
}

function getValuation(company) {
  return (company.valuation?.value || company.market_cap?.value || 0);
}

export default function CompetitivePositioning() {
  const bubbleData = useMemo(() => {
    return REVENUE_PROVIDER_ORDER_NO_META.map(id => {
      const company = REVENUE_COMPANIES[id];
      const arr = getLatestArr(company);
      const growth = getGrowth(company);
      const valuation = getValuation(company);

      return {
        id,
        name: company.name,
        x: arr / 1e9,           // Revenue in $B
        y: growth * 100,         // Growth in %
        z: valuation / 1e9,      // Valuation in $B for bubble size
        color: company.color,
        arr,
        growth,
        valuation,
      };
    });
  }, []);

  // Quadrant midpoints
  const medianRevenue = 5; // $5B midline
  const medianGrowth = 100; // 100% midline

  return (
    <Section
      number={8}
      title="Competitive Positioning Matrix"
      subtitle="Revenue scale vs. growth rate — bubble size represents valuation"
      id="positioning"
    >
      <div className="bg-terminal-surface/50 border border-terminal-border rounded-lg p-5">
        <ResponsiveContainer width="100%" height={450}>
          <ScatterChart margin={{ top: 20, right: 40, bottom: 30, left: 30 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis
              type="number"
              dataKey="x"
              name="Revenue"
              tickFormatter={(v) => `$${v}B`}
              tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'JetBrains Mono' }}
              axisLine={{ stroke: '#1e293b' }}
              tickLine={false}
              domain={[0, 'auto']}
            >
              <Label value="Revenue (ARR, $B)" position="bottom" offset={10} style={{ fill: '#64748b', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
            </XAxis>
            <YAxis
              type="number"
              dataKey="y"
              name="Growth"
              tickFormatter={(v) => `${v}%`}
              tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'JetBrains Mono' }}
              axisLine={{ stroke: '#1e293b' }}
              tickLine={false}
              domain={[0, 'auto']}
            >
              <Label value="YoY Growth (%)" angle={-90} position="insideLeft" offset={-10} style={{ fill: '#64748b', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
            </YAxis>
            <ZAxis
              type="number"
              dataKey="z"
              range={[200, 2000]}
              name="Valuation"
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.[0]) return null;
                const d = payload[0].payload;
                return (
                  <div className="bg-terminal-elevated border border-terminal-border rounded-lg p-3 shadow-xl">
                    <p className="text-xs font-mono font-semibold mb-1" style={{ color: d.color }}>{d.name}</p>
                    <p className="text-[10px] font-mono text-terminal-text">ARR: {formatCurrency(d.arr)}</p>
                    <p className="text-[10px] font-mono text-terminal-text">Growth: {formatPercent(d.growth, 0)}</p>
                    <p className="text-[10px] font-mono text-terminal-text">Valuation: {formatCurrency(d.valuation)}</p>
                    <p className="text-[10px] font-mono text-terminal-muted">Multiple: {(d.valuation / d.arr).toFixed(1)}x</p>
                  </div>
                );
              }}
            />

            {/* Quadrant reference lines */}
            <ReferenceLine
              x={medianRevenue}
              stroke="#1e293b"
              strokeDasharray="8 4"
            />
            <ReferenceLine
              y={medianGrowth}
              stroke="#1e293b"
              strokeDasharray="8 4"
            />

            {/* One scatter per company for distinct colors */}
            {bubbleData.map(d => (
              <Scatter
                key={d.id}
                name={d.name}
                data={[d]}
                fill={d.color}
                fillOpacity={0.6}
                stroke={d.color}
                strokeWidth={2}
              />
            ))}
          </ScatterChart>
        </ResponsiveContainer>

        {/* Quadrant labels */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="text-right pr-4 border-r border-b border-terminal-border/30 pb-2">
            <span className="text-[9px] font-mono text-terminal-muted uppercase tracking-widest">Emerging + Fast</span>
          </div>
          <div className="pl-4 border-b border-terminal-border/30 pb-2">
            <span className="text-[9px] font-mono text-terminal-muted uppercase tracking-widest">Scale + Speed</span>
          </div>
          <div className="text-right pr-4 border-r border-terminal-border/30 pt-2">
            <span className="text-[9px] font-mono text-terminal-muted uppercase tracking-widest">Emerging + Slow</span>
          </div>
          <div className="pl-4 pt-2">
            <span className="text-[9px] font-mono text-terminal-muted uppercase tracking-widest">Scale + Maturity</span>
          </div>
        </div>
      </div>
    </Section>
  );
}
