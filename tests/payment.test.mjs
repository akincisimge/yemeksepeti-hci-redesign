import test from 'node:test';
import assert from 'node:assert/strict';
import {
  SAVED_CARD_KEY, cardFixture, createPaymentRunner, fixtureCard, fixtureLabel,
  forgetFixture, formatCardNumber, formatExpiry, normalizePaymentMethod,
  paymentMethods, readSavedFixture, saveFixture, validateCard,
} from '../src/features/checkout/paymentModel.ts';
import { calculateCheckout, readCheckoutDraft, saveCheckoutDraft, SAVED_ADDRESS } from '../src/features/checkout/checkoutModel.ts';
import { readDemoOrder, saveDemoOrder } from '../src/state/demoOrder.ts';

const now = new Date(2026, 10, 30, 23, 59);
const validCard = { holder: 'Deniz Yılmaz', number: '0000 0000 0000 0000', expiry: '12/30', cvv: '000' };
const memoryStorage = () => {
  const values = new Map();
  return { getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value), removeItem: key => values.delete(key) };
};

test('Food exposes four methods; Market exposes only online card and rejects persisted alternatives', () => {
  assert.deepEqual(paymentMethods('food'), ['card-demo', 'cash-demo', 'door-card-demo', 'meal-card-demo']);
  assert.deepEqual(paymentMethods('market'), ['card-demo']);
  assert.equal(normalizePaymentMethod('meal-card-demo', 'food'), 'meal-card-demo');
  assert.equal(normalizePaymentMethod('meal-card-demo', 'market'), 'card-demo');
  assert.equal(normalizePaymentMethod('unknown', 'food'), 'card-demo');
});
test('formatting retains leading zeroes and bounds pasted input', () => {
  assert.equal(formatCardNumber('0000000000000000'), '0000 0000 0000 0000');
  assert.equal(formatCardNumber('0000-0000-0000-0002-999'), '0000 0000 0000 0002');
  assert.equal(formatExpiry('1230'), '12/30');
  assert.equal(formatExpiry('12/3099'), '12/30');
  assert.equal(formatExpiry('1'), '1');
});
test('both presentation fixtures validate without pretending to authorize a real card', () => {
  assert.deepEqual(validateCard(validCard, now), {});
  assert.deepEqual(validateCard({ ...validCard, number: '0000 0000 0000 0002' }, now), {});
  assert.equal(cardFixture(validCard.number), 'presentation-card');
  assert.equal(cardFixture('0000 0000 0000 0002'), 'retry-card');
  assert.ok(validateCard({ ...validCard, number: '1234 5678 9012 3456' }, now).number);
});
test('empty card fields produce separate errors, and fixing CVV leaves other fields valid', () => {
  assert.deepEqual(Object.keys(validateCard({ holder: '', number: '', expiry: '', cvv: '' }, now)), ['holder', 'number', 'expiry', 'cvv']);
  assert.deepEqual(Object.keys(validateCard({ ...validCard, cvv: '00' }, now)), ['cvv']);
  assert.deepEqual(validateCard({ ...validCard, cvv: '0000' }, now), {});
  assert.ok(validateCard({ ...validCard, cvv: 'a00' }, now).cvv);
  assert.ok(validateCard({ ...validCard, cvv: '00000' }, now).cvv);
});
test('expiry remains valid through its final month and rejects past/invalid months', () => {
  assert.deepEqual(validateCard({ ...validCard, expiry: '11/26' }, now), {});
  for (const expiry of ['10/26', '12/25', '00/30', '13/30', '1/30', '11/2']) {
    assert.ok(validateCard({ ...validCard, expiry }, now).expiry, expiry);
  }
});
test('tip updates the payable total but cannot satisfy minimum basket value', () => {
  const line = { product: { price: 149.99 }, quantity: 1 };
  const totals = calculateCheckout([line], { deliveryFee: 29.99, minBasket: 150 }, 100);
  assert.equal(totals.total, 279.98);
  assert.equal(totals.tip, 100);
  assert.equal(totals.remaining, 0.01);
  assert.equal(totals.canContinue, false);
});
test('removing a tip restores exact totals; empty baskets and unsupported tips do not add a charge', () => {
  const lines = [{ product: { price: 49.9 }, quantity: 2 }, { product: { price: 79.9 }, quantity: 1 }];
  assert.equal(calculateCheckout(lines, { deliveryFee: 29.99 }, 50).total, 259.69);
  assert.equal(calculateCheckout(lines, { deliveryFee: 29.99 }, 0).total, 209.69);
  assert.equal(calculateCheckout([], { deliveryFee: 29.99 }, 50).total, 0);
  for (const tip of [-1, NaN, Infinity, 31]) assert.equal(calculateCheckout(lines, undefined, tip).tip, 0);
});
test('saved-card preference contains only a fixture identifier, never card fields', () => {
  const storage = memoryStorage();
  assert.equal(saveFixture(storage, 'presentation-card'), true);
  assert.deepEqual(JSON.parse(storage.getItem(SAVED_CARD_KEY)), { fixtureId: 'presentation-card' });
  assert.equal(readSavedFixture(storage), 'presentation-card');
  const card = fixtureCard('presentation-card');
  assert.equal(card.cvv, '');
  assert.equal(fixtureLabel('presentation-card'), '•••• 0000');
  assert.equal(forgetFixture(storage), true);
  assert.equal(readSavedFixture(storage), undefined);
});
test('malformed saved-card data and blocked storage fail gracefully', () => {
  const storage = memoryStorage();
  for (const value of ['{', 'null', '42', '{"fixtureId":"real-card"}']) {
    storage.setItem(SAVED_CARD_KEY, value);
    assert.equal(readSavedFixture(storage), undefined);
  }
  const blocked = { getItem() { throw Error('blocked'); }, setItem() { throw Error('blocked'); }, removeItem() { throw Error('blocked'); } };
  assert.equal(readSavedFixture(blocked), undefined);
  assert.equal(saveFixture(blocked, 'presentation-card'), false);
  assert.equal(forgetFixture(blocked), false);
  assert.equal(saveFixture(undefined, 'presentation-card'), false);
});
test('all four Food choices survive address draft restoration without persisting card values', () => {
  const storage = memoryStorage();
  for (const method of paymentMethods('food')) {
    saveCheckoutDraft(storage, 'food', 'kotekli', { ...SAVED_ADDRESS, method, ...validCard });
    const restored = readCheckoutDraft(storage, 'food', 'kotekli');
    assert.equal(restored.method, method);
    assert.equal(restored.cvv, undefined);
    assert.equal(restored.number, undefined);
  }
});
test('a second simultaneous payment cannot start another order attempt', async () => {
  const runner = createPaymentRunner(5);
  const first = runner.run({ method: 'card-demo', fixtureId: 'presentation-card' });
  assert.equal(runner.pending(), true);
  assert.equal((await runner.run({ method: 'card-demo', fixtureId: 'presentation-card' })).status, 'busy');
  assert.equal((await first).status, 'succeeded');
  assert.equal(runner.pending(), false);
});
test('retry fixture fails once then succeeds with the same data', async () => {
  const runner = createPaymentRunner(1);
  const request = { method: 'card-demo', fixtureId: 'retry-card' };
  assert.equal((await runner.run(request)).status, 'failed');
  assert.equal((await runner.run(request)).status, 'succeeded');
});
test('cancelling processing suppresses success and does not consume the retry scenario', async () => {
  const runner = createPaymentRunner(5);
  const request = { method: 'card-demo', fixtureId: 'retry-card' };
  const pending = runner.run(request);
  runner.cancel();
  assert.equal((await pending).status, 'cancelled');
  assert.equal((await runner.run(request)).status, 'failed');
});
test('an old cancelled attempt cannot unlock a newer active attempt', async () => {
  const runner = createPaymentRunner(5);
  const first = runner.run({ method: 'cash-demo' });
  runner.cancel();
  const next = runner.run({ method: 'door-card-demo' });
  assert.equal((await first).status, 'cancelled');
  assert.equal(runner.pending(), true);
  assert.equal((await next).status, 'succeeded');
});
test('delivery methods require no online card fields; online card requires a fixture', async () => {
  const runner = createPaymentRunner(1);
  for (const method of ['cash-demo', 'door-card-demo', 'meal-card-demo']) {
    assert.equal((await runner.run({ method })).status, 'succeeded');
  }
  assert.equal((await runner.run({ method: 'card-demo' })).status, 'failed');
});
test('order persistence accepts all Food methods but rejects unsupported Market delivery payment', () => {
  const previous = Object.getOwnPropertyDescriptor(globalThis, 'sessionStorage');
  Object.defineProperty(globalThis, 'sessionStorage', { configurable: true, value: memoryStorage() });
  const order = { orderId: 'DEMO-1234567', amount: 235.89, service: 'food', stage: 0, createdAt: now.toISOString() };
  try {
    for (const method of paymentMethods('food')) {
      saveDemoOrder({ ...order, method });
      assert.equal(readDemoOrder().method, method);
    }
    saveDemoOrder({ ...order, service: 'market', method: 'door-card-demo' });
    assert.equal(readDemoOrder(), null);
    saveDemoOrder({ ...order, service: 'market', method: 'card-demo' });
    assert.equal(readDemoOrder().amount, 235.89);
  } finally {
    if (previous) Object.defineProperty(globalThis, 'sessionStorage', previous);
    else delete globalThis.sessionStorage;
  }
});
