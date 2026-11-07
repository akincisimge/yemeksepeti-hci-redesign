import test from 'node:test';
import assert from 'node:assert/strict';
import { deliversTo, locations, locationLabel } from '../src/data/delivery.ts';

test('Kötekli and Bodrum show different food and market providers', () => {
  const stores = ['f-1', 'f-2', 'ymarket-1', 'carrefour-1', 'bim-1'];
  assert.deepEqual(stores.filter(id => deliversTo(id, 'kotekli')), ['f-1', 'ymarket-1', 'bim-1']);
  assert.deepEqual(stores.filter(id => deliversTo(id, 'bodrum-merkez')), ['f-2', 'carrefour-1', 'bim-1']);
});
test('unsupported, missing and legacy stores do not silently get delivery', () => {
  for (const id of ['f-1', 'f-2', 'ymarket-1', 'carrefour-1', 'bim-1']) {
    assert.equal(deliversTo(id, 'adana-merkez'), false);
    assert.equal(deliversTo(id, undefined), false);
  }
  assert.equal(deliversTo('m-1', 'kotekli'), false);
  assert.equal(deliversTo('unknown-store', 'kotekli'), false);
  assert.equal(deliversTo('f-1', 'unknown-location'), false);
});
test('location labels include neighborhood, district and province', () => {
  assert.equal(locationLabel(locations[0]), 'Kötekli, Menteşe, Muğla');
  assert.equal(new Set(locations.map(x => x.id)).size, locations.length);
});
