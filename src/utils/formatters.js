export function formatNumber(n) {
  if (n === null || n === undefined) return 'N/A';
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return n.toLocaleString();
}

export function formatPercent(n, decimals = 1) {
  if (n === null || n === undefined) return 'N/A';
  const sign = n > 0 ? '+' : '';
  return `${sign}${(n * 100).toFixed(decimals)}%`;
}

export function formatDelta(n) {
  if (n === null || n === undefined) return 'N/A';
  const sign = n > 0 ? '+' : '';
  return `${sign}${formatNumber(n)}`;
}

export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });
}

export function formatCompactDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export function formatCurrency(n, decimals = 1) {
  if (n === null || n === undefined) return 'N/A';
  if (Math.abs(n) >= 1e12) return `$${(n / 1e12).toFixed(decimals)}T`;
  if (Math.abs(n) >= 1e9) return `$${(n / 1e9).toFixed(decimals)}B`;
  if (Math.abs(n) >= 1e6) return `$${(n / 1e6).toFixed(decimals)}M`;
  if (Math.abs(n) >= 1e3) return `$${(n / 1e3).toFixed(decimals)}K`;
  return `$${n.toLocaleString()}`;
}

export function formatMultiple(n) {
  if (n === null || n === undefined) return 'N/A';
  return `${n.toFixed(1)}x`;
}
