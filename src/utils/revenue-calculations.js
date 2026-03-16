import { REVENUE_COMPANIES } from '../data/revenue/companies';

// Generate quarterly labels from a start quarter
function quarterLabel(year, quarter) {
  return `Q${quarter} ${year}`;
}

// Get the last known ARR for a company
function getLatestArr(company) {
  const timeline = company.revenue_timeline;
  if (!timeline || timeline.length === 0) return 0;
  const last = timeline[timeline.length - 1];
  return last.arr || last.revenue * 4 || 0;
}

// Project revenue forward for a single company
function projectCompany(companyId, latestArr, growthRate, quarters) {
  const points = [];
  const quarterlyGrowth = Math.pow(1 + growthRate, 0.25); // Convert YoY to quarterly

  for (let q = 1; q <= quarters; q++) {
    const projected = latestArr * Math.pow(quarterlyGrowth, q);
    // Simple confidence band: ±20% widening over time
    const bandWidth = 0.10 * q;
    points.push({
      quarter: q,
      companyId,
      arr: projected,
      arrHigh: projected * (1 + bandWidth),
      arrLow: projected * (1 - bandWidth),
      confidence: 'projected',
    });
  }
  return points;
}

// Main projection engine
export function computeProjections(assumptions) {
  const companies = REVENUE_COMPANIES;
  const quarters = assumptions.projection_quarters;

  const growthRates = {
    anthropic: assumptions.anthropic_growth_rate,
    openai: assumptions.openai_growth_rate,
    google: assumptions.google_cloud_ai_growth,
    xai: assumptions.xai_growth_rate,
  };

  const projections = {};

  for (const [id, rate] of Object.entries(growthRates)) {
    const company = companies[id];
    if (!company) continue;
    const latestArr = getLatestArr(company);
    projections[id] = projectCompany(id, latestArr, rate, quarters);
  }

  return projections;
}

// Build chart data combining historical + projected
export function buildTrajectoryData(assumptions) {
  const companies = REVENUE_COMPANIES;
  const projections = computeProjections(assumptions);

  // Collect all unique dates from all companies' timelines
  const allDates = new Set();
  for (const company of Object.values(companies)) {
    if (!company.revenue_timeline) continue;
    for (const point of company.revenue_timeline) {
      allDates.add(point.date);
    }
  }

  // Sort dates chronologically
  const sortedDates = [...allDates].sort();

  // Build historical data points
  const historical = sortedDates.map(date => {
    const point = { date, type: 'historical' };
    for (const [id, company] of Object.entries(companies)) {
      if (!company.revenue_timeline) continue;
      const match = company.revenue_timeline.find(p => p.date === date);
      if (match) {
        point[id] = match.arr || (match.revenue ? match.revenue * 4 : null);
        point[`${id}_confidence`] = match.confidence;
      }
    }
    return point;
  });

  // Build projected data points
  const lastDate = sortedDates[sortedDates.length - 1];
  const [lastYear, lastMonth] = lastDate.split('-').map(Number);
  const projected = [];

  const maxQuarters = assumptions.projection_quarters;
  for (let q = 1; q <= maxQuarters; q++) {
    let month = lastMonth + q * 3;
    let year = lastYear + Math.floor((month - 1) / 12);
    month = ((month - 1) % 12) + 1;
    const dateStr = `${year}-${String(month).padStart(2, '0')}`;

    const point = { date: dateStr, type: 'projected' };
    for (const [id, points] of Object.entries(projections)) {
      if (points[q - 1]) {
        point[id] = points[q - 1].arr;
        point[`${id}_high`] = points[q - 1].arrHigh;
        point[`${id}_low`] = points[q - 1].arrLow;
        point[`${id}_confidence`] = 'projected';
      }
    }
    projected.push(point);
  }

  return { historical, projected, combined: [...historical, ...projected] };
}

