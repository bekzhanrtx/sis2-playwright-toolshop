import { test, expect } from '../fixtures/testFixtures';

test.describe('3. Buy a product', () => {
  test('add to cart → cart shows item and quantity → checkout completes', async ({
    homePage,
    productPage,
    checkoutPage,
    registeredCustomer,
  }) => {
    const quantity = 2;

    await homePage.open();
    await homePage.openProductByIndex(0);

    const product = await productPage.captureDetails();
    await productPage.setQuantityTo(quantity);
    await productPage.addCurrentProductToCart();
    await expect(productPage.cartQuantity).toHaveText(String(quantity));

    await productPage.navCart.click();
    await checkoutPage.expectCartItem(product.name, String(quantity));
    await expect(checkoutPage.productPrice).toContainText(product.priceText.replace(/^\$/, ''));

    await checkoutPage.goToSignInStep();
    await checkoutPage.signInAtCheckout(registeredCustomer.email, registeredCustomer.password);
    await checkoutPage.continueToBilling();
    await checkoutPage.fillBilling(registeredCustomer);
    await checkoutPage.continueToPayment();
    await checkoutPage.payWithCashOnDelivery();
  });
});
