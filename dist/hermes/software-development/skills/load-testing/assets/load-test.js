// k6 load test ตัวอย่าง · skill load-testing
// เขียนตามเอกสาร k6 ตรวจ 2026-10-28 · ยังไม่ได้รันกับระบบจริง
//
// ก่อนยิง (skill load-testing หัวข้อ 2) จดไว้ตรงนี้:
//   ระบบ:            (รอยืนยัน)
//   environment:     (รอยืนยัน) เช่น staging
//   ปริมาณสูงสุด:      (รอยืนยัน)
//   ช่วงเวลา:          (รอยืนยัน)
//   ผู้อนุมัติ:         (รอยืนยัน)
//   ช่องทางหยุด:       Ctrl+C หรือยกเลิก job ใน CI
//
// รัน:
//   k6 run -e TEST_TYPE=smoke -e TARGET_ENV=staging -e BASE_URL=https://staging.example.com load-test.js
//   k6 run -e TEST_TYPE=load  -e TARGET_ENV=staging -e BASE_URL=https://staging.example.com -e APPROVED_BY="ชื่อผู้อนุมัติ" load-test.js
//   TARGET_ENV=production ต้องมี APPROVED_BY ทุกแบบ รวม smoke
//
// ตัวเลขทุกตัวในไฟล์นี้ (rate · VU · stages · เกณฑ์) เป็นค่าตั้งต้น ยังไม่ได้วัด

import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL;
const TEST_TYPE = __ENV.TEST_TYPE || 'smoke';
const APPROVED_BY = __ENV.APPROVED_BY;
const TARGET_ENV = __ENV.TARGET_ENV;

// ด่านอนุญาต: หยุดตั้งแต่ก่อนยิงคำขอแรก
if (!BASE_URL) {
  throw new Error('ต้องใส่ -e BASE_URL=... ของระบบที่ได้รับอนุญาตให้ยิง');
}
if (!['staging', 'loadtest', 'production'].includes(TARGET_ENV)) {
  throw new Error(`ต้องใส่ -e TARGET_ENV=staging · loadtest · production ตัวเล็กตรงตัว (ได้ ${TARGET_ENV}) บอกว่ายิงที่ไหน`);
}
if ((TEST_TYPE !== 'smoke' || TARGET_ENV === 'production') && !APPROVED_BY) {
  throw new Error(`TEST_TYPE=${TEST_TYPE} ที่ TARGET_ENV=${TARGET_ENV} ต้องมี -e APPROVED_BY=... (ชื่อคนอนุมัติ) ก่อนยิง`);
}

// ทุกแบบใช้ ramping-arrival-rate: กำหนดจำนวนรอบต่อ timeUnit ระบบช้าลงก็ยังโดนยิงเท่าเดิม
// target = จำนวนรอบที่เริ่มต่อ timeUnit (ไม่ใช่จำนวน VU)
const PROFILES = {
  smoke: [
    { target: 1, duration: '1m' },
  ],
  load: [
    { target: 50, duration: '5m' },   // ไต่ขึ้นถึงปริมาณปกติ
    { target: 50, duration: '20m' },  // คงที่
    { target: 0, duration: '2m' },    // ลง
  ],
  stress: [
    { target: 50, duration: '5m' },
    { target: 100, duration: '10m' }, // 2 เท่าของปกติ
    { target: 100, duration: '10m' },
    { target: 0, duration: '5m' },
  ],
  spike: [
    { target: 5, duration: '1m' },
    { target: 300, duration: '30s' }, // คนแห่เข้า
    { target: 300, duration: '2m' },
    { target: 5, duration: '30s' },
  ],
  soak: [
    { target: 50, duration: '5m' },
    { target: 50, duration: '4h' },
    { target: 0, duration: '5m' },
  ],
};

if (!PROFILES[TEST_TYPE]) {
  throw new Error(`TEST_TYPE ต้องเป็น ${Object.keys(PROFILES).join(' | ')}`);
}

export const options = {
  scenarios: {
    [TEST_TYPE]: {
      executor: 'ramping-arrival-rate',
      startRate: 1,
      timeUnit: '1s',
      preAllocatedVUs: TEST_TYPE === 'smoke' ? 2 : 50,
      maxVUs: TEST_TYPE === 'smoke' ? 5 : 500,
      stages: PROFILES[TEST_TYPE],
    },
  },
  thresholds: {
    // error เกิน 1% หยุดยิงทันที ไม่ทุบระบบต่อ · รอ 30 วินาทีให้มีตัวอย่างก่อนตัดสิน
    http_req_failed: [{ threshold: 'rate<0.01', abortOnFail: true, delayAbortEval: '30s' }],
    http_req_duration: ['p(95)<500'],
    'http_req_duration{type:API}': ['p(95)<500'],
    checks: ['rate>0.99'],
  },
};

const params = { tags: { type: 'API' } };

// เส้นทางตัวอย่าง: แก้ path ให้ตรงระบบ · อย่าใส่เส้นทางที่สร้างเงิน อีเมล SMS หรือคำสั่งซื้อจริง
export default function () {
  const res = http.get(`${BASE_URL}/api/products`, params);
  check(res, {
    'status 200': (r) => r.status === 200,
  });
  sleep(1);
}
