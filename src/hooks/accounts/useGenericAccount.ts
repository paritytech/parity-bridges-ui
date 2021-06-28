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

import { useState, useCallback } from 'react';
import { encodeAddress } from '@polkadot/util-crypto';
import { useUpdateTransactionContext } from '../../contexts/TransactionContext';
import { TransactionActionCreators } from '../../actions/transactionActions';
import { useSourceTarget } from '../../contexts/SourceTargetContextProvider';
import useBalance from '../subscriptions/useBalance';
import getDeriveAccount from '../../util/getDeriveAccount';
import shorterItem from '../../util/shortenItem';
import { getBridgeId } from '../../util/getConfigs';
import { AddressKind } from '../../types/accountTypes';

export const useGenericAccount = (value: string) => {
  const [selected, setSelected] = useState('');

  const { dispatchTransaction } = useUpdateTransactionContext();
  const {
    sourceChainDetails: { configs: sourceConfigs },
    targetChainDetails: {
      configs: targetConfigs,
      apiConnection: { api: targetApi }
    }
  } = useSourceTarget();

  const nativeAddress = encodeAddress(value, targetConfigs.ss58Format);
  const nativeState = useBalance(targetApi, nativeAddress, true);

  const companionAddress = getDeriveAccount({
    ss58Format: targetConfigs.ss58Format,
    address: value,
    bridgeId: getBridgeId(targetConfigs, sourceConfigs.chainName)
  });
  const companionState = useBalance(targetApi, companionAddress, true);

  const looseHelperAccount = useCallback(() => {
    setSelected('');
    dispatchTransaction(TransactionActionCreators.setReceiverAddress(null));
  }, [dispatchTransaction]);

  const setNativeAsTargetOrClear = useCallback(
    (address: string, addressKind: AddressKind) => {
      if (selected) {
        looseHelperAccount();
        return;
      }
      setSelected(addressKind);
      dispatchTransaction(TransactionActionCreators.setReceiverAddress(address));
    },
    [dispatchTransaction, looseHelperAccount, selected]
  );

  const setNativeAsTarget = useCallback(() => setNativeAsTargetOrClear(nativeAddress, AddressKind.NATIVE), [
    nativeAddress,
    setNativeAsTargetOrClear
  ]);
  const setCompanionAsTarget = useCallback(() => setNativeAsTargetOrClear(companionAddress, AddressKind.COMPANION), [
    companionAddress,
    setNativeAsTargetOrClear
  ]);

  const shortGenericAddress = shorterItem(value);

  return {
    selected,
    shortGenericAddress,
    setNativeAsTarget,
    setCompanionAsTarget,
    nativeAddress,
    nativeState,
    companionAddress,
    companionState
  };
};
