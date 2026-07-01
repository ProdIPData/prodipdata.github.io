// Shared build-time formatters — mirror the helpers in assets/js/site.js so that
// pre-rendered (build-time) output matches what site.js produces in the browser.

import fs from 'node:fs';
import path from 'node:path';

// Build-time data loading. The current release month is read from releases.json,
// so publishing a new month needs NO code change: just drop the new *-YYYY-MM.json
// files into assets/data/ and bump "current_release" in releases.json.
const DATA_DIR = path.join(process.cwd(), 'assets', 'data');
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));

export const releasesData = (() => {
  try { return readJson('releases.json'); } catch (e) { return {}; }
})();

export const currentReleaseMonth =
  typeof releasesData.current_release === 'string' && releasesData.current_release.length >= 7
    ? releasesData.current_release
    : '2026-04';
export const currentReleaseYear = currentReleaseMonth.slice(0, 4);

// Load a month-stamped data file for the current release (e.g. loadData('overview-global')).
export const loadData = (prefix) => {
  try { return readJson(`${prefix}-${currentReleaseMonth}.json`); } catch (e) { return null; }
};
// Load a year-stamped data file (e.g. loadYearData('new-added-asns')).
export const loadYearData = (prefix) => {
  try { return readJson(`${prefix}-${currentReleaseYear}.json`); } catch (e) { return null; }
};

export const numericValue = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

export const getItems = (v) => {
  if (v && Array.isArray(v.items)) return v.items;
  if (Array.isArray(v)) return v;
  return [];
};

export const formatInteger = (v) =>
  new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(numericValue(v));

export const formatCompact = (v) => {
  const n = numericValue(v);
  try {
    return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(n);
  } catch (err) {
    return formatInteger(n);
  }
};

export const formatShare = (v) => `${(numericValue(v) * 100).toFixed(1)}%`;

export const formatRirName = (v) => {
  const r = String(v || '').toLowerCase();
  const labels = { afrinic: 'AFRINIC', apnic: 'APNIC', arin: 'ARIN', lacnic: 'LACNIC', ripe: 'RIPE' };
  return labels[r] || String(v || '').toUpperCase();
};

export const sortByRank = (items) =>
  getItems(items).slice().sort(
    (a, b) => numericValue(a.rank) - numericValue(b.rank) || numericValue(b.prefixCount) - numericValue(a.prefixCount)
  );

export const escapeHtml = (v) =>
  String(v == null ? '' : v)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

export const summarizeByRir = (items) => {
  const totals = new Map();
  let grand = 0;
  items.forEach((i) => {
    const r = (i.rir || 'unknown').toLowerCase();
    const p = numericValue(i.prefixCount);
    grand += p;
    totals.set(r, (totals.get(r) || 0) + p);
  });
  return Array.from(totals.entries())
    .map(([rir, prefixCount]) => ({ rir, prefixCount, sharePercent: grand > 0 ? (prefixCount / grand) * 100 : 0 }))
    .sort((a, b) => b.prefixCount - a.prefixCount)
    .slice(0, 5);
};

export const sortRirProfiles = (items) => {
  const order = new Map([['afrinic', 1], ['apnic', 2], ['arin', 3], ['lacnic', 4], ['ripe', 5]]);
  return getItems(items).slice().sort(
    (a, b) => (order.get(String(a.rir || '').toLowerCase()) || 999) - (order.get(String(b.rir || '').toLowerCase()) || 999)
  );
};

export const formatAsnTypeLabel = (value) => {
  const key = String(value || '').toLowerCase();
  const labels = { isp: 'ISP', hosting: 'Hosting', business: 'Business', education: 'Education', government: 'Government', unknown: 'Unknown' };
  if (key === 'inactive') return 'Type n/a';
  return labels[key] || String(value || '').replace(/[_-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
};

export const formatCountryTopAsnLabel = (item) => {
  const id = numericValue(item.topAsnId);
  if (id > 0) return item.topAsnName || `AS${Math.trunc(id)}`;
  return item.topAsnName || 'No dominant ASN';
};

// Inline flag <span> from an ISO 3166-1 alpha-2 code (flag-icons CSS classes).
// Returns '' for missing/invalid codes so non-country rows degrade gracefully.
export const flag = (iso2) => {
  const c = String(iso2 == null ? '' : iso2).trim().toLowerCase();
  return /^[a-z]{2}$/.test(c) ? `<span class="fi fi-${c}" aria-hidden="true"></span> ` : '';
};

