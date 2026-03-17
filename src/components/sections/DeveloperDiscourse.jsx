import { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import Section from '../layout/Section';
import ChartContainer from '../charts/ChartContainer';
import CustomTooltip from '../charts/CustomTooltip';
import Footnote from '../ui/Footnote';
import { PROVIDERS, PROVIDER_ORDER } from '../../data/providers';
import { discourse } from '../../data/discourse';
import { formatNumber } from '../../utils/formatters';

// Custom bar shape that reads color from data
function ColoredBar(props) {
  const { fill, x, y, width, height, payload } = props;
  return <rect x={x} y={y} width={width} height={height} fill={payload?.color || fill} rx={4} />;
}

export default function DeveloperDiscourse() {
  // HN monthly data
  const hnChartData = useMemo(() => {
    const months = discourse.hackerNews.anthropic.monthlyTrend.map(m => m.month);
    return months.map(month => {
      const point = { month };
      for (const id of PROVIDER_ORDER) {
        const trend = discourse.hackerNews[id]?.monthlyTrend;
        const found = trend?.find(t => t.month === month);
        point[id] = found?.stories || 0;
      }
      return point;
    });
  }, []);

  // SO data for bar chart — using comprehensive tag counts
  const soData = useMemo(() => [
    { name: 'OpenAI', total: discourse.stackOverflow.openai.totalQuestions, color: PROVIDERS.openai.color },
    { name: 'Google', total: discourse.stackOverflow.google.totalQuestions, color: PROVIDERS.google.color },
    { name: 'Anthropic', total: discourse.stackOverflow.anthropic.totalQuestions, color: PROVIDERS.anthropic.color },
  ], []);


  return (
    <Section number={4} title="Developer Discourse & Sentiment" subtitle="Community activity across platforms" id="discourse">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Panel A: HN Attention */}
        <ChartContainer height={280} title="Hacker News — Monthly Story Submissions">
          <BarChart data={hnChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={{ stroke: '#1e293b' }} tickLine={false} />
            <YAxis tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={{ stroke: '#1e293b' }} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend content={() => (
              <div style={{ display: 'flex', justifyContent: 'center', gap: 16, fontSize: 10, fontFamily: 'JetBrains Mono', marginTop: 8 }}>
                {[{ name: 'OpenAI', color: PROVIDERS.openai.color }, { name: 'Anthropic', color: PROVIDERS.anthropic.color }, { name: 'Google', color: PROVIDERS.google.color }].map(item => (
                  <span key={item.name} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 10, height: 10, backgroundColor: item.color, borderRadius: 2, display: 'inline-block' }} />
                    {item.name}
                  </span>
                ))}
              </div>
            )} />
            <Bar dataKey="openai" name="OpenAI" fill={PROVIDERS.openai.color} radius={[2, 2, 0, 0]} />
            <Bar dataKey="anthropic" name="Anthropic" fill={PROVIDERS.anthropic.color} radius={[2, 2, 0, 0]} />
            <Bar dataKey="google" name="Google" fill={PROVIDERS.google.color} radius={[2, 2, 0, 0]} />
          </BarChart>
        </ChartContainer>

        {/* Panel B: Stack Overflow */}
        <ChartContainer height={280} title="Stack Overflow — Total Questions (All Tags)">
          <BarChart data={soData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis type="number" tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={{ stroke: '#1e293b' }} tickLine={false} tickFormatter={formatNumber} />
            <YAxis type="category" dataKey="name" tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={{ stroke: '#1e293b' }} tickLine={false} width={80} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="total" name="Total Questions" shape={<ColoredBar />} />
          </BarChart>
        </ChartContainer>
      </div>

      <Footnote lines={[
        'HN: hn.algolia.com/api. Search terms — Anthropic: "anthropic" + "claude ai" + "claude code" + "claude sonnet"; OpenAI: "openai" + "chatgpt" + "gpt-4"; Google: "gemini ai" + "google gemini" + "gemini pro". Counts summed across terms (some overlap possible). xAI excluded ("xai" matches unrelated terms). "claude" alone excluded (matches people named Claude).',
        'SO: api.stackexchange.com. All relevant tags per provider combined. Anthropic: claude (127) + claude-code (28) + mcp-server (17) + anthropic (11) + sonnet (8) + 5 more = 199. "opus" tag (402) is audio codec, "haiku" tag (13) is Haiku OS — excluded. "gemini" tag (34) is Countersoft bug-tracker — excluded. Upper bounds due to possible multi-tag overlap.',
      ]} />
    </Section>
  );
}
