import test from "node:test";
import assert from "node:assert/strict";
import {
  normalizeDemoAccount,
  parseDemoAccount,
  SAMPLE_DEMO_ACCOUNT,
  validateDemoAccount,
} from "../src/state/demoAccount.ts";
import { buildSupportReply, SUPPORT_TOPICS } from "../src/data/supportAssistant.ts";
import { createSamplePreviewOrder, DEMO_TRACKING_STEPS } from "../src/state/demoOrder.ts";

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

test("support assistant uses active order, location and account context honestly", () => {
  assert.equal(SUPPORT_TOPICS.length, 5);

  const noOrderReply = buildSupportReply("Siparişim nerede?", {
    order: null,
    locationText: null,
    accountName: null,
  });
  assert.match(noOrderReply.text, /henüz aktif bir demo sipariş bulunmuyor/i);
  assert.equal(noOrderReply.action?.to, "/food");

  const withOrderReply = buildSupportReply("Siparişim nerede?", {
    order: {
      orderId: "DEMO-1234567",
      amount: 245,
      service: "food",
      method: "cash-demo",
      stage: 1,
      createdAt: new Date().toISOString(),
    },
    locationText: "Kötekli, Menteşe, Muğla",
    accountName: "Ayşe Yılmaz (Demo)",
  });
  assert.match(withOrderReply.text, /DEMO-1234567/);
  assert.match(withOrderReply.text, /2\. aşamada \(Hazırlanıyor\)/);
  assert.equal(withOrderReply.action?.to, "/track");

  const addressReply = buildSupportReply("Adres değiştirmek istiyorum", {
    order: null,
    locationText: "Kötekli, Menteşe, Muğla",
    accountName: null,
  });
  assert.match(addressReply.text, /Kötekli, Menteşe, Muğla/);
  assert.equal(addressReply.action?.actionType, "open-address");

  const accountReply = buildSupportReply("Hesap nasıl açılır?", {
    order: null,
    locationText: null,
    accountName: "Ayşe Yılmaz (Demo)",
  });
  assert.match(accountReply.text, /Ayşe Yılmaz \(Demo\)/);
  assert.equal(accountReply.action?.to, "/account");
});

test("sample preview demo order creates valid 4-stage tracking state", () => {
  assert.equal(DEMO_TRACKING_STEPS.length, 4);
  const preview = createSamplePreviewOrder("Çarşı, Bodrum, Muğla");
  assert.match(preview.orderId, /^DEMO-\d{7}$/);
  assert.equal(preview.stage, 1);
  assert.equal(preview.locationLabel, "Çarşı, Bodrum, Muğla");
  assert.equal(preview.service, "food");
});
