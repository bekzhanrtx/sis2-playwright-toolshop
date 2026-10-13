import { test, expect } from '../fixtures/testFixtures';

test.describe('4. Compare two products', () => {
  test('opens two products, captures name/price, asserts names differ and ranks by price', async ({
    homePage,
    productPage,
  }) => {
    // Open two catalog products and compare captured name + price (assignment comparison).
    await homePage.open();
    await homePage.openProductByIndex(0);
    const first = await productPage.captureDetails();

    await homePage.open();
    await homePage.openProductByIndex(1);
    const second = await productPage.captureDetails();

    expect(first.name.length).toBeGreaterThan(0);
    expect(second.name.length).toBeGreaterThan(0);
    expect(first.name).not.toEqual(second.name);

    expect(first.price).toBeGreaterThan(0);
    expect(second.price).toBeGreaterThan(0);

    // Stated comparison: identify the more expensive product of the pair.
    const higher = first.price >= second.price ? first : second;
    const lower = first.price >= second.price ? second : first;
    expect(higher.price).toBeGreaterThanOrEqual(lower.price);
    expect(`${higher.name} ($${higher.price})`).not.toEqual(`${lower.name} ($${lower.price})`);
  });
});
