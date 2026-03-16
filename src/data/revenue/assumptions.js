// Interactive assumption slider configurations
// Each assumption drives recalculation in ForwardRevenueModel and UnitEconomics

export const DEFAULT_ASSUMPTIONS = {
  // Global
  projection_quarters: 8,        // 2 years forward
  market_growth_rate: 0.80,       // 80% CAGR for total AI market
  token_price_deflation: -0.25,   // -25% annual token price decline

  // Anthropic
  anthropic_growth_rate: 1.00,    // 100% YoY (based on trajectory)
  anthropic_api_mix: 0.73,        // API as % of total (70-75%)
  anthropic_code_growth: 2.0,     // Claude Code growth multiplier (2x since Jan)
  anthropic_new_product: 0,       // New product revenue (agents, Cowork)

  // OpenAI
  openai_growth_rate: 0.60,       // 60% YoY
  openai_plus_growth: 0.20,       // Plus subscriber growth 20%
  openai_pro_conversion: 0.03,    // 3% of Plus users upgrade to Pro
  openai_msft_share: 0.49,        // Microsoft revenue share

  // Google
  google_cloud_ai_growth: 0.35,   // Cloud AI revenue growth
  google_workspace_ai_pct: 0.10,  // Workspace AI upsell penetration

  // xAI
  xai_growth_rate: 1.50,          // 150% YoY from low base

  // Unit economics
  api_gross_margin: 0.55,         // Blended API gross margin
  cloud_marketplace_take: 0.25,   // Cloud marketplace take rate
};

export const ASSUMPTION_CONFIGS = {
  // Global
  projection_quarters: { min: 4, max: 12, step: 1, label: 'Projection Horizon (Quarters)', format: 'number' },
  market_growth_rate: { min: 0.30, max: 1.50, step: 0.05, label: 'AI Market CAGR', format: 'percent' },
  token_price_deflation: { min: -0.50, max: 0, step: 0.05, label: 'Annual Token Price Change', format: 'percent' },

  // Anthropic
  anthropic_growth_rate: { min: 0.50, max: 2.00, step: 0.05, label: 'Anthropic Growth Rate (YoY)', format: 'percent' },
  anthropic_api_mix: { min: 0.50, max: 0.90, step: 0.01, label: 'Anthropic API Revenue %', format: 'percent' },
  anthropic_code_growth: { min: 1.0, max: 5.0, step: 0.1, label: 'Claude Code Growth Multiplier', format: 'multiplier' },
  anthropic_new_product: { min: 0, max: 5e9, step: 500e6, label: 'New Product Revenue (Agents)', format: 'currency' },

  // OpenAI
  openai_growth_rate: { min: 0.30, max: 1.50, step: 0.05, label: 'OpenAI Growth Rate (YoY)', format: 'percent' },
  openai_plus_growth: { min: 0, max: 0.50, step: 0.05, label: 'ChatGPT Plus Subscriber Growth', format: 'percent' },
  openai_pro_conversion: { min: 0.01, max: 0.10, step: 0.01, label: 'Plus → Pro Conversion', format: 'percent' },
  openai_msft_share: { min: 0.30, max: 0.49, step: 0.01, label: 'Microsoft Revenue Share', format: 'percent' },

  // Google
  google_cloud_ai_growth: { min: 0.15, max: 0.75, step: 0.05, label: 'Google Cloud AI Growth', format: 'percent' },
  google_workspace_ai_pct: { min: 0.05, max: 0.30, step: 0.01, label: 'Workspace AI Penetration', format: 'percent' },

  // xAI
  xai_growth_rate: { min: 0.50, max: 5.00, step: 0.10, label: 'xAI Growth Rate (YoY)', format: 'percent' },

  // Unit economics
  api_gross_margin: { min: 0.30, max: 0.80, step: 0.01, label: 'API Gross Margin', format: 'percent' },
  cloud_marketplace_take: { min: 0.15, max: 0.35, step: 0.01, label: 'Cloud Marketplace Take Rate', format: 'percent' },
};
