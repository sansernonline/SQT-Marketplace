import { test } from "node:test"; import assert from "node:assert/strict";
import { parseCsv, toCsv } from "../src/csv.js"; import { freeSlots } from "../src/slots.js";
import { nextRun } from "../src/cron.js"; import { compare, satisfies } from "../src/semver.js";
import { createRouter } from "../src/router.js"; import { LruCache } from "../src/lru.js";
const D = (s) => new Date(s);
// csv
test("csv basic", () => assert.deepEqual(parseCsv("a,b\n1,2"), [["a", "b"], ["1", "2"]]));
test("csv quotes comma newline", () => assert.deepEqual(parseCsv('x,"a,b","l1\nl2"\r\n"he said ""hi""",z\n'), [["x", "a,b", "l1\nl2"], ['he said "hi"', "z"]]));
test("csv empty fields", () => assert.deepEqual(parseCsv("a,,c\n,,"), [["a", "", "c"], ["", "", ""]]));
test("csv unclosed", () => assert.throws(() => parseCsv('a,"b')));
test("csv roundtrip", () => { const r = [["a", 'q"', "c,d"], ["x\ny", "", "z"]]; assert.equal(toCsv(r), 'a,"q""","c,d"\r\n"x\ny",,z'); assert.deepEqual(parseCsv(toCsv(r)), r); });
// slots
test("slots simple", () => assert.deepEqual(freeSlots({ open: 540, close: 660, duration: 60, step: 30 }), [540, 570, 600]));
test("slots booking + edge touch", () => assert.deepEqual(freeSlots({ open: 540, close: 720, duration: 60, step: 30, bookings: [{ start: 600, end: 660 }] }), [540, 660]));
test("slots buffer", () => assert.deepEqual(freeSlots({ open: 540, close: 720, duration: 60, step: 30, buffer: 15, bookings: [{ start: 600, end: 660 }] }), []));
test("slots buffer 2", () => assert.deepEqual(freeSlots({ open: 480, close: 780, duration: 60, step: 30, buffer: 15, bookings: [{ start: 600, end: 660 }] }), [480, 510, 690, 720]));
test("slots invalid", () => { assert.throws(() => freeSlots({ open: 600, close: 540, duration: 30, step: 30 })); assert.throws(() => freeSlots({ open: 0, close: 60, duration: 0, step: 30 })); assert.throws(() => freeSlots({ open: 0, close: 60, duration: 30, step: 1.5 })); });
// cron
test("cron every 15", () => assert.equal(nextRun("*/15 * * * *", D("2026-10-20T10:07:30Z")).toISOString(), "2026-10-20T10:15:00.000Z"));
test("cron strictly after", () => assert.equal(nextRun("0 9 * * *", D("2026-10-20T09:00:00Z")).toISOString(), "2026-10-21T09:00:00.000Z"));
test("cron weekday range", () => assert.equal(nextRun("30 8 * * 1-5", D("2026-10-24T12:00:00Z")).toISOString(), "2026-10-26T08:30:00.000Z"));
test("cron dow 7 sunday", () => assert.equal(nextRun("0 0 * * 7", D("2026-10-20T00:00:00Z")).toISOString(), "2026-10-25T00:00:00.000Z"));
test("cron dom or dow", () => assert.equal(nextRun("0 12 1 * 3", D("2026-10-20T13:00:00Z")).toISOString(), "2026-10-21T12:00:00.000Z"));
test("cron list + month", () => assert.equal(nextRun("0 6 1,15 2 *", D("2026-10-20T00:00:00Z")).toISOString(), "2027-02-01T06:00:00.000Z"));
test("cron leap day", () => assert.equal(nextRun("0 0 29 2 *", D("2026-03-01T00:00:00Z")).toISOString(), "2028-02-29T00:00:00.000Z"));
test("cron invalid", () => { assert.throws(() => nextRun("60 * * * *", D("2026-01-01T00:00:00Z"))); assert.throws(() => nextRun("* * *", D("2026-01-01T00:00:00Z"))); assert.throws(() => nextRun("a * * * *", D("2026-01-01T00:00:00Z"))); });
// semver
test("semver compare", () => { assert.equal(compare("1.2.3", "1.10.0"), -1); assert.equal(compare("2.0.0", "2.0.0+build.5"), 0); assert.equal(compare("1.0.0", "1.0.0-rc.1"), 1); });
test("semver prerelease order", () => { const o = ["1.0.0-alpha", "1.0.0-alpha.1", "1.0.0-alpha.beta", "1.0.0-beta", "1.0.0-beta.2", "1.0.0-beta.11", "1.0.0-rc.1", "1.0.0"]; for (let i = 0; i < o.length - 1; i++) assert.equal(compare(o[i], o[i + 1]), -1, `${o[i]} < ${o[i + 1]}`); });
test("semver caret", () => { assert.ok(satisfies("1.9.9", "^1.2.3")); assert.ok(!satisfies("2.0.0", "^1.2.3")); assert.ok(satisfies("0.2.9", "^0.2.3")); assert.ok(!satisfies("0.3.0", "^0.2.3")); assert.ok(!satisfies("0.0.4", "^0.0.3")); });
test("semver tilde x", () => { assert.ok(satisfies("1.2.9", "~1.2.3")); assert.ok(!satisfies("1.3.0", "~1.2.3")); assert.ok(satisfies("1.7.0", "1.x")); assert.ok(!satisfies("2.0.0", "1.x")); assert.ok(satisfies("1.2.5", "1.2.x")); assert.ok(satisfies("9.9.9", "*")); });
test("semver ranges", () => { assert.ok(satisfies("1.5.0", ">=1.2.0 <2.0.0")); assert.ok(!satisfies("2.0.0", ">=1.2.0 <2.0.0")); assert.ok(satisfies("3.1.0", "^1.0.0 || ^3.0.0")); assert.ok(satisfies("1.2.3", "1.2.3")); });
test("semver prerelease gating", () => { assert.ok(!satisfies("1.3.0-beta.1", "^1.2.0")); assert.ok(satisfies("1.2.4-beta.2", ">=1.2.4-beta.1")); });
// router
test("router params & priority", () => { const r = createRouter(); r.add("GET", "/users/:id", "byId"); r.add("GET", "/users/me", "me"); r.add("GET", "/files/*", "files");
  assert.equal(r.match("GET", "/users/me").handler, "me"); const m = r.match("GET", "/users/42/"); assert.equal(m.handler, "byId"); assert.deepEqual(m.params, { id: "42" });
  assert.deepEqual(r.match("GET", "/files/a/b%20c.txt").params, { "*": "a/b c.txt" }); assert.equal(r.match("GET", "/nope"), null); });
