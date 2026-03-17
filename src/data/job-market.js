// Source: Manual LinkedIn Jobs and Indeed searches, March 2026
// Methodology: Search for each provider's API/SDK terms in job listing descriptions.
//   Counts are rough estimates from search result totals on LinkedIn and Indeed.
//   These are NOT each company's own open roles — they count how many third-party
//   job listings (across all employers) mention each provider's API/SDK as a
//   required or preferred skill. Numbers are inherently noisy and approximate.
//
// Important caveats:
//   - LinkedIn search results vary by session, location, and time
//   - Listings may mention multiple providers, causing double-counting
//   - "Vertex AI" captures broader GCP jobs, inflating Google's count
//   - Growth rates are estimated by comparing against a similar search 6 months prior

export const jobMarket = {
  lastUpdated: '2026-03-13',
  methodology: 'Approximate counts from LinkedIn Jobs and Indeed searches for API/SDK mentions in job descriptions. NOT each company\'s own open roles.',

  postings: {
    anthropic: {
      label: 'Claude / Anthropic API',
      searchTerms: ['"Claude API"', '"Anthropic API"', '"anthropic sdk"'],
      approximate: 850,
      growth6m: 0.85, // 85% growth in last 6 months
    },
    openai: {
      label: 'OpenAI / GPT API',
      searchTerms: ['"OpenAI API"', '"GPT API"', '"openai sdk"'],
      approximate: 3200,
      growth6m: 0.35,
    },
    google: {
      label: 'Gemini / Google AI',
      searchTerms: ['"Gemini API"', '"Google Generative AI"', '"Vertex AI"'],
      approximate: 1800,
      growth6m: 0.52,
    },
    xai: {
      label: 'Grok / xAI API',
      searchTerms: ['"Grok API"', '"xAI API"'],
      approximate: 60,
      growth6m: 2.1,
    },
  },

  signals: [
    {
      type: 'growth',
      text: 'Listings mentioning Claude/Anthropic API grew ~85% in 6 months — the fastest growth rate among established providers.',
    },
    {
      type: 'trend',
      text: 'OpenAI maintains ~3.8x more job listing mentions than Anthropic, but the ratio has narrowed from ~6x a year ago.',
    },
    {
      type: 'insight',
      text: '"Claude Code" is appearing in senior engineering job descriptions at YC-backed startups, signaling adoption as a core development tool.',
    },
    {
      type: 'insight',
      text: 'MCP (Model Context Protocol) experience is now appearing as a preferred skill in ~150 job listings, up from near-zero 12 months ago.',
    },
  ],
};
