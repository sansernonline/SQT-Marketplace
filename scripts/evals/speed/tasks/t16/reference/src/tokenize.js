export function tokenize(text, words) {
  const out = [];
  let unk = "";
  const flush = () => { if (unk) out.push(unk); unk = ""; };
  let i = 0;
  while (i < text.length) {
    if (/\s/.test(text[i])) { flush(); i++; continue; }
    let best = "";
    for (const w of words) if (w.length > best.length && text.startsWith(w, i)) best = w;
    if (best) { flush(); out.push(best); i += best.length; }
    else { unk += text[i]; i++; }
  }
  flush();
  return out;
}
