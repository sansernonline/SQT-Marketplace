// --self-test ของ plan.mjs · ตัวอย่างใน superuser/references/team-roles.md "แบ่งงาน" + กรณีผิดที่ต้องจับได้
import { validate, ranks, analyse, render } from "./plan.mjs";

const example = { name: "ตัวอย่าง team-roles", tasks: [
  { id: "a", title: "ออกแบบตาราง", size: 2, owns: ["db/schema.sql"], step: "design" },
  { id: "b", title: "เขียน API", size: 3, needs: ["a"], owns: ["src/api.ts"], step: "code" },
  { id: "c", title: "แก้ README", size: 1, owns: ["README.md"] },
  { id: "d", title: "ทดสอบรวม", size: 2, needs: ["b"], step: "test" },
] };
const wide = { tasks: Array.from({ length: 10 }, (_, i) => ({ id: `w${i}`, size: 1 })) };
const solo = { tasks: [{ id: "x", size: 2 }, { id: "y", size: 2 }, { id: "z", size: 1, solo: true }] };

export function selfTest() {
  const a = analyse(example);
  const r = ranks(example.tasks);
  const md = render(example, a);
  const w = analyse(wide), wCap = analyse(wide, { agents: 3 });
  const s = analyse(solo);
  const zRun = s.schedule.find((x) => x.id === "z");
  const cases = [
    ["rank ก 7 · ข 5 · ง 2 · ค 1", [r.get("a"), r.get("b"), r.get("d"), r.get("c")].join() === "7,5,2,1"],
    ["สายวิกฤต ก → ข → ง ยาว 7 · งานรวม 8", a.cp.join() === "a,b,d" && a.cpLen === 7 && a.total === 8],
    ["กว้างสุด 2 · ขนานได้ 7 (เร็วขึ้น 1.1 เท่า) จึงใช้ลูกทีม 1 · ตัวเดียวได้ 8", a.width === 2 && Math.abs(a.parallelSpeedup - 8 / 7) < 1e-9 && a.team === 1 && a.makespan === 8],
    ["ปล่อยชิ้น rank สูงก่อน: ก ลำดับ 1 · ค ไปท้ายสุด", md.includes("| 1 | a ออกแบบตาราง") && md.includes("| 4 | c แก้ README")],
    ["เร็วขึ้นใกล้ 1 เท่า → บอกเหตุที่ใช้ตัวเดียว", md.includes("เร็วขึ้นแค่ 1.1 เท่า")],
    ["บรรทัดคาด: พร้อมใช้", md.includes("คาด: ลูกทีม 1 · สายวิกฤต 7k · กว้างสุด 2 · เร็วขึ้น 1.0 เท่า")],
    ["ค่า k ต่อขั้นคูณขนาด (code × 2 → ข 6 · rank ก 10)", ranks(analyse(example, { k: { code: 2 } }).tasks).get("a") === 10],
    ["กว้าง 10 → ลูกทีม 8 และเตือน dynamic workflow", w.width === 10 && w.team === 8 && w.needsWorkflow && render(wide, w).includes("dynamic workflow")],
    ["--agents 3 จำกัดลูกทีม · ไม่เตือน workflow", wCap.team === 3 && !wCap.needsWorkflow && wCap.makespan === 4],
    ["ชิ้นคนเดียวไม่ทับเวลากับชิ้นอื่น", s.schedule.filter((x) => x.id !== "z").every((x) => x.end <= zRun.start || x.start >= zRun.end)],
    ["จับกราฟวน", validate({ tasks: [{ id: "p", size: 1, needs: ["q"] }, { id: "q", size: 1, needs: ["p"] }] }).some((e) => e.includes("วน"))],
    ["จับเจ้าของไฟล์ซ้ำที่ไม่ได้รอกัน", validate({ tasks: [{ id: "p", size: 1, owns: ["f"] }, { id: "q", size: 1, owns: ["f"] }] }).some((e) => e.includes("เจ้าของ f"))],
    ["เจ้าของไฟล์ซ้ำแต่รอกันแล้ว → ผ่าน", validate({ tasks: [{ id: "p", size: 1, owns: ["f"] }, { id: "q", size: 1, owns: ["f"], needs: ["p"] }] }).length === 0],
    ["จับชิ้นที่รอชิ้นไม่มีอยู่ · id ซ้ำ · size 0", validate({ tasks: [{ id: "p", size: 0, needs: ["zz"] }, { id: "p", size: 1 }] }).length === 3],
    ["ตัวอย่างผ่านการตรวจ", validate(example).length === 0],
  ];
  let ok = 0;
  for (const [label, pass] of cases) { console.log(`  ${pass ? "✅" : "❌"} ${label}`); if (pass) ok++; }
  console.log(`\nself-test ${ok}/${cases.length} ผ่าน`);
  process.exit(ok === cases.length ? 0 : 1);
}
