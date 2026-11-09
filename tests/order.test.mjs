import test from 'node:test';
import assert from 'node:assert/strict';
import { createDemoOrder, ORDER_STORAGE_KEY, parseDemoOrder, readDemoOrder, resolveDemoOrder, saveDemoOrder } from '../src/state/demoOrder.ts';
import { advanceDemoOrder, deliveryTimeLabel, orderStatusDescription, STAGE_AFTER_MS } from '../src/features/checkout/orderStatusModel.ts';

const created = new Date('2026-11-09T13:00:00.000Z');
const input = (service = 'food') => ({
  service, method: 'card-demo', now: created,
  lines: [
    { quantity: 2, product: { id: 'p1', name: 'Çorba', price: 49.9, storeName: 'Örnek İşletme', storeId: 's1', category: 'Yemek', description: '', service, unitLabel: '1 porsiyon' } },
    { quantity: 1, product: { id: 'p2', name: 'Pilav', price: 79.9, storeName: 'Örnek İşletme', storeId: 's1', category: 'Yemek', description: '', service } },
  ],
  address: { name: 'Deniz Yılmaz', address: 'Örnek Sokak No: 12', note: 'Zile basma', regionLabel: 'Muğla / Menteşe / Kötekli' },
  deliveryFee: 29.99, tip: 50, deliveryTime: '20-30 dk',
});
const memory = () => {
  const data = new Map();
  return { getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value) };
};

