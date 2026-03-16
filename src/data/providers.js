export const PROVIDERS = {
  anthropic: {
    name: 'Anthropic',
    shortName: 'Claude',
    color: '#D4A574',
    colorDim: 'rgba(212, 165, 116, 0.15)',
    sdk: { npm: '@anthropic-ai/sdk', pypi: 'anthropic' },
    github: { python: 'anthropics/anthropic-sdk-python', ts: 'anthropics/anthropic-sdk-typescript' },
  },
  openai: {
    name: 'OpenAI',
    shortName: 'GPT',
    color: '#10B981',
    colorDim: 'rgba(16, 185, 129, 0.15)',
    sdk: { npm: 'openai', pypi: 'openai' },
    github: { python: 'openai/openai-python', ts: 'openai/openai-node' },
  },
  google: {
    name: 'Google',
    shortName: 'Gemini',
    color: '#4285F4',
    colorDim: 'rgba(66, 133, 244, 0.15)',
    sdk: { npm: '@google/generative-ai', pypi: 'google-generativeai' },
    github: { python: 'google-gemini/generative-ai-python', ts: 'google-gemini/generative-ai-js' },
  },
  xai: {
    name: 'xAI',
    shortName: 'Grok',
    color: '#EF4444',
    colorDim: 'rgba(239, 68, 68, 0.15)',
    sdk: { npm: null, pypi: null },
    github: { python: null, ts: null },
  },
};

export const PROVIDER_ORDER = ['anthropic', 'openai', 'google', 'xai'];
export const PROVIDER_COLORS = Object.fromEntries(
  Object.entries(PROVIDERS).map(([k, v]) => [k, v.color])
);
