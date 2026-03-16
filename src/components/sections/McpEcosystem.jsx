import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import Section from '../layout/Section';
import ChartContainer from '../charts/ChartContainer';
import CustomTooltip from '../charts/CustomTooltip';
import { mcpEcosystem } from '../../data/mcp-ecosystem';
import { npmDownloads } from '../../data/npm-downloads';
import { formatNumber } from '../../utils/formatters';

export default function McpEcosystem() {
  const trendData = useMemo(() =>
    mcpEcosystem.npmMonthlyTrend.map(m => ({
      month: m.month,
      downloads: m.downloads,
    })),
  []);

  // Compare MCP to provider SDKs
  const comparison = useMemo(() => {
    const mcpMonthly = mcpEcosystem.npmMonthly;
    const anthropicMonthly = npmDownloads.primary.anthropic.monthlyDownloads;
    const openaiMonthly = npmDownloads.primary.openai.monthlyDownloads;
    return {
      vsAnthropic: (mcpMonthly / anthropicMonthly).toFixed(1),
      vsOpenai: (mcpMonthly / openaiMonthly).toFixed(1),
    };
  }, []);

  return (
    <Section number={6} title="MCP Ecosystem Spotlight" subtitle="Model Context Protocol — Anthropic's developer platform play" id="mcp">
      {/* Hero numbers */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-terminal-surface/50 border border-terminal-border rounded-lg p-5 md:col-span-2"
          style={{ borderTopColor: '#D4A574', borderTopWidth: '2px' }}>
          <p className="text-[10px] font-mono text-terminal-muted uppercase tracking-widest mb-2">
            Combined Monthly SDK Downloads (npm + PyPI)
          </p>
          <p className="text-4xl font-mono font-bold text-anthropic">
            {formatNumber(mcpEcosystem.totalMonthlyDownloads)}
          </p>
          <p className="text-xs font-mono text-terminal-muted mt-1">
            {formatNumber(mcpEcosystem.npmMonthly)} npm · {formatNumber(mcpEcosystem.pypiMonthly)} PyPI
          </p>
        </div>

        <div className="bg-terminal-surface/50 border border-terminal-border rounded-lg p-5">
          <p className="text-[10px] font-mono text-terminal-muted uppercase tracking-widest mb-2">
            GitHub Stars (Total)
          </p>
          <p className="text-3xl font-mono font-bold text-terminal-bright">
            {formatNumber(mcpEcosystem.github.totalStars)}
          </p>
          <p className="text-xs font-mono text-terminal-muted mt-1">Across all MCP repos</p>
        </div>

        <div className="bg-terminal-surface/50 border border-terminal-border rounded-lg p-5">
          <p className="text-[10px] font-mono text-terminal-muted uppercase tracking-widest mb-2">
            Registered Servers
          </p>
          <p className="text-3xl font-mono font-bold text-terminal-bright">
            {mcpEcosystem.registeredServers}+
          </p>
          <p className="text-xs font-mono text-terminal-muted mt-1">Community + official</p>
        </div>
      </div>

      {/* Growth chart */}
      <ChartContainer height={280} title="MCP npm SDK Downloads — Monthly Growth" subtitle={`Now ${comparison.vsAnthropic}x Anthropic SDK and ${comparison.vsOpenai}x OpenAI SDK in npm downloads`}>
        <AreaChart data={trendData}>
          <defs>
            <linearGradient id="mcpGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#D4A574" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#D4A574" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={{ stroke: '#1e293b' }} tickLine={false} />
          <YAxis tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={{ stroke: '#1e293b' }} tickLine={false} tickFormatter={formatNumber} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="downloads" name="MCP SDK Downloads" stroke="#D4A574" strokeWidth={2} fill="url(#mcpGradient)" />
        </AreaChart>
      </ChartContainer>

      {/* Adopters */}
      <div className="mt-4 bg-terminal-surface/50 border border-terminal-border rounded-lg p-5">
        <p className="text-[10px] font-mono text-terminal-muted uppercase tracking-widest mb-3">
          Major MCP Adopters
        </p>
        <div className="flex flex-wrap gap-2">
          {mcpEcosystem.adopters.map((adopter) => (
            <span key={adopter} className="px-3 py-1.5 text-xs font-mono text-terminal-text bg-terminal-elevated rounded border border-terminal-border">
              {adopter}
            </span>
          ))}
        </div>
      </div>

      {/* Milestones */}
      <div className="mt-4 bg-terminal-surface/50 border border-terminal-border rounded-lg p-5">
        <p className="text-[10px] font-mono text-terminal-muted uppercase tracking-widest mb-3">
          Key Milestones
        </p>
        <div className="space-y-2">
          {mcpEcosystem.milestones.map((m, i) => (
            <div key={i} className="flex gap-4 text-xs font-mono">
              <span className="text-terminal-muted w-20 shrink-0">{m.date}</span>
              <span className="text-terminal-text">{m.event}</span>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
