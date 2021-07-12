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
import { getSubstrateDynamicNames } from '../../util/getSubstrateDynamicNames';
import useDispatchGenericCall from '../api/useDispatchGenericCall';
import useLaneId from '../chain/useLaneId';
import type { InterfaceTypes } from '@polkadot/types/types';

export const useEstimateFee = () => {
  const { createType, stateCall } = useApiCallsContext();
  const laneId = useLaneId();
  const {
    sourceChainDetails: { chain: sourceChain },
    targetChainDetails: { chain: targetChain }
  } = useSourceTarget();
  const { dispatchTransaction } = useUpdateTransactionContext();
  const { estimatedFeeMethodName } = getSubstrateDynamicNames(targetChain);

  const estimateFeeCallback = useCallback(
    async (payloadInput: Object | null) => {
      if (!payloadInput) {
        return null;
      }

      // Ignoring custom types missed for TS for now.
      // Need to apply: https://polkadot.js.org/docs/api/start/typescript.user
      const payloadType = createType(sourceChain as keyof InterfaceTypes, 'OutboundPayload', payloadInput);
      const messageFeeType = createType(sourceChain as keyof InterfaceTypes, 'MessageFeeData', {
        lane_id: laneId,
        payload: payloadType.toHex()
      });

      const estimatedFeeCall = await stateCall(sourceChain, estimatedFeeMethodName, messageFeeType.toHex());

      const estimatedFeeType = createType(sourceChain as keyof InterfaceTypes, 'Option<Balance>', estimatedFeeCall);
      const estimatedFee = estimatedFeeType.toString();
      return estimatedFee;
    },
    [createType, estimatedFeeMethodName, laneId, sourceChain, stateCall]
  );

  const dispatch = useCallback(
    (error: string | null, data: any, loading: boolean) =>
      dispatchTransaction(TransactionActionCreators.setEstimatedFee(error, data, loading)),
    [dispatchTransaction]
  );

  const { execute: calculateEstimateFee } = useDispatchGenericCall({
    call: estimateFeeCallback,
    dispatch
  });

  return calculateEstimateFee;
};

export default useEstimateFee;
