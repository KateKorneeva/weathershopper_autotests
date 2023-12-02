# WeatherShopper Autotests
This reporitory contains a minimal Playwright + CodeceptJS autotesting setup that covers 2 Use Cases for the https://weathershopper.pythonanywhere.com/

The scenarios can be found at purchase_test.js, the Steps Object file for it is steps\purchase.js

Some custom functions are defined in steps_file.js

CodeceptJS and Playwright Config is codecept.conf.js

The first Use Case Covers the happy path described in the task. The second Use Case demonstrates the current bug in the WeatherShopper Application code and therefore fails.

Screenshots on failures will be added to the output folder.

To run tests in Docker, execute
`docker run --net=host -v $PWD:/tests codeceptjs/codeceptjs:3.5.4 --steps`
To run 1 specific Use Case, run
`docker run --net=host -v $PWD:/tests codeceptjs/codeceptjs:3.5.4 codeceptjs run --steps --grep "001"`

For Windows, use path to current directory instead of $PWD

To run tests on local machine, simply run 
`npm install`
`npx codeceptjs run`
Use  `--steps`,   `--verbose` or  `--debug` for different levels of output. Use `--grep "purchase"` to filter tests by text in `Scenario` field