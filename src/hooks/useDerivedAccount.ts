// Copyright 2019-2020 @paritytech/bridge-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { useAccountContext } from '../contexts/AccountContextProvider';
import { useSourceTarget } from '../contexts/SourceTargetContextProvider';
import getDerivedAccount from '../util/getDeriveAccount';
import { chainsConfigs } from '../util/substrateProviders';

const useDerivedAccount = () => {
  const { targetChain, sourceChain } = useSourceTarget();
  const { account } = useAccountContext();
  const { ss58Formats, accountDerivations, bridgeIds } = chainsConfigs;
  const SS58Format = ss58Formats[targetChain];
  const accountDerivation = accountDerivations[targetChain];
  const bridgeId = bridgeIds[sourceChain];

  if (!account) {
    return null;
  }

  const toDerive = {
    SS58Format,
    accountDerivation,
    address: account.address,
    bridgeId
  };
  return getDerivedAccount(toDerive);
};

export default useDerivedAccount;
