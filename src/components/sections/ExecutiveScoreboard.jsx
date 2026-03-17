import { useMemo } from 'react';
import Section from '../layout/Section';
import Footnote from '../ui/Footnote';
import { PROVIDERS, PROVIDER_ORDER } from '../../data/providers';
import { npmDownloads } from '../../data/npm-downloads';
import { pypiDownloads } from '../../data/pypi-downloads';
import { githubMetrics } from '../../data/github-metrics';
import { discourse } from '../../data/discourse';
import { computeCompositeScores } from '../../utils/calculations';
import { formatNumber } from '../../utils/formatters';

function MetricRow({ label, value, maxValue, color }) {
  const barWidth = maxValue > 0 ? (value / maxValue) * 100 : 0;
  return (
    <div className="flex items-center gap-3 py-1.5">
      <span className="text-[9px] font-mono text-terminal-muted uppercase tracking-wider w-32 shrink-0">
        {label}
      </span>
      <div className="flex-1 h-1.5 bg-terminal-border/50 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${barWidth}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-xs font-mono text-terminal-text w-16 text-right font-semibold">
        {formatNumber(value)}
      </span>
    </div>
  );
}

export default function ExecutiveScoreboard() {
  const compositeScores = useMemo(() => computeCompositeScores(), []);

  const metrics = useMemo(() => {
    const result = {};
    for (const id of PROVIDER_ORDER) {
      const npmWeekly = npmDownloads.primary[id]?.weeklyDownloads || 0;
      const pypiMonthly = id === 'google'
        ? (pypiDownloads.primary.googleGenai?.lastMonth || pypiDownloads.primary.googleGenerativeAi?.lastMonth || 0)
        : (pypiDownloads.primary[id]?.lastMonth || 0);
      const ghStars = (githubMetrics.sdks[id]?.python?.stars || 0) + (githubMetrics.sdks[id]?.typescript?.stars || 0);
      const hnMentions = discourse.hackerNews[id]?.last30d?.stories || 0;
      const soQuestions = discourse.stackOverflow[id]?.totalQuestions || 0;

      result[id] = { npmWeekly, pypiMonthly, ghStars, hnMentions, soQuestions };
    }
    return result;
  }, []);

  // Compute max values for bar scaling
  const maxValues = useMemo(() => ({
    npmWeekly: Math.max(...Object.values(metrics).map(m => m.npmWeekly)),
    pypiMonthly: Math.max(...Object.values(metrics).map(m => m.pypiMonthly)),
    ghStars: Math.max(...Object.values(metrics).map(m => m.ghStars)),
    hnMentions: Math.max(...Object.values(metrics).map(m => m.hnMentions)),
    soQuestions: Math.max(...Object.values(metrics).map(m => m.soQuestions)),
  }), [metrics]);

  return (
    <Section number={1} title="Executive Scoreboard" id="scoreboard">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {PROVIDER_ORDER.map((id) => {
          const provider = PROVIDERS[id];
          const m = metrics[id];
          const score = compositeScores[id];

          return (
            <div
              key={id}
              className="bg-terminal-surface/50 border border-terminal-border rounded-lg p-5 hover:border-terminal-muted/30 transition-all"
              style={{ borderTopColor: provider.color, borderTopWidth: '2px' }}
            >
              <h3 className="text-sm font-mono font-bold mb-4" style={{ color: provider.color }}>
                {provider.name}
              </h3>

              <div className="space-y-0.5">
                <MetricRow label="npm (weekly)" value={m.npmWeekly} maxValue={maxValues.npmWeekly} color={provider.color} />
                <MetricRow label="PyPI (monthly)" value={m.pypiMonthly} maxValue={maxValues.pypiMonthly} color={provider.color} />
                <MetricRow label="GitHub Stars" value={m.ghStars} maxValue={maxValues.ghStars} color={provider.color} />
                <MetricRow label="HN (30d)" value={m.hnMentions} maxValue={maxValues.hnMentions} color={provider.color} />
                <MetricRow label="SO Questions" value={m.soQuestions} maxValue={maxValues.soQuestions} color={provider.color} />
              </div>

              <div className="mt-4 pt-3 border-t border-terminal-border">
                <div className="flex justify-between items-baseline">
                  <span className="text-[9px] font-mono text-terminal-muted uppercase tracking-widest">
                    Ecosystem Score
                  </span>
                  <span className="text-xl font-mono font-bold" style={{ color: provider.color }}>
                    {score?.composite || 0}
                    <span className="text-xs text-terminal-muted font-normal"> / 100</span>
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <Footnote lines={[
        'Ecosystem Score is a weighted composite of 5 dimensions: SDK downloads (30%), discourse (25%), ecosystem breadth (20%), GitHub health (15%), growth momentum (10%). Each dimension normalized 0–100 where the top provider = 100.',
        'npm: api.npmjs.org (daily, 7-day avg). PyPI: pypistats.org. GitHub: api.github.com. HN: hn.algolia.com (multi-term search). SO: api.stackexchange.com (comprehensive tags — 9 for Anthropic, 8 for OpenAI, 7 for Google). All fetched 2026-03-17.',
      ]} />
    </Section>
  );
}
