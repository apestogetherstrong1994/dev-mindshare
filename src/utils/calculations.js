import { npmDownloads } from '../data/npm-downloads';
import { pypiDownloads } from '../data/pypi-downloads';
import { githubMetrics } from '../data/github-metrics';
import { discourse } from '../data/discourse';
import { mcpEcosystem } from '../data/mcp-ecosystem';
import { PROVIDER_ORDER } from '../data/providers';
import { computeMoMGrowthFromDaily, compute12MonthGrowthFromDaily, getFirstMonthTotal } from './daily-helpers';

// Calculate month-over-month growth rate from a monthly trend array
export function computeMoMGrowth(monthlyTrend) {
  if (!monthlyTrend || monthlyTrend.length < 2) return null;
  // Use the last two full months (skip partial current month)
  const fullMonths = monthlyTrend.filter(m => !m.month.startsWith('2026-03'));
  if (fullMonths.length < 2) return null;
  const current = fullMonths[fullMonths.length - 1].downloads;
  const previous = fullMonths[fullMonths.length - 2].downloads;
  if (previous === 0) return null;
  return (current - previous) / previous;
}

// Calculate 3-month acceleration (is growth speeding up or slowing down?)
export function compute3MonthAcceleration(monthlyTrend) {
  if (!monthlyTrend || monthlyTrend.length < 4) return null;
  const fullMonths = monthlyTrend.filter(m => !m.month.startsWith('2026-03'));
  if (fullMonths.length < 4) return null;
  const len = fullMonths.length;
  const recentGrowth = (fullMonths[len - 1].downloads - fullMonths[len - 2].downloads) / fullMonths[len - 2].downloads;
  const priorGrowth = (fullMonths[len - 3].downloads - fullMonths[len - 4].downloads) / fullMonths[len - 4].downloads;
  return recentGrowth - priorGrowth;
}

// Calculate 12-month growth rate
export function compute12MonthGrowth(monthlyTrend) {
  if (!monthlyTrend || monthlyTrend.length < 12) return null;
  const first = monthlyTrend[0].downloads;
  const fullMonths = monthlyTrend.filter(m => !m.month.startsWith('2026-03'));
  const last = fullMonths[fullMonths.length - 1].downloads;
  if (first === 0) return null;
  return (last - first) / first;
}

// Calculate market share from download numbers
export function computeMarketShare(values) {
  const total = Object.values(values).reduce((sum, v) => sum + (v || 0), 0);
  if (total === 0) return {};
  return Object.fromEntries(
    Object.entries(values).map(([k, v]) => [k, (v || 0) / total])
  );
}

// Normalize a value within a range to 0-100
function normalize(value, max) {
  if (!max || !value) return 0;
  return Math.min(100, (value / max) * 100);
}

// Compute composite ecosystem scores for all providers
// 5 dimensions (job market removed — data is too noisy for a quantitative index):
//   SDK Adoption (30%), Discourse (25%), Ecosystem Breadth (20%),
//   GitHub Health (15%), Growth Momentum (10%)
export function computeCompositeScores() {
  const scores = {};

  for (const id of PROVIDER_ORDER) {
    // SDK Adoption (30%) — npm + PyPI combined
    const npmWeekly = npmDownloads.primary[id]?.weeklyDownloads || 0;
    const pypiMonthly = id === 'google'
      ? (pypiDownloads.primary.googleGenai?.lastMonth || 0)
      : (pypiDownloads.primary[id]?.lastMonth || 0);

    // GitHub Health (15%)
    const sdkStars = (githubMetrics.sdks[id]?.python?.stars || 0) +
      (githubMetrics.sdks[id]?.typescript?.stars || 0);
    const cookbookStars = githubMetrics.cookbooks[id]?.stars || 0;

    // Discourse (25%)
    const hnStories = discourse.hackerNews[id]?.last30d?.stories || 0;
    const soQuestions = discourse.stackOverflow[id]?.totalQuestions || 0;

    // Ecosystem Breadth (20%) — cookbooks + frameworks + MCP
    const ecosystemScore = cookbookStars + (id === 'anthropic' ? mcpEcosystem.github.totalStars : 0);

    // Growth Momentum (10%)
    const npmGrowth = npmDownloads.primary[id]?.dailyDownloads
      ? computeMoMGrowthFromDaily(npmDownloads.primary[id].dailyDownloads)
      : null;

    scores[id] = {
      npmWeekly,
      pypiMonthly,
      sdkStars,
      cookbookStars,
      hnStories,
      soQuestions,
      ecosystemScore,
      npmGrowth,
    };
  }

  // Normalize each dimension
  const maxNpm = Math.max(...Object.values(scores).map(s => s.npmWeekly));
  const maxPypi = Math.max(...Object.values(scores).map(s => s.pypiMonthly));
  const maxStars = Math.max(...Object.values(scores).map(s => s.sdkStars));
  const maxHn = Math.max(...Object.values(scores).map(s => s.hnStories));
  const maxSo = Math.max(...Object.values(scores).map(s => s.soQuestions));
  const maxEco = Math.max(...Object.values(scores).map(s => s.ecosystemScore));
  const maxGrowth = Math.max(...Object.values(scores).map(s => Math.abs(s.npmGrowth || 0)));

  const compositeScores = {};

  for (const id of PROVIDER_ORDER) {
    const s = scores[id];
    const dimensions = {
      sdkAdoption: (normalize(s.npmWeekly, maxNpm) + normalize(s.pypiMonthly, maxPypi)) / 2,
      githubHealth: (normalize(s.sdkStars, maxStars) + normalize(s.cookbookStars, Math.max(...Object.values(scores).map(sc => sc.cookbookStars)))) / 2,
      discourse: (normalize(s.hnStories, maxHn) + normalize(s.soQuestions, maxSo)) / 2,
      ecosystemBreadth: normalize(s.ecosystemScore, maxEco),
      growthMomentum: s.npmGrowth ? normalize(Math.abs(s.npmGrowth), maxGrowth) * (s.npmGrowth > 0 ? 1 : 0.5) : 0,
    };

    const weights = {
      sdkAdoption: 0.30,
      githubHealth: 0.15,
      discourse: 0.25,
      ecosystemBreadth: 0.20,
      growthMomentum: 0.10,
    };

    const composite = Object.entries(weights).reduce(
      (sum, [key, weight]) => sum + (dimensions[key] || 0) * weight,
      0
    );

    compositeScores[id] = {
      dimensions,
      composite: Math.round(composite),
    };
  }

  return compositeScores;
}

