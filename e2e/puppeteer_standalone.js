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
const SERVER_URL = 'http://localhost:3001';

(async function main() {
  try {
    // const pathToExtension = require('path').join(__dirname);
    // console.log('----- ', pathToExtension);
    const browser = await puppeteer.launch({
      executablePath:process.env.chrome,
      headless: false
    });
    const page = await browser.newPage();
    await page.goto(SERVER_URL, { waitUntil: 'domcontentloaded' });

    // HERE SHOULD BE ALL THE TESTS
    // console.log(page);
    // const urlLink = await page.$('a[href*="https://github.com"]');
    // if (urlLink) {
    //   await urlLink.click();
    // } else {
    //   console.log('No "urlLink" found on page');
    // }

    // wait 20 secs and shut down!
    await new Promise((resolve) => setTimeout(resolve, 20000));
    await browser.close();
  } catch (error) {
    if (error.message.includes('ERR_CONNECTION_REFUSED')) {
      console.log('Make sure you have React running: $ yarn start');
    }
    console.log('Error message', error.message);
  }
})();
