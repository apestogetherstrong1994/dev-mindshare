import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import Section from '../layout/Section';
import ConfidenceBadge from '../ui/ConfidenceBadge';
import { REVENUE_COMPANIES, REVENUE_PROVIDER_ORDER_NO_META } from '../../data/revenue/companies';
import { formatCurrency } from '../../utils/formatters';

const SEGMENT_COLORS = ['#D4A574', '#10B981', '#4285F4', '#F59E0B', '#8B5CF6', '#EF4444', '#06B6D4'];

function getLatestArr(company) {
  const timeline = company.revenue_timeline;
  if (!timeline?.length) return 0;
  const last = timeline[timeline.length - 1];
  return last.arr || last.revenue * 4 || 0;
}

function DonutChart({ company, size = 180 }) {
  const totalArr = getLatestArr(company);
  const decomp = company.revenue_decomposition || {};

  const data = Object.entries(decomp)
    .filter(([, seg]) => seg.pct > 0)
    .map(([key, seg]) => ({
      name: seg.label,
      value: totalArr * seg.pct,
      pct: seg.pct,
      confidence: seg.confidence,
    }));

  if (data.length === 0) return null;

  return (
    <div className="flex flex-col items-center">
      <h4 className="text-xs font-mono font-semibold mb-2" style={{ color: company.color }}>
        {company.name}
      </h4>
      <div style={{ width: size, height: size }} className="relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={size * 0.30}
              outerRadius={size * 0.42}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {data.map((_, i) => (
                <Cell key={i} fill={SEGMENT_COLORS[i % SEGMENT_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.[0]) return null;
                const d = payload[0].payload;
                return (
                  <div className="bg-terminal-elevated border border-terminal-border rounded-lg p-2 shadow-xl">
                    <p className="text-[10px] font-mono text-terminal-text font-semibold">{d.name}</p>
                    <p className="text-[10px] font-mono text-terminal-muted">
                      {formatCurrency(d.value)} ({Math.round(d.pct * 100)}%)
                    </p>
                    {d.confidence !== 'confirmed' && (
                      <div className="mt-1"><ConfidenceBadge level={d.confidence} showLabel /></div>
                    )}
                  </div>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        {/* Center label */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-mono font-bold text-terminal-bright">
            {formatCurrency(totalArr, 0)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function RevenueMix() {
  const tableData = useMemo(() => {
    // Collect all unique segment types across companies
    const segmentTypes = [
      { key: 'api', label: 'API (Direct)', match: ['api_direct', 'api'] },
      { key: 'api_marketplace', label: 'API (Cloud/Azure)', match: ['api_marketplace', 'api_azure'] },
      { key: 'subscription', label: 'Consumer Subscription', match: ['claude_subscriptions', 'chatgpt_plus', 'chatgpt_pro', 'supergrok', 'google_one_ai', 'x_premium'] },
      { key: 'enterprise', label: 'Enterprise / Team', match: ['enterprise', 'chatgpt_team_enterprise', 'cloud_ai_vertex', 'workspace_ai', 'government'] },
      { key: 'code', label: 'Coding Tools', match: ['claude_code'] },
      { key: 'other', label: 'Other', match: ['other', 'search_ai', 'gemini_api', 'ai_ad_uplift', 'meta_ai_engagement'] },
    ];

    return segmentTypes.map(seg => {
      const row = { label: seg.label };
      REVENUE_PROVIDER_ORDER_NO_META.forEach(id => {
        const company = REVENUE_COMPANIES[id];
        const totalArr = getLatestArr(company);
        const decomp = company.revenue_decomposition || {};
        let pctSum = 0;
        seg.match.forEach(matchKey => {
          if (decomp[matchKey]) pctSum += decomp[matchKey].pct;
        });
        row[id] = pctSum > 0 ? totalArr * pctSum : 0;
        row[`${id}_pct`] = pctSum;
      });
      return row;
    });
  }, []);

  const totals = useMemo(() => {
    const t = {};
    REVENUE_PROVIDER_ORDER_NO_META.forEach(id => {
      t[id] = getLatestArr(REVENUE_COMPANIES[id]);
    });
    return t;
  }, []);

  return (
    <Section
      number={4}
      title="Revenue Mix Comparison"
      subtitle="Revenue composition by business model across frontier labs"
      id="mix"
    >
      {/* Donut charts row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {REVENUE_PROVIDER_ORDER_NO_META.map(id => (
          <DonutChart key={id} company={REVENUE_COMPANIES[id]} />
        ))}
      </div>

      {/* Comparison table */}
      <div className="bg-terminal-surface/50 border border-terminal-border rounded-lg overflow-x-auto">
        <table className="w-full text-xs font-mono">
          <thead>
            <tr className="border-b border-terminal-border">
              <th className="text-left px-4 py-3 text-[9px] text-terminal-muted uppercase tracking-widest">
                Revenue Line
              </th>
              {REVENUE_PROVIDER_ORDER_NO_META.map(id => (
                <th
                  key={id}
                  className="text-right px-4 py-3 text-[9px] uppercase tracking-widest"
                  style={{ color: REVENUE_COMPANIES[id].color }}
                >
                  {REVENUE_COMPANIES[id].name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, i) => (
              <tr key={i} className="border-b border-terminal-border/50 hover:bg-terminal-elevated/30">
                <td className="px-4 py-2.5 text-terminal-text">{row.label}</td>
                {REVENUE_PROVIDER_ORDER_NO_META.map(id => (
                  <td key={id} className="px-4 py-2.5 text-right text-terminal-text">
                    {row[id] > 0 ? (
                      <span>
                        {formatCurrency(row[id])}
                        <span className="text-terminal-muted ml-1">
                          ({Math.round(row[`${id}_pct`] * 100)}%)
                        </span>
                      </span>
                    ) : (
                      <span className="text-terminal-muted">—</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
            {/* Total row */}
            <tr className="border-t-2 border-terminal-border bg-terminal-elevated/20">
              <td className="px-4 py-2.5 text-terminal-bright font-semibold">Total</td>
              {REVENUE_PROVIDER_ORDER_NO_META.map(id => (
                <td key={id} className="px-4 py-2.5 text-right font-semibold" style={{ color: REVENUE_COMPANIES[id].color }}>
                  {formatCurrency(totals[id])}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </Section>
  );
}
