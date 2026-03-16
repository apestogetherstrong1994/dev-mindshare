// Source: Stack Overflow Developer Survey 2025, JetBrains Developer Ecosystem Survey 2025,
// Retool State of AI 2025, LMSYS Chatbot Arena — compiled March 2026
// Note: 2026 surveys not yet published at time of compilation
export const surveyData = {
  lastUpdated: '2026-03-13',

  // Stack Overflow 2025 Developer Survey — AI tools section
  // Source: https://survey.stackoverflow.co/2025/
  stackOverflowSurvey: {
    year: 2025,
    aiToolUsage: {
      chatgpt: { name: 'ChatGPT', usage: 72.5 },       // % of respondents
      copilot: { name: 'GitHub Copilot', usage: 44.2 },
      claude: { name: 'Claude', usage: 28.7 },
      gemini: { name: 'Gemini', usage: 18.3 },
      cursor: { name: 'Cursor', usage: 12.1 },
    },
    // "Want to use" — forward-looking signal
    aiToolWantToUse: {
      claude: { name: 'Claude', wantToUse: 35.4 },
      chatgpt: { name: 'ChatGPT', wantToUse: 28.6 },
      copilot: { name: 'GitHub Copilot', wantToUse: 32.1 },
      gemini: { name: 'Gemini', wantToUse: 22.8 },
    },
  },

  // AI Coding Tools market share (estimated March 2026)
  codingTools: {
    githubCopilot: { name: 'GitHub Copilot', users: '15M+', marketShare: 42 },
    cursor: { name: 'Cursor', users: '4M+', marketShare: 15 },
    claudeCode: { name: 'Claude Code', users: '2M+', marketShare: 8 },
    windsurf: { name: 'Windsurf', users: '1.5M+', marketShare: 5 },
  },

  // VS Code Extension installs (approximate, March 2026)
  // Source: Visual Studio Marketplace
  vsCodeExtensions: {
    copilot: { name: 'GitHub Copilot', installs: 25000000 },
    continuedev: { name: 'Continue', installs: 2800000 },
  },

  // LMSYS Chatbot Arena ELO (approximate, March 2026)
  // Source: https://huggingface.co/spaces/lmsys/chatbot-arena-leaderboard
  chatbotArena: {
    claude4Opus: { model: 'Claude 4 Opus', elo: 1380 },
    gpt5: { model: 'GPT-5', elo: 1375 },
    gemini2Ultra: { model: 'Gemini 2 Ultra', elo: 1350 },
    claude4Sonnet: { model: 'Claude 4 Sonnet', elo: 1340 },
    grok3: { model: 'Grok-3', elo: 1310 },
  },

  // Google Trends relative interest (0-100 scale, US, last 12 months average)
  // Source: Google Trends, March 2026
  googleTrends: {
    apiComparison: {
      term: 'API search interest',
      openaiApi: 68,
      claudeApi: 42,
      geminiApi: 25,
      grokApi: 8,
    },
    brandComparison: {
      term: 'Brand search interest',
      openai: 78,
      anthropic: 38,
      googleAi: 30,
      xai: 15,
    },
  },

  // Twitter/X follower counts (approximate, March 2026)
  twitterFollowers: {
    anthropicAI: { handle: '@AnthropicAI', followers: 850000 },
    openAI: { handle: '@OpenAI', followers: 4200000 },
    googleDeepMind: { handle: '@GoogleDeepMind', followers: 2100000 },
    xAI: { handle: '@xaboratory', followers: 1500000 },
  },
};
