// Copyright 2019-2020 @paritytech/bridge-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { checkAddress } from '@polkadot/util-crypto';

import getDeriveAccount from './getDeriveAccount';
import getDerivedParameters from './getDerivedParameters';

interface Props {
  receiverAddress: string;
  chain: string;
}
const getReceiverAddress = ({ receiverAddress, chain }: Props) => {
  const derivedParameters = getDerivedParameters(chain);
  try {
    const [validatedDerivedAcccount] = checkAddress(receiverAddress, derivedParameters.SS58Format);
    let address = receiverAddress;
    if (!validatedDerivedAcccount) {
      const formattedAccount = getDeriveAccount({
        address: receiverAddress,
        ...derivedParameters
      });

      address = formattedAccount;
    }
    return address;
  } catch (e) {
    throw new Error('INCORRECT-FORMAT');
  }
};

export default getReceiverAddress;
