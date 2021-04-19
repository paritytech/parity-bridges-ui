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

import type { KeyringPair } from '@polkadot/keyring/types';
import { encodeAddress } from '@polkadot/util-crypto';

import getChainSS58 from '../util/getSS58';

export default function formatAccounts(accounts: Array<KeyringPair>, chain: string) {
  return accounts.map(({ meta, address }) => {
    const ss58Format = getChainSS58(chain);
    const formatedAddress = encodeAddress(address, ss58Format);
    return {
      icon: 'user',
      key: formatedAddress,
      text: (meta.name as string).toLocaleUpperCase(),
      value: formatedAddress
    };
  });
}
