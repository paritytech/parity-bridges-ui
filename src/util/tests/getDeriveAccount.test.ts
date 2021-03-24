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
    SS58Format: 48,
    address: '5sauUXUfPjmwxSgmb3tZ5d6yx24eZX4wWJ2JtVUBaQqFbvEU',
    bridgeId: 'rlto',
    derivedAccount: '74GNQjmkcfstRftSQPJgMREchqHM56EvAUXRc266cZ1NYVW5'
  };
  const millauAccount = {
    SS58Format: 60,
    address: '752paRyW1EGfq9YLTSSqcSJ5hqnBDidBmaftGhBo8fy6ypW9',
    bridgeId: 'mlau',
    derivedAccount: '5rERgaT1Z8nM3et2epA5i1VtEBfp5wkhwHtVE8HK7BRbjAH2'
  };

  describe('Rialto', () => {
    it('should retrieve expected Millau derived account ', async () => {
      const { address, bridgeId, derivedAccount } = rialtoAccount;
      const { SS58Format } = millauAccount;

      const result = getDeriveAccount({ SS58Format, address, bridgeId });
      expect(result).toEqual(derivedAccount);
    });
  });

  describe('Millau', () => {
    it('should retrieve expected Rialto derived account ', async () => {
      const { address, bridgeId, derivedAccount } = millauAccount;
      const { SS58Format } = rialtoAccount;
      const result = getDeriveAccount({ SS58Format, address, bridgeId });
      expect(result).toEqual(derivedAccount);
    });
  });
});
