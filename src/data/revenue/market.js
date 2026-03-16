// Market-level financial data for AI industry context

export const MARKET_DATA = {
  lastUpdated: '2026-03-16',

  // Hyperscaler AI CapEx
  hyperscaler_capex: {
    2024: {
      alphabet: { value: 52.5e9, confidence: 'confirmed', source: 'Alphabet 10-K FY2024' },
      microsoft: { value: 55.7e9, confidence: 'confirmed', source: 'Microsoft 10-K FY2024' },
      meta: { value: 39.2e9, confidence: 'confirmed', source: 'Meta 10-K FY2024' },
      amazon: { value: 58.4e9, confidence: 'confirmed', source: 'Amazon 10-K FY2024' },
      total: { value: 205.8e9, confidence: 'confirmed', source: 'Sum of big 4' },
    },
    2025: {
      alphabet: { value: 91.4e9, confidence: 'confirmed', source: 'Alphabet 10-K FY2025' },
      microsoft: { value: 78e9, confidence: 'estimated', source: 'Microsoft FY2025 estimates' },
      meta: { value: 72.2e9, confidence: 'confirmed', source: 'Meta 10-K FY2025' },
      amazon: { value: 75e9, confidence: 'estimated', source: 'Amazon FY2025 estimates' },
      total: { value: 316.6e9, confidence: 'estimated', source: 'Sum of big 4' },
    },
    2026: {
      alphabet: { value: 180e9, confidence: 'confirmed', source: 'Alphabet guidance: $175-185B' },
      microsoft: { value: 110e9, confidence: 'estimated', source: 'Analyst estimates' },
      meta: { value: 125e9, confidence: 'confirmed', source: 'Meta guidance: $115-135B' },
      amazon: { value: 100e9, confidence: 'estimated', source: 'Analyst estimates' },
      total: { value: 515e9, confidence: 'estimated', source: 'Sum of big 4' },
    },
  },

  // Total AI market sizing (TAM)
  ai_market_sizing: {
    ai_software_2025: { value: 150e9, confidence: 'estimated', source: 'Gartner, IDC estimates' },
    ai_software_2026: { value: 250e9, confidence: 'speculative', source: 'Goldman Sachs, Morgan Stanley projections' },
    ai_software_2027: { value: 400e9, confidence: 'speculative', source: 'ARK Invest Big Ideas, analyst consensus' },
    ai_api_market_2025: { value: 30e9, confidence: 'speculative', source: 'Estimated: Anthropic + OpenAI + Google API + others' },
    ai_api_market_2026: { value: 55e9, confidence: 'speculative', source: 'Projected from growth rates' },
  },

  // Revenue efficiency benchmarks
  benchmarks: {
    top_saas_revenue_per_employee: { value: 500000, source: 'Bessemer Cloud Index top decile' },
    anthropic_revenue_per_employee: { value: 7.6e6, source: '$19B / ~2,500 employees' },
    openai_revenue_per_employee: { value: 4.4e6, source: '~$16B ARR / ~3,500 employees' },
  },
};
