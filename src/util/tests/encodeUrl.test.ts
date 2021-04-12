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

import { stringToU8a } from '@polkadot/util';
import { base64Encode } from '@polkadot/util-crypto';
import { zlibSync } from 'fflate';

import customTypesRialto from '../../configs/substrateCustomTypes/customTypesRialto.json';
import encodeUrl from '../encodeUrl';

describe('encodeUrl', () => {
  const jsonU8a = stringToU8a(JSON.stringify(customTypesRialto));
  const compressed = zlibSync(jsonU8a, { level: 9 });
  const encoded = base64Encode(compressed);
  const providerUrl = 'wss://wss.rialto.brucke.link';
  const expectedUrl = `https://polkadot.js.org/apps/?rpc=${encodeURIComponent(providerUrl)}&types=${encodeURIComponent(
    encoded
  )}`;

  describe('Test chain', () => {
    it('should retrieve the expected URL for provided types', async () => {
      const result = encodeUrl(customTypesRialto, providerUrl);
      expect(result).toEqual(expectedUrl);
    });
  });
});
