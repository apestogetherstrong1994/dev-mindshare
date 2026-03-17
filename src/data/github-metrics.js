// Source: GitHub API (api.github.com), fetched 2026-03-17
// Note: google-gemini/generative-ai-python and google-gemini/generative-ai-js repos have been
// renamed to deprecated-generative-ai-python and deprecated-generative-ai-js respectively.
// Google's active Python SDK is now googleapis/python-genai.
// Note: anthropics/anthropic-cookbook has been renamed to anthropics/claude-cookbooks.
export const githubMetrics = {
  lastUpdated: '2026-03-17',
  sdks: {
    anthropic: {
      python: { repo: 'anthropics/anthropic-sdk-python', stars: 2965, forks: 528, openIssues: 148, watchers: 181 },
      typescript: { repo: 'anthropics/anthropic-sdk-typescript', stars: 1727, forks: 249, openIssues: 109, watchers: 166 },
    },
    openai: {
      python: { repo: 'openai/openai-python', stars: 30279, forks: 4639, openIssues: 333, watchers: 348 },
      typescript: { repo: 'openai/openai-node', stars: 10740, forks: 1429, openIssues: 160, watchers: 155 },
    },
    google: {
      python: { repo: 'googleapis/python-genai', stars: 3505, forks: 795, openIssues: 412, watchers: 35 },
      pythonDeprecated: { repo: 'google-gemini/deprecated-generative-ai-python', stars: 2267, forks: 493, openIssues: 95, watchers: 35 },
      typescript: { repo: 'google-gemini/deprecated-generative-ai-js', stars: 1239, forks: 323, openIssues: 104, watchers: 30 },
    },
  },
  cookbooks: {
    anthropic: { repo: 'anthropics/claude-cookbooks', stars: 35204, forks: 3741 },
    openai: { repo: 'openai/openai-cookbook', stars: 72181, forks: 12158 },
    google: { repo: 'google-gemini/cookbook', stars: 16770, forks: 2534 },
  },
  courses: {
    anthropic: { repo: 'anthropics/courses', stars: 19540, forks: 1910 },
  },
  mcp: {
    servers: { repo: 'modelcontextprotocol/servers', stars: 81339, forks: 9944, openIssues: 521 },
    pythonSdk: { repo: 'modelcontextprotocol/python-sdk', stars: 22188, forks: 3184 },
    typescriptSdk: { repo: 'modelcontextprotocol/typescript-sdk', stars: 11870, forks: 1686 },
  },
  frameworks: {
    vercelAi: { repo: 'vercel/ai', stars: 22720, forks: 4003 },
    langchainJs: { repo: 'langchain-ai/langchainjs', stars: 17237, forks: 3070 },
    litellm: { repo: 'BerriAI/litellm', stars: 39406, forks: 6470 },
  },
};
