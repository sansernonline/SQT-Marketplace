#!/usr/bin/env node
// pulse: what real users said about a topic in the last N days (Reddit, Hacker News, YouTube).
// Node 18+, global fetch, no packages. Read-only public endpoints, low volume.
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';

const run = promisify(execFile);
const UA = 'sqt-research/1.0';

export function parseArgs(argv) {
  const o = { topic: '', days: 30, sources: ['reddit', 'hn', 'youtube'], limit: 10, json: false };
  const words = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--days') o.days = Number(argv[++i]);
    else if (a === '--sources') o.sources = String(argv[++i]).split(',').map((s) => s.trim());
    else if (a === '--limit') o.limit = Number(argv[++i]);
    else if (a === '--json') o.json = true;
    else words.push(a);
  }
  o.topic = words.join(' ');
  return o;
}

const iso = (sec) => new Date(sec * 1000).toISOString().slice(0, 10);

export function parseReddit(json) {
  const kids = (json && json.data && json.data.children) || [];
  return kids.map((k) => k.data).map((d) => ({
    source: 'reddit',
    date: iso(d.created_utc),
    score: d.score,
    comments: d.num_comments,
    title: d.title,
    url: 'https://www.reddit.com' + d.permalink,
  }));
}

export function parseHn(json) {
  const hits = (json && json.hits) || [];
  return hits.map((h) => ({
    source: 'hn',
    date: iso(h.created_at_i),
    score: h.points,
    comments: h.num_comments,
    title: h.title,
    url: 'https://news.ycombinator.com/item?id=' + h.objectID,
  }));
}

export function parseYoutube(text) {
  return String(text).split('\n').filter((l) => l.trim()).map((l) => {
    const [d, views, title, url] = l.split('\t');
    const n = Number(views);
    return {
      source: 'youtube',
      date: `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`,
      score: Number.isFinite(n) ? n : 0,
      comments: null,
      title,
      url,
    };
  });
}

export function filterAndSort(items, days, now = Date.now()) {
  const cutoff = now - days * 86400000;
  return items
    .filter((it) => new Date(it.date + 'T23:59:59Z').getTime() >= cutoff)
    .sort((a, b) => b.score - a.score);
}

const LABEL = { reddit: 'score', hn: 'points', youtube: 'views' };

export function formatMarkdown(source, items) {
  const lines = [`## ${source}`, ''];
  if (!items.length) lines.push('(ไม่พบรายการ)');
  for (const it of items) {
    const c = it.comments == null ? '-' : `${it.comments} comments`;
    lines.push(`- ${it.date} · ${it.score} ${LABEL[source]} · ${c} · ${it.title} · ${it.url}`);
  }
  return lines.join('\n');
}

async function getJson(url) {
  const r = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
}

const fetchers = {
  async reddit({ topic, days, limit }) {
    const t = days <= 7 ? 'week' : 'month';
    const u = `https://www.reddit.com/search.json?q=${encodeURIComponent(topic)}&sort=top&t=${t}&limit=${limit}`;
    return parseReddit(await getJson(u));
  },
  async hn({ topic, days, limit }) {
    const since = Math.floor(Date.now() / 1000) - days * 86400;
    const u = `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(topic)}&tags=story&numericFilters=${encodeURIComponent('created_at_i>' + since)}&hitsPerPage=${limit}`;
    return parseHn(await getJson(u));
  },
  async youtube({ topic, days, limit }) {
    const { stdout } = await run('yt-dlp', [
      `ytsearch${limit}:${topic}`, '--dateafter', `now-${days}days`, '--skip-download',
      '--print', '%(upload_date)s\t%(view_count)s\t%(title)s\t%(webpage_url)s',
    ]);
    return parseYoutube(stdout);
  },
};

async function hasYtDlp() {
  try { await run('yt-dlp', ['--version']); return true; } catch { return false; }
}

async function main() {
  const o = parseArgs(process.argv.slice(2));
  if (!o.topic) {
    console.error('usage: node pulse.mjs "<topic>" [--days 30] [--sources reddit,hn,youtube] [--limit 10] [--json]');
    process.exit(2);
  }
  const out = {};
  const notes = [];
  for (const s of o.sources) {
    if (!fetchers[s]) { notes.push(`${s}: ล้มเหลว unknown source`); continue; }
    if (s === 'youtube' && !(await hasYtDlp())) { notes.push('youtube: ข้าม (ไม่มี yt-dlp)'); continue; }
    try {
      out[s] = filterAndSort(await fetchers[s](o), o.days).slice(0, o.limit);
    } catch (e) {
      notes.push(`${s}: ล้มเหลว ${e.message}`);
    }
  }
  if (o.json) {
    console.log(JSON.stringify(Object.values(out).flat(), null, 2));
    for (const n of notes) console.error(n);
  } else {
    for (const [s, items] of Object.entries(out)) console.log(formatMarkdown(s, items) + '\n');
    for (const n of notes) console.log(n);
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main();
