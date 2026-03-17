import { useMemo } from 'react';
import Section from '../layout/Section';
import InsightCard from '../ui/InsightCard';
import Footnote from '../ui/Footnote';
import { generateInsights } from '../../utils/calculations';

export default function TrendInflections() {
  const insights = useMemo(() => generateInsights(), []);

  return (
    <Section number={8} title="Trend Inflections & Key Takeaways" subtitle="Auto-generated from data analysis" id="insights">
      <div className="space-y-3">
        {insights.map((insight, i) => (
          <InsightCard key={i} type={insight.type} severity={insight.severity} text={insight.text} />
        ))}
      </div>
      <Footnote lines={[
        'Insights are programmatically generated from the underlying data — not hand-written. Growth rates, ratios, and comparisons are computed at render time from the data modules.',
        'All takeaways inherit the caveats of their source data. See Sources & Methodology (Section 09) for per-source limitations.',
      ]} />
    </Section>
  );
}
