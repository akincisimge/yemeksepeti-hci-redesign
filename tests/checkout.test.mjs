import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateCheckout, clearCheckoutDraft, deliveryMinutes, draftKey, readCheckoutDraft,
  saveCheckoutDraft, SAVED_ADDRESS, validateAddress,
} from '../src/features/checkout/checkoutModel.ts';

const line = (price, quantity = 1) => ({ product: { price }, quantity });
const memoryStorage = () => {
  const values = new Map();
  return { getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value), removeItem: key => values.delete(key) };
};

test('a delivery fee cannot satisfy the minimum basket amount', () => {
  const totals = calculateCheckout([line(149.99)], { minBasket: 150, deliveryFee: 29.99 });
  assert.equal(totals.canContinue, false);
  assert.equal(totals.remaining, 0.01);
  assert.equal(totals.total, 179.98);
  assert.equal(calculateCheckout([line(150)], { minBasket: 150, deliveryFee: 29.99 }).canContinue, true);
});
test('quantities and decimal prices produce an exact kuruş total', () => {
  const totals = calculateCheckout([line(49.9, 2), line(79.9)], { deliveryFee: 29.99 });
  assert.equal(totals.subtotal, 179.7);
  assert.equal(totals.total, 209.69);
  assert.equal(totals.count, 3);
  assert.equal(totals.canContinue, true);
});
test('an empty cart cannot proceed and has no delivery charge', () => {
  const totals = calculateCheckout([], { deliveryFee: 29.99, minBasket: 0 });
  assert.equal(totals.total, 0);
  assert.equal(totals.canContinue, false);
});
test('address errors identify the invalid field; optional notes can be blank', () => {
  assert.deepEqual(validateAddress(SAVED_ADDRESS), {});
  assert.deepEqual(Object.keys(validateAddress({ ...SAVED_ADDRESS, name: '  ' })), ['name']);
  assert.deepEqual(Object.keys(validateAddress({ ...SAVED_ADDRESS, address: 'Kötekli' })), ['address']);
  assert.deepEqual(Object.keys(validateAddress({ ...SAVED_ADDRESS, note: 'x'.repeat(201) })), ['note']);
});
test('returning to the same service and region restores the edited address and note', () => {
  const storage = memoryStorage();
  const draft = { ...SAVED_ADDRESS, address: 'Örnek Cadde No: 8', note: 'Zile basma', method: 'card-demo' };
  saveCheckoutDraft(storage, 'food', 'kotekli', draft);
  assert.deepEqual(readCheckoutDraft(storage, 'food', 'kotekli'), draft);
  assert.equal(readCheckoutDraft(storage, 'market', 'kotekli').address, '');
  assert.equal(readCheckoutDraft(storage, 'food', 'bodrum-merkez').address, '');
});
test('completing one order removes only that service and region draft', () => {
  const storage = memoryStorage();
  const draft = { ...SAVED_ADDRESS, method: 'card-demo' };
  saveCheckoutDraft(storage, 'food', 'kotekli', draft);
  saveCheckoutDraft(storage, 'market', 'kotekli', draft);
  clearCheckoutDraft(storage, 'food', 'kotekli');
  assert.equal(readCheckoutDraft(storage, 'food', 'kotekli').address, '');
  assert.equal(readCheckoutDraft(storage, 'market', 'kotekli').address, SAVED_ADDRESS.address);
});
test('malformed or unavailable storage does not break checkout', () => {
  const storage = memoryStorage();
  for (const invalid of ['{', 'null', '42', '{"name":5}', JSON.stringify({ ...SAVED_ADDRESS, address: 'x'.repeat(301) })]) {
    storage.setItem(draftKey('food', 'kotekli'), invalid);
    assert.equal(readCheckoutDraft(storage, 'food', 'kotekli').address, '');
  }
  const unavailable = { getItem() { throw Error('blocked'); }, setItem() { throw Error('blocked'); }, removeItem() { throw Error('blocked'); } };
  assert.equal(readCheckoutDraft(unavailable, 'food', 'kotekli').address, '');
  assert.doesNotThrow(() => saveCheckoutDraft(unavailable, 'food', 'kotekli', { ...SAVED_ADDRESS, method: 'cash-demo' }));
});
test('Market draft preserves cash while excluding card credentials and unsupported meal cards', () => {
  const storage = memoryStorage();
  saveCheckoutDraft(storage, 'market', 'kotekli', { ...SAVED_ADDRESS, method: 'cash-demo', cardNumber: '0000 0000 0000 0000', cvv: '000' });
  const raw = JSON.parse(storage.getItem(draftKey('market', 'kotekli')));
  assert.deepEqual(Object.keys(raw).sort(), ['address', 'method', 'name', 'note']);
  assert.equal(readCheckoutDraft(storage, 'market', 'kotekli').method, 'cash-demo');
  saveCheckoutDraft(storage, 'market', 'kotekli', { ...SAVED_ADDRESS, method: 'meal-card-demo' });
  assert.equal(readCheckoutDraft(storage, 'market', 'kotekli').method, 'card-demo');
});
test('delivery estimates parse catalog intervals and use a stable fallback for missing or invalid ranges', () => {
  for (const label of ['20-30 dk', '20–30', ' 20 - 30 dk ']) assert.deepEqual(deliveryMinutes(label), [20, 30]);
  for (const label of [undefined, '', 'soon', '30-20 dk', '0-30', '20-999']) assert.deepEqual(deliveryMinutes(label), [20, 35]);
});
