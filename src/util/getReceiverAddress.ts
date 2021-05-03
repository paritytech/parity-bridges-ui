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
import { INCORRECT_FORMAT, GENERIC, GENERIC_SUBSTRATE_PREFIX } from '../constants';
import getDeriveAccount from './getDeriveAccount';

interface Props {
  receiverAddress: string;
  targetChain: string;
  sourceChain: string;
}
const getReceiverAddress = ({ receiverAddress, targetChain, sourceChain }: Props) => {
  const chainsConfigs = getChainConfigs();
  const { SS58Format } = chainsConfigs[targetChain];
  const { bridgeId } = chainsConfigs[sourceChain];

  try {
    const [validatedDerivedAcccount, rest] = checkAddress(receiverAddress, SS58Format);
    if (validatedDerivedAcccount) {
      return { address: receiverAddress, formatFound: targetChain };
    }
    // should be extracted as a separate component/function
    const getFormat = (prefix: string) => {
      const intPrefix: number = parseInt(prefix, 10);
      if (intPrefix === GENERIC_SUBSTRATE_PREFIX) {
        return GENERIC;
      }
      const chainsConfigs = getChainConfigs();
      return Object.keys(chainsConfigs).find((key) => chainsConfigs[key].SS58Format === intPrefix);
    };

    const parts = rest?.split(',');
    const prefix = parts![2].split(' ');
    const formatFound = getFormat(prefix[2]) || prefix[2];

    const address = getDeriveAccount({
      SS58Format,
      address: receiverAddress,
      bridgeId
    });

    return { address, formatFound };
  } catch (e) {
    if (receiverAddress) {
      throw new Error(INCORRECT_FORMAT);
    }
    return { address: '', formatFound: null };
  }
};

export default getReceiverAddress;
