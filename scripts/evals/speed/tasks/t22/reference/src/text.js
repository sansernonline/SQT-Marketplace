const SMALL = new Set(["a", "an", "the", "of", "and", "or", "in", "on"]);
export function slugify(s) { return String(s).trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""); }
export function titleCase(s) {
  return String(s).trim().split(/\s+/).map((w, i) => { const l = w.toLowerCase(); return i > 0 && SMALL.has(l) ? l : l.charAt(0).toUpperCase() + l.slice(1); }).join(" ");
}
export function truncate(s, n) {
  s = String(s); if (s.length <= n) return s;
  const cut = s.slice(0, n - 1), sp = cut.lastIndexOf(" ");
  return (sp > 0 ? cut.slice(0, sp) : cut) + "…";
}
export function wordCount(s) { const t = String(s).trim(); return t ? t.split(/\s+/).length : 0; }
