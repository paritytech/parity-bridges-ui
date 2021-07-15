// Copyright 2021 Parity Technologies (UK) Ltd.
// This file is part of Parity Bridges UI.
//
// Parity Bridges UI is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Parity Bridges UI is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Parity Bridges UI.  If not, see <http://www.gnu.org/licenses/>.
const puppeteer = require('puppeteer');
const { globals } = require('./jest.config');

const chromeOptions = {
  args: ['--no-sandbox'],
  executablePath: process.env.PUPPETEER_EXEC_PATH, // set by docker container
  headless: false
};

(async function main() {
  try {
    const browser = await puppeteer.launch(chromeOptions);
    const page = await browser.newPage();
    page.emulate({
      viewport: {
        width: 1920,
        height: 1080
      },
      userAgent: ''
    });
    await page.goto(globals.SERVER_URL, { waitUntil: 'domcontentloaded' });

    // Run happy path test for submitting a transaction
    await page.waitForSelector('#test-sender-component');
    await page.waitForTimeout(1000);
    await page.click('#test-sender-component').then(() => console.log('-- Open Sender dropdown'));
    await page.waitForTimeout(1000);
    const [aliceOption] = await page.$x("//div[contains(., '5sauUX')]");
    await page.waitForTimeout(500);
    if (aliceOption) {
        await aliceOption.click().then(() => console.log('-- Click on an account from the dropdown'));
    }
    await page.waitForTimeout(500);
    await page.focus('#test-amount-send').then(() => console.log('-- Focus on amount input field.'));
    await page.keyboard.type('10').then(() => console.log('-- add 10 MLAU'));;
    await page.waitForTimeout(500);
    await page.focus('#test-receiver-input').then(() => console.log('-- Focus on receiver input field'));
    await page.keyboard.type('74YBVK9EJ4uSzokqewqmBcecAWq6tosB2xujX5Lf8jKg2gze').then(() => console.log('-- Add a receiver address'));
    await page.waitForTimeout(500);
    await page.click('#test-button-submit').then(() => console.log('-- Click send button to initiate the transaction'));
    await page.waitForXPath('//div[contains(text(), "Transaction was broadcasted")]').then(() => console.log('-- Transaction was broadcasted.'));
    await page.waitForTimeout(15000);
    await page.waitForSelector('#notistack-snackbar', { timeout: 0}).then(async () => {
      console.log('-- Transaction was completed.');
      await page.waitForTimeout(5000);
      await browser.close();
    });
  } catch (error) {
    if (error.message.includes('ERR_CONNECTION_REFUSED')) {
      console.log('Make sure you have React running: $ yarn start');
    }
    console.log('Error message', error.message);
    await browser.close();
  }
})();