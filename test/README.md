## Running the test suite

0. _Optional: If your corporate machine requires code to be run from a particular folder, run `export PLAYWRIGHT_BROWSERS_PATH=0` so the browser gets installed in this project folder._
1. From this directory, run `npm i` to install Playwright's npm dependencies.
2. Run `npx playwright install --with-deps chromium` to install Playwright's copy of Chromium.
3. Check the current milestone's pull request to find the command to run its test suite.