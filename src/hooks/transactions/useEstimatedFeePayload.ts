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

import { Dispatch, useCallback, useEffect } from 'react';
import { BN, compactAddLength, u8aToHex } from '@polkadot/util';
import { useAccountContext } from '../../contexts/AccountContextProvider';
import { useApiCallsContext } from '../../contexts/ApiCallsContextProvider';
import { useSourceTarget } from '../../contexts/SourceTargetContextProvider';
import { TransactionActionCreators } from '../../actions/transactionActions';
import { FeeDetails } from '@polkadot/types/interfaces';
import logger from '../../util/logger';
import type { InterfaceTypes } from '@polkadot/types/types';

import useLaneId from '../chain/useLaneId';
import { getSubstrateDynamicNames } from '../../util/getSubstrateDynamicNames';
import { genericCall } from '../../util/apiUtlis';
import {
  PayloadEstimatedFee,
  TransactionsActionType,
  TransactionState,
  TransactionTypes
} from '../../types/transactionTypes';
import { getFeeAndWeightForInternals, getTransactionCallWeight } from '../../util/transactions/';
import { useGUIContext } from '../../contexts/GUIContextProvider';
import usePrevious from '../react/usePrevious';

const emptyData = {
  payload: null,
  estimatedSourceFee: null,
  estimatedFeeMessageDelivery: null,
  estimatedFeeBridgeCall: null,
  estimatedTargetFee: null
} as PayloadEstimatedFee;