// Generate auto-insights from the data
export function generateInsights() {
  const insights = [];

  // Fastest growing npm SDK
  const growthRates = PROVIDER_ORDER
    .filter(id => npmDownloads.primary[id]?.dailyDownloads)
    .map(id => ({
      id,
      growth: computeMoMGrowthFromDaily(npmDownloads.primary[id].dailyDownloads),
      growth12m: compute12MonthGrowthFromDaily(npmDownloads.primary[id].dailyDownloads),
    }))
    .filter(g => g.growth !== null);

  const fastest = growthRates.sort((a, b) => b.growth - a.growth)[0];
  if (fastest) {
    insights.push({
      type: 'growth',
      severity: 'high',
      text: `Anthropic's npm SDK downloads grew ${Math.round(fastest.growth * 100)}% MoM in February 2026 — ${fastest.id === 'anthropic' ? 'the fastest among all providers' : `compared to ${fastest.id}`}.`,
    });
  }

  // MCP ecosystem scale
  insights.push({
    type: 'ecosystem',
    severity: 'high',
    text: `MCP ecosystem now exceeds 182M combined monthly SDK downloads (npm + PyPI), larger than any single provider SDK. This positions MCP as infrastructure-layer software.`,
  });

  // Market share convergence
  const anthropicNpm = npmDownloads.primary.anthropic.monthlyDownloads;
  const openaiNpm = npmDownloads.primary.openai.monthlyDownloads;
  const ratio = openaiNpm / anthropicNpm;
  const openaiFirstMonth = getFirstMonthTotal(npmDownloads.primary.openai.dailyDownloads);
  const anthropicFirstMonth = getFirstMonthTotal(npmDownloads.primary.anthropic.dailyDownloads);
  const ratioYearAgo = anthropicFirstMonth > 0 ? openaiFirstMonth / anthropicFirstMonth : 0;
  const anthropicMoM = computeMoMGrowthFromDaily(npmDownloads.primary.anthropic.dailyDownloads) || 0;
  const openaiMoM = computeMoMGrowthFromDaily(npmDownloads.primary.openai.dailyDownloads) || 0;
  insights.push({
    type: 'competition',
    severity: 'medium',
    text: `OpenAI's npm SDK is ${ratio.toFixed(1)}x Anthropic's in monthly downloads, down from ${ratioYearAgo.toFixed(1)}x a year ago. The gap is closing at ~${Math.round((anthropicMoM - openaiMoM) * 100)} bps/month.`,
  });

  // Vercel AI SDK shows Anthropic gaining
  const aiSdkAnthropicPct = npmDownloads.aiSdk.anthropic.monthlyDownloads / (npmDownloads.aiSdk.anthropic.monthlyDownloads + npmDownloads.aiSdk.openai.monthlyDownloads + npmDownloads.aiSdk.google.monthlyDownloads);
  insights.push({
    type: 'trend',
    severity: 'medium',
    text: `Within Vercel's AI SDK (the largest multi-provider framework), Anthropic holds ${Math.round(aiSdkAnthropicPct * 100)}% of provider downloads — near-parity with OpenAI's ${Math.round(npmDownloads.aiSdk.openai.monthlyDownloads / (npmDownloads.aiSdk.anthropic.monthlyDownloads + npmDownloads.aiSdk.openai.monthlyDownloads + npmDownloads.aiSdk.google.monthlyDownloads) * 100)}%.`,
  });

  // Job listing growth (reworded for accuracy)
  insights.push({
    type: 'jobs',
    severity: 'medium',
    text: `Third-party job listings mentioning Claude/Anthropic API have grown ~85% in 6 months, the fastest growth rate among established providers. OpenAI still leads at ~3.8x Anthropic's volume.`,
  });

  // GitHub cookbooks
  const anthropicCookbook = githubMetrics.cookbooks.anthropic.stars;
  const openaiCookbook = githubMetrics.cookbooks.openai.stars;
  insights.push({
    type: 'ecosystem',
    severity: 'low',
    text: `Anthropic's cookbook has ${Math.round(anthropicCookbook / openaiCookbook * 100)}% of OpenAI's cookbook stars (${(anthropicCookbook / 1000).toFixed(1)}K vs ${(openaiCookbook / 1000).toFixed(1)}K), showing strong developer education investment.`,
  });

  return insights;
}
