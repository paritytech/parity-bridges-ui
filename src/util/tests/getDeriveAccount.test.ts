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

import getDeriveAccount from '../getDeriveAccount';

describe('getDeriveAccount', () => {
  const rialtoAccount = {
    ss58Format: 48,
    address: '5szh47tfXQVZSkJWgbudkRxRottJDTY24L8PvfU1WDhgAUwX',
    bridgeId: [114, 108, 116, 111],
    derivedAccount: '75ZD2wKFpfuR8xzH5NDG8V1BwE3rHyqHWo7Vqek4VGqSDHdi'
  };
  const millauAccount = {
    ss58Format: 60,
    address: '71L3SiUNQXD5bqJWomVCA8kqaJ6A5Yhd8ZwrbnDyF9kAXQCo',
    bridgeId: [109, 108, 97, 117],
    derivedAccount: '5tHfBsKTzBZ8SsJzZihDpEVcGbTDQQ9e4vFpTr5urjw1hqTo'
  };

  describe('Rialto', () => {
    it('should retrieve expected Millau derived account ', async () => {
      const { address, bridgeId, derivedAccount } = rialtoAccount;
      const { ss58Format } = millauAccount;

      const result = getDeriveAccount({ ss58Format, address, bridgeId });
      expect(result).toEqual(derivedAccount);
    });
  });

  describe('Millau', () => {
    it('should retrieve expected Rialto derived account ', async () => {
      const { address, bridgeId, derivedAccount } = millauAccount;
      const { ss58Format } = rialtoAccount;
      const result = getDeriveAccount({ ss58Format, address, bridgeId });
      expect(result).toEqual(derivedAccount);
    });
  });
});
