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

import { useCallback } from 'react';
import { useApiCallsContext } from '../../contexts/ApiCallsContextProvider';
import { useSourceTarget } from '../../contexts/SourceTargetContextProvider';
import { TransactionActionCreators } from '../../actions/transactionActions';
import { useUpdateTransactionContext } from '../../contexts/TransactionContext';
import { useApiGenericCall } from '../api/useApiGenericCall';
import { getSubstrateDynamicNames } from '../../util/getSubstrateDynamicNames';
import useLaneId from '../chain/useLaneId';

export const useEstimateFee = () => {
  const { createType, stateCall } = useApiCallsContext();
  const laneId = useLaneId();
  const {
    sourceChainDetails: { chain: sourceChain },
    targetChainDetails: { chain: targetChain }
  } = useSourceTarget();
  const { dispatchTransaction } = useUpdateTransactionContext();

  const { execute } = useApiGenericCall({
    customSetIsLoading: (isCalculatingFee: boolean) =>
      dispatchTransaction(TransactionActionCreators.setCalculatingFee(isCalculatingFee)),
    customSetError: (error: string) => dispatchTransaction(TransactionActionCreators.setTransactionError(error)),
    customSetData: (estimatedFee: any) => dispatchTransaction(TransactionActionCreators.setEstimateFee(estimatedFee))
  });

  const getEstimateFeeCall = useCallback(
    async (payload) => {
      const { estimatedFeeMethodName } = getSubstrateDynamicNames(targetChain);
      // Ignoring custom types missed for TS for now.
      // Need to apply: https://polkadot.js.org/docs/api/start/typescript.user
      // @ts-ignore
      const payloadType = createType(sourceChain, 'OutboundPayload', payload);
      // @ts-ignore
      const messageFeeType = createType(sourceChain, 'MessageFeeData', {
        lane_id: laneId,
        payload: payloadType.toHex()
      });

      const estimatedFeeCall = await stateCall(sourceChain, estimatedFeeMethodName, messageFeeType.toHex());

      // @ts-ignore
      const estimatedFeeType = createType(sourceChain, 'Option<Balance>', estimatedFeeCall);
      const estimatedFee = estimatedFeeType.toString();

      dispatchTransaction(TransactionActionCreators.setEstimateFee(estimatedFee));
    },
    [createType, dispatchTransaction, laneId, sourceChain, stateCall, targetChain]
  );

  return execute(getEstimateFeeCall);
};

export default useEstimateFee;
