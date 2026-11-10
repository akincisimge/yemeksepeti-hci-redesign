import test from 'node:test';
import assert from 'node:assert/strict';
import { provinces, filterProvinces } from '../src/data/provinces.ts';
import { locations } from '../src/data/delivery.ts';
test('all 81 unique provinces and existing demo cities are selectable', () => {
  assert.equal(provinces.length, 81);
  assert.equal(new Set(provinces).size, 81);
  for (const location of locations) assert.ok(provinces.includes(location.city));
});
test('search supports Turkish characters, ASCII input, case and whitespace', () => {
  for (const query of ['istanbul', 'İSTANBUL', ' Istanbul ']) assert.deepEqual(filterProvinces(query), ['İstanbul']);
  assert.deepEqual(filterProvinces('MUGLA'), ['Muğla']);
  assert.deepEqual(filterProvinces('ığdır'), ['Iğdır']);
  assert.deepEqual(filterProvinces('not-a-city'), []);
  assert.equal(filterProvinces('').length, 81);
});
