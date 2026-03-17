import Section from '../layout/Section';
import DataTable from '../ui/DataTable';
import Footnote from '../ui/Footnote';
import { PROVIDERS, PROVIDER_ORDER } from '../../data/providers';
import { githubMetrics } from '../../data/github-metrics';
import { formatNumber } from '../../utils/formatters';

export default function GitHubHealthMatrix() {
  const columns = [
    { key: 'metric', label: 'Metric', align: 'left' },
    ...PROVIDER_ORDER.map(id => ({
      key: id,
      label: PROVIDERS[id].name,
      align: 'right',
      isMetric: true,
      format: (v) => v === null || v === undefined ? '—' : typeof v === 'number' ? formatNumber(v) : v,
    })),
  ];

  const data = [
    {
      metric: 'SDK Stars (Python)',
      ...Object.fromEntries(PROVIDER_ORDER.map(id => [id, githubMetrics.sdks[id]?.python?.stars ?? null])),
    },
    {
      metric: 'SDK Stars (JS/TS)',
      ...Object.fromEntries(PROVIDER_ORDER.map(id => [id, githubMetrics.sdks[id]?.typescript?.stars ?? null])),
    },
    {
      metric: 'SDK Forks (Python)',
      ...Object.fromEntries(PROVIDER_ORDER.map(id => [id, githubMetrics.sdks[id]?.python?.forks ?? null])),
    },
    {
      metric: 'SDK Open Issues',
      ...Object.fromEntries(PROVIDER_ORDER.map(id => [id, githubMetrics.sdks[id]?.python?.openIssues ?? null])),
    },
    {
      metric: 'Cookbook Stars',
      ...Object.fromEntries(PROVIDER_ORDER.map(id => [id, githubMetrics.cookbooks[id]?.stars ?? null])),
    },
    {
      metric: 'Cookbook Forks',
      ...Object.fromEntries(PROVIDER_ORDER.map(id => [id, githubMetrics.cookbooks[id]?.forks ?? null])),
    },
    {
      metric: 'Fork:Star Ratio',
      ...Object.fromEntries(PROVIDER_ORDER.map(id => {
        const stars = githubMetrics.sdks[id]?.python?.stars;
        const forks = githubMetrics.sdks[id]?.python?.forks;
        return [id, stars && forks ? `${((forks / stars) * 100).toFixed(1)}%` : null];
      })),
    },
  ];

  // MCP row (Anthropic only)
  data.push({
    metric: 'MCP Ecosystem Stars',
    anthropic: githubMetrics.mcp.servers.stars + githubMetrics.mcp.pythonSdk.stars + githubMetrics.mcp.typescriptSdk.stars,
    openai: null,
    google: null,
    xai: null,
  });

  return (
    <Section number={3} title="GitHub Health Matrix" subtitle="Repository metrics across providers" id="github">
      <div className="bg-terminal-surface/50 border border-terminal-border rounded-lg overflow-hidden">
        <DataTable columns={columns} data={data} highlightLeader />
      </div>

      {/* Framework ecosystem */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        {[
          { label: 'Vercel AI SDK', ...githubMetrics.frameworks.vercelAi },
          { label: 'LangChain JS', ...githubMetrics.frameworks.langchainJs },
          { label: 'LiteLLM', ...githubMetrics.frameworks.litellm },
        ].map((fw) => (
          <div key={fw.label} className="bg-terminal-surface/50 border border-terminal-border rounded-lg p-4">
            <p className="text-[10px] font-mono text-terminal-muted uppercase tracking-widest mb-1">{fw.label}</p>
            <div className="flex items-baseline gap-3">
              <span className="text-lg font-mono font-bold text-terminal-bright">{formatNumber(fw.stars)}</span>
              <span className="text-[10px] font-mono text-terminal-muted">stars</span>
              <span className="text-sm font-mono text-terminal-muted">{formatNumber(fw.forks)} forks</span>
            </div>
          </div>
        ))}
      </div>
      <Footnote lines={[
        'Source: GitHub REST API (api.github.com/repos). 60 req/hr unauthenticated. Snapshot values only, fetched 2026-03-13.',
        'Google Gemini SDK repos were renamed to deprecated-* during the data collection period; current google-genai repos may differ. xAI has no public SDK repos.',
        'Fork:Star ratio is a rough engagement signal — higher ratios suggest more active reuse. MCP Ecosystem Stars sums modelcontextprotocol/servers, /python-sdk, and /typescript-sdk.',
      ]} />
    </Section>
  );
}
