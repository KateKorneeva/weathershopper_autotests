module.exports = function() {
  return actor({
    waitForVisibleAndClick(selector, timeout) {
      this.waitForVisible(selector, timeout);
      this.click(selector);
    },

    fillFieldAndCheckValue(selector, value, timeout) {
      this.waitForVisible(selector);
      this.waitForEnabled(selector, timeout);
      this.wait(0.5);
      this.fillField(selector, value);
      this.seeInField(selector, value);
    },

    async waitForPageToLoad(url, timeout) {
      this.waitInUrl(url, timeout);
      await this.usePlaywrightTo('Wait for load state', async ({ page }) => {
          await page.waitForLoadState();
      });
    }
  });
}
