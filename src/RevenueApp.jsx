import { useReducer, useCallback } from 'react';
import RevenueHeader from './components/revenue/RevenueHeader';
import MarketOverview from './components/revenue/MarketOverview';
import RevenueTrajectory from './components/revenue/RevenueTrajectory';
import RevenueDecomposition from './components/revenue/RevenueDecomposition';
import RevenueMix from './components/revenue/RevenueMix';
import UnitEconomics from './components/revenue/UnitEconomics';
import ForwardRevenueModel from './components/revenue/ForwardRevenueModel';
import RevenueMilestones from './components/revenue/RevenueMilestones';
import CompetitivePositioning from './components/revenue/CompetitivePositioning';
import StrategicInsights from './components/revenue/StrategicInsights';
import SourcesMethodology from './components/revenue/SourcesMethodology';
import { DEFAULT_ASSUMPTIONS } from './data/revenue/assumptions';

function assumptionsReducer(state, action) {
  switch (action.type) {
    case 'SET':
      return { ...state, [action.id]: action.value };
    case 'RESET':
      return { ...DEFAULT_ASSUMPTIONS };
    default:
      return state;
  }
}

export default function RevenueApp() {
  const [assumptions, dispatch] = useReducer(assumptionsReducer, DEFAULT_ASSUMPTIONS);

  const handleAssumptionChange = useCallback((id, value) => {
    dispatch({ type: 'SET', id, value });
  }, []);

  const handleReset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <RevenueHeader />
      <MarketOverview />
      <RevenueTrajectory assumptions={assumptions} />
      <RevenueDecomposition />
      <RevenueMix />
      <UnitEconomics
        assumptions={assumptions}
        onAssumptionChange={handleAssumptionChange}
      />
      <ForwardRevenueModel
        assumptions={assumptions}
        onAssumptionChange={handleAssumptionChange}
        onReset={handleReset}
      />
      <RevenueMilestones />
      <CompetitivePositioning />
      <StrategicInsights assumptions={assumptions} />
      <SourcesMethodology />

      {/* Footer */}
      <footer className="mt-16 pt-6 border-t border-terminal-border text-center">
        <p className="text-[10px] font-mono text-terminal-muted uppercase tracking-widest">
          AI Revenue Model Decomposition — Supplemental Application Material
        </p>
        <p className="text-[10px] font-mono text-terminal-muted mt-1">
          Prepared by Dev Gupta · March 2026 · All data from public sources
        </p>
      </footer>
    </div>
  );
}
