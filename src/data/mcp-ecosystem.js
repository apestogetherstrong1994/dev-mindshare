// Source: npm registry, PyPI stats, GitHub API — fetched 2026-03-13
// MCP (Model Context Protocol) is Anthropic's developer platform play
export const mcpEcosystem = {
  lastUpdated: '2026-03-13',

  // Combined npm + PyPI SDK downloads
  totalMonthlyDownloads: 182496786, // 71.6M npm + 110.8M PyPI (Feb 2026)
  npmMonthly: 71656771,  // @modelcontextprotocol/sdk
  pypiMonthly: 110840015, // mcp (Python)

  // Monthly trend (npm @modelcontextprotocol/sdk)
  npmMonthlyTrend: [
    { month: '2025-03', downloads: 1874545 },
    { month: '2025-04', downloads: 4212709 },
    { month: '2025-05', downloads: 20933359 },
    { month: '2025-06', downloads: 16837593 },
    { month: '2025-07', downloads: 21605761 },
    { month: '2025-08', downloads: 24658353 },
    { month: '2025-09', downloads: 31258519 },
    { month: '2025-10', downloads: 31805028 },
    { month: '2025-11', downloads: 35008987 },
    { month: '2025-12', downloads: 38516712 },
    { month: '2026-01', downloads: 50249918 },
    { month: '2026-02', downloads: 71656771 },
  ],

  // GitHub ecosystem
  github: {
    servers: { stars: 80980, forks: 9884 },
    pythonSdk: { stars: 22119, forks: 3176 },
    typescriptSdk: { stars: 11834, forks: 1679 },
    totalStars: 114933,
  },

  // Registered MCP servers (from modelcontextprotocol/servers repo)
  registeredServers: 150, // Approximate count of listed servers in the registry

  // Major adopters of MCP protocol
  adopters: [
    'OpenAI',
    'Google (Gemini)',
    'Microsoft (VS Code, GitHub Copilot)',
    'Amazon (AWS)',
    'JetBrains',
    'Cursor',
    'Sourcegraph',
    'Replit',
    'Block (Square)',
    'Cloudflare',
  ],

  // Key milestones
  milestones: [
    { date: '2024-11', event: 'MCP specification publicly released by Anthropic' },
    { date: '2025-03', event: 'OpenAI announces MCP support' },
    { date: '2025-05', event: 'npm SDK downloads cross 20M/month' },
    { date: '2025-09', event: 'Google and Microsoft adopt MCP' },
    { date: '2026-02', event: 'Combined SDK downloads exceed 180M/month' },
  ],
};
