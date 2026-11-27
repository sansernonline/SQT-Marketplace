// แม่แบบออก presigned PUT URL ของ Backblaze B2 (S3-compatible API) สำหรับอัปโหลดจากเบราว์เซอร์ · skill backblaze-b2
// เขียนตามเอกสาร B2 ตรวจ 2026-11-05 · ยังไม่ได้รันกับ bucket จริง
//
// ติดตั้งเองในโปรเจกต์ของผู้ใช้: npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
// ต้องล็อกรุ่นเอง (ยังไม่ได้ตรวจรุ่นที่ใช้ได้)
//
// รัน: B2_KEY_ID=... B2_APPLICATION_KEY=... B2_BUCKET=... B2_REGION=us-east-005 node b2-presign.mjs
//
// ข้อควรรู้:
//   - presigned URL เป็น bearer token: ใครถือก็อัปโหลดได้จนหมดอายุ จึงตั้งอายุสั้น
//   - ไม่รองรับ POST จากเบราว์เซอร์ ใช้ PUT เท่านั้น
//   - เบราว์เซอร์ต้องมี CORS ที่ bucket (รูปแบบกฎ ดู SKILL.md)
//   - เป็นแม่แบบ: ต้องปรับรายการ ALLOWED_CONTENT_TYPES ตามงานจริง

import { randomUUID } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const REQUIRED_ENV = ['B2_KEY_ID', 'B2_APPLICATION_KEY', 'B2_BUCKET', 'B2_REGION'];

const ALLOWED_CONTENT_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];
const MIN_SECONDS = 1;
// เพดานของเราเอง ไม่ใช่ของ B2
const MAX_SECONDS = 3600;

// ตรวจ env ตอนเรียกใช้ ไม่ใช่ตอน import เพื่อไม่ฆ่า process ของแอปที่นำเข้าไฟล์นี้
// พิมพ์เฉพาะชื่อตัวแปรที่ขาด ไม่พิมพ์ค่า
function createClient() {
  const missing = REQUIRED_ENV.filter((name) => !process.env[name]);
  if (missing.length > 0) {
    throw new Error(`ขาดตัวแปร env: ${missing.join(', ')}`);
  }
  const { B2_KEY_ID, B2_APPLICATION_KEY, B2_REGION } = process.env;
  return new S3Client({
    region: B2_REGION,
    endpoint: `https://s3.${B2_REGION}.backblazeb2.com`,
    // keyID เป็น access key id และ applicationKey เป็น secret · การจับคู่นี้ยังไม่ได้ตรวจกับหน้าเอกสาร
    credentials: { accessKeyId: B2_KEY_ID, secretAccessKey: B2_APPLICATION_KEY },
  });
}

/**
 * ออก presigned PUT URL ให้เบราว์เซอร์อัปโหลดไฟล์เดียว
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

  const client = createClient();
  const key = `uploads/${randomUUID()}`;
  const command = new PutObjectCommand({ Bucket: process.env.B2_BUCKET, Key: key, ContentType: contentType });
  const url = await getSignedUrl(client, command, { expiresIn: maxSeconds });
  return { key, url };
}

// รันตรง: แสดงเฉพาะ key ห้ามพิมพ์ url เต็ม เพราะเป็น bearer token
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const { key } = await presignUpload({ contentType: 'image/png' });
    console.log(`key: ${key}`);
    console.log('url สร้างแล้ว (ไม่แสดง)');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}
