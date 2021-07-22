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

import { Dispatch, useEffect } from 'react';
import { compactAddLength } from '@polkadot/util';
import { useAccountContext } from '../../contexts/AccountContextProvider';
import { useApiCallsContext } from '../../contexts/ApiCallsContextProvider';
import { useSourceTarget } from '../../contexts/SourceTargetContextProvider';
import { TransactionActionCreators } from '../../actions/transactionActions';
import logger from '../../util/logger';
import type { InterfaceTypes } from '@polkadot/types/types';
import useLaneId from '../chain/useLaneId';
import { getSubstrateDynamicNames } from '../../util/getSubstrateDynamicNames';
import useTransactionType from './useTransactionType';
import { TransactionsActionType, TransactionState } from '../../types/transactionTypes';

export const useEstimatedFeePayload = (
  transactionState: TransactionState,
  dispatchTransaction: Dispatch<TransactionsActionType>
) => {
  const { createType, stateCall } = useApiCallsContext();

  const laneId = useLaneId();
  const {
    sourceChainDetails: { chain: sourceChain },
    targetChainDetails: {
      apiConnection: { api: targetApi },
      chain: targetChain
    }
  } = useSourceTarget();
  const { account } = useAccountContext();
  const { estimatedFeeMethodName } = getSubstrateDynamicNames(targetChain);
  const { call, weight } = useTransactionType(transactionState);

  useEffect(() => {
    const getPayloadEstimatedFee = async () => {
      if (!account || !call || !weight) {
        return null;
      }

      dispatchTransaction(
        TransactionActionCreators.setPayloadEstimatedFee(null, { payload: null, estimatedFee: null }, true)
      );

      const payload = {
        call: compactAddLength(call!),
        origin: {
          SourceAccount: account!.addressRaw
        },
        spec_version: targetApi.consts.system.version.specVersion.toNumber(),
        weight
      };

      const payloadType = createType(sourceChain as keyof InterfaceTypes, 'OutboundPayload', payload);
      logger.info(`OutboundPayload: ${JSON.stringify(payload)}`);
      logger.info(`OutboundPayload.toHex(): ${payloadType.toHex()}`);
      const messageFeeType = createType(sourceChain as keyof InterfaceTypes, 'MessageFeeData', {
        lane_id: laneId,
        payload: payloadType.toHex()
      });

      const estimatedFeeCall = await stateCall(sourceChain, estimatedFeeMethodName, messageFeeType.toHex());

      const estimatedFeeType = createType(sourceChain as keyof InterfaceTypes, 'Option<Balance>', estimatedFeeCall);
      const estimatedFee = estimatedFeeType.toString();
      dispatchTransaction(TransactionActionCreators.setPayloadEstimatedFee(null, { estimatedFee, payload }, false));
    };

    try {
      getPayloadEstimatedFee();
    } catch (e) {
      dispatchTransaction(
        TransactionActionCreators.setPayloadEstimatedFee(e, { payload: null, estimatedFee: null }, false)
      );
    }
  }, [
    account,
    call,
    createType,
    dispatchTransaction,
    estimatedFeeMethodName,
    laneId,
    sourceChain,
    stateCall,
    targetApi.consts.system.version.specVersion,
    weight
  ]);
};

export default useEstimatedFeePayload;
