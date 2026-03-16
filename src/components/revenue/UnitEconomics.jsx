import { useMemo } from 'react';
import Section from '../layout/Section';
import ConfidenceBadge from '../ui/ConfidenceBadge';
import AssumptionSlider from '../ui/AssumptionSlider';
import { REVENUE_COMPANIES, REVENUE_PROVIDER_ORDER_NO_META } from '../../data/revenue/companies';
import { ASSUMPTION_CONFIGS } from '../../data/revenue/assumptions';
import { computeUnitEconomics } from '../../utils/revenue-calculations';
import { formatCurrency, formatPercent } from '../../utils/formatters';

function MetricCell({ value, format = 'currency', confidence, highlight = false }) {
  let formatted;
  if (value === null || value === undefined) formatted = 'N/A';
  else if (format === 'currency') formatted = formatCurrency(value);
  else if (format === 'percent') formatted = formatPercent(value, 1);
  else if (format === 'number') formatted = value.toLocaleString();
  else formatted = String(value);

  return (
    <td className="px-4 py-2.5 text-right">
      <span className={`font-mono text-xs ${highlight ? 'text-terminal-bright font-semibold' : 'text-terminal-text'}`}>
        {formatted}
      </span>
      {confidence && confidence !== 'confirmed' && (
        <span className="ml-1.5 inline-block"><ConfidenceBadge level={confidence} /></span>
      )}
    </td>
  );
}

export default function UnitEconomics({ assumptions, onAssumptionChange }) {
  const metrics = useMemo(() => computeUnitEconomics(assumptions), [assumptions]);

  const rows = [
    {
      label: 'ARR (Latest)',
      values: {
        anthropic: { v: metrics.anthropic.arr, f: 'currency', c: 'confirmed' },
        openai: { v: metrics.openai.arr, f: 'currency', c: 'estimated' },
        google: { v: metrics.google.aiAttributedRevenue, f: 'currency', c: 'speculative' },
        xai: { v: metrics.xai.arr, f: 'currency', c: 'speculative' },
      },
    },
    {
      label: 'Revenue / Employee',
      values: {
        anthropic: { v: metrics.anthropic.revenuePerEmployee, f: 'currency', c: 'estimated' },
        openai: { v: metrics.openai.revenuePerEmployee, f: 'currency', c: 'estimated' },
        google: { v: null },
        xai: { v: metrics.xai.revenuePerEmployee, f: 'currency', c: 'speculative' },
      },
    },
    {
      label: 'Revenue / Active User',
      values: {
        anthropic: { v: metrics.anthropic.revenuePerUser, f: 'currency', c: 'estimated', note: '$211/mo' },
        openai: { v: metrics.openai.revenuePerUserWeekly * 52, f: 'currency', c: 'estimated', note: '$25/wk' },
        google: { v: null },
        xai: { v: null },
      },
    },
    {
      label: 'API Revenue',
      values: {
        anthropic: { v: metrics.anthropic.apiRevenue, f: 'currency', c: 'estimated' },
        openai: { v: metrics.openai.apiRevenue, f: 'currency', c: 'estimated' },
        google: { v: null },
        xai: { v: null },
      },
    },
    {
      label: 'Subscription Revenue',
      values: {
        anthropic: { v: metrics.anthropic.subscriptionRevenue, f: 'currency', c: 'estimated' },
        openai: { v: metrics.openai.subscriptionRevenue, f: 'currency', c: 'estimated' },
        google: { v: null },
        xai: { v: null },
      },
    },
    {
      label: 'Gross Margin (Est.)',
      values: {
        anthropic: { v: metrics.anthropic.grossMargin, f: 'percent', c: 'speculative' },
        openai: { v: metrics.openai.grossMargin, f: 'percent', c: 'speculative' },
        google: { v: 0.62, f: 'percent', c: 'estimated' },
        xai: { v: null },
      },
    },
    {
      label: 'Gross Profit (Est.)',
      values: {
        anthropic: { v: metrics.anthropic.grossProfit, f: 'currency', c: 'speculative' },
        openai: { v: metrics.openai.arr * metrics.openai.grossMargin, f: 'currency', c: 'speculative' },
        google: { v: null },
        xai: { v: null },
      },
    },
    {
      label: 'Marketplace Leakage',
      values: {
        anthropic: { v: metrics.anthropic.marketplaceLeakage, f: 'currency', c: 'speculative' },
        openai: { v: metrics.openai.arr * 0.20 * assumptions.openai_msft_share, f: 'currency', c: 'speculative' },
        google: { v: 0, note: 'First-party' },
        xai: { v: 0, note: 'Direct only' },
      },
    },
  ];

  // Find max per row for highlighting
  const rowMaxes = rows.map(row => {
    const vals = Object.values(row.values).map(v => v.v).filter(v => v !== null && v !== undefined);
    return Math.max(...vals);
  });

  return (
    <Section
      number={5}
      title="Unit Economics Deep Dive"
      subtitle="Key efficiency metrics with adjustable assumptions"
      id="unit-economics"
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Assumptions panel */}
        <div className="lg:col-span-1 bg-terminal-surface/50 border border-terminal-border rounded-lg p-4">
          <h4 className="text-[10px] font-mono text-terminal-muted uppercase tracking-widest mb-4">
            Adjustable Assumptions
          </h4>
          {['api_gross_margin', 'cloud_marketplace_take', 'anthropic_api_mix', 'openai_msft_share'].map(key => {
            const config = ASSUMPTION_CONFIGS[key];
            return (
              <AssumptionSlider
                key={key}
                id={key}
                label={config.label}
                value={assumptions[key]}
                min={config.min}
                max={config.max}
                step={config.step}
                format={config.format}
                onChange={onAssumptionChange}
                color="#D4A574"
              />
            );
          })}
        </div>

        {/* Metrics table */}
        <div className="lg:col-span-3 bg-terminal-surface/50 border border-terminal-border rounded-lg overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="border-b border-terminal-border">
                <th className="text-left px-4 py-3 text-[9px] text-terminal-muted uppercase tracking-widest">Metric</th>
                {REVENUE_PROVIDER_ORDER_NO_META.map(id => (
                  <th key={id} className="text-right px-4 py-3 text-[9px] uppercase tracking-widest"
                    style={{ color: REVENUE_COMPANIES[id].color }}>
                    {REVENUE_COMPANIES[id].name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-b border-terminal-border/50 hover:bg-terminal-elevated/30">
                  <td className="px-4 py-2.5 text-terminal-text text-xs">{row.label}</td>
                  {REVENUE_PROVIDER_ORDER_NO_META.map(id => {
                    const cell = row.values[id] || {};
                    return (
                      <MetricCell
                        key={id}
                        value={cell.v}
                        format={cell.f}
                        confidence={cell.c}
                        highlight={cell.v === rowMaxes[i] && cell.v > 0}
                      />
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Section>
  );
}
