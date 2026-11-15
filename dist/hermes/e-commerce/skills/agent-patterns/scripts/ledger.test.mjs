import { test } from "node:test";
import assert from "node:assert/strict";
import { add, mark, close, next, validate } from "./ledger.mjs";

const fresh = () => ({ claims: [] });

test("empty ledger asks for claims", () => {
  assert.match(next(fresh()).action, /add claims/);
});

test("OPEN claim with fewest checks comes first", () => {
  const l = fresh();
  add(l, "a", "A"); add(l, "b", "B");
  mark(l, "a", "OPEN");
  assert.match(next(l).action, /^check b /);
});

test("a single PROVED check does not close a claim (min rounds)", () => {
  const l = fresh();
  add(l, "a", "A");
  mark(l, "a", "PROVED", "test passes");
  const r = next(l);
  assert.equal(r.done, false);
  assert.match(r.action, /minimum is 2/);
  mark(l, "a", "PROVED", "fresh verifier: no counterexample");
  assert.equal(next(l).done, true);
});

test("min rounds is configurable", () => {
  const l = fresh();
  add(l, "a", "A");
  mark(l, "a", "PROVED", "x");
  assert.equal(next(l, { minRounds: 1 }).done, true);
});

test("REFUTED must be removed then closed", () => {
  const l = fresh();
  add(l, "a", "A");
  mark(l, "a", "REFUTED", "counterexample at f.js:3");
  assert.match(next(l).action, /REFUTED: remove it/);
  close(l, "a");
  assert.equal(next(l).done, true);
});

test("claim still OPEN at max rounds stops the loop and is reported", () => {
  const l = fresh();
  add(l, "a", "A");
  for (let i = 0; i < 4; i++) mark(l, "a", "OPEN");
  const r = next(l);
  assert.equal(r.done, true);
  assert.equal(r.stuck, true);
  assert.match(r.action, /still OPEN/);
});

test("PROVED and REFUTED require evidence; close only on REFUTED", () => {
  const l = fresh();
  add(l, "a", "A");
  assert.throws(() => mark(l, "a", "PROVED"), /evidence/);
  assert.throws(() => close(l, "a"), /only a REFUTED/);
});

test("a re-opened REFUTED claim is no longer closed", () => {
  const l = fresh();
  add(l, "a", "A");
  mark(l, "a", "REFUTED", "e"); close(l, "a");
  mark(l, "a", "OPEN");
  assert.equal(l.claims[0].closed, false);
});

test("validate rejects duplicate ids and bad status", () => {
  assert.throws(() => validate({ claims: [{ id: "a", status: "OPEN" }, { id: "a", status: "OPEN" }] }), /duplicate/);
  assert.throws(() => validate({ claims: [{ id: "a", status: "MAYBE" }] }), /status/);
});
