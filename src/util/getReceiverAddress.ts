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
import { INCORRECT_FORMAT, GENERIC } from '../constants';
import getDeriveAccount from './getDeriveAccount';

interface Props {
  receiverAddress: string;
  chain: string;
}
const getReceiverAddress = ({ receiverAddress, chain }: Props) => {
  const chainsConfigs = getChainConfigs();
  const { SS58Format, bridgeId } = chainsConfigs[chain];

  try {
 const [validatedDerivedAcccount, rest] = checkAddress(receiverAddress, SS58Format);
    const address = receiverAddress;
    if (validatedDerivedAcccount) {
       return { address, formatFound: chain };
    }
    // should be extracted as a separate component/function
    const getFormat = (prefix: string) => {
       const intPrefix: number = parseInt(prefix, 10);
       if (intPrefix === GENERIC_SUBSTRATE_PREFIX /* 42 */) {
          return GENERIC;
       }
       const chainsConfigs = getChainConfigs();
       return Object.keys(chainsConfigs).find((key) => chainsConfigs[key].SS58Format === intPrefix);
    }
    
    const parts = rest?.split(',');
    const prefix = parts![2].split(' ');
    const formatFound = getFormat(prefix);
    
    const address = getDeriveAccount({
        SS58Format,
        address,
        bridgeId
      });

      return { address, formatFound };
    }
    const address = receiverAddress;
    let formatFound = chain;
    if (!validatedDerivedAcccount) {
      const parts = rest?.split(',');
      const prefix = parts![2].split(' ');

      Object.keys(chainsConfigs).map((key) => {
        if (chainsConfigs[key].SS58Format === parseInt(prefix[2])) {
          formatFound = key;
        }
        if (parseInt(prefix[2]) === 42) {
          formatFound = GENERIC;
        }
      });

      const formattedAccount = getDeriveAccount({
        SS58Format,
        address: receiverAddress,
        bridgeId
      });

      return { address: formattedAccount, formatFound };
    }
    return { address, formatFound };
  } catch (e) {
    if (receiverAddress) {
      throw new Error(INCORRECT_FORMAT);
    }
    return { address: '', formatFound: null };
  }
};

export default getReceiverAddress;
