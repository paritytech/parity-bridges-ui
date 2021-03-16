// Copyright 2019-2020 @paritytech/bridge-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { useKeyringContext } from '../contexts/KeyringContextProvider';
import { useSourceTarget } from '../contexts/SourceTargetContextProvider';
import getDerivedAccount from '../util/getDeriveAccount';
import { chainsConfigs } from '../util/substrateProviders';

const useAccounts = () => {
  const { keyringPairs, keyringPairsReady } = useKeyringContext();
  const { targetChain, sourceChain } = useSourceTarget();
  const { ss58Formats, accountDerivations, bridgeIds } = chainsConfigs;
  const SS58Format = ss58Formats[targetChain];
  const accountDerivation = accountDerivations[targetChain];
  const bridgeId = bridgeIds[sourceChain];

  if (!keyringPairsReady && !keyringPairs.length) {
    return [];
  }

  return keyringPairs.map(({ address, meta }) => {
    const account = {
      address,
      name: (meta.name as string).toLocaleUpperCase()
    };
    const toDerive = {
      SS58Format,
      accountDerivation,
      address,
      bridgeId
    };
    return { account, derivedAccount: getDerivedAccount(toDerive) };
  });
};

export default useAccounts;
