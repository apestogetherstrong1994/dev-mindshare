import { useMemo } from 'react';
import Section from '../layout/Section';
import InsightCard from '../ui/InsightCard';
import { generateRevenueInsights } from '../../utils/revenue-calculations';

export default function StrategicInsights({ assumptions }) {
  const insights = useMemo(() => generateRevenueInsights(assumptions), [assumptions]);

  return (
    <Section
      number={9}
      title="Key Strategic Insights"
      subtitle="Auto-generated analysis based on current data and assumptions"
      id="insights"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((insight, i) => (
          <InsightCard
            key={i}
            type={insight.type}
            severity={insight.severity}
            text={insight.text}
          />
        ))}
      </div>

      <div className="mt-4 p-3 bg-terminal-surface/30 border border-terminal-border/50 rounded-lg">
        <p className="text-[9px] font-mono text-terminal-muted italic">
          Insights are dynamically generated from current data and your assumption settings in Sections 05-06.
          Adjust sliders to see how insights change under different scenarios.
        </p>
      </div>
    </Section>
  );
}
