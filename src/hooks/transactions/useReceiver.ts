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

import React, { useCallback, useEffect } from 'react';
import { TransactionActionCreators } from '../../actions/transactionActions';

import { useSourceTarget } from '../../contexts/SourceTargetContextProvider';
import { useUpdateTransactionContext, useTransactionContext } from '../../contexts/TransactionContext';

import usePrevious from '../../hooks/react/usePrevious';

export default function useReceiver() {
  const { dispatchTransaction } = useUpdateTransactionContext();
  const { unformattedReceiverAddress } = useTransactionContext();
  const { targetChainDetails, sourceChainDetails } = useSourceTarget();

  const { chain: targetChain } = targetChainDetails;
  const prevTargetChain = usePrevious(targetChain);

  const setUnformattedReceiver = useCallback(
    (address: string | null) => dispatchTransaction(TransactionActionCreators.setUnformattedReceiverAddress(address)),
    [dispatchTransaction]
  );

  const onReceiverChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const unformattedReceiverAddress = event.target.value;
      dispatchTransaction(TransactionActionCreators.reset());
      dispatchTransaction(
        // @ts-ignore
        TransactionActionCreators.setReceiver({
          unformattedReceiverAddress,
          sourceChainDetails,
          targetChainDetails
        })
      );
    },
    [dispatchTransaction, sourceChainDetails, targetChainDetails]
  );

  useEffect(() => {
    if (prevTargetChain !== targetChain) {
      dispatchTransaction(TransactionActionCreators.reset());
    }
  }, [unformattedReceiverAddress, setUnformattedReceiver, prevTargetChain, targetChain, dispatchTransaction]);

  return { onReceiverChange };
}
