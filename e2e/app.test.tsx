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

// @ts-ignore due to isolatedModules flag - no import so this needed

const puppeteer = require('puppeteer');
const { globals } = require('./jest.config');

const chromeOptions = {
  executablePath: process.env.chrome,
  headless: false
};

const timeout = 50000000;

const ids = {
  native: '#test-native-input',
  companion: '#test-companion-input',
  sender: '#test_sender_component',
  transferButton: '#test-button-submit'
};

const chooseSender = async (page) => {
  await page.waitForSelector('#test_sender_component');
  await page.waitForTimeout(1000);
  await page.click('#test_sender_component').then(() => console.log('-- Open Sender dropdown'));
  await page.waitForTimeout(1000);
  const [aliceOption] = await page.$x("//div[contains(., '5sauUX')]");
  await page.waitForTimeout(500);
  if (aliceOption) {
    await aliceOption.click().then(() => console.log('-- Click on an account from the dropdown'));
  }
  await page.waitForTimeout(500);
};

const enterAmount = async (page) => {
  await page.focus('#test-amount-send').then(() => console.log('-- Focus on amount input field.'));
  await page.keyboard.type('10').then(() => console.log('-- add 10 MLAU'));
  await page.waitForTimeout(500);
  await page.focus('#test-receiver-input').then(() => console.log('-- Focus on receiver input field'));
  await page.waitForTimeout(500);
};

const checkEnabledButton = async (page) => {
  await page.waitForSelector(ids.transferButton);
  await page.waitForTimeout(500);
  await page
    .waitForSelector(`${ids.transferButton}:not([disabled])`)
    .then(() => console.log('-- Submit button enabled'));
  await page.waitForTimeout(1000);
};

const testWrapper = async (page, fn, logHeader, checkButton = false) => {
  if (logHeader) {
    console.log(`********** Starting Check: ${logHeader} ********** `);
  }
  try {
    // Run happy path test for submitting a transaction
    await chooseSender(page);
    await enterAmount(page);
    if (checkButton) {
      await fn();
      await checkEnabledButton(page);
    } else {
      await fn();
    }
  } catch (error) {
    if (error.message.includes('ERR_CONNECTION_REFUSED')) {
      throw new Error('Make sure you have React running: $ yarn start');
    }
    throw new Error(error);
  } finally {
    page.close();
  }
};

describe('<App />', () => {
  let page;
  let browser;

  beforeAll(async () => {
    browser = await puppeteer.launch(chromeOptions);
  });

  afterAll(async () => {
    await browser.close();
  }, timeout);

  beforeEach(async () => {
    page = await browser.newPage();

    page.emulate({
      viewport: {
        width: 1388,
        height: 1080
      },
      userAgent: ''
    });
    await page.goto(globals.SERVER_URL, { waitUntil: 'domcontentloaded' });
  }, timeout);

  it(
    'should show generic component',
    async () => {
      const nativeExpectedText = 'native(5H3Zry...jbVtrThD)';
      const companionExpectedText = 'companion(5H3Zry...jbVtrThD)';
      let nativeText;
      let companionText;

      const checkDerived = async () => {
        await page.focus('#test-receiver-input').then(() => console.log('-- Focus on receiver input field'));
        await page.keyboard
          .type('5H3ZryLmpNwrochemdVFTq9WMJW39NCo5HWFEwRtjbVtrThD')
          .then(() => console.log('-- Add a generic receiver address'));
        await page.waitForTimeout(1000);
        nativeText = await page.$eval(ids.native, (el) => el.innerText);
        companionText = await page.$eval(ids.companion, (el) => el.innerText);
        expect(nativeText).toEqual(nativeExpectedText);
        expect(companionText).toEqual(companionExpectedText);
        await page.waitForSelector(ids.native);
        await page.click(ids.native).then(() => console.log('-- Clicking Native account'));
        await page.waitForTimeout(1000);
        await expect(page).not.toMatchElement(ids.companion);
        await page.waitForTimeout(500);
      };

      await testWrapper(page, checkDerived, 'Generic Account Validation', true);
    },
    timeout
  );

  it(
    'should show native component',
    async () => {
      const nativeExpectedText = 'native(711cUi...oEQXguPZ)';

      let nativeText;

      const checkNative = async () => {
        await page.focus('#test-receiver-input').then(() => console.log('-- Focus on receiver input field'));
        await page.keyboard
          .type('711cUirFtNtASdZNJ37ahHYELi69kPCco5QRG5GyoEQXguPZ')
          .then(() => console.log('-- Add a native receiver address'));
        await page.waitForTimeout(1000);
        nativeText = await page.$eval(ids.native, (el) => el.innerText);
        expect(nativeText).toEqual(nativeExpectedText);
      };

      await testWrapper(page, checkNative, 'Native Account Validation', true);
    },
    timeout
  );

  it(
    'should show companion component',
    async () => {
      const companionExpectedText = 'companion(5rERga...7BRbjAH2)';

      let companionText;

      const checkNative = async () => {
        await page.focus('#test-receiver-input').then(() => console.log('-- Focus on receiver input field'));
        await page.keyboard
          .type('5rERgaT1Z8nM3et2epA5i1VtEBfp5wkhwHtVE8HK7BRbjAH2')
          .then(() => console.log('-- Add a native receiver address'));
        await page.waitForTimeout(1000);
        companionText = await page.$eval(ids.companion, (el) => el.innerText);
        expect(companionText).toEqual(companionExpectedText);
      };

      await testWrapper(page, checkNative, 'Companion Account Validation', true);
    },
    timeout
  );

  it(
    'should make a successfull transfer',
    async () => {
      const makeTransfer = async () => {
        await page.focus('#test-receiver-input').then(() => console.log('-- Focus on receiver input field'));
        await page.keyboard
          .type('74YBVK9EJ4uSzokqewqmBcecAWq6tosB2xujX5Lf8jKg2gze')
          .then(() => console.log('-- Add a receiver address'));
        await page.waitForTimeout(500);
        await page
          .click('#test-button-submit')
          .then(() => console.log('-- Click send button to initiate the transaction'));
        await page.waitForTimeout(500);
        await page
          .waitForXPath('//div[contains(text(), "Transaction was broadcasted")]')
          .then(() => console.log('-- Transaction was broadcasted.'));
        await page.waitForTimeout(500);

        await page
          .waitForSelector('#step-include-message-block > #check-circle-icon')
          .then(() => console.log('-- Step 1 "Include message in block" completed'));
        await page
          .waitForSelector('#step-finalized-block > #check-circle-icon')
          .then(() => console.log('-- Step 2 "Finalize block" completed'));
        await page
          .waitForSelector('#step-relay-block > #check-circle-icon')
          .then(() => console.log('-- Step 3 "Relay block" completed'));
        await page
          .waitForSelector('#step-deliver-message-block > #check-circle-icon')
          .then(() => console.log('-- Step 4 "Deliver message in target block" completed'));
        await page
          .waitForSelector('#step-finalized-message > #check-circle-icon')
          .then(() => console.log('-- Step 5 "Finalize message" completed'));
        await page
          .waitForSelector('#step-confirm-delivery > #check-circle-icon')
          .then(() => console.log('-- Step 6 "Confirm delivery" completed'));

        await page
          .waitForSelector('#transaction-header > #check-circle-icon')
          .then(() => console.log('-- Transaction Completed'));
        await page.waitForTimeout(15000);
      };

      await testWrapper(page, makeTransfer, 'Successfull Transfer', false);
    },
    timeout
  );
});
