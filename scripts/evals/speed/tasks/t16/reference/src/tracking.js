export function formatTracking(s) {
  if (typeof s !== "string") return null;
  const t = s.replace(/[\s-]/g, "").toUpperCase();
  let m;
  if ((m = /^KEX(\d{10})$/.exec(t))) return `KEX-${m[1]}`;
  if ((m = /^TH(\d{10})([A-Z])$/.exec(t))) return `TH-${m[1]}-${m[2]}`;
  if ((m = /^([A-Z]{2})(\d{9})TH$/.exec(t))) return `${m[1]}-${m[2]}-TH`;
  return null;
}
