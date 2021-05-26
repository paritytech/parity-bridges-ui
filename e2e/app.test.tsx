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
describe('Google', () => {
  beforeAll(async () => {
    await page.goto('https://google.com', { waitUntil: 'domcontentloaded' });
  });

  it('sanity check, test Google server by checking "google" text on page', async () => {
    await expect(page).toMatch('google');
  });
});

describe('<App />', () => {
  beforeAll(async () => {
    await page.goto(SERVER_URL, { waitUntil: 'domcontentloaded' });
  }, JEST_TIMEOUT);

  //   it(
  //     'should include "edit" text on page',
  //     async () => {
  //       await expect(page).toMatch('Edit');
  //     },
  //     JEST_TIMEOUT
  //   );

  //   it(
  //     'should include href with correct link',
  //     async () => {
  //       const hrefsArray = await page.evaluate(() => () => () =>
  //         Array.from(document.querySelectorAll('a[href]'), (a) => a.getAttribute('href'))
  //       );
  //       expect(hrefsArray[0]).toMatch('https://github.com/EliEladElrom/react-tutorials');
  //     },
  //     JEST_TIMEOUT
  //   );

  //   it(
  //     'should include the React svg correct image',
  //     async () => {
  //       // @ts-ignore
  //       const images = await page.$$eval('img', (anchors) => [].map.call(anchors, (img) => img.src));
  //       expect(images[0]).toMatch(`${SERVER_URL}/static/media/logo.5d5d9eef.svg`);
  //     },
  //     JEST_TIMEOUT
  //   );
});
