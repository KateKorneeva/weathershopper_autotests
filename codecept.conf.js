const {
  setHeadlessWhen,
  setCommonPlugins
} = require('@codeceptjs/configure');
// turn on headless mode when running with HEADLESS=true environment variable
// export HEADLESS=true && npx codeceptjs run
setHeadlessWhen(process.env.HEADLESS);

// enable all common plugins https://github.com/codeceptjs/configure#setcommonplugins
setCommonPlugins();

/** @type {CodeceptJS.MainConfig} */
exports.config = {
  tests: './*_test.js',
  output: './output',
  waitForTimeout: 5, // seconds
  helpers: {
    Playwright: {
      browser: 'chromium',
      url: 'https://weathershopper.pythonanywhere.com',
      show: true
    }
  },
  plugins: {
    commentStep: {
      enabled: true,
      registerGlobal: true
    }
  },
  include: {
    I: './steps_file.js',
    purchase: "./steps/purchase.js",
  },
  name: 'weathershopper_autotests'
}