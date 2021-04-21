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
import { checkAddress } from '@polkadot/util-crypto';

import { getChainConfigs } from '../configs/substrateProviders';
import getDeriveAccount from './getDeriveAccount';

interface Props {
  receiverAddress: string;
  chain: string;
}
const getReceiverAddress = ({ receiverAddress, chain }: Props) => {
  const chainsConfigs = getChainConfigs();
  console.log('chainsConfigs', chainsConfigs);
  const { SS58Format, bridgeId } = chainsConfigs[chain];

  try {
    const [validatedDerivedAcccount, rest] = checkAddress(receiverAddress, SS58Format);
    console.log('validatedDerivedAcccount', validatedDerivedAcccount);
    console.log('rest', rest);
    let address = receiverAddress;
    if (!validatedDerivedAcccount) {
      const parts = rest?.split(',');
      console.log('parts', parts);
      console.log('parts![2]', parts![2]);
      const prefix = parts![2].split(' ');
      console.log('prefix:', prefix[2]);
      let found;
      Object.keys(chainsConfigs).map((key) => {
        console.log('chainsConfigs[key].SS58Format', chainsConfigs[key].SS58Format);
        console.log('parseInt(prefix[2])', parseInt(prefix[2]));

        if (chainsConfigs[key].SS58Format === parseInt(prefix[2])) {
          found = key;
        }
        if (parseInt(prefix[2]) === 42) {
          found = 'Substrate';
        }
      });

      console.log('chain found', found);

      const formattedAccount = getDeriveAccount({
        SS58Format,
        address: receiverAddress,
        bridgeId
      });

      address = formattedAccount;
    }
    return address;
  } catch (e) {
    throw new Error('INCORRECT-FORMAT');
  }
};

export default getReceiverAddress;
