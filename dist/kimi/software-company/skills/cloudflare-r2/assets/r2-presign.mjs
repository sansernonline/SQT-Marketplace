// แม่แบบออก presigned PUT URL ของ Cloudflare R2 สำหรับอัปโหลดจากเบราว์เซอร์ · skill cloudflare-r2
// เขียนตามเอกสาร R2 ตรวจ 2026-11-05 · ยังไม่ได้รันกับ bucket จริง
//
// ติดตั้งเองในโปรเจกต์ของผู้ใช้: npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
// ต้องล็อกรุ่นเอง (ยังไม่ได้ตรวจรุ่นที่ใช้ได้)
//
// รัน: R2_ACCOUNT_ID=... R2_ACCESS_KEY_ID=... R2_SECRET_ACCESS_KEY=... R2_BUCKET=... node r2-presign.mjs
//
// ข้อควรรู้:
//   - presigned URL เป็น bearer token: ใครถือก็อัปโหลดได้จนหมดอายุ จึงตั้งอายุสั้น
//   - ใช้กับ custom domain ไม่ได้ ใช้ได้เฉพาะ <ACCOUNT_ID>.r2.cloudflarestorage.com
//   - ไม่รองรับ POST (HTML form upload) ใช้ PUT เท่านั้น
//   - เบราว์เซอร์ต้องมี CORS ที่ bucket (ดู cors.json)

import { randomUUID } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const REQUIRED_ENV = ['R2_ACCOUNT_ID', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_BUCKET'];
const missing = REQUIRED_ENV.filter((name) => !process.env[name]);
if (missing.length > 0) {
  console.error(`ขาดตัวแปร env: ${missing.join(', ')}`);
  process.exit(1);
}

const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET } = process.env;

const ALLOWED_CONTENT_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];
const MIN_SECONDS = 1;
// เพดานของเราเอง ต่ำกว่าเพดานของ R2 ที่ 7 วัน
const MAX_SECONDS = 3600;

const client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY },
});

/**
 * ออก presigned PUT URL ให้เบราว์เซอร์อัปโหลดไฟล์เดียว
 * แม่แบบ: ต้องปรับรายการ ALLOWED_CONTENT_TYPES ตามงานจริง
 * key สร้างฝั่งเซิร์ฟเวอร์เอง ไม่รับชื่อไฟล์จากผู้ใช้
 * @param {{ contentType: string, maxSeconds?: number }} options
 * @returns {Promise<{ key: string, url: string }>}
 */
export async function presignUpload({ contentType, maxSeconds = 300 }) {
  if (!ALLOWED_CONTENT_TYPES.includes(contentType)) {
    throw new Error(`contentType ไม่อยู่ในรายการอนุญาต: ${contentType}`);
  }
  if (!Number.isInteger(maxSeconds) || maxSeconds < MIN_SECONDS || maxSeconds > MAX_SECONDS) {
    throw new Error(`maxSeconds ต้องเป็นจำนวนเต็มระหว่าง ${MIN_SECONDS} ถึง ${MAX_SECONDS}`);
  }

  const key = `uploads/${randomUUID()}`;
  const command = new PutObjectCommand({ Bucket: R2_BUCKET, Key: key, ContentType: contentType });
  const url = await getSignedUrl(client, command, { expiresIn: maxSeconds });
  return { key, url };
}

// รันตรง: แสดงเฉพาะ key ห้ามพิมพ์ url เต็ม เพราะเป็น bearer token
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { key } = await presignUpload({ contentType: 'image/png' });
  console.log(`key: ${key}`);
  console.log('url สร้างแล้ว (ไม่แสดง)');
}
