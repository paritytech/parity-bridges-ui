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

import { INCORRECT_FORMAT, GENERIC, GENERIC_SUBSTRATE_PREFIX } from '../constants';
import getDeriveAccount from './getDeriveAccount';

interface Props {
  receiverAddress: string;
  // TODO proper type
  targetChainDetails: any;
  sourceChainDetails: any;
}
const getReceiverAddress = ({ targetChainDetails, sourceChainDetails, receiverAddress }: Props) => {
  const { sourceChain, sourceConfigs } = sourceChainDetails;
  const { targetChain, targetConfigs } = targetChainDetails;

  const targetSS58Format = targetConfigs.ss58Format;
  const sourceSS58Format = sourceConfigs.ss58Format;

  const bridgeId = sourceConfigs.bridgeId;

  try {
    const [validatedDerivedAcccount, rest] = checkAddress(receiverAddress, targetSS58Format);
    if (validatedDerivedAcccount) {
      return { address: receiverAddress, formatFound: targetChain };
    }
    // should be extracted as a separate component/function
    const getFormat = (prefix: string) => {
      const intPrefix: number = parseInt(prefix, 10);
      if (intPrefix === GENERIC_SUBSTRATE_PREFIX) {
        return GENERIC;
      }

      if (targetSS58Format === intPrefix) {
        return targetChain;
      }
      if (sourceSS58Format === intPrefix) {
        return sourceChain;
      }
    };

    const parts = rest?.split(',');
    const prefix = parts![2].split(' ');
    const formatFound = getFormat(prefix[2]) || prefix[2];

    const address = getDeriveAccount({
      ss58Format: targetSS58Format,
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
