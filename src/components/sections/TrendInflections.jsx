import { useMemo } from 'react';
import Section from '../layout/Section';
import InsightCard from '../ui/InsightCard';
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
    </Section>
  );
}
