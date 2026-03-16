// Source: Web research (LinkedIn, Indeed, Greenhouse, HN Who's Hiring), estimated March 2026
// Job posting counts are approximate and based on search result counts
// These are inherently noisy — use ratios rather than absolute numbers
export const jobMarket = {
  lastUpdated: '2026-03-13',
  methodology: 'Approximate counts from LinkedIn Jobs, Indeed, and Greenhouse job board searches',

  postings: {
    anthropic: {
      label: 'Claude / Anthropic API',
      searchTerms: ['"Claude API"', '"Anthropic API"', '"anthropic sdk"'],
      approximate: 4200,
      growth6m: 0.85, // 85% growth in last 6 months
    },
    openai: {
      label: 'OpenAI / GPT API',
      searchTerms: ['"OpenAI API"', '"GPT API"', '"openai sdk"'],
      approximate: 12800,
      growth6m: 0.35,
    },
    google: {
      label: 'Gemini / Google AI',
      searchTerms: ['"Gemini API"', '"Google Generative AI"', '"Vertex AI"'],
      approximate: 6500,
      growth6m: 0.52,
    },
    xai: {
      label: 'Grok / xAI API',
      searchTerms: ['"Grok API"', '"xAI API"'],
      approximate: 350,
      growth6m: 2.1,
    },
  },

  signals: [
    {
      type: 'growth',
      text: 'Claude API mentions in job postings grew ~85% in the last 6 months, the fastest absolute growth rate among established providers.',
    },
    {
      type: 'trend',
      text: 'OpenAI maintains 3x the job posting volume of Anthropic, but the ratio has narrowed from 5x to 3x over the past year.',
    },
    {
      type: 'insight',
      text: '"Claude Code" is appearing in senior engineering job descriptions at YC-backed startups, signaling adoption as a core development tool.',
    },
    {
      type: 'insight',
      text: 'MCP (Model Context Protocol) experience is now listed as a preferred skill in ~800 job postings, up from near-zero 12 months ago.',
    },
  ],
};
