// Copyright 2019-2020 @paritytech/bridge-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import type { KeyringPair } from '@polkadot/keyring/types';

import { useKeyringContext } from '../contexts/KeyringContextProvider';
const useAccounts = (): Array<KeyringPair> | [] => {
  const { keyringPairs, keyringPairsReady } = useKeyringContext();

  if (!keyringPairsReady && !keyringPairs.length) {
    return [];
  }

  return keyringPairs;
};

export default useAccounts;
