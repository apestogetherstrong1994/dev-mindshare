import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import Section from '../layout/Section';
import ChartContainer from '../charts/ChartContainer';
import CustomTooltip from '../charts/CustomTooltip';
import InsightCard from '../ui/InsightCard';
import Footnote from '../ui/Footnote';
import { PROVIDERS, PROVIDER_ORDER } from '../../data/providers';
import { jobMarket } from '../../data/job-market';
import { formatNumber, formatPercent } from '../../utils/formatters';

export default function JobMarketSignals() {
  const chartData = useMemo(() =>
    PROVIDER_ORDER.map(id => ({
      name: PROVIDERS[id].name,
      postings: jobMarket.postings[id].approximate,
      growth: jobMarket.postings[id].growth6m,
      color: PROVIDERS[id].color,
    })).sort((a, b) => b.postings - a.postings),
  []);

  return (
    <Section number={5} title="Job Market Signals" subtitle="Third-party job listings mentioning each provider's API/SDK" id="jobs">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <ChartContainer height={250} title="Listings Mentioning Provider API (Estimated)">
            <BarChart data={chartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis
                type="number"
                tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                axisLine={{ stroke: '#1e293b' }}
                tickLine={false}
                tickFormatter={formatNumber}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                axisLine={{ stroke: '#1e293b' }}
                tickLine={false}
                width={80}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="postings" name="Listings" radius={[0, 4, 4, 0]}>
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </div>

        <div className="space-y-3">
          {/* Growth cards */}
          {PROVIDER_ORDER.map(id => (
            <div key={id} className="bg-terminal-surface/50 border border-terminal-border rounded-lg p-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: PROVIDERS[id].color }}>
                  {PROVIDERS[id].name}
                </span>
                <span className="text-xs font-mono text-green-400">
                  {formatPercent(jobMarket.postings[id].growth6m)} <span className="text-terminal-muted">6m</span>
                </span>
              </div>
              <p className="text-lg font-mono font-bold text-terminal-bright mt-1">
                ~{formatNumber(jobMarket.postings[id].approximate)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Signal Watch */}
      <div className="mt-4 space-y-2">
        <h4 className="text-[10px] font-mono text-terminal-muted uppercase tracking-widest mb-3">
          Signal Watch
        </h4>
        {jobMarket.signals.map((signal, i) => (
          <InsightCard key={i} type={signal.type} severity="medium" text={signal.text} />
        ))}
      </div>
      <Footnote lines={[
        'Source: Manual LinkedIn Jobs and Indeed searches for API/SDK terms in job descriptions, March 2026. These count third-party listings mentioning each provider\'s API — NOT each company\'s own open roles.',
        'Counts are rough order-of-magnitude estimates. Listings may mention multiple providers (double-counting). "Vertex AI" inflates Google\'s count by capturing broader GCP jobs. Ratios between providers are more meaningful than absolute numbers.',
        'Growth rates estimated by comparing current search totals against a similar search ~6 months prior. This data is excluded from the Composite Ecosystem Index due to its inherent noise.',
      ]} />
    </Section>
  );
}
