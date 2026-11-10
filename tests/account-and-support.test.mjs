import test from "node:test";
import assert from "node:assert/strict";
import {
  normalizeDemoAccount,
  parseDemoAccount,
  SAMPLE_DEMO_ACCOUNT,
  validateDemoAccount,
} from "../src/state/demoAccount.ts";

test("demo account validation rejects invalid name, email, or phone and accepts sample account", () => {
  const invalid = validateDemoAccount({ name: "A", email: "bad-email", phone: "123" });
  assert.ok(invalid.name);
  assert.ok(invalid.email);
  assert.ok(invalid.phone);

  const valid = validateDemoAccount(SAMPLE_DEMO_ACCOUNT);
  assert.deepEqual(valid, {});
});

test("parseDemoAccount safely rejects corrupted storage and normalizes valid profiles", () => {
  assert.equal(parseDemoAccount(null), null);
  assert.equal(parseDemoAccount("not-json"), null);
  assert.equal(parseDemoAccount(JSON.stringify({ name: "A", email: "x", phone: "1" })), null);

  const normalized = normalizeDemoAccount({
    name: "  Simge Demo  ",
    email: "  simge@example.com ",
    phone: " 0500 111 22 33 ",
    deliveryNote: "   ",
  });
  assert.deepEqual(normalized, {
    name: "Simge Demo",
    email: "simge@example.com",
    phone: "0500 111 22 33",
  });

  const parsed = parseDemoAccount(JSON.stringify({
    name: "  Simge Demo  ",
    email: "simge@example.com",
    phone: "0500 111 22 33",
    deliveryNote: " Kapıya bırak ",
  }));
  assert.deepEqual(parsed, {
    name: "Simge Demo",
    email: "simge@example.com",
    phone: "0500 111 22 33",
    deliveryNote: "Kapıya bırak",
  });
});
