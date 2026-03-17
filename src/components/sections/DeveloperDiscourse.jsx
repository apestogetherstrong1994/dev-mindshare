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

  // SO data for bar chart
  const soData = useMemo(() => [
    { name: 'OpenAI', total: discourse.stackOverflow.openai.totalQuestions, color: PROVIDERS.openai.color },
    { name: 'LangChain', total: discourse.stackOverflow.langchain.totalQuestions, color: '#f59e0b' },
    { name: 'Google', total: discourse.stackOverflow.google.totalQuestions, color: PROVIDERS.google.color },
    { name: 'Anthropic', total: discourse.stackOverflow.anthropic.totalQuestions, color: PROVIDERS.anthropic.color },
  ], []);

  // Reddit data
  const redditData = useMemo(() => [
    { name: 'r/ChatGPT', subscribers: discourse.reddit.chatGPT.subscribers, color: PROVIDERS.openai.color },
    { name: 'r/OpenAI', subscribers: discourse.reddit.openAI.subscribers, color: PROVIDERS.openai.color },
    { name: 'r/LocalLLaMA', subscribers: discourse.reddit.localLLaMA.subscribers, color: '#f59e0b' },
    { name: 'r/ClaudeAI', subscribers: discourse.reddit.claudeAI.subscribers, color: PROVIDERS.anthropic.color },
    { name: 'r/GoogleGeminiAI', subscribers: discourse.reddit.gemini.subscribers, color: PROVIDERS.google.color },
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
            <Legend wrapperStyle={{ fontSize: 10, fontFamily: 'JetBrains Mono' }} />
            {PROVIDER_ORDER.filter(id => id !== 'xai').map(id => (
              <Bar key={id} dataKey={id} name={PROVIDERS[id].name} fill={PROVIDERS[id].color} radius={[2, 2, 0, 0]} />
            ))}
          </BarChart>
        </ChartContainer>

        {/* Panel B: Stack Overflow */}
        <ChartContainer height={280} title="Stack Overflow — Total Questions by Tag">
          <BarChart data={soData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis type="number" tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={{ stroke: '#1e293b' }} tickLine={false} />
            <YAxis type="category" dataKey="name" tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={{ stroke: '#1e293b' }} tickLine={false} width={80} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="total" name="Total Questions" shape={<ColoredBar />} />
          </BarChart>
        </ChartContainer>
      </div>

      {/* Panel C: Reddit Community */}
      <div className="mt-4">
        <ChartContainer height={250} title="Reddit — Community Size (Subscribers)">
          <BarChart data={redditData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis type="number" tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={{ stroke: '#1e293b' }} tickLine={false} tickFormatter={formatNumber} />
            <YAxis type="category" dataKey="name" tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={{ stroke: '#1e293b' }} tickLine={false} width={110} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="subscribers" name="Subscribers" shape={<ColoredBar />} />
          </BarChart>
        </ChartContainer>
      </div>
      <Footnote lines={[
        'HN: hn.algolia.com/api. Search terms — Anthropic: "anthropic" OR "claude ai" OR "claude api"; OpenAI: "openai"; Google: "gemini ai" OR "google ai". xAI excluded (inflated by unrelated "xai" matches).',
        'SO: api.stackexchange.com. Tag-based counts. The "anthropic" tag has very few questions (most Claude questions use other tags), so SO undercounts Anthropic activity.',
        'Reddit: Public JSON endpoint (/r/{sub}/about.json). Subscriber counts only; active user counts unavailable without authentication.',
      ]} />
    </Section>
  );
}
