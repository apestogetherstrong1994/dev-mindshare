// Sources: HN Algolia API, Stack Exchange API, Reddit JSON API — fetched 2026-03-17
//
// HN search terms (each queried individually, counts summed with overlap possible):
//   anthropic: "anthropic" + "claude ai" + "claude code" + "claude sonnet"
//   openai: "openai" + "chatgpt" + "gpt-4"
//   google: "gemini ai" + "google gemini" + "gemini pro"
//   Note: "claude" alone is too noisy (matches people named Claude, Claude Shannon, etc.)
//   Note: "google ai" is too broad (matches any Google AI story, not just Gemini)
//   Note: "gpt 4" / "gpt 5" with spaces are noisy (Algolia OR-matches each word)
//   Note: xAI excluded — "xai" matches unrelated terms on HN
//
// SO: Tags are deduplicated. openai/chatgpt/chat-gpt are synonyms of openai-api.
//   The "gemini" tag (34 questions) is for Countersoft bug-tracker, NOT Google Gemini — excluded.
//   Claude questions searched via both tags (claude + anthropic) and title search.
//
// Reddit: Subscriber counts from public /about.json endpoint.
//   r/Gemini (47K) is the crypto exchange, NOT Google AI — excluded.
//   r/ClaudeDev (218) is a dead redirect to old Cline subreddit — excluded.
//   r/Bard (138K) is Google's old chatbot name, now titled "r/Gemini" — included under Google general.

