export async function retry(fn, { tries = 3, baseMs = 100, sleep = (ms) => new Promise((r) => setTimeout(r, ms)) } = {}) {
  let last;
  for (let attempt = 1; attempt <= tries; attempt++) {
    try { return await fn(attempt); }
    catch (e) { last = e; if (e?.retryable === false || attempt === tries) throw e; await sleep(baseMs * 2 ** (attempt - 1)); }
  }
  throw last;
}
