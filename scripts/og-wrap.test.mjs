// Small regression test for scripts/og-wrap.mjs (review fix #3 on gooze #80).
// The bug: when the last allowed line was reached, the rest of the text
// REPLACED the line that was just built, silently dropping already-wrapped
// words. Run with: node --test scripts/og-wrap.test.mjs
import assert from "node:assert/strict";
import { test } from "node:test";
import { wrapLines } from "./og-wrap.mjs";

test("short text stays on one line", () => {
  assert.deepEqual(wrapLines("hello", 10, 2), ["hello"]);
});

test("no ellipsis when everything fits", () => {
  assert.deepEqual(wrapLines("one two three four", 10, 2), ["one two", "three four"]);
});

test("review example: rest folds into the pushed line, nothing is dropped", () => {
  // maxChars=10, maxLines=2. "one two three four five six seven eight nine ten
  // eleven twelve" cannot fit; the second line must keep the words that were
  // already being built ("three four") and fold the overflow behind an
  // ellipsis, instead of replacing them with the tail ("five six ...").
  const lines = wrapLines("one two three four five six seven eight nine ten eleven twelve", 10, 2);
  assert.equal(lines.length, 2);
  assert.equal(lines[0], "one two");
  // The old code dropped the pushed line entirely and started the last line
  // at the tail ("five six …"). Fixed: the built words come first, clipped by
  // the budget with a trailing ellipsis.
  assert.ok(lines[1].startsWith("three"), `expected to keep "three four", got ${lines[1]}`);
  assert.ok(lines[1].endsWith("…"), `expected ellipsis, got ${lines[1]}`);
  assert.ok(!lines[1].startsWith("five"), `tail must not replace the pushed line, got ${lines[1]}`);
});

test("maxLines cap is respected with an ellipsis on the final line", () => {
  const lines = wrapLines("a string that is very very long indeed and keeps going", 10, 2);
  assert.equal(lines.length, 2);
  assert.ok(lines[1].endsWith("…"));
});

test("every line stays within the character budget", () => {
  const long = "alpha bravo charlie delta echo foxtrot golf hotel india juliet kilo lima mike november";
  for (const maxChars of [10, 20, 30]) {
    for (const line of wrapLines(long, maxChars, 3)) {
      assert.ok(line.length <= maxChars, `line "${line}" exceeds ${maxChars}`);
    }
  }
});
