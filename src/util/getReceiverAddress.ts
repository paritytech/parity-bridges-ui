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

import { chainsConfigs } from '../configs/substrateProviders';
import getDeriveAccount from './getDeriveAccount';

interface Props {
  receiverAddress: string;
  chain: string;
}
const getReceiverAddress = ({ receiverAddress, chain }: Props) => {
  const { SS58Format, bridgeId } = chainsConfigs[chain];
  try {
    const [validatedDerivedAcccount] = checkAddress(receiverAddress, SS58Format);
    let address = receiverAddress;
    if (!validatedDerivedAcccount) {
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