test("router query", () => { const r = createRouter(); r.add("GET", "/s", "s"); assert.deepEqual(r.match("GET", "/s?q=hello+world&t=a&t=b&x=%E0%B8%81").query, { q: "hello world", t: ["a", "b"], x: "ก" }); });
test("router method not allowed", () => { const r = createRouter(); r.add("GET", "/a", 1); r.add("POST", "/a", 2); assert.deepEqual(r.match("DELETE", "/a").allowed.sort(), ["GET", "POST"]); });
test("router param decode", () => { const r = createRouter(); r.add("GET", "/t/:name", 1); assert.equal(r.match("GET", "/t/%E0%B8%8A%E0%B8%B2").params.name, "ชา"); });
// lru
test("lru evicts least recent", () => { const c = new LruCache({ max: 2 }); c.set("a", 1); c.set("b", 2); c.get("a"); c.set("c", 3); assert.equal(c.has("b"), false); assert.equal(c.get("a"), 1); assert.equal(c.size, 2); });
test("lru has does not touch", () => { const c = new LruCache({ max: 2 }); c.set("a", 1); c.set("b", 2); c.has("a"); c.set("c", 3); assert.equal(c.has("a"), false); });
test("lru ttl", () => { let t = 1000; const c = new LruCache({ max: 5, ttlMs: 100, now: () => t }); c.set("a", 1); t = 1099; assert.equal(c.get("a"), 1); t = 1100; assert.equal(c.get("a"), undefined); assert.equal(c.has("a"), false); assert.equal(c.size, 0); });
test("lru delete & invalid", () => { const c = new LruCache({ max: 1 }); c.set("a", 1); assert.equal(c.delete("a"), true); assert.equal(c.size, 0); assert.throws(() => new LruCache({ max: 0 })); assert.throws(() => new LruCache({ max: 1.5 })); });
