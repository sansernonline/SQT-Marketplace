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
 */
'use strict';

const express = require('express');
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

  const router = express.Router();

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
