import { useMemo } from 'react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend, Tooltip,
} from 'recharts';
import Section from '../layout/Section';
import ChartContainer from '../charts/ChartContainer';
import Footnote from '../ui/Footnote';
import { PROVIDERS, PROVIDER_ORDER } from '../../data/providers';
import { computeCompositeScores } from '../../utils/calculations';

const DIMENSION_LABELS = {
  sdkAdoption: 'SDK Adoption',
  githubHealth: 'GitHub Health',
  discourse: 'Discourse',
  ecosystemBreadth: 'Ecosystem',
  growthMomentum: 'Growth',
};

const WEIGHTS = {
  sdkAdoption: '30%',
  githubHealth: '15%',
  discourse: '25%',
  ecosystemBreadth: '20%',
  growthMomentum: '10%',
};

export default function CompositeIndex() {
  const scores = useMemo(() => computeCompositeScores(), []);

  const radarData = useMemo(() => {
    const dimensions = Object.keys(DIMENSION_LABELS);
    return dimensions.map(dim => {
      const point = { dimension: DIMENSION_LABELS[dim] };
      for (const id of PROVIDER_ORDER) {
        point[id] = Math.round(scores[id]?.dimensions[dim] || 0);
      }
      return point;
    });
  }, [scores]);

  return (
    <Section number={7} title="Composite Ecosystem Index" subtitle="Weighted multi-signal competitive positioning" id="composite">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Radar chart */}
        <div className="lg:col-span-2">
          <ChartContainer height={400} title="Provider Comparison — Radar View">
            <RadarChart data={radarData}>
              <PolarGrid stroke="#1e293b" />
              <PolarAngleAxis
                dataKey="dimension"
                tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'JetBrains Mono' }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={{ fill: '#64748b', fontSize: 9 }}
                axisLine={false}
              />
              {PROVIDER_ORDER.map(id => (
                <Radar
                  key={id}
                  name={PROVIDERS[id].name}
                  dataKey={id}
                  stroke={PROVIDERS[id].color}
                  fill={PROVIDERS[id].color}
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
              ))}
              <Legend wrapperStyle={{ fontSize: 10, fontFamily: 'JetBrains Mono' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#111827',
                  border: '1px solid #1e293b',
                  borderRadius: '8px',
                  fontSize: 11,
                  fontFamily: 'JetBrains Mono',
                }}
              />
            </RadarChart>
          </ChartContainer>
        </div>

        {/* Score cards + methodology */}
        <div className="space-y-4">
          {/* Final scores */}
          <div className="bg-terminal-surface/50 border border-terminal-border rounded-lg p-5">
            <p className="text-[10px] font-mono text-terminal-muted uppercase tracking-widest mb-4">
              Composite Scores
            </p>
            <div className="space-y-3">
              {PROVIDER_ORDER.map(id => (
                <div key={id} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PROVIDERS[id].color }} />
                  <span className="text-xs font-mono text-terminal-text flex-1">{PROVIDERS[id].name}</span>
                  <span className="text-lg font-mono font-bold" style={{ color: PROVIDERS[id].color }}>
                    {scores[id]?.composite || 0}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Methodology */}
          <div className="bg-terminal-surface/50 border border-terminal-border rounded-lg p-5">
            <p className="text-[10px] font-mono text-terminal-muted uppercase tracking-widest mb-3">
              Methodology
            </p>
            <div className="space-y-1.5">
              {Object.entries(DIMENSION_LABELS).map(([key, label]) => (
                <div key={key} className="flex justify-between text-[10px] font-mono">
                  <span className="text-terminal-muted">{label}</span>
                  <span className="text-terminal-text">{WEIGHTS[key]}</span>
                </div>
              ))}
            </div>
            <p className="text-[9px] font-mono text-terminal-muted mt-3 leading-relaxed">
              Each dimension normalized 0–100 (max provider = 100). Composite = weighted sum.
              Growth momentum rewards positive trajectory.
            </p>
          </div>
        </div>
      </div>
      <Footnote lines={[
        'Inputs: npm daily downloads (api.npmjs.org, 7-day rolling avg), PyPI monthly (pypistats.org), GitHub stars/forks (api.github.com), HN stories (hn.algolia.com), SO questions (api.stackexchange.com with comprehensive tag coverage). All data fetched 2026-03-17.',
        'Job market data excluded from composite scoring — search-based estimates are too noisy for a quantitative index. Job market signals are presented qualitatively in Section 05.',
        'This is a directional heuristic, not a definitive ranking. Weights reflect the author\'s judgment of signal importance and data reliability.',
      ]} />
    </Section>
  );
}