// Compute unit economics for all companies
export function computeUnitEconomics(assumptions) {
  const companies = REVENUE_COMPANIES;

  const metrics = {};

  // Anthropic
  const anthArr = getLatestArr(companies.anthropic);
  const anthEmployees = companies.anthropic.employees?.value || 2500;
  metrics.anthropic = {
    arr: anthArr,
    revenuePerEmployee: anthArr / anthEmployees,
    revenuePerUser: companies.anthropic.key_metrics.revenue_per_user_monthly.value * 12,
    apiRevenue: anthArr * assumptions.anthropic_api_mix,
    subscriptionRevenue: anthArr * (1 - assumptions.anthropic_api_mix),
    grossProfit: anthArr * assumptions.api_gross_margin,
    grossMargin: assumptions.api_gross_margin,
    marketplaceLeakage: anthArr * assumptions.anthropic_api_mix * 0.25 * assumptions.cloud_marketplace_take,
  };

  // OpenAI
  const oaiArr = getLatestArr(companies.openai);
  const oaiEmployees = companies.openai.employees?.value || 3500;
  metrics.openai = {
    arr: oaiArr,
    revenuePerEmployee: oaiArr / oaiEmployees,
    revenuePerUserWeekly: companies.openai.key_metrics.revenue_per_user_weekly?.value || 25,
    apiRevenue: oaiArr * 0.40,
    subscriptionRevenue: oaiArr * 0.55,
    netApiRevenue: oaiArr * 0.40 * (1 - assumptions.openai_msft_share),
    grossMargin: assumptions.api_gross_margin * 0.9, // slightly lower due to MSFT share
  };

  // Google (AI portion of Cloud)
  const gcloudAnnual = companies.google.ai_revenue_estimate?.cloud_annual_2025?.value || 53.6e9;
  const gaiPct = companies.google.ai_revenue_estimate?.pct_of_cloud?.value || 0.30;
  metrics.google = {
    cloudRevenue: gcloudAnnual,
    aiAttributedRevenue: gcloudAnnual * gaiPct,
    cloudBacklog: companies.google.key_metrics.cloud_backlog?.value || 240e9,
    capex2025: companies.google.key_metrics.total_capex_2025?.value || 91.4e9,
  };

  // xAI
  const xaiArr = getLatestArr(companies.xai);
  const xaiEmployees = companies.xai.employees?.value || 300;
  metrics.xai = {
    arr: xaiArr,
    revenuePerEmployee: xaiArr / xaiEmployees,
  };

  return metrics;
}

// Compute projected milestones (when each company hits $X ARR)
export function computeMilestoneProjections(assumptions) {
  const targets = [25e9, 50e9, 100e9];
  const results = {};

  for (const id of ['anthropic', 'openai']) {
    const company = REVENUE_COMPANIES[id];
    const latestArr = getLatestArr(company);
    const growthRate = id === 'anthropic' ? assumptions.anthropic_growth_rate : assumptions.openai_growth_rate;
    const quarterlyGrowth = Math.pow(1 + growthRate, 0.25);

    results[id] = {};
    for (const target of targets) {
      if (latestArr >= target) {
        results[id][target] = 0;
      } else {
        const quarters = Math.ceil(Math.log(target / latestArr) / Math.log(quarterlyGrowth));
        results[id][target] = quarters;
      }
    }
  }

  return results;
}