test('completed order owns a detached product and delivery snapshot after cart/address changes', () => {
  const source = input();
  const order = createDemoOrder(source);
  source.lines[0].product.name = 'Başka ürün';
  source.lines[0].quantity = 9;
  source.lines.length = 0;
  source.address.address = 'Başka adres';
  source.address.regionLabel = 'Başka bölge';
  assert.equal(order.snapshot.lines.length, 2);
  assert.equal(order.snapshot.lines[0].product.name, 'Çorba');
  assert.equal(order.snapshot.lines[0].quantity, 2);
  assert.equal(order.snapshot.address.address, 'Örnek Sokak No: 12');
  assert.equal(order.snapshot.address.regionLabel, 'Muğla / Menteşe / Kötekli');
});
test('snapshot preserves exact total, tip, note, units, method and service-specific order prefix', () => {
  const food = createDemoOrder({ ...input(), method: 'door-card-demo' });
  const market = createDemoOrder(input('market'));
  assert.equal(food.amount, 259.69);
  assert.equal(food.snapshot.tip, 50);
  assert.equal(food.snapshot.deliveryFee, 29.99);
  assert.equal(food.snapshot.address.note, 'Zile basma');
  assert.equal(food.snapshot.lines[0].product.unitLabel, '1 porsiyon');
  assert.equal(food.method, 'door-card-demo');
  assert.match(food.orderId, /^YMK-/);
  assert.match(market.orderId, /^MKT-/);
  assert.deepEqual(market.snapshot.deliveryMinutes, [20, 30]);
});
test('saving and reloading only allow-listed fields never retains card or arbitrary nested fields', () => {
  const storage = memory();
  const order = createDemoOrder(input());
  order.cardNumber = 'forbidden-number';
  order.cvv = 'forbidden-cvv';
  order.snapshot.address.card = 'forbidden-address-extra';
  order.snapshot.lines[0].product.secret = 'forbidden-product-extra';
  assert.equal(saveDemoOrder(order, storage), true);
  assert.ok(!storage.getItem(ORDER_STORAGE_KEY).includes('forbidden'));
  const restored = readDemoOrder(storage);
  assert.equal(restored.amount, 259.69);
  assert.equal(restored.snapshot.address.note, 'Zile basma');
});
test('invalid persisted snapshots, totals, quantities and identifiers are rejected', () => {
  const order = createDemoOrder(input());
  for (const mutate of [
    v => { v.amount += 1; },
    v => { v.snapshot.lines[0].quantity = -1; },
    v => { v.snapshot.lines[0].quantity = 1.5; },
    v => { v.snapshot.lines[0].product.price = -3; },
    v => { v.snapshot.address.name = ''; },
    v => { v.snapshot.deliveryMinutes = [30, 10]; },
    v => { v.snapshot.tip = 17; },
    v => { v.snapshot.lines = []; },
    v => { v.orderId = 'MKT-1234567'; },
  ]) {
    const changed = structuredClone(order); mutate(changed);
    assert.equal(parseDemoOrder(changed), null);
  }
});
test('legacy order remains readable without invented products or address', () => {
  const old = { orderId: 'DEMO-1234567', amount: 40, service: 'food', method: 'cash-demo', stage: 1, createdAt: created.toISOString() };
  assert.deepEqual(parseDemoOrder(old), old);
  assert.equal(parseDemoOrder(old).snapshot, undefined);
});
test('missing, malformed and inaccessible storage returns empty while failed write preserves existing record', () => {
  const storage = memory();
  assert.equal(readDemoOrder(storage), null);
  storage.setItem(ORDER_STORAGE_KEY, '{broken');
  assert.equal(readDemoOrder(storage), null);
  const blocked = { getItem() { throw Error('blocked'); }, setItem() { throw Error('blocked'); } };
  assert.equal(readDemoOrder(blocked), null);
  assert.equal(saveDemoOrder(createDemoOrder(input()), blocked), false);
  const valid = createDemoOrder(input());
  saveDemoOrder(valid, storage);
  assert.equal(saveDemoOrder({ ...valid, service: 'market', method: 'cash-demo' }, storage), false);
  assert.deepEqual(readDemoOrder(storage), valid);
});
test('a new navigation order wins over stale saved order when browser writes fail', () => {
  const saved = createDemoOrder(input());
  const fresh = createDemoOrder({ ...input('market'), now: new Date(created.getTime() + 2000) });
  assert.equal(resolveDemoOrder(fresh, saved).orderId, fresh.orderId);
  assert.equal(resolveDemoOrder(null, saved).orderId, saved.orderId);
  assert.equal(resolveDemoOrder({ orderId: 'invalid' }, null), null);
});
test('refreshing same order retains later saved progress instead of stale navigation stage', () => {
  const initial = createDemoOrder(input());
  const later = { ...initial, stage: 2 };
  assert.equal(resolveDemoOrder(initial, later).stage, 2);
  assert.equal(resolveDemoOrder(later, initial).stage, 2);
});
test('timeline changes only at the four specified boundaries', () => {
  const initial = createDemoOrder(input());
  const start = created.getTime();
  assert.equal(advanceDemoOrder(initial, start - 1).stage, 0);
  assert.equal(advanceDemoOrder(initial, start + 11_999).stage, 0);
  assert.equal(advanceDemoOrder(initial, start + 12_000).stage, 1);
  assert.equal(advanceDemoOrder(initial, start + 29_999).stage, 1);
  assert.equal(advanceDemoOrder(initial, start + 30_000).stage, 2);
  assert.equal(advanceDemoOrder(initial, start + 59_999).stage, 2);
  assert.equal(advanceDemoOrder(initial, start + 60_000).stage, 3);
  assert.deepEqual(STAGE_AFTER_MS, [0, 12_000, 30_000, 60_000]);
});
test('returning after inactivity catches up without creating another order or changing its snapshot', () => {
  const initial = createDemoOrder(input());
  const done = advanceDemoOrder(initial, created.getTime() + 180_000);
  assert.equal(done.stage, 3);
  assert.equal(done.orderId, initial.orderId);
  assert.equal(done.snapshot, initial.snapshot);
  assert.equal(done.amount, initial.amount);
  assert.equal(advanceDemoOrder(done, created.getTime()), done);
  assert.equal(advanceDemoOrder(done, created.getTime() + 600_000), done);
});
test('estimated and delivered time are stable in Turkey timezone across midnight', () => {
  const order = createDemoOrder({ ...input(), now: new Date('2026-11-09T20:50:00Z') });
  assert.equal(deliveryTimeLabel(order), '00:10 – 00:20');
  assert.equal(deliveryTimeLabel({ ...order, stage: 3 }), '23:51');
  assert.equal(deliveryTimeLabel({ ...order, snapshot: undefined }), 'Teslimat zamanı bu kayıtta bulunmuyor');
});
test('status copy follows service and current stage', () => {
  assert.match(orderStatusDescription(createDemoOrder(input())), /restorana/);
  assert.match(orderStatusDescription(createDemoOrder(input('market'))), /mağazaya/);
  assert.match(orderStatusDescription({ ...createDemoOrder(input()), stage: 2 }), /adresine doğru/);
  assert.match(orderStatusDescription({ ...createDemoOrder(input('market')), stage: 3 }), /Alışverişin teslim edildi/);
});
