// Shared build-time formatters — mirror the helpers in assets/js/site.js so that
// pre-rendered (build-time) output matches what site.js produces in the browser.

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

// Resolve the current release month and load a month-keyed JSON file from /assets/data.
// Globs are eager so this runs at build time.
const dataFiles = import.meta.glob('/assets/data/*.json', { import: 'default', eager: true });

export const currentReleaseMonth = (() => {
  const releases = dataFiles['/assets/data/releases.json'] || {};
  const m = releases.current_release;
  return typeof m === 'string' && m.length >= 7 ? m : '2026-04';
})();

export const loadData = (prefix, month = currentReleaseMonth) =>
  dataFiles[`/assets/data/${prefix}-${month}.json`] ?? null;