// Generate auto-insights from data and assumptions
export function generateRevenueInsights(assumptions) {
  const companies = REVENUE_COMPANIES;
  const unitEcon = computeUnitEconomics(assumptions);
  const milestones = computeMilestoneProjections(assumptions);

  const insights = [];

  // Monetization efficiency
  const anthRpu = companies.anthropic.key_metrics.revenue_per_user_monthly?.value || 211;
  const oaiRpuWeekly = companies.openai.key_metrics.revenue_per_user_weekly?.value || 25;
  const ratio = Math.round(anthRpu / (oaiRpuWeekly * 4.33));
  insights.push({
    type: 'competition',
    severity: 'high',
    text: `Anthropic's revenue per user ($${anthRpu}/mo) is ~${ratio}x OpenAI's (~$${Math.round(oaiRpuWeekly * 4.33)}/mo), reflecting an enterprise-first monetization strategy that generates more revenue with fewer users.`,
  });

  // Claude Code trajectory
  const codeArr = companies.anthropic.key_metrics.claude_code_arr?.value || 2.5e9;
  insights.push({
    type: 'growth',
    severity: 'high',
    text: `Claude Code is a $${(codeArr / 1e9).toFixed(1)}B ARR product (${Math.round(codeArr / getLatestArr(companies.anthropic) * 100)}% of total), having doubled since January 2026. At ${assumptions.anthropic_code_growth.toFixed(1)}x annual growth, it could exceed $${(codeArr * assumptions.anthropic_code_growth / 1e9).toFixed(0)}B by EOY 2026.`,
  });

  // Revenue crossover
  const anthArr = getLatestArr(companies.anthropic);
  const oaiArr = getLatestArr(companies.openai);
  if (assumptions.anthropic_growth_rate > assumptions.openai_growth_rate && anthArr < oaiArr) {
    const anthQ = Math.pow(1 + assumptions.anthropic_growth_rate, 0.25);
    const oaiQ = Math.pow(1 + assumptions.openai_growth_rate, 0.25);
    let q = 0;
    let a = anthArr, o = oaiArr;
    while (a < o && q < 20) { a *= anthQ; o *= oaiQ; q++; }
    if (q < 20) {
      insights.push({
        type: 'trend',
        severity: 'high',
        text: `At current assumed growth rates (Anthropic ${Math.round(assumptions.anthropic_growth_rate * 100)}% vs OpenAI ${Math.round(assumptions.openai_growth_rate * 100)}%), Anthropic's ARR could surpass OpenAI's in ~${q} quarters (~${(q / 4).toFixed(1)} years).`,
      });
    }
  }

  // Microsoft revenue share insight
  insights.push({
    type: 'competition',
    severity: 'medium',
    text: `OpenAI's Microsoft revenue share (~${Math.round(assumptions.openai_msft_share * 100)}%) means for every $1 of API revenue, OpenAI retains ~$${(1 - assumptions.openai_msft_share).toFixed(2)}. Anthropic retains ~100% of direct API revenue and ~${Math.round((1 - assumptions.cloud_marketplace_take) * 100)}% via cloud marketplaces.`,
  });

  // Revenue per employee
  insights.push({
    type: 'trend',
    severity: 'medium',
    text: `Anthropic generates ~$${(unitEcon.anthropic.revenuePerEmployee / 1e6).toFixed(1)}M per employee vs OpenAI's ~$${(unitEcon.openai.revenuePerEmployee / 1e6).toFixed(1)}M — ${(unitEcon.anthropic.revenuePerEmployee / unitEcon.openai.revenuePerEmployee).toFixed(1)}x more efficient. Both far exceed top-decile SaaS benchmarks (~$500K/employee).`,
  });

  // Google backlog
  insights.push({
    type: 'ecosystem',
    severity: 'medium',
    text: `Google Cloud's $240B remaining deal backlog suggests massive latent AI demand not yet recognized as revenue. At 30% AI attribution, this represents ~$72B in future AI revenue commitments.`,
  });

  // xAI valuation gap
  const xaiArr = getLatestArr(companies.xai);
  const xaiVal = companies.xai.valuation?.value || 230e9;
  const anthVal = companies.anthropic.valuation?.value || 380e9;
  insights.push({
    type: 'competition',
    severity: 'low',
    text: `xAI's ~$${(xaiArr / 1e9).toFixed(1)}B ARR at $${(xaiVal / 1e9).toFixed(0)}B valuation implies a ${Math.round(xaiVal / xaiArr)}x revenue multiple vs Anthropic's ${Math.round(anthVal / anthArr)}x — a ${Math.round(xaiVal / xaiArr / (anthVal / anthArr))}x premium despite significantly lower revenue.`,
  });

  // Token price deflation
  insights.push({
    type: 'trend',
    severity: 'medium',
    text: `Token price deflation of ${Math.round(assumptions.token_price_deflation * 100)}% per generation means revenue growth requires even faster volume growth — the treadmill effect. Companies must grow token volume at >${Math.round(-assumptions.token_price_deflation * 100)}% annually just to maintain revenue.`,
  });

  return insights;
}
