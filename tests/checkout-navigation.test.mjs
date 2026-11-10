import test from 'node:test';
import assert from 'node:assert/strict';
import { checkoutCatalogPath, clearCheckoutReturn, readCheckoutReturn, rememberCheckoutReturn } from '../src/features/checkout/checkoutNavigation.ts';

const memoryStorage = () => {
  const values = new Map();
  return { values, getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value), removeItem: key => values.delete(key) };
};

test('adding more products targets the current seller in either service', () => {
  assert.equal(checkoutCatalogPath('market', 'bim'), '/market/bim');
  assert.equal(checkoutCatalogPath('food', 'f-2'), '/food?store=f-2');
  assert.equal(checkoutCatalogPath('market', ''), '/market');
  assert.equal(checkoutCatalogPath('food', 'store&other=1'), '/food?store=store%26other%3D1');
});
test('a shopping return retains the tip without storing payment credentials', () => {
  const storage = memoryStorage();
  rememberCheckoutReturn(storage, 'market', 'kotekli', { storeId: 'bim', tip: 30, cardNumber: '0000', cvv: '000' });
  assert.deepEqual(readCheckoutReturn(storage, 'market', 'kotekli', 'bim'), { storeId: 'bim', tip: 30 });
  assert.deepEqual(JSON.parse([...storage.values.values()][0]), { storeId: 'bim', tip: 30 });
});
test('a different seller, region, service or an empty cart cannot resume that payment', () => {
  const storage = memoryStorage();
  rememberCheckoutReturn(storage, 'market', 'kotekli', { storeId: 'bim', tip: 0 });
  for (const args of [['market', 'kotekli', 'carrefour'], ['market', 'orhaniye', 'bim'], ['food', 'kotekli', 'bim'], ['market', 'kotekli', '']]) {
    assert.equal(readCheckoutReturn(storage, ...args), undefined);
  }
});
test('consuming a return does not redirect later visits or delete another service return', () => {
  const storage = memoryStorage();
  rememberCheckoutReturn(storage, 'market', 'kotekli', { storeId: 'bim', tip: 30 });
  rememberCheckoutReturn(storage, 'food', 'kotekli', { storeId: 'f-2', tip: 50 });
  clearCheckoutReturn(storage, 'market', 'kotekli');
  assert.equal(readCheckoutReturn(storage, 'market', 'kotekli', 'bim'), undefined);
  assert.deepEqual(readCheckoutReturn(storage, 'food', 'kotekli', 'f-2'), { storeId: 'f-2', tip: 50 });
});
test('invalid return data or blocked storage falls back to normal address-first checkout', () => {
  const storage = memoryStorage();
  rememberCheckoutReturn(storage, 'market', 'kotekli', { storeId: 'bim', tip: 0 });
  const key = [...storage.values.keys()][0];
  for (const raw of ['{', 'null', '42', '{}', '{"storeId":"bim","tip":999}', '{"storeId":"bim","tip":"30"}']) {
    storage.setItem(key, raw);
    assert.equal(readCheckoutReturn(storage, 'market', 'kotekli', 'bim'), undefined);
  }
  const blocked = { getItem() { throw Error('blocked'); }, setItem() { throw Error('blocked'); }, removeItem() { throw Error('blocked'); } };
  assert.equal(readCheckoutReturn(blocked, 'market', 'kotekli', 'bim'), undefined);
  assert.doesNotThrow(() => rememberCheckoutReturn(blocked, 'market', 'kotekli', { storeId: 'bim', tip: 0 }));
  assert.doesNotThrow(() => clearCheckoutReturn(blocked, 'market', 'kotekli'));
});
