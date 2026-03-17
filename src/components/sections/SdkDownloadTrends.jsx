import { useMemo, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell,
} from 'recharts';
import Section from '../layout/Section';
import ChartContainer from '../charts/ChartContainer';
import CustomTooltip from '../charts/CustomTooltip';
import StatCard from '../ui/StatCard';
import Footnote from '../ui/Footnote';
import { PROVIDERS, PROVIDER_ORDER } from '../../data/providers';
import { npmDownloads } from '../../data/npm-downloads';
import { buildDailyChartData, computeMoMGrowthFromDaily, formatChartDate } from '../../utils/daily-helpers';
import { computeMarketShare } from '../../utils/calculations';
import { formatNumber } from '../../utils/formatters';

const TABS = [
  { key: 'primary', label: 'Official SDKs' },
  { key: 'aiSdk', label: 'Vercel AI SDK' },
  { key: 'langchain', label: 'LangChain' },
];

export default function SdkDownloadTrends() {
  const [activeTab, setActiveTab] = useState('primary');

  // Build chart data: 7-day rolling average, sampled weekly
  const chartData = useMemo(() => {
    const dataset = npmDownloads[activeTab];
    if (!dataset) return [];
    const ids = PROVIDER_ORDER.filter(id => dataset[id]);
    return buildDailyChartData(dataset, ids);
  }, [activeTab]);

  const growthData = useMemo(() => {
    const dataset = npmDownloads[activeTab];
    if (!dataset) return {};
    const result = {};
    for (const id of PROVIDER_ORDER) {
      if (dataset[id]) {
        result[id] = {
          mom: computeMoMGrowthFromDaily(dataset[id].dailyDownloads),
          weekly: dataset[id].weeklyDownloads,
          monthly: dataset[id].monthlyDownloads,
        };
      }
    }
    return result;
  }, [activeTab]);

  const marketShareData = useMemo(() => {
    const dataset = npmDownloads[activeTab];
    if (!dataset) return [];
    const values = {};
    for (const id of PROVIDER_ORDER) {
      if (dataset[id]) values[id] = dataset[id].monthlyDownloads;
    }
    const shares = computeMarketShare(values);
    return Object.entries(shares).map(([id, share]) => ({
      name: PROVIDERS[id]?.name || id,
      value: Math.round(share * 100),
      color: PROVIDERS[id]?.color,
    }));
  }, [activeTab]);

  return (
    <Section number={2} title="SDK Download Trends" subtitle="npm package downloads — daily data, 7-day rolling average" id="sdk-trends">
      {/* Tab selector */}
      <div className="flex gap-1 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-1.5 text-[10px] font-mono uppercase tracking-wider rounded transition-colors ${
              activeTab === tab.key
                ? 'bg-terminal-elevated text-terminal-bright border border-terminal-muted/30'
                : 'text-terminal-muted hover:text-terminal-text border border-transparent'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main line chart — daily data smoothed */}
      <ChartContainer height={350} title={`Daily Downloads (7-Day Avg) — ${TABS.find(t => t.key === activeTab)?.label}`}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis
            dataKey="date"
            tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'JetBrains Mono' }}
            axisLine={{ stroke: '#1e293b' }}
            tickLine={false}
            tickFormatter={formatChartDate}
            interval={Math.max(0, Math.floor(chartData.length / 8))}
          />
          <YAxis
            tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'JetBrains Mono' }}
            axisLine={{ stroke: '#1e293b' }}
            tickLine={false}
            tickFormatter={formatNumber}
          />
          <Tooltip
            content={<CustomTooltip />}
            labelFormatter={(label) => label}
          />
          {PROVIDER_ORDER.map((id) => {
            if (!npmDownloads[activeTab]?.[id]) return null;
            return (
              <Line
                key={id}
                type="monotone"
                dataKey={id}
                name={PROVIDERS[id]?.name}
                stroke={PROVIDERS[id]?.color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
            );
          })}
        </LineChart>
      </ChartContainer>

      {/* Growth snapshot cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
        {PROVIDER_ORDER.map((id) => {
          const g = growthData[id];
          if (!g) return null;
          return (
            <StatCard
              key={id}
              label={`${PROVIDERS[id]?.name} MoM Growth`}
              value={g.monthly}
              formattedValue={formatNumber(g.weekly) + '/wk'}
              delta={g.mom}
              deltaLabel="MoM"
              color={PROVIDERS[id]?.color}
              small
            />
          );
        })}
      </div>

      {/* Market share pie */}
      <div className="mt-4">
        <ChartContainer height={250} title="Market Share (Feb 2026 Monthly Downloads)">
          <PieChart>
            <Pie
              data={marketShareData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
              label={({ name, value }) => `${name} ${value}%`}
            >
              {marketShareData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ChartContainer>
      </div>
      <Footnote lines={[
        'Source: npm Registry API (api.npmjs.org/downloads/range), daily data from 2025-03-01 to 2026-03-16. Chart shows 7-day rolling average to smooth weekday/weekend cycles.',
        'Downloads include CI/CD pipelines and bots — not a 1:1 proxy for unique developers. Relative comparisons between providers are more meaningful than absolute counts.',
        'Market share and MoM growth calculated from February 2026 (most recent complete month).',
      ]} />
    </Section>
  );
}
