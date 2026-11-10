import test from "node:test";
import assert from "node:assert/strict";
import {
  analyzeLocationChange,
  createCustomLocation,
  deliversTo,
  formatLocationChangeMessage,
  getProvinceDemoCoverage,
  locationLabel,
  locations,
  resolveLocation,
  resolveLocationIdForSelection,
} from "../src/data/delivery.ts";
import {
  getDistrictsForCity,
  getNeighborhoodsForDistrict,
  loadTurkeyRegions,
} from "../src/data/regions.ts";

const sampleMarketProduct = {
  id: "m1",
  name: "Sütaş Süzme Peynir",
  description: "500 g",
  price: 190.9,
  category: "Süt ve Kahvaltılık",
  storeId: "ymarket-1",
  storeName: "Yemeksepeti Market",
  service: "market",
};

const sampleFoodProduct = {
  id: "food-crispy-1",
  name: "Double Cheddar Menü",
  description: "Burger ve patates",
  price: 320,
  category: "Ana Lezzetler",
  storeId: "food-crispy-co",
  storeName: "Crispy Co Burger",
  service: "food",
};

test("Kötekli and Bodrum show different food and market providers", () => {
  const stores = ["f-1", "f-2", "ymarket-1", "carrefour-1", "bim-1"];
  assert.deepEqual(stores.filter((id) => deliversTo(id, "kotekli")), ["f-1", "ymarket-1", "bim-1"]);
  assert.deepEqual(stores.filter((id) => deliversTo(id, "bodrum-merkez")), ["f-2", "carrefour-1", "bim-1"]);
});

test("unsupported, missing and legacy stores do not silently get delivery", () => {
  for (const id of ["f-1", "f-2", "ymarket-1", "carrefour-1", "bim-1"]) {
    assert.equal(deliversTo(id, "adana-merkez"), false);
    assert.equal(deliversTo(id, undefined), false);
  }
  assert.equal(deliversTo("m-1", "kotekli"), false);
  assert.equal(deliversTo("unknown-store", "kotekli"), false);
  assert.equal(deliversTo("f-1", "unknown-location"), false);
});

test("location labels include neighborhood, district and province", () => {
  assert.equal(locationLabel(locations[0]), "Kötekli, Menteşe, Muğla");
  assert.equal(new Set(locations.map((x) => x.id)).size, locations.length);
});

test("province demo coverage separates full demo, food-only demo, and unsupported cities", () => {
  assert.deepEqual(getProvinceDemoCoverage("Muğla"), { supported: true, hasFood: true, hasMarket: true });
  assert.deepEqual(getProvinceDemoCoverage("Adana"), { supported: true, hasFood: true, hasMarket: false });
  assert.deepEqual(getProvinceDemoCoverage("İstanbul"), { supported: false, hasFood: false, hasMarket: false });
});

test("location change plan detects affected market basket while preserving compatible food basket", () => {
  const carts = {
    food: [{ product: sampleFoodProduct, quantity: 2 }],
    market: [{ product: sampleMarketProduct, quantity: 3 }],
  };

  const plan = analyzeLocationChange(carts, "bodrum-merkez");
  assert.ok(plan);
  assert.equal(plan.target.id, "bodrum-merkez");
  assert.deepEqual(plan.affected, [
    {
      service: "market",
      serviceLabel: "Market",
      storeName: "Yemeksepeti Market",
      itemCount: 3,
    },
  ]);
  assert.deepEqual(plan.preserved, [
    {
      service: "food",
      serviceLabel: "Yemek",
      storeName: "Crispy Co Burger",
      itemCount: 2,
    },
  ]);

  const message = formatLocationChangeMessage(plan);
  assert.match(message, /Çarşı, Bodrum, Muğla/);
  assert.match(message, /Market sepeti \(Yemeksepeti Market\)/);
  assert.match(message, /Yemek sepetin korundu/);
});

test("location change to unknown location returns null without side effects", () => {
  const carts = {
    food: [],
    market: [{ product: sampleMarketProduct, quantity: 1 }],
  };
  assert.equal(analyzeLocationChange(carts, "istanbul-merkez"), null);
});

test("custom locations across all 81 provinces resolve cleanly and enable active food and market stores", () => {
  const custom = createCustomLocation("İstanbul", "Kadıköy", "Caferağa");
  assert.ok(custom);
  assert.equal(locationLabel(custom), "Caferağa, Kadıköy, İstanbul");
  assert.deepEqual(resolveLocation(custom.id), custom);
  assert.equal(deliversTo("food-crispy-co", custom.id), true);
  assert.equal(deliversTo("ymarket-1", custom.id), true);
  assert.equal(deliversTo("carrefour-1", custom.id), true);
  assert.equal(deliversTo("unknown-store", custom.id), false);
  assert.equal(createCustomLocation("NotAProvince", "Merkez", "Merkez"), null);
});

test("turkeyRegions dataset includes all 81 provinces with real districts and neighborhoods", async () => {
  const regions = await loadTurkeyRegions();
  assert.equal(Object.keys(regions).length, 81);
  assert.equal(getDistrictsForCity(regions, "İstanbul").includes("Kadıköy"), true);
  assert.equal(getNeighborhoodsForDistrict(regions, "İstanbul", "Kadıköy").includes("Caferağa Mah"), true);
  assert.equal(getNeighborhoodsForDistrict(regions, "Muğla", "Menteşe").includes("Kötekli Mah"), true);

  assert.equal(resolveLocationIdForSelection("Muğla", "Menteşe", "Kötekli Mah"), "kotekli");
  assert.equal(resolveLocationIdForSelection("Muğla", "Bodrum", "Çarşı Mah"), "bodrum-merkez");
  assert.equal(resolveLocationIdForSelection("Adana", "Seyhan", "Reşatbey Mah"), "adana-merkez");

  const kadikoyId = resolveLocationIdForSelection("İstanbul", "Kadıköy", "Caferağa Mah");
  assert.ok(kadikoyId);
  assert.equal(locationLabel(resolveLocation(kadikoyId)), "Caferağa Mah, Kadıköy, İstanbul");
});
