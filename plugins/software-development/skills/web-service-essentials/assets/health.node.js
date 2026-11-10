/**
 * health.node.js — endpoint พื้นฐานที่ทุก service ต้องมี (Express)
 *
 *   const { createHealthRouter } = require('./health.node');
 *   app.use(createHealthRouter({
 *     version: { version: '1.4.0', commit: process.env.GIT_SHA, buildTime: process.env.BUILD_TIME },
 *     checks: {
 *       db:    async () => { await pool.query('SELECT 1'); },
 *       redis: async () => { await redis.ping(); },
 *       mail:  { critical: false, run: async () => { await smtp.verify(); } },
 *     },
 *   }));
 *
 * ให้:
 *   GET /ping          200 "pong"          ถูกที่สุด ไม่แตะ dependency ใด ๆ
 *   GET /health/live   200 | 503           process ยังทำงานอยู่ไหม
 *   GET /health/ready  200 | 503           พร้อมรับ traffic ไหม (เช็ค dependency)
 *   GET /version       200                 เวอร์ชันที่รันอยู่จริง
 *
 * ทดสอบ:  node health.node.js --self-test     (ไม่ต้องมี express · ทดสอบ runCheck และ timeout)
 */
'use strict';

const os = require('os');

const DEFAULT_TIMEOUT_MS = 3000;

/** ครอบ check ด้วย timeout — dependency ที่ค้างต้องไม่ทำให้ health endpoint ค้างตาม */
function withTimeout(promise, ms, name) {
  let timer;
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error(`${name} timeout after ${ms}ms`)), ms);
    }),
  ]).finally(() => clearTimeout(timer));
}

async function runCheck(name, def, timeoutMs) {
  const fn = typeof def === 'function' ? def : def.run;
  const critical = typeof def === 'function' ? true : def.critical !== false;
  const started = Date.now();
  try {
    await withTimeout(Promise.resolve(fn()), timeoutMs, name);
    return { name, status: 'up', durationMs: Date.now() - started, critical };
  } catch (err) {
    return {
      name,
      status: 'down',
      durationMs: Date.now() - started,
      critical,
      // ข้อความ error เท่านั้น ห้ามส่ง stack — endpoint นี้เปิดสาธารณะ
      error: String(err && err.message ? err.message : err).slice(0, 200),
    };
  }
}

function createHealthRouter(options = {}) {
  const {
    version = {},
    checks = {},
    timeoutMs = DEFAULT_TIMEOUT_MS,
    startedAt = Date.now(),
  } = options;

  const router = require('express').Router(); // โหลดตอนใช้ เพื่อให้ --self-test รันได้โดยไม่ต้องลง express

  // ---- ping: ตัวที่ load balancer เรียกทุกวินาที ต้องเบาที่สุด ไม่ต้อง log ----
  router.get('/ping', (_req, res) => res.type('text/plain').send('pong'));

  // ---- liveness: process ตายหรือยัง ----
  // ห้ามเช็ค dependency ตรงนี้ ไม่งั้น DB ล่มชั่วคราว → orchestrator ฆ่า pod ทิ้งทั้งที่แอปปกติดี
  router.get('/health/live', (_req, res) =>
    res.json({
      status: 'up',
      uptimeSec: Math.floor((Date.now() - startedAt) / 1000),
      timestamp: new Date().toISOString(),
    }));

  // ---- readiness: พร้อมรับ traffic ไหม ----
  router.get('/health/ready', async (_req, res) => {
    const names = Object.keys(checks);
    const results = await Promise.all(
      names.map((n) => runCheck(n, checks[n], timeoutMs)),
    );

    // dependency ที่ไม่ critical ล่ม = degraded ยังรับ traffic ได้
    const criticalDown = results.some((r) => r.status === 'down' && r.critical);
    const anyDown = results.some((r) => r.status === 'down');
    const status = criticalDown ? 'down' : anyDown ? 'degraded' : 'up';

    res.status(criticalDown ? 503 : 200).json({
      status,
      timestamp: new Date().toISOString(),
      checks: results.reduce((acc, r) => {
        acc[r.name] = { status: r.status, durationMs: r.durationMs, ...(r.error && { error: r.error }) };
        return acc;
      }, {}),
    });
  });

  // ---- version: ตอบว่า "ตอนนี้รันอะไรอยู่" — คำถามแรกเสมอเวลามีปัญหา ----
  router.get('/version', (_req, res) =>
    res.json({
      name: version.name || process.env.npm_package_name || 'service',
      version: version.version || process.env.npm_package_version || '0.0.0',
      commit: version.commit || process.env.GIT_SHA || 'unknown',
      buildTime: version.buildTime || process.env.BUILD_TIME || 'unknown',
      env: process.env.NODE_ENV || 'development',
      host: os.hostname(),
    }));

  return router;
}

module.exports = { createHealthRouter, runCheck };

/* self-test: ไม่เปิดพอร์ต ไม่ใช้ express — ทดสอบตรรกะ check ตัวเดียว */
async function selfTest() {
  const assert = require('assert');
  const results = [];
  const t = async (name, fn) => { try { await fn(); results.push([name, true]); } catch (e) { results.push([name, false, e.message]); } };
  await t('check ผ่าน = up', async () => assert.strictEqual((await runCheck('db', async () => {}, 200)).status, 'up'));
  await t('function ธรรมดาก็ใช้ได้', async () => assert.strictEqual((await runCheck('db', () => 1, 200)).status, 'up'));
  await t('check พัง = down + ข้อความ error ไม่มี stack', async () => {
    const r = await runCheck('db', async () => { throw new Error('db down'); }, 200);
    assert.deepStrictEqual([r.status, r.error, r.critical], ['down', 'db down', true]);
  });
  await t('check ค้าง = down ตาม timeout', async () => {
    const r = await runCheck('slow', () => new Promise((res) => setTimeout(res, 1000)), 50);
    assert.ok(r.status === 'down' && /timeout after 50ms/.test(r.error) && r.durationMs < 500);
  });
  await t('critical:false ถูกอ่านจาก object', async () =>
    assert.strictEqual((await runCheck('m', { critical: false, run: async () => { throw new Error('x'); } }, 200)).critical, false));
  await t('createHealthRouter ไม่ล้ม (ข้ามถ้าไม่มี express)', async () => {
    try { require.resolve('express'); } catch { return; }
    assert.strictEqual(typeof createHealthRouter({}).use, 'function');
  });
  results.forEach(([n, ok, m]) => console.log(ok ? 'ok  ' : 'FAIL', n, ok ? '' : m));
  const passed = results.filter((r) => r[1]).length;
  console.log(`self-test ${passed}/${results.length}`);
  process.exit(passed === results.length ? 0 : 1);
}

if (require.main === module && process.argv.includes('--self-test')) selfTest();
