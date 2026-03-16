// Sources: HN Algolia API, Stack Exchange API, Reddit JSON API — fetched 2026-03-13
//
// HN search terms used:
//   anthropic: "anthropic" OR "claude ai" OR "claude api"
//   openai: "openai"
//   google: "gemini ai" OR "google ai"
//   xai: "grok xai" OR "xai"
//
// Notes:
//   - HN monthly stories are the sum of nbHits across each provider's search queries.
//   - HN last30d avgPoints and totalPoints/totalComments are computed from the first
//     page of results (up to 50 hits) returned by the API for each query.
//   - Reddit active_user_count is null because the unauthenticated JSON endpoint
//     does not reliably return this field.
//   - Stack Overflow "anthropic" tag has very few questions; most Claude-related
//     questions use other tags.

export const discourse = {
  lastUpdated: '2026-03-13',

  hackerNews: {
    anthropic: {
      last30d: { stories: 2190, totalPoints: 13481, totalComments: 8785, avgPoints: 89.9 },
      monthlyTrend: [
        { month: '2026-01', stories: 820 },
        { month: '2026-02', stories: 1706 },
        { month: '2026-03', stories: 1024 },
      ],
    },
    openai: {
      last30d: { stories: 938, totalPoints: 11638, totalComments: 6376, avgPoints: 232.8 },
      monthlyTrend: [
        { month: '2026-01', stories: 487 },
        { month: '2026-02', stories: 751 },
        { month: '2026-03', stories: 406 },
      ],
    },
    google: {
      last30d: { stories: 707, totalPoints: 2134, totalComments: 1740, avgPoints: 21.3 },
      monthlyTrend: [
        { month: '2026-01', stories: 476 },
        { month: '2026-02', stories: 572 },
        { month: '2026-03', stories: 320 },
      ],
    },
    xai: {
      last30d: { stories: 8763, totalPoints: 982, totalComments: 252, avgPoints: 9.8 },
      monthlyTrend: [
        { month: '2026-01', stories: 5904 },
        { month: '2026-02', stories: 7676 },
        { month: '2026-03', stories: 3762 },
      ],
    },
  },

  stackOverflow: {
    anthropic: { tag: 'anthropic', totalQuestions: 2, last30d: 1 },
    openai: { tag: 'openai-api', totalQuestions: 2598, last30d: 4 },
    google: { tag: 'google-gemini', totalQuestions: 389, last30d: 7 },
    langchain: { tag: 'langchain', totalQuestions: 2004, last30d: 9 },
  },

  reddit: {
    claudeAI: { subreddit: 'ClaudeAI', subscribers: 598812, activeUsers: null },
    openAI: { subreddit: 'OpenAI', subscribers: 2676717, activeUsers: null },
    chatGPT: { subreddit: 'ChatGPT', subscribers: 11404193, activeUsers: null },
    gemini: { subreddit: 'GoogleGeminiAI', subscribers: 129350, activeUsers: null },
    localLLaMA: { subreddit: 'LocalLLaMA', subscribers: 650288, activeUsers: null },
  },
};
