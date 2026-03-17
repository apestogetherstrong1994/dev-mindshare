// Helpers for working with daily npm download arrays
// dailyDownloads[0] = 2025-03-01, dailyDownloads[N] = 2025-03-01 + N days

const START_DATE = new Date('2025-03-01T00:00:00Z');

/** Convert array index to date string (YYYY-MM-DD) */
export function indexToDate(index) {
  const d = new Date(START_DATE.getTime() + index * 86400000);
  return d.toISOString().slice(0, 10);
}

/** Convert array index to month string (YYYY-MM) */
export function indexToMonth(index) {
  return indexToDate(index).slice(0, 7);
}

/**
 * Compute a 7-day rolling average from a daily downloads array.
 * Returns array of { date, value } where value is the 7-day avg daily rate.
 * First 6 entries are null (not enough lookback).
 */
export function rollingAverage(dailyDownloads, window = 7) {
  const result = [];
  for (let i = 0; i < dailyDownloads.length; i++) {
    if (i < window - 1) continue; // skip until we have a full window
    let sum = 0;
    for (let j = i - window + 1; j <= i; j++) {
      sum += dailyDownloads[j];
    }
    result.push({
      date: indexToDate(i),
      value: Math.round(sum / window),
    });
  }
  return result;
}

/**
 * Build chart-ready data from multiple providers' daily arrays.
 * Returns weekly-sampled points (every 7th day) with 7-day rolling avg.
 * This gives ~54 data points instead of 381, keeping the chart clean.
 */
export function buildDailyChartData(providers, providerIds) {
  // Compute rolling averages for each provider
  const averages = {};
  for (const id of providerIds) {
    if (providers[id]?.dailyDownloads) {
      averages[id] = rollingAverage(providers[id].dailyDownloads);
    }
  }

  // Use the first provider's dates as reference
  const refId = providerIds.find(id => averages[id]);
  if (!refId) return [];
  const refDates = averages[refId];

  // Sample every 7th point for clean chart, always include the last point
  const points = [];
  for (let i = 0; i < refDates.length; i += 7) {
    const point = { date: refDates[i].date };
    for (const id of providerIds) {
      if (averages[id]?.[i]) {
        point[id] = averages[id][i].value;
      }
    }
    points.push(point);
  }
  // Always include the very last data point
  const lastIdx = refDates.length - 1;
  if (lastIdx % 7 !== 0) {
    const point = { date: refDates[lastIdx].date };
    for (const id of providerIds) {
      if (averages[id]?.[lastIdx]) {
        point[id] = averages[id][lastIdx].value;
      }
    }
    points.push(point);
  }

  return points;
}

/**
 * Aggregate daily downloads into monthly totals.
 * Returns array of { month, downloads }.
 */
export function aggregateMonthly(dailyDownloads) {
  const months = {};
  for (let i = 0; i < dailyDownloads.length; i++) {
    const month = indexToMonth(i);
    months[month] = (months[month] || 0) + dailyDownloads[i];
  }
  return Object.entries(months).map(([month, downloads]) => ({ month, downloads }));
}

/**
 * Compute MoM growth from daily downloads array.
 * Uses the two most recent complete months.
 */
export function computeMoMGrowthFromDaily(dailyDownloads) {
  const monthly = aggregateMonthly(dailyDownloads);
  // Current month (2026-03) is partial, skip it
  const fullMonths = monthly.filter(m => m.month !== '2026-03');
  if (fullMonths.length < 2) return null;
  const current = fullMonths[fullMonths.length - 1].downloads;
  const previous = fullMonths[fullMonths.length - 2].downloads;
  if (previous === 0) return null;
  return (current - previous) / previous;
}

/**
 * Compute the 12-month download ratio (latest full month / first month).
 */
export function compute12MonthGrowthFromDaily(dailyDownloads) {
  const monthly = aggregateMonthly(dailyDownloads);
  if (monthly.length < 12) return null;
  const first = monthly[0].downloads;
  const fullMonths = monthly.filter(m => m.month !== '2026-03');
  const last = fullMonths[fullMonths.length - 1].downloads;
  if (first === 0) return null;
  return (last - first) / first;
}

/**
 * Get the first month's total from daily array (for computing year-ago ratios).
 */
export function getFirstMonthTotal(dailyDownloads) {
  const monthly = aggregateMonthly(dailyDownloads);
  return monthly.length > 0 ? monthly[0].downloads : 0;
}

/** Format a date string for chart axis (e.g., "Mar 15" or "Sep 01") */
export function formatChartDate(dateStr) {
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const d = new Date(dateStr + 'T00:00:00Z');
  return `${months[d.getUTCMonth()]} '${String(d.getUTCFullYear()).slice(2)}`;
}
