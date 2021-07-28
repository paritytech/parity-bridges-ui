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
const winston = require('winston');
const { globals } = require('./jest.config');

winston.addColors({
  debug: 'grey',
  error: 'red',
  info: 'green',
  warn: 'blue'
});

const myformat = winston.format.cli({
  all: true
});

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      format: myformat
    })
  ]
});

const chromeOptions = {
  executablePath: process.env.chrome,
  headless: false
};

const timeout = 500000;

const ids = {
  native: '#test-native-input',
  companion: '#test-companion-input',
  transferButton: '#test-button-submit',
  senderComponent: '#test-sender-component',
  checkCircleComponent: '#test-transaction-status-completed'
};

const chooseSender = async (page) => {
  logger.info('  >>> Choosing Sender');
  await page.waitForSelector(ids.senderComponent);
  await page.waitForTimeout(2000);
  await page.click(ids.senderComponent).then(() => logger.info('     -- Open Sender dropdown'));
  await page.waitForTimeout(1000);
  const [aliceOption] = await page.$x("//div[contains(., '5sauUX')]");
  await page.waitForTimeout(500);
  if (aliceOption) {
    await aliceOption.click().then(() => logger.info('     -- Click on an account from the dropdown'));
  }
  await page.waitForTimeout(500);
};

const enterAmount = async (page) => {
  logger.info('  >>> Entering Amount');

  await page.focus('#test-amount-send').then(() => logger.info('     -- Focus on amount input field.'));
  await page.keyboard.type('10').then(() => logger.info('     -- add 10 MLAU'));
  await page.waitForTimeout(500);
};

const checkEnabledButton = async (page) => {
  logger.info('  >>> Checking if execution button is enabled');
  await page.waitForTimeout(4000);
  await page.waitForSelector(ids.transferButton);
  await page.waitForTimeout(500);
  await page
    .waitForSelector(`${ids.transferButton}:not([disabled])`)
    .then(() => logger.info('     -- Submit button enabled'));
  await page.waitForTimeout(1000);
};

const testWrapper = async (page, fn, logHeader, checkButton = false) => {
  if (logHeader) {
    logger.info(`********** Starting Check: ${logHeader} ********** `);
  }
  try {
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

const getBalance = (input) => {
  const balance = input.split(' ');
  return parseFloat(balance[0]);
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

      const checkGeneric = async () => {
        logger.info('  >>> Validating generic acccount');
        await page.focus('#test-receiver-input').then(() => logger.info('     -- Focus on receiver input field'));
        await page.keyboard
          .type('5H3ZryLmpNwrochemdVFTq9WMJW39NCo5HWFEwRtjbVtrThD')
          .then(() => logger.info('     -- Add a generic receiver address'));
        await page.waitForTimeout(1000);
        nativeText = await page.$eval(ids.native, (el) => el.innerText);
        companionText = await page.$eval(ids.companion, (el) => el.innerText);
        expect(nativeText).toEqual(nativeExpectedText);
        expect(companionText).toEqual(companionExpectedText);
        await page.waitForSelector(ids.native);
        await page.click(ids.native).then(() => logger.info('     -- Clicking Native account'));
        await page.waitForTimeout(1000);
        await expect(page).not.toMatchElement(ids.companion);
        await page.waitForTimeout(500);
      };

      await testWrapper(page, checkGeneric, 'Generic Account Validation', true);
    },
    timeout
  );

  it(
    'should show native component',
    async () => {
      const nativeExpectedText = 'native(711cUi...oEQXguPZ)';

      let nativeText;

      const checkNative = async () => {
        logger.info('  >>> Validating native acccount');
        await page.focus('#test-receiver-input').then(() => logger.info('     -- Focus on receiver input field'));
        await page.keyboard
          .type('711cUirFtNtASdZNJ37ahHYELi69kPCco5QRG5GyoEQXguPZ')
          .then(() => logger.info('     -- Add a native receiver address'));
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
      logger.info('  >>> Validating companion acccount');

      const companionExpectedText = 'companion(5rERga...7BRbjAH2)';

      let companionText;

      const checkCompanion = async () => {
        await page.focus('#test-receiver-input').then(() => logger.info('     -- Focus on receiver input field'));
        await page.keyboard
          .type('5rERgaT1Z8nM3et2epA5i1VtEBfp5wkhwHtVE8HK7BRbjAH2')
          .then(() => logger.info('     -- Add a companion receiver address'));
        await page.waitForTimeout(1000);
        companionText = await page.$eval(ids.companion, (el) => el.innerText);
        expect(companionText).toEqual(companionExpectedText);
      };

      await testWrapper(page, checkCompanion, 'Companion Account Validation', true);
    },
    timeout
  );

  it(
    'should make a successfull transfer',
    async () => {
      const makeTransfer = async () => {
        logger.info('  >>> Making transfer');
        await page.focus('#test-receiver-input').then(() => logger.info('     -- Focus on receiver input field'));
        await page.keyboard
          .type('75DSWq62jcgwcfz15DKgG3w9z35L8fYAUDUcKF1K4zCfv2yc')
          .then(() => logger.info('     -- Add a receiver address'));
        await page.waitForTimeout(2000);
        const originalBalance = await page.$eval('#test-receiver-balance', (el) => el.innerText);
        await page
          .click('#test-button-submit')
          .then(() => logger.info('     -- Click send button to initiate the transaction'));
        await page.waitForTimeout(2000);
        await page
          .waitForXPath('//div[contains(text(), "Transaction was broadcasted")]')
          .then(() => logger.info('     -- Transaction was broadcasted.'));
        await page.waitForTimeout(500);

        await page
          .waitForSelector(`#test-step-include-message-block > ${ids.checkCircleComponent}`)
          .then(() => logger.info('     -- Step 1 "Include message in block" completed'));
        await page
          .waitForSelector(`#test-step-finalized-block > ${ids.checkCircleComponent}`)
          .then(() => logger.info('     -- Step 2 "Finalize block" completed'));
        await page
          .waitForSelector(`#test-step-relay-block > ${ids.checkCircleComponent}`)
          .then(() => logger.info('     -- Step 3 "Relay block" completed'));
        await page
          .waitForSelector(`#test-step-deliver-message-block > ${ids.checkCircleComponent}`)
          .then(() => logger.info('     -- Step 4 "Deliver message in target block" completed'));
        await page
          .waitForSelector(`#test-step-finalized-message > ${ids.checkCircleComponent}`)
          .then(() => logger.info('     -- Step 5 "Finalize message" completed'));
        await page
          .waitForSelector(`#test-step-confirm-delivery > ${ids.checkCircleComponent}`)
          .then(() => logger.info('     -- Step 6 "Confirm delivery" completed'));

        await page
          .waitForSelector(`#test-transaction-header > ${ids.checkCircleComponent}`)
          .then(() => logger.info('     -- Transaction Completed'));
        await page.waitForTimeout(15000);
        await page.focus('#test-receiver-input').then(() => logger.info('     -- Focus on receiver input field'));
        await page.keyboard
          .type('75DSWq62jcgwcfz15DKgG3w9z35L8fYAUDUcKF1K4zCfv2yc')
          .then(() => logger.info('     -- Adding a receiver address back to check balance'));
        await page.waitForTimeout(2000);
        const udpatedBalance = await page.$eval('#test-receiver-balance', (el) => el.innerText);
        const expectedBalance = getBalance(originalBalance) + 10;
        expect(getBalance(udpatedBalance)).toEqual(expectedBalance);
        logger.info('     -- Balance increased successfully');
      };

      await testWrapper(page, makeTransfer, 'Successfull Transfer', false);
    },
    timeout
  );
});
