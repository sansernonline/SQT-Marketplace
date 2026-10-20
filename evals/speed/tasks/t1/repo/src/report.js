import { formatThaiDate } from "./thaiDate.js";
export function reportHeader(date, title) {
  return `${title} · ประจำวันที่ ${formatThaiDate(date)}`;
}
