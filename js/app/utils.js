export const $ = (sel) => document.querySelector(sel);

export function qs(name) {
  const u = new URL(window.location.href);
  return u.searchParams.get(name);
}

export function setQS(name, value) {
  const u = new URL(window.location.href);
  if (value === null || value === undefined) u.searchParams.delete(name);
  else u.searchParams.set(name, String(value));
  window.history.replaceState({}, "", u.toString());
}

export function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }

export function formatDate(iso) {
  // iso like 2024-01-01
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { year:"numeric", month:"short", day:"2-digit" });
}

export function scoreBadge(valueMs) {
  // very low forecasts exist in your CSV for some stations; keep categories gentle
  if (valueMs >= 2.0) return { label:"Good potential", className:"good" };
  if (valueMs >= 1.0) return { label:"Moderate", className:"mid" };
  return { label:"Low", className:"low" };
}

export function turbineRecommendation(valueMs) {
  if (valueMs >= 2.0) return "Small–Medium turbine (site study recommended)";
  if (valueMs >= 1.0) return "Small turbine / hybrid (wind + solar)";
  return "Likely not economical (consider solar/hybrid)";
}