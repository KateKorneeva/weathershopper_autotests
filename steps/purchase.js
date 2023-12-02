const { I } = inject();

module.exports = {
  fields: {
    temperatureDisplay: '#temperature',
    item: '.container .col-4',
    getBuyButton: type => `[href="/${type.urlPart}"]`,
    getItemByText: text => locate('.col-4').withText(text),
    getBuyButtonByOnclick: text => `[onclick*="${text}" i]`,
    getBuyButtonByPrice: text => locate('.col-4').withText(text),
    cartButton: '[onclick="goToCart()"]',
    checkout: {
      priceCells: 'tbody td:nth-child(2n)',
      total: '#total',
      payButton: '[action="/confirmation"] button',
    },
    card: {
      emailInput: '.emailInput input',
      numberInput: '.cardNumberInput input',
      expiresInput: '.cardExpiresInput input',
      cvcInput: '.cardCVCInput input',
      zipInput: '.zipCodeInput input',
    },
    paymentDetailsIframe: 'iframe',
    submitPaymentButton: '.overlayView #submitButton',
    submitPaymentButtonSuccess: '.submit.success'
  },
  texts: {
    someItems: 'item(s)',
    fakePaymentData: {
      email: 'zyxwvu@abcdef.hh',
      cardNumber: '5555 5555 5555 4444',
      expiryDate: '12 / 34',
      cvc: '654',
      zip: '54321'
    },
    paymentSuccessMessage: 'Your payment was successful'
  },
  urls: {
    main: '/',
    cart: 'cart',
    confirmation: 'confirmation'
  },
  productTypes: {
    sunscreen: {
      urlPart: 'sunscreen',
      texts: {
        firstItem: 'spf-50',
        secondItem: 'spf-30'
      },
    },
    moisturizer: {
      urlPart: 'moisturizer',
      texts: {
        firstItem: 'aloe',
        secondItem: 'almond'
      },
    }
  },

  getPrice: function(onclickValue) {
    const regex = /,\s*(\d+)(?=\))/g;
    const match = onclickValue.match(regex);
    let price;
    if (match) {
      price = match[0].replace(/,\s*/, ''); // Removes the comma and any whitespace
    }
    else price = 0
    return parseFloat(price)
  },

  getItemLocatorWithLeastPrice: async function(textInItem) {
    const buttonsOnclickValues = await I.grabAttributeFromAll(this.fields.getBuyButtonByOnclick(textInItem), 'onclick');
    // Sometimes there is no matching item found
    if(buttonsOnclickValues.length === 0) return false
  
    const leastPriceIndex = buttonsOnclickValues.
      map(onclickValue => this.getPrice(onclickValue)).
      reduce((minIndex, currentValue, currentIndex, array) => {
        return (currentValue < array[minIndex]) ? currentIndex : minIndex;
      }, 0);
    const minPriceBuyButtonText = buttonsOnclickValues[leastPriceIndex];

    return this.fields.getBuyButtonByOnclick(minPriceBuyButtonText)
  }
}
