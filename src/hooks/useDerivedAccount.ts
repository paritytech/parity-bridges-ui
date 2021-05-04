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

import { getChainConfigs } from '../configs/substrateProviders';
import { useAccountContext } from '../contexts/AccountContextProvider';
import { useSourceTarget } from '../contexts/SourceTargetContextProvider';
import getDeriveAccount from '../util/getDeriveAccount';

const useDerivedAccount = () => {
  const {
    targetChainDetails: { targetChain },
    sourceChainDetails: { sourceChain }
  } = useSourceTarget();
  const { account } = useAccountContext();
  const chainsConfigs = getChainConfigs();
  const { SS58Format } = chainsConfigs[targetChain];
  const { bridgeId } = chainsConfigs[sourceChain];

  if (!account) {
    return null;
  }

  const toDerive = {
    SS58Format,
    address: account.address,
    bridgeId
  };
  return getDeriveAccount(toDerive);
};

export default useDerivedAccount;
