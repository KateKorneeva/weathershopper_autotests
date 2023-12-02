const { waitForTimeout: timeout } = require('codeceptjs').config.get();
const urlTimeout = 10;

Feature('Purchase');

Scenario('001: User Checks the Weather, Buys Several Items and Checks out.',  async ({ I, purchase }) => {
    I.amOnPage(purchase.urls.main);

    __`Check the temperature and decide which type of product to buy`;
    const temperature = await I.grabTextFrom(purchase.fields.temperatureDisplay);
    let productType;
    if (parseFloat(temperature) < 19) { productType = purchase.productTypes.moisturizer }
    else { productType = purchase.productTypes.sunscreen }

    __`Open corresponding category page`;
    I.waitForVisibleAndClick(purchase.fields.getBuyButton(productType));
    await I.waitForPageToLoad(productType.urlPart, urlTimeout);
    I.waitForVisible(purchase.fields.item);

    __`Put 2 least price items of different kinds into the basket`;
    const firstItemBuyButton = await purchase.getItemLocatorWithLeastPrice(productType.texts.firstItem);
    const secondItemBuyButton = await purchase.getItemLocatorWithLeastPrice(productType.texts.secondItem);
    if (firstItemBuyButton) I.click(firstItemBuyButton);
    if (secondItemBuyButton) I.click(secondItemBuyButton);
    I.waitForText(purchase.texts.someItems, purchase.fields.cartButton);

    __`Open cart and verify it contains the added items and the total is correct`;
    I.click(purchase.fields.cartButton);
    let firstItemPrice = 0, secondItemPrice = 0;
    if (firstItemBuyButton) { firstItemPrice = purchase.getPrice(firstItemBuyButton); }
    if (secondItemBuyButton) { secondItemPrice = purchase.getPrice(secondItemBuyButton); }
    const total = firstItemPrice + secondItemPrice;
    if (firstItemBuyButton) I.waitForText(firstItemPrice, timeout, purchase.fields.checkout.priceCells);
    if (secondItemBuyButton) I.waitForText(secondItemPrice, timeout, purchase.fields.checkout.priceCells);
    I.waitForText(total, timeout, purchase.fields.checkout.total);
    // It would be nice to check that the titles of the items are the same as on the previous page, I'll leave it as TODO

    __`Click Pay Button, fill out credit card details, submit`;
    I.waitForVisibleAndClick(purchase.fields.checkout.payButton);
    I.switchTo(purchase.fields.paymentDetailsIframe);

    I.fillFieldAndCheckValue(purchase.fields.card.emailInput, purchase.texts.fakePaymentData.email, timeout);
    I.fillFieldAndCheckValue(purchase.fields.card.numberInput, purchase.texts.fakePaymentData.cardNumber, timeout);
    I.fillFieldAndCheckValue(purchase.fields.card.expiresInput, purchase.texts.fakePaymentData.expiryDate, timeout);
    I.fillFieldAndCheckValue(purchase.fields.card.cvcInput, purchase.texts.fakePaymentData.cvc, timeout);

    // Only fill the ZIP code if the field is present
    const zipField = await I.grabNumberOfVisibleElements(purchase.fields.card.zipInput);
    if (zipField) { I.fillFieldAndCheckValue(purchase.fields.card.zipInput, purchase.texts.fakePaymentData.zip, timeout) }

    I.waitForVisibleAndClick(purchase.fields.submitPaymentButton);
    I.waitForVisible(purchase.fields.submitPaymentButtonSuccess);
    I.switchTo();
    await I.waitForPageToLoad(purchase.urls.confirmation, urlTimeout)
    I.waitForText(purchase.texts.paymentSuccessMessage, timeout);
});

// This scenario will fail bacause of the bug in the application.
Scenario('002: User Adds Item to the Cart, opens Checkout Page and Navigates back. Item Stays in Cart.',  async ({ I, purchase }) => {
    I.amOnPage(purchase.urls.main);
    let productType = purchase.productTypes.moisturizer;

    __`Open corresponding category page`;
    I.waitForVisibleAndClick(purchase.fields.getBuyButton(productType));
    await I.waitForPageToLoad(productType.urlPart, urlTimeout)
    I.waitForVisible(purchase.fields.item);

    __`Put 2 least price items into the basket`;
    const itemBuyButton = await purchase.getItemLocatorWithLeastPrice(productType.texts.firstItem);
    if (itemBuyButton) I.click(itemBuyButton);
    I.waitForText(purchase.texts.someItems, timeout, purchase.fields.cartButton);

    __`Open cart`;
    I.click(purchase.fields.cartButton);
    I.waitForVisible(purchase.fields.checkout.total);

    __`Navigate back and check the cart`;
    I.executeScript("window.history.back();");
    I.waitForText(purchase.texts.someItems, timeout, purchase.fields.cartButton);
});
