// AI Revenue Model Decomposition — Company Financial Data
// All values in USD. Confidence: confirmed = official/3+ Tier 1 sources, estimated = triangulated, speculative = model-derived
// Data collected: March 2026

export const REVENUE_COMPANIES = {
  anthropic: {
    id: 'anthropic',
    name: 'Anthropic',
    shortName: 'Claude',
    color: '#D4A574',
    colorDim: 'rgba(212, 165, 116, 0.15)',
    type: 'private',

    valuation: { value: 380e9, date: '2026-02', confidence: 'confirmed', source: 'Series G announcement, $380B post-money' },
    total_raised: { value: 64e9, confidence: 'confirmed', source: 'Cumulative funding through Series G ($30B round)' },
    employees: { value: 2500, confidence: 'estimated', source: 'LinkedIn, various reports' },

    revenue_timeline: [
      { date: '2023-01', arr: 100e6, confidence: 'confirmed', source: 'SaaStr, multiple reports' },
      { date: '2023-12', arr: 200e6, confidence: 'confirmed', source: 'The Information' },
      { date: '2024-12', arr: 1e9, confidence: 'confirmed', source: 'Multiple reports' },
      { date: '2025-03', arr: 2e9, confidence: 'confirmed', source: 'CNBC' },
      { date: '2025-05', arr: 3e9, confidence: 'confirmed', source: 'CNBC' },
      { date: '2025-07', arr: 4e9, confidence: 'confirmed', source: 'Bloomberg' },
      { date: '2025-12', arr: 9e9, confidence: 'confirmed', source: 'Bloomberg, Anthropic' },
      { date: '2026-02', arr: 14e9, confidence: 'confirmed', source: 'Anthropic official blog — Series G' },
      { date: '2026-03', arr: 19e9, confidence: 'confirmed', source: 'Bloomberg; Dario Amodei at Morgan Stanley TMT Conference' },
    ],

    revenue_decomposition: {
      api_direct: { pct: 0.55, label: 'API (Direct)', confidence: 'estimated', source: 'SaaStr: API is 70-75% total; split direct vs marketplace est.' },
      api_marketplace: { pct: 0.18, label: 'API (Cloud Marketplace)', confidence: 'estimated', source: 'Derived: Bedrock + Vertex + Azure share of API revenue' },
      claude_subscriptions: { pct: 0.07, label: 'Claude Pro/Max/Team', confidence: 'estimated', source: 'Bottoms-up from user estimates, Ramp data' },
      claude_code: { pct: 0.13, label: 'Claude Code', confidence: 'confirmed', source: '$2.5B of $19B ARR — Anthropic official' },
      enterprise: { pct: 0.07, label: 'Enterprise Contracts', confidence: 'estimated', source: 'Residual; 500+ customers >$1M annually' },
    },

    key_metrics: {
      revenue_per_user_monthly: { value: 211, confidence: 'estimated', source: 'SaaStr analysis' },
      business_customers: { value: 300000, confidence: 'confirmed', source: 'Anthropic official' },
      customers_over_1m: { value: 500, confidence: 'confirmed', source: 'Anthropic official' },
      fortune_10_customers: { value: 8, confidence: 'confirmed', source: 'Anthropic official' },
      claude_code_arr: { value: 2.5e9, confidence: 'confirmed', source: 'Anthropic official' },
      claude_code_enterprise_pct: { value: 0.50, confidence: 'confirmed', source: 'Claude Code enterprise >50% of Claude Code revenue' },
      cash_burn_2025: { value: 3e9, confidence: 'estimated', source: 'Fintool, Forbes estimates' },
      break_even_target: '2028',
      revenue_forecast_2026: { value: 18e9, confidence: 'estimated', source: 'Fintool: internal forecast raised 20% in Dec 2025' },
      revenue_forecast_2027: { value: 55e9, confidence: 'speculative', source: 'Fintool projection' },
      yoy_growth: { value: 10, confidence: 'confirmed', source: '10x annual growth each of past 3 years — Anthropic official' },
      api_revenue_pct: { value: 0.73, confidence: 'estimated', source: 'SaaStr/Sacra: API revenue 70-75% of total' },
    },

    products: [
      { name: 'Claude API (Direct)', type: 'api', pricing: 'Per-token consumption', model: 'consumption' },
      { name: 'Claude API (Bedrock/Vertex/Azure)', type: 'api', pricing: 'Per-token + cloud margin', model: 'consumption' },
      { name: 'Claude Pro', type: 'subscription', pricing: '$20/mo ($17/mo annual)', model: 'subscription' },
      { name: 'Claude Max', type: 'subscription', pricing: '$100/mo', model: 'subscription' },
      { name: 'Claude Team', type: 'subscription', pricing: '$25-150/seat/mo', model: 'subscription' },
      { name: 'Claude Enterprise', type: 'enterprise', pricing: 'Custom', model: 'subscription + consumption' },
      { name: 'Claude Code', type: 'tool', pricing: 'Included in Pro/Max plans', model: 'subscription' },
    ],
  },

  openai: {
    id: 'openai',
    name: 'OpenAI',
    shortName: 'GPT',
    color: '#10B981',
    colorDim: 'rgba(16, 185, 129, 0.15)',
    type: 'private',

    valuation: { value: 300e9, date: '2025-10', confidence: 'confirmed', source: 'October 2025 funding round at $300B' },
    total_raised: { value: 17.9e9, confidence: 'estimated', source: 'Cumulative funding through late 2025' },
    employees: { value: 3500, confidence: 'estimated', source: 'Various reports, LinkedIn' },

    revenue_timeline: [
      { date: '2023-11', arr: 1.6e9, confidence: 'confirmed', source: 'The Information' },
      { date: '2024-02', arr: 2e9, confidence: 'confirmed', source: 'Multiple reports' },
      { date: '2024-06', arr: 3.4e9, confidence: 'confirmed', source: 'The Information' },
      { date: '2024-10', arr: 4e9, confidence: 'confirmed', source: 'Bloomberg' },
      { date: '2024-12', arr: 5e9, confidence: 'estimated', source: 'Extrapolation from trajectory' },
      { date: '2025-06', arr: 8e9, confidence: 'estimated', source: 'Mid-year estimates' },
      { date: '2025-12', arr: 13.1e9, confidence: 'confirmed', source: 'The Information, multiple reports' },
      { date: '2026-03', arr: 16e9, confidence: 'estimated', source: 'Projected from growth trajectory' },
    ],

    revenue_decomposition: {
      chatgpt_plus: { pct: 0.35, label: 'ChatGPT Plus ($20/mo)', confidence: 'estimated', source: 'The Information: ~11M subscribers est.' },
      chatgpt_pro: { pct: 0.05, label: 'ChatGPT Pro ($200/mo)', confidence: 'speculative', source: 'Subscriber count unknown; est. 200-500K' },
      chatgpt_team_enterprise: { pct: 0.15, label: 'Team/Enterprise', confidence: 'estimated', source: 'Est. ~1M seats at $30-60/mo blended' },
      api_direct: { pct: 0.20, label: 'API (Direct)', confidence: 'estimated', source: 'The Information: API ~40-50% of total' },
      api_azure: { pct: 0.20, label: 'API (Azure OpenAI)', confidence: 'estimated', source: 'Major Azure growth driver; MSFT takes ~49% share' },
      other: { pct: 0.05, label: 'Other (Mobile/Licensing)', confidence: 'speculative', source: 'Mobile in-app purchases, other' },
    },

    key_metrics: {
      revenue_per_user_weekly: { value: 25, confidence: 'estimated', source: 'SaaStr analysis' },
      weekly_active_users: { value: 800e6, confidence: 'estimated', source: 'Various reports, ~800M WAU' },
      chatgpt_plus_subscribers: { value: 11e6, confidence: 'estimated', source: 'The Information mid-2025 estimate' },
      microsoft_revenue_share: { value: 0.49, confidence: 'estimated', source: 'Various reports: MSFT takes ~49% of API revenue' },
      cash_burn_annual: { value: 10e9, confidence: 'estimated', source: 'Forbes, various: $8-14B estimates' },
    },

    products: [
      { name: 'ChatGPT Plus', type: 'subscription', pricing: '$20/mo', model: 'subscription' },
      { name: 'ChatGPT Pro', type: 'subscription', pricing: '$200/mo', model: 'subscription' },
      { name: 'ChatGPT Team', type: 'subscription', pricing: '$30/seat/mo', model: 'subscription' },
      { name: 'ChatGPT Enterprise', type: 'enterprise', pricing: 'Custom', model: 'subscription' },
      { name: 'OpenAI API', type: 'api', pricing: 'Per-token consumption', model: 'consumption' },
      { name: 'Azure OpenAI', type: 'api', pricing: 'Per-token via Azure', model: 'consumption' },
    ],
  },

  google: {
    id: 'google',
    name: 'Google',
    shortName: 'Gemini',
    color: '#4285F4',
    colorDim: 'rgba(66, 133, 244, 0.15)',
    type: 'public',

    market_cap: { value: 2.1e12, date: '2026-03', confidence: 'confirmed', source: 'GOOG public market cap' },
    employees: { value: 183000, confidence: 'confirmed', source: 'Alphabet 10-K (total company)' },

    // Google Cloud segment revenue (AI revenue is embedded, not separately disclosed)
    revenue_timeline: [
      { date: '2023-03', revenue: 7.45e9, segment: 'Cloud', confidence: 'confirmed', source: 'Alphabet 10-Q Q1 2023' },
      { date: '2023-06', revenue: 8.03e9, segment: 'Cloud', confidence: 'confirmed', source: 'Alphabet 10-Q Q2 2023' },
      { date: '2023-09', revenue: 8.41e9, segment: 'Cloud', confidence: 'confirmed', source: 'Alphabet 10-Q Q3 2023' },
      { date: '2023-12', revenue: 9.19e9, segment: 'Cloud', confidence: 'confirmed', source: 'Alphabet 10-K FY2023' },
      { date: '2024-03', revenue: 9.57e9, segment: 'Cloud', confidence: 'confirmed', source: 'Alphabet 10-Q Q1 2024' },
      { date: '2024-06', revenue: 10.35e9, segment: 'Cloud', confidence: 'confirmed', source: 'Alphabet 10-Q Q2 2024' },
      { date: '2024-09', revenue: 11.35e9, segment: 'Cloud', confidence: 'confirmed', source: 'Alphabet 10-Q Q3 2024' },
      { date: '2024-12', revenue: 12.0e9, segment: 'Cloud', confidence: 'estimated', source: 'Alphabet 10-K FY2024 (est.)' },
      { date: '2025-03', revenue: 12.3e9, segment: 'Cloud', confidence: 'estimated', source: 'Earnings estimate' },
      { date: '2025-06', revenue: 13.0e9, segment: 'Cloud', confidence: 'estimated', source: 'Earnings estimate' },
      { date: '2025-09', revenue: 13.8e9, segment: 'Cloud', confidence: 'estimated', source: 'Earnings estimate' },
      { date: '2025-12', revenue: 14.5e9, segment: 'Cloud', confidence: 'estimated', source: 'Alphabet Q4 2025 earnings' },
    ],

    // Estimated AI-specific portion of Cloud revenue
    ai_revenue_estimate: {
      pct_of_cloud: { value: 0.30, confidence: 'speculative', source: 'Author estimate: AI contributing ~30% of Cloud growth' },
      cloud_annual_2025: { value: 53.6e9, confidence: 'estimated', source: 'Sum of quarterly Cloud revenue' },
      ai_attributed_2025: { value: 16e9, confidence: 'speculative', source: '~30% of Cloud revenue attributed to AI' },
    },

    revenue_decomposition: {
      cloud_ai_vertex: { pct: 0.40, label: 'Cloud AI / Vertex AI', confidence: 'speculative', source: 'Largest Cloud AI segment' },
      gemini_api: { pct: 0.15, label: 'Gemini API', confidence: 'speculative', source: 'Developer API consumption' },
      workspace_ai: { pct: 0.20, label: 'Workspace AI Add-ons', confidence: 'speculative', source: 'Google Workspace AI Premium' },
      google_one_ai: { pct: 0.10, label: 'Google One AI Premium', confidence: 'speculative', source: 'Gemini Advanced in Google One' },
      search_ai: { pct: 0.15, label: 'Search AI Impact', confidence: 'speculative', source: 'AI Overviews revenue uplift' },
    },

    key_metrics: {
      cloud_backlog: { value: 240e9, confidence: 'confirmed', source: 'Alphabet Q4 2025 earnings: $240B backlog' },
      total_capex_2025: { value: 91.4e9, confidence: 'confirmed', source: 'Alphabet 10-K' },
      capex_guidance_2026: { value: 180e9, confidence: 'confirmed', source: 'Alphabet guidance: $175-185B' },
      cloud_growth_yoy: { value: 0.30, confidence: 'estimated', source: 'Cloud segment growth rate' },
    },

    products: [
      { name: 'Google Cloud AI / Vertex AI', type: 'cloud', pricing: 'Consumption + committed', model: 'consumption' },
      { name: 'Gemini API', type: 'api', pricing: 'Per-token', model: 'consumption' },
      { name: 'Google One AI Premium', type: 'subscription', pricing: '$20/mo', model: 'subscription' },
      { name: 'Workspace AI Add-ons', type: 'subscription', pricing: '$21/user/mo', model: 'subscription' },
    ],
  },

  xai: {
    id: 'xai',
    name: 'xAI',
    shortName: 'Grok',
    color: '#EF4444',
    colorDim: 'rgba(239, 68, 68, 0.15)',
    type: 'private',

    valuation: { value: 230e9, date: '2026-03', confidence: 'estimated', source: 'SpaceX-xAI merger implies ~$230B for xAI' },
    total_raised: { value: 37e9, confidence: 'estimated', source: 'Cumulative funding, various reports' },
    employees: { value: 300, confidence: 'estimated', source: 'Various reports' },

    revenue_timeline: [
      { date: '2024-12', arr: 100e6, confidence: 'speculative', source: 'Author estimate from early-stage revenue' },
      { date: '2025-06', arr: 400e6, confidence: 'speculative', source: 'Reuters: expected $1B by EOY 2025; midpoint est.' },
      { date: '2025-12', arr: 1e9, confidence: 'estimated', source: 'Reuters: xAI expects $1B annual earnings by EOY 2025' },
      { date: '2026-03', arr: 1.5e9, confidence: 'speculative', source: 'Projected from trajectory' },
    ],

    revenue_decomposition: {
      supergrok: { pct: 0.40, label: 'SuperGrok Subscriptions', confidence: 'speculative', source: '$30/mo and $300/mo tiers' },
      x_premium: { pct: 0.25, label: 'X Premium+ (Grok portion)', confidence: 'speculative', source: 'Grok access via X Premium+ $40/mo' },
      api: { pct: 0.15, label: 'Grok API', confidence: 'speculative', source: 'Nascent developer API' },
      enterprise: { pct: 0.10, label: 'Enterprise/Business', confidence: 'speculative', source: 'Grok Business $30/seat/mo' },
      government: { pct: 0.10, label: 'Government Contracts', confidence: 'speculative', source: 'Grok for Government announced' },
    },

    key_metrics: {
      revenue_forecast_2025: { value: 1e9, confidence: 'estimated', source: 'Reuters early 2025' },
    },

    products: [
      { name: 'SuperGrok', type: 'subscription', pricing: '$30/mo (standard) / $300/mo (heavy)', model: 'subscription' },
      { name: 'X Premium+', type: 'subscription', pricing: '$40/mo (includes Grok)', model: 'subscription' },
      { name: 'Grok API', type: 'api', pricing: 'Per-token', model: 'consumption' },
      { name: 'Grok Business', type: 'subscription', pricing: '$30/seat/mo', model: 'subscription' },
      { name: 'Grok for Government', type: 'enterprise', pricing: 'Custom', model: 'enterprise' },
    ],
  },

  meta: {
    id: 'meta',
    name: 'Meta',
    shortName: 'Llama',
    color: '#8B5CF6',
    colorDim: 'rgba(139, 92, 246, 0.15)',
    type: 'public',

    market_cap: { value: 1.6e12, date: '2026-03', confidence: 'confirmed', source: 'META public market cap' },
    employees: { value: 74000, confidence: 'confirmed', source: 'Meta 10-K' },

    // Meta has no direct AI product revenue — AI drives ad engagement
    revenue_timeline: [
      { date: '2023-12', revenue: 134e9, segment: 'Total (Ads)', confidence: 'confirmed', source: 'Meta 10-K FY2023' },
      { date: '2024-12', revenue: 164e9, segment: 'Total (Ads)', confidence: 'confirmed', source: 'Meta 10-K FY2024' },
      { date: '2025-12', revenue: 196e9, segment: 'Total (Ads)', confidence: 'confirmed', source: 'Meta 10-K FY2025' },
    ],

    revenue_decomposition: {
      ai_ad_uplift: { pct: 0.05, label: 'AI-Driven Ad Revenue Uplift', confidence: 'speculative', source: 'Est. 5% of total ad revenue attributable to AI improvements' },
      meta_ai_engagement: { pct: 0, label: 'Meta AI (Free)', confidence: 'confirmed', source: 'Meta AI assistant is free, no direct revenue' },
    },

    key_metrics: {
      total_revenue_2025: { value: 196e9, confidence: 'confirmed', source: 'Meta 10-K' },
      ai_capex_2025: { value: 72.2e9, confidence: 'confirmed', source: 'Meta 10-K' },
      ai_capex_2026_guidance: { value: 125e9, confidence: 'confirmed', source: 'Meta guidance: $115-135B' },
      llama_downloads: { value: 600e6, confidence: 'estimated', source: 'Various reports' },
      ai_revenue_direct: { value: 0, confidence: 'confirmed', source: 'No direct AI product revenue' },
    },

    products: [
      { name: 'Meta AI', type: 'free', pricing: 'Free', model: 'ad-supported' },
      { name: 'Llama (Open Source)', type: 'open-source', pricing: 'Free / Custom licensing', model: 'ecosystem play' },
    ],
  },
};

export const REVENUE_PROVIDER_ORDER = ['anthropic', 'openai', 'google', 'xai', 'meta'];
export const REVENUE_PROVIDER_ORDER_NO_META = ['anthropic', 'openai', 'google', 'xai'];