export const useEstimatedFeePayload = (
  transactionState: TransactionState,
  dispatchTransaction: Dispatch<TransactionsActionType>
) => {
  const { createType, stateCall } = useApiCallsContext();

  const laneId = useLaneId();
  const sourceTargetDetails = useSourceTarget();
  const {
    sourceChainDetails: {
      chain: sourceChain,
      apiConnection: { api: sourceApi }
    },
    targetChainDetails: {
      apiConnection: { api: targetApi },
      chain: targetChain
    }
  } = sourceTargetDetails;
  const { account, senderAccountBalance, senderCompanionAccountBalance } = useAccountContext();
  const { action, isBridged } = useGUIContext();
  const { estimatedFeeMethodName } = getSubstrateDynamicNames(targetChain);
  const previousPayloadEstimatedFeeLoading = usePrevious(transactionState.payloadEstimatedFeeLoading);
  const { bridgedMessages } = getSubstrateDynamicNames(targetChain);

  const dispatch = useCallback(
    (error: string | null, data: PayloadEstimatedFee | null, loading: boolean) =>
      dispatchTransaction(
        TransactionActionCreators.setPayloadEstimatedFee({
          payloadEstimatedFeeError: error,
          payloadEstimatedFee: data,
          payloadEstimatedFeeLoading: loading,
          sourceTargetDetails,
          createType,
          isBridged,
          senderAccountBalance,
          senderCompanionAccountBalance,
          chainDecimals: targetApi.registry.chainDecimals[0]
        })
      ),
    [
      createType,
      dispatchTransaction,
      isBridged,
      senderAccountBalance,
      senderCompanionAccountBalance,
      sourceTargetDetails,
      targetApi.registry.chainDecimals
    ]
  );

  const calculateFeeAndPayload = useCallback(
    async (currentTransactionState: TransactionState) => {
      if (currentTransactionState.action === TransactionTypes.INTERNAL_TRANSFER) {
        const { estimatedFee, weight } = await getFeeAndWeightForInternals({
          api: sourceApi,
          transactionState: currentTransactionState
        });
        const payload = {
          sourceAccount: currentTransactionState.senderAccount,
          transferAmount: currentTransactionState.transferAmount!.toNumber(),
          receiverAddress: currentTransactionState.receiverAddress,
          weight
        };
        return { estimatedSourceFee: estimatedFee, payload };
      }
      const { call, weight } = await getTransactionCallWeight({
        action,
        account,
        targetApi,
        transactionState: currentTransactionState
      });

      if (!call || !weight) {
        return emptyData;
      }

      const callToCompact = currentTransactionState.action === TransactionTypes.CUSTOM ? call : call.slice(2);
      const payload = {
        call: compactAddLength(callToCompact),
        origin: {
          SourceAccount: account!.addressRaw
        },
        dispatch_fee_payment: currentTransactionState.payFee,
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

      // estimatedFeeMessageDelivery
      const estimatedFeeCall = await stateCall(sourceChain, estimatedFeeMethodName, messageFeeType.toHex());
      const estimatedFeeType = createType(sourceChain as keyof InterfaceTypes, 'Option<Balance>', estimatedFeeCall);
      const estimatedFeeMessageDelivery = estimatedFeeType.toString();

      // estimatedFeeBridgeCall
      const bridgeMessage = sourceApi.tx[bridgedMessages].sendMessage(laneId, payload, estimatedFeeCall);
      const submitMessageTransactionFee = await sourceApi.rpc.payment.queryFeeDetails(bridgeMessage.toHex());
      const estimatedFeeBridgeCallBalance = (submitMessageTransactionFee as FeeDetails).inclusionFee.unwrap()
        .adjustedWeightFee;
      const estimatedFeeBridgeCall = estimatedFeeBridgeCallBalance.toString();

      // estimatedSourceFee calculation based on the sum of estimatedFeeMessageDelivery + estimatedFeeBridgeCallBalance
      const estimatedSourceFeeBN = new BN(estimatedFeeMessageDelivery).add(estimatedFeeBridgeCallBalance.toBn());
      const estimatedSourceFee = estimatedSourceFeeBN.toString();

      // estimatedTargetFee
      const targetFeeDetails = await targetApi.rpc.payment.queryFeeDetails(u8aToHex(call));
      const estimatedTargetFee = (targetFeeDetails as FeeDetails).inclusionFee.unwrap().adjustedWeightFee.toString();

      return {
        estimatedSourceFee,
        estimatedFeeMessageDelivery,
        estimatedFeeBridgeCall,
        estimatedTargetFee,
        payload
      };
    },
    [
      account,
      action,
      bridgedMessages,
      createType,
      estimatedFeeMethodName,
      laneId,
      sourceApi,
      sourceChain,
      stateCall,
      targetApi
    ]
  );

  useEffect(() => {
    const { shouldEvaluatePayloadEstimatedFee, payloadEstimatedFeeLoading } = transactionState;

    if (shouldEvaluatePayloadEstimatedFee && payloadEstimatedFeeLoading) {
      logger.info(
        'Transaction information changed while estimated fee is being calculating. Batching the new calculation.'
      );
      dispatchTransaction(TransactionActionCreators.setBatchedEvaluationPayloadEstimatedFee(transactionState));
    }
    if (shouldEvaluatePayloadEstimatedFee && !payloadEstimatedFeeLoading) {
      genericCall({
        //@ts-ignore
        call: () => calculateFeeAndPayload(transactionState),
        dispatch,
        emptyData
      });
    }
  }, [calculateFeeAndPayload, dispatch, dispatchTransaction, transactionState]);

  useEffect(() => {
    const { batchedTransactionState, payloadEstimatedFeeLoading } = transactionState;

    if (
      previousPayloadEstimatedFeeLoading &&
      !payloadEstimatedFeeLoading &&
      batchedTransactionState &&
      senderAccountBalance &&
      senderCompanionAccountBalance
    ) {
      genericCall({
        //@ts-ignore
        call: () => calculateFeeAndPayload(batchedTransactionState),
        dispatch,
        emptyData
      });
      dispatchTransaction(TransactionActionCreators.setBatchedEvaluationPayloadEstimatedFee(null));
    }
  }, [
    account,
    calculateFeeAndPayload,
    dispatch,
    dispatchTransaction,
    previousPayloadEstimatedFeeLoading,
    senderAccountBalance,
    senderCompanionAccountBalance,
    transactionState
  ]);
};

export default useEstimatedFeePayload;
