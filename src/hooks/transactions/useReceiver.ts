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

import React, { useCallback } from 'react';
import { TransactionActionCreators } from '../../actions/transactionActions';

import { useSourceTarget } from '../../contexts/SourceTargetContextProvider';

import { useUpdateTransactionContext } from '../../contexts/TransactionContext';

export default function useReceiver() {
  const { dispatchTransaction } = useUpdateTransactionContext();
  const { targetChainDetails, sourceChainDetails } = useSourceTarget();

  const onReceiverChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const unformattedReceiverAddress = event.target.value;
      dispatchTransaction(
        TransactionActionCreators.setReceiver({
          unformattedReceiverAddress,
          sourceChainDetails,
          targetChainDetails
        })
      );
    },
    [dispatchTransaction, sourceChainDetails, targetChainDetails]
  );

  return { onReceiverChange };
}
