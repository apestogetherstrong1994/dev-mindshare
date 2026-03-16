import Section from '../layout/Section';
import ConfidenceBadge from '../ui/ConfidenceBadge';
import { SOURCES, CONFIDENCE_FRAMEWORK } from '../../data/revenue/sources';

const TYPE_LABELS = {
  official: 'Official',
  tier1: 'Tier 1 Press',
  analysis: 'Research',
  dataset: 'Dataset',
  'sec-filing': 'SEC Filing',
  conference: 'Conference',
  proxy: 'Proxy Data',
};

export default function SourcesMethodology() {
  return (
    <Section
      number={10}
      title="Sources, Methodology & Confidence Ratings"
      subtitle="Full attribution for all data used in this analysis"
      id="sources"
    >
      {/* Confidence framework */}
      <div className="mb-8">
        <h3 className="text-[10px] font-mono text-terminal-muted uppercase tracking-widest mb-3">
          Confidence Framework
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(CONFIDENCE_FRAMEWORK).map(([level, info]) => (
            <div key={level} className="bg-terminal-surface/50 border border-terminal-border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <ConfidenceBadge level={level} showLabel />
              </div>
              <p className="text-[10px] font-mono text-terminal-muted leading-relaxed">
                {info.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Source bibliography */}
      <div className="mb-8">
        <h3 className="text-[10px] font-mono text-terminal-muted uppercase tracking-widest mb-3">
          Source Bibliography
        </h3>
        <div className="bg-terminal-surface/50 border border-terminal-border rounded-lg overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="border-b border-terminal-border">
                <th className="text-left px-4 py-3 text-[9px] text-terminal-muted uppercase tracking-widest">Source</th>
                <th className="text-left px-4 py-3 text-[9px] text-terminal-muted uppercase tracking-widest">Type</th>
                <th className="text-left px-4 py-3 text-[9px] text-terminal-muted uppercase tracking-widest">Company</th>
                <th className="text-left px-4 py-3 text-[9px] text-terminal-muted uppercase tracking-widest">Date</th>
                <th className="text-left px-4 py-3 text-[9px] text-terminal-muted uppercase tracking-widest">Key Data Points</th>
              </tr>
            </thead>
            <tbody>
              {SOURCES.map((source, i) => (
                <tr key={i} className="border-b border-terminal-border/50 hover:bg-terminal-elevated/30">
                  <td className="px-4 py-2.5 text-terminal-text max-w-[200px]">
                    {source.url ? (
                      <span className="text-blue-400 hover:underline cursor-pointer" title={source.url}>
                        {source.title}
                      </span>
                    ) : (
                      source.title
                    )}
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="text-[9px] uppercase tracking-wider text-terminal-muted">
                      {TYPE_LABELS[source.type] || source.type}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-terminal-muted capitalize">{source.company}</td>
                  <td className="px-4 py-2.5 text-terminal-muted">{source.date}</td>
                  <td className="px-4 py-2.5 text-terminal-muted text-[10px] max-w-[250px]">
                    {source.dataPoints.join(' · ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Methodology notes */}
      <div>
        <h3 className="text-[10px] font-mono text-terminal-muted uppercase tracking-widest mb-3">
          Methodology Notes
        </h3>
        <div className="bg-terminal-surface/50 border border-terminal-border rounded-lg p-5 space-y-3">
          {[
            'Revenue timeline data cross-referenced from Epoch AI machine-readable dataset, official company disclosures, and Tier 1 financial press reports.',
            'Revenue decomposition based on Sacra analysis, SaaStr commentary, and bottoms-up estimation from published pricing multiplied by subscriber estimates.',
            'Forward projections are model outputs based on user-defined assumptions and should not be treated as forecasts.',
            'Google AI revenue is estimated as a portion of Google Cloud segment revenue and is subject to significant uncertainty — Google does not disclose AI-specific revenue.',
            'xAI revenue estimates are among the least reliable in this analysis due to limited public disclosure.',
            'Meta is included for context as an alternative monetization model (indirect via ads) but has no direct AI product revenue.',
            'All unit economics (gross margin, marketplace take rates) are estimates based on industry benchmarks and should be stress-tested using the interactive sliders.',
          ].map((note, i) => (
            <p key={i} className="text-[10px] font-mono text-terminal-muted leading-relaxed flex gap-2">
              <span className="text-terminal-muted/50 shrink-0">{i + 1}.</span>
              {note}
            </p>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-6 p-4 border border-amber-400/20 bg-amber-400/5 rounded-lg">
        <p className="text-[10px] font-mono text-amber-400/80 leading-relaxed">
          <strong>Disclaimer:</strong> This analysis is prepared as supplemental application material for
          Anthropic's Finance & Strategy, Product Intelligence role. It is not investment advice. All
          projections are illustrative and based on publicly available information combined with
          user-adjustable assumptions. Most companies analyzed are private and do not publish audited
          financial statements. Numbers marked as Estimated or Speculative should be treated accordingly.
        </p>
      </div>
    </Section>
  );
}
