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

import React, { useContext, createContext } from 'react';
import { TransactionStatusType, OverrideSourceTargetContextType } from '../types/transactionTypes';

import { useSourceTarget } from '../contexts/SourceTargetContextProvider';
import { useSubscriptionsContext } from '../contexts/SubscriptionsContextProvider';
import { getChainSubscriptionsKey } from '../util/chainsUtils';
import useChainGetters from '../hooks/chain/useChainGetters';

interface Props {
  transaction: TransactionStatusType;
  onComplete: () => void;
  children: React.ReactElement;
}

export const OverrideSourceTargetContext: React.Context<OverrideSourceTargetContextType> = createContext(
  {} as OverrideSourceTargetContextType
);

export function useOverrideSourceTargetContext() {
  return useContext(OverrideSourceTargetContext);
}

export default function OverrideSourceTarget({ transaction, onComplete, children }: Props) {
  const { getValuesByChain } = useChainGetters();
  const { sourceChain, targetChain } = transaction;
  const { api: targetApi } = getValuesByChain(targetChain);
  const subscriptions = useSubscriptionsContext();
  const {
    sourceChainDetails: { chain: currentSourceChain }
  } = useSourceTarget();

  const { sourceRole, targetRole } = getChainSubscriptionsKey({
    currentSourceChain,
    sourceChain
  });

  const overrideValues = {
    targetApi,
    transaction,
    sourceSubscriptions: subscriptions[sourceRole],
    targetSubscriptions: subscriptions[targetRole],
    onComplete
  };

  return <OverrideSourceTargetContext.Provider value={overrideValues}>{children}</OverrideSourceTargetContext.Provider>;
}
