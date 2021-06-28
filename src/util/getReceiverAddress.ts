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
import { ChainState } from '../types/sourceTargetTypes';
import { INCORRECT_FORMAT, GENERIC, GENERIC_SUBSTRATE_PREFIX } from '../constants';
import getDeriveAccount from './getDeriveAccount';
import { getBridgeId } from './getConfigs';

interface Props {
  receiverAddress: string;
  targetChainDetails: ChainState;
  sourceChainDetails: ChainState;
}
const getReceiverAddress = ({ targetChainDetails, sourceChainDetails, receiverAddress }: Props) => {
  const { configs: sourceConfigs, chain: sourceChain } = sourceChainDetails;
  const { chain: targetChain, configs: targetConfigs } = targetChainDetails;

  const targetSS58Format = targetConfigs.ss58Format;
  const bridgeId = getBridgeId(targetConfigs, sourceConfigs.chainName);

  const getChainBySS58Prefix = (prefix: string) => {
    const intPrefix: number = parseInt(prefix, 10);
    switch (intPrefix) {
      case GENERIC_SUBSTRATE_PREFIX:
        return GENERIC;
      case targetConfigs.ss58Format:
        return targetChain;
      case sourceConfigs.ss58Format:
        return sourceChain;
      default:
        return '';
    }
  };

  try {
    const [validatedDerivedAcccount, rest] = checkAddress(receiverAddress, targetSS58Format);

    if (validatedDerivedAcccount) {
      return { address: receiverAddress, formatFound: targetChain };
    }

    const parts = rest?.split(',');
    const prefix = parts![2].split(' ');
    const formatFound = getChainBySS58Prefix(prefix[2]) || prefix[2];

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
