import { useMemo, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import Section from '../layout/Section';
import ChartContainer from '../charts/ChartContainer';
import CustomTooltip from '../charts/CustomTooltip';
import StatCard from '../ui/StatCard';
import { PROVIDERS, PROVIDER_ORDER } from '../../data/providers';
import { npmDownloads } from '../../data/npm-downloads';
import { computeMoMGrowth, compute3MonthAcceleration, computeMarketShare } from '../../utils/calculations';
import { formatNumber } from '../../utils/formatters';

const TABS = [
  { key: 'primary', label: 'Official SDKs' },
  { key: 'aiSdk', label: 'Vercel AI SDK' },
  { key: 'langchain', label: 'LangChain' },
];

export default function SdkDownloadTrends() {
  const [activeTab, setActiveTab] = useState('primary');

  const chartData = useMemo(() => {
    const dataset = npmDownloads[activeTab];
    if (!dataset) return [];

    const months = dataset[Object.keys(dataset)[0]]?.monthlyTrend || [];
    return months.map((m) => {
      const point = { month: m.month };
      for (const id of PROVIDER_ORDER) {
        if (dataset[id]) {
          const found = dataset[id].monthlyTrend.find(t => t.month === m.month);
          point[id] = found?.downloads || 0;
        }
      }
      return point;
    });
  }, [activeTab]);

  const growthData = useMemo(() => {
    const dataset = npmDownloads[activeTab];
    if (!dataset) return {};
    const result = {};
    for (const id of PROVIDER_ORDER) {
      if (dataset[id]) {
        result[id] = {
          mom: computeMoMGrowth(dataset[id].monthlyTrend),
          acceleration: compute3MonthAcceleration(dataset[id].monthlyTrend),
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
    <Section number={2} title="SDK Download Trends" subtitle="npm package downloads — 12-month timeline" id="sdk-trends">
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

      {/* Main line chart */}
      <ChartContainer height={350} title={`Monthly Downloads — ${TABS.find(t => t.key === activeTab)?.label}`}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis
            dataKey="month"
            tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'JetBrains Mono' }}
            axisLine={{ stroke: '#1e293b' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'JetBrains Mono' }}
            axisLine={{ stroke: '#1e293b' }}
            tickLine={false}
            tickFormatter={formatNumber}
          />
          <Tooltip content={<CustomTooltip />} />
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
        <ChartContainer height={250} title="Market Share (Monthly Downloads)">
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
    </Section>
  );
}
