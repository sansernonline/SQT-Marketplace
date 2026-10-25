const MONTHS = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];

// รับ Date แล้วคืนข้อความแบบ "19 ต.ค. 2569" (ปี พ.ศ., เวลาไทย UTC+7)
export function formatThaiDate(date) {
  const day = date.getUTCDate();
  const month = MONTHS[date.getUTCMonth() + 1];
  const year = date.getUTCFullYear() + 543;
  return `${day} ${month} ${year}`;
}
