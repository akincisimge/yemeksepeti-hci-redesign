import test from "node:test";
import assert from "node:assert/strict";
import {
  calculateFoodCouponDiscount,
  createCustomizedFoodProduct,
  foodCoupons,
  foodProducts,
  foodRestaurants,
  getFoodCouponCampaignProducts,
  getFoodCustomizationOptions,
} from "../src/features/food/data/foodData.ts";
import { analyzeLocationChange, deliversTo, locations } from "../src/data/delivery.ts";

test("all food restaurants deliver to demo locations and have menu products", () => {
  for (const restaurant of foodRestaurants) {
    const menu = foodProducts.filter((product) => product.storeId === restaurant.id);
    assert.ok(menu.length > 0, `No menu products for ${restaurant.id}`);
    for (const loc of locations) {
      assert.equal(deliversTo(restaurant.id, loc.id), true, `Expected delivery for ${restaurant.id} at ${loc.id}`);
    }
  }
});

test("food coupon discount applies only when restaurant, minimum subtotal and campaign item match", () => {
  const burgerCoupon = foodCoupons.find((coupon) => coupon.code === "BURGER75");
  assert.ok(burgerCoupon);

  const campaignItems = getFoodCouponCampaignProducts(burgerCoupon, "food-crispy-co");
  assert.equal(campaignItems.length, 1);
  const campaignProduct = campaignItems[0];

  const belowMinimum = calculateFoodCouponDiscount(burgerCoupon, [{ product: campaignProduct, quantity: 1 }]);
  if (campaignProduct.price < burgerCoupon.minimumSubtotal) {
    assert.equal(belowMinimum.applicable, false);
    assert.equal(belowMinimum.discount, 0);
  }

  const eligibleQty = Math.ceil(burgerCoupon.minimumSubtotal / campaignProduct.price);
  const applied = calculateFoodCouponDiscount(burgerCoupon, [{ product: campaignProduct, quantity: eligibleQty }]);
  assert.equal(applied.applicable, true);
  assert.equal(applied.discount, burgerCoupon.discountValue);

  const otherRestaurantProduct = foodProducts.find((product) => product.storeId === "food-meydan-pizza");
  assert.ok(otherRestaurantProduct);
  const wrongStore = calculateFoodCouponDiscount(burgerCoupon, [{ product: otherRestaurantProduct, quantity: 3 }]);
  assert.equal(wrongStore.applicable, false);
  assert.equal(wrongStore.discount, 0);
});

test("customized food products keep deterministic ids, extras pricing and coupon eligibility", () => {
  const burgerCoupon = foodCoupons.find((coupon) => coupon.code === "BURGER75");
  assert.ok(burgerCoupon);
  const baseProduct = getFoodCouponCampaignProducts(burgerCoupon, "food-crispy-co")[0];
  const options = getFoodCustomizationOptions(baseProduct, "Burger");
  const extra = options.extras[0];

  const customized = createCustomizedFoodProduct(
    baseProduct,
    {
      removedIngredients: [options.ingredients[0]],
      extras: [extra.name],
      preference: "Bol Acılı",
      note: "Zile basmayın",
    },
    options,
  );

  assert.ok(customized.id.startsWith(`${baseProduct.id}-custom-`));
  assert.equal(customized.price, baseProduct.price + extra.price);

  const applied = calculateFoodCouponDiscount(burgerCoupon, [{ product: customized, quantity: 2 }]);
  assert.equal(applied.applicable, true);
  assert.equal(applied.discount, burgerCoupon.discountValue);
});

test("location change between Kötekli and Orhaniye preserves both compatible food and market baskets", () => {
  const foodItem = foodProducts.find((product) => product.storeId === "food-crispy-co");
  assert.ok(foodItem);

  const plan = analyzeLocationChange(
    {
      food: [{ product: foodItem, quantity: 1 }],
      market: [
        {
          product: {
            id: "m1",
            name: "Sütaş Süzme Peynir",
            description: "500 g",
            price: 190.9,
            category: "Süt ve Kahvaltılık",
            storeId: "ymarket-1",
            storeName: "Yemeksepeti Market",
            service: "market",
          },
          quantity: 1,
        },
      ],
    },
    "mentese-merkez",
  );

  assert.ok(plan);
  assert.equal(plan.affected.length, 0);
  assert.equal(plan.preserved.length, 2);
});
