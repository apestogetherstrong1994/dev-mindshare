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

  // Reddit General — combined subscriber counts per provider
  const redditGeneralData = useMemo(() => {
    const sumSubs = (subs) => subs.reduce((s, r) => s + r.subscribers, 0);
    return [
      { name: 'OpenAI / ChatGPT', subscribers: sumSubs(discourse.reddit.general.openai), color: PROVIDERS.openai.color,
        detail: discourse.reddit.general.openai.map(r => `r/${r.subreddit}`).join(', ') },
      { name: 'Anthropic / Claude', subscribers: sumSubs(discourse.reddit.general.anthropic), color: PROVIDERS.anthropic.color,
        detail: discourse.reddit.general.anthropic.map(r => `r/${r.subreddit}`).join(', ') },
      { name: 'Google / Gemini', subscribers: sumSubs(discourse.reddit.general.google), color: PROVIDERS.google.color,
        detail: discourse.reddit.general.google.map(r => `r/${r.subreddit}`).join(', ') },
      { name: 'xAI / Grok', subscribers: sumSubs(discourse.reddit.general.xai), color: PROVIDERS.xai.color,
        detail: discourse.reddit.general.xai.map(r => `r/${r.subreddit}`).join(', ') },
    ];
  }, []);

  // Reddit Developer — combined subscriber counts per provider
  const redditDevData = useMemo(() => {
    const sumSubs = (subs) => subs.reduce((s, r) => s + r.subscribers, 0);
    const entries = [];
    const devAnthro = discourse.reddit.developer.anthropic;
    const devOpenai = discourse.reddit.developer.openai;
    const devGoogle = discourse.reddit.developer.google;
    if (devOpenai.length > 0) entries.push({
      name: 'OpenAI', subscribers: sumSubs(devOpenai), color: PROVIDERS.openai.color,
      detail: devOpenai.map(r => `r/${r.subreddit}`).join(', '),
    });
    if (devAnthro.length > 0) entries.push({
      name: 'Anthropic', subscribers: sumSubs(devAnthro), color: PROVIDERS.anthropic.color,
      detail: devAnthro.map(r => `r/${r.subreddit}`).join(', '),
    });
    if (devGoogle.length > 0) entries.push({
      name: 'Google', subscribers: sumSubs(devGoogle), color: PROVIDERS.google.color,
      detail: devGoogle.map(r => `r/${r.subreddit}`).join(', '),
    });
    return entries;
  }, []);

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

      {/* Reddit — two charts side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        {/* Panel C: Reddit General Communities */}
        <ChartContainer height={250} title="Reddit — General Communities (Combined Subscribers)">
          <BarChart data={redditGeneralData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis type="number" tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={{ stroke: '#1e293b' }} tickLine={false} tickFormatter={formatNumber} />
            <YAxis type="category" dataKey="name" tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={{ stroke: '#1e293b' }} tickLine={false} width={120} />
            <Tooltip content={<CustomTooltip formatter={(v, entry) => formatNumber(v)} />} />
            <Bar dataKey="subscribers" name="Subscribers" shape={<ColoredBar />} />
          </BarChart>
        </ChartContainer>

        {/* Panel D: Reddit Developer Communities */}
        <ChartContainer height={250} title="Reddit — Developer Communities (Combined Subscribers)">
          <BarChart data={redditDevData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis type="number" tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={{ stroke: '#1e293b' }} tickLine={false} tickFormatter={formatNumber} />
            <YAxis type="category" dataKey="name" tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={{ stroke: '#1e293b' }} tickLine={false} width={120} />
            <Tooltip content={<CustomTooltip formatter={(v, entry) => formatNumber(v)} />} />
            <Bar dataKey="subscribers" name="Subscribers" shape={<ColoredBar />} />
          </BarChart>
        </ChartContainer>
      </div>

      {/* Subreddit breakdown detail */}
      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="bg-terminal-surface/50 border border-terminal-border rounded-lg p-3">
          <p className="text-[10px] font-mono text-terminal-muted uppercase tracking-widest mb-2">General Subreddit Breakdown</p>
          {redditGeneralData.map(provider => (
            <div key={provider.name} className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: provider.color }} />
              <span className="text-[10px] font-mono text-terminal-muted">{provider.name}:</span>
              <span className="text-[10px] font-mono text-terminal-text">{provider.detail}</span>
            </div>
          ))}
        </div>
        <div className="bg-terminal-surface/50 border border-terminal-border rounded-lg p-3">
          <p className="text-[10px] font-mono text-terminal-muted uppercase tracking-widest mb-2">Developer Subreddit Breakdown</p>
          {redditDevData.map(provider => (
            <div key={provider.name} className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: provider.color }} />
              <span className="text-[10px] font-mono text-terminal-muted">{provider.name}:</span>
              <span className="text-[10px] font-mono text-terminal-text">{provider.detail}</span>
            </div>
          ))}
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-terminal-muted/50" />
            <span className="text-[10px] font-mono text-terminal-muted">Google:</span>
            <span className="text-[10px] font-mono text-terminal-muted/70 italic">No active developer subreddit found</span>
          </div>
        </div>
      </div>

      <Footnote lines={[
        'HN: hn.algolia.com/api. Search terms — Anthropic: "anthropic" + "claude ai" + "claude code" + "claude sonnet"; OpenAI: "openai" + "chatgpt" + "gpt-4"; Google: "gemini ai" + "google gemini" + "gemini pro". Counts summed across terms (some overlap possible). xAI excluded ("xai" matches unrelated terms). "claude" alone excluded (matches people named Claude).',
        'SO: api.stackexchange.com. All relevant tags per provider combined. Anthropic: claude (127) + claude-code (28) + mcp-server (17) + anthropic (11) + sonnet (8) + 5 more = 199. "opus" tag (402) is audio codec, "haiku" tag (13) is Haiku OS — excluded. "gemini" tag (34) is Countersoft bug-tracker — excluded. Upper bounds due to possible multi-tag overlap.',
        'Reddit: Public JSON endpoint (/r/{sub}/about.json). General = consumer + discussion communities. Developer = coding/API-focused subreddits. r/Gemini (47K) is the crypto exchange — excluded. r/Bard (138K, now titled "r/Gemini") included under Google general.',
      ]} />
    </Section>
  );
}