export const discourse = {
  lastUpdated: '2026-03-17',

  hackerNews: {
    // Search terms: "anthropic" + "claude ai" + "claude code" + "claude sonnet"
    anthropic: {
      searchTerms: ['anthropic', 'claude ai', 'claude code', 'claude sonnet'],
      last30d: { stories: 2190, totalPoints: 13481, totalComments: 8785, avgPoints: 89.9 },
      monthlyTrend: [
        { month: '2026-01', stories: 154 },  // 61 + 50 + 24 + 19
        { month: '2026-02', stories: 176 },  // 69 + 49 + 37 + 20 (note: some overlap possible)
        { month: '2026-03', stories: 213 },  // 58 + 55 + 71 + 21 (partial month, claude code surging)
      ],
    },
    // Search terms: "openai" + "chatgpt" + "gpt-4"
    openai: {
      searchTerms: ['openai', 'chatgpt', 'gpt-4'],
      last30d: { stories: 938, totalPoints: 11638, totalComments: 6376, avgPoints: 232.8 },
      monthlyTrend: [
        { month: '2026-01', stories: 792 },  // 412 + 330 + 50
        { month: '2026-02', stories: 704 },  // 381 + 260 + 63
        { month: '2026-03', stories: 425 },  // 206 + 175 + 44 (partial month)
      ],
    },
    // Search terms: "gemini ai" + "google gemini" + "gemini pro"
    google: {
      searchTerms: ['gemini ai', 'google gemini', 'gemini pro'],
      last30d: { stories: 707, totalPoints: 2134, totalComments: 1740, avgPoints: 21.3 },
      monthlyTrend: [
        { month: '2026-01', stories: 96 },   // 34 + 37 + 25
        { month: '2026-02', stories: 139 },  // 55 + 42 + 42
        { month: '2026-03', stories: 94 },   // 30 + 37 + 27 (partial month)
      ],
    },
  },

  stackOverflow: {
    // Tags: claude (127) + claude-code (28) + mcp-server (17) + anthropic (11) + sonnet (8) + mcps (4) + mcp-client (2) + python-anthropic (1) + mcpo (1) = 199
    // Upper bound — some questions carry multiple tags
    // Excluded: opus (402, audio codec), haiku (13, Haiku OS), dm-haiku (4, DeepMind JAX lib)
    anthropic: {
      tags: ['claude', 'claude-code', 'mcp-server', 'anthropic', 'sonnet', 'mcps', 'mcp-client', 'python-anthropic', 'mcpo'],
      totalQuestions: 199,
      breakdown: { claude: 127, 'claude-code': 28, 'mcp-server': 17, anthropic: 11, sonnet: 8, mcps: 4, 'mcp-client': 2, 'python-anthropic': 1, mcpo: 1 },
      note: 'opus tag (402 Qs) is audio codec, haiku tag (13 Qs) is Haiku OS — both excluded. Upper bound due to possible multi-tag overlap.',
    },
    // Tags: openai-api (2895, includes openai/chatgpt/chat-gpt synonyms) + chatgpt-api (557) + gpt-3 (291) + openai-whisper (286) + gpt-4 (151) + chatgpt-plugin (18) + chatgpt-function-call (16) + gpt-5 (4) = 4218
    // Upper bound — some questions carry multiple tags
    openai: {
      tags: ['openai-api', 'chatgpt-api', 'gpt-3', 'openai-whisper', 'gpt-4', 'chatgpt-plugin', 'chatgpt-function-call', 'gpt-5'],
      totalQuestions: 4218,
      breakdown: { 'openai-api': 2895, 'chatgpt-api': 557, 'gpt-3': 291, 'openai-whisper': 286, 'gpt-4': 151, 'chatgpt-plugin': 18, 'chatgpt-function-call': 16, 'gpt-5': 4 },
      note: 'openai, chatgpt, chat-gpt are synonyms of openai-api (same 2895 questions). Upper bound due to possible multi-tag overlap.',
    },
    // Tags: google-gemini (470) + google-gemini-file-api (17) + palm-api (18) + google-cloud-aiplatform (13) + gemini-cli (5) + google-gemini-context-caching (3) + gemini-code-assist (2) = 528
    // "gemini" tag (34) is Countersoft bug-tracker — excluded
    google: {
      tags: ['google-gemini', 'palm-api', 'google-gemini-file-api', 'google-cloud-aiplatform', 'gemini-cli', 'google-gemini-context-caching', 'gemini-code-assist'],
      totalQuestions: 528,
      breakdown: { 'google-gemini': 470, 'palm-api': 18, 'google-gemini-file-api': 17, 'google-cloud-aiplatform': 13, 'gemini-cli': 5, 'google-gemini-context-caching': 3, 'gemini-code-assist': 2 },
      note: 'The "gemini" tag (34 questions) is for Countersoft bug-tracking software, not Google Gemini AI.',
    },
    // Tags: langchain (2189) + langchain-js (64)
    langchain: {
      tags: ['langchain', 'langchain-js'],
      totalQuestions: 2253,
      breakdown: { langchain: 2189, 'langchain-js': 64 },
    },
  },

  reddit: {
    // General/consumer communities
    general: {
      anthropic: [
        { subreddit: 'ClaudeAI', subscribers: 619071 },
        { subreddit: 'Anthropic', subscribers: 105233 },
        { subreddit: 'Claude', subscribers: 44486 },
      ],
      openai: [
        { subreddit: 'ChatGPT', subscribers: 11409482 },
        { subreddit: 'OpenAI', subscribers: 2680655 },
        { subreddit: 'ChatGPTPlus', subscribers: 15252 },
      ],
      google: [
        { subreddit: 'GeminiAI', subscribers: 265848 },
        { subreddit: 'Bard', subscribers: 138531 },  // Now titled "r/Gemini" — old chatbot name
        { subreddit: 'GoogleGeminiAI', subscribers: 130318 },
      ],
      xai: [
        { subreddit: 'grok', subscribers: 170522 },
      ],
    },
    // Developer-focused communities
    developer: {
      anthropic: [
        { subreddit: 'ClaudeCode', subscribers: 161575 },
      ],
      openai: [
        { subreddit: 'ChatGPTCoding', subscribers: 364156 },
        { subreddit: 'OpenAIDev', subscribers: 13990 },
      ],
      google: [
        // No active developer subreddit — r/GeminiCL, r/GeminiDev, r/GoogleAIDev all 404
      ],
      xai: [],
    },
    // Reference communities (not provider-specific)
    reference: [
      { subreddit: 'LocalLLaMA', subscribers: 654615 },
      { subreddit: 'LLMDevs', subscribers: 137311 },
      { subreddit: 'Cursor', subscribers: 127501 },
      { subreddit: 'Ollama', subscribers: 105624 },
      { subreddit: 'LangChain', subscribers: 90643 },
    ],
  },
};
