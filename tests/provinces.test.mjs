import test from "node:test";
import assert from "node:assert/strict";
import { provinces, filterProvinces, normalizeProvince } from "../src/data/provinces.ts";
import { locations } from "../src/data/delivery.ts";

test("all 81 unique Turkish provinces are sorted in Turkish alphabetical order and cover demo cities", () => {
  assert.equal(provinces.length, 81);
  assert.equal(new Set(provinces).size, 81);

  const expectedSorted = [...provinces].sort((a, b) => a.localeCompare(b, "tr"));
  assert.deepEqual(provinces, expectedSorted);
  assert.ok(provinces.indexOf("Iğdır") < provinces.indexOf("İstanbul"));

  for (const location of locations) {
    assert.ok(provinces.includes(location.city), `Missing demo city: ${location.city}`);
  }
});

test("province search supports Turkish characters, ASCII input, case and whitespace", () => {
  for (const query of ["istanbul", "İSTANBUL", "ISTANBUL", "  Istanbul  "]) {
    assert.deepEqual(filterProvinces(query), ["İstanbul"]);
  }
  assert.deepEqual(filterProvinces("MUGLA"), ["Muğla"]);
  assert.deepEqual(filterProvinces("ığdır"), ["Iğdır"]);
  assert.deepEqual(filterProvinces("IGDIR"), ["Iğdır"]);
  assert.deepEqual(filterProvinces("sanliurfa"), ["Şanlıurfa"]);
  assert.deepEqual(filterProvinces("canakkale"), ["Çanakkale"]);
  assert.equal(normalizeProvince("  İzmir   "), "izmir");
  assert.deepEqual(filterProvinces("not-a-city"), []);
  assert.equal(filterProvinces("").length, 81);
  assert.equal(filterProvinces("   ").length, 81);
});
