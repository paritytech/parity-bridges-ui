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

import BN from 'bn.js';
import { ApiPromise } from '@polkadot/api';
import {
  TransactionStatusType,
  TransactionStatusEnum,
  Payload,
  TransactionDisplayPayload
} from '../types/transactionTypes';
import shortenItem from '../util/shortenItem';
import { Subscriptions } from '../types/subscriptionsTypes';
import { encodeAddress } from '@polkadot/util-crypto';
import { SourceTargetState } from '../types/sourceTargetTypes';
import { MessageActionsCreators } from '../actions/messageActions';
import { getSubstrateDynamicNames } from './getSubstrateDynamicNames';

export function isTransactionCompleted(transaction: TransactionStatusType): boolean {
  return transaction.status === TransactionStatusEnum.COMPLETED;
}

interface PayloadInput {
  payload: Payload;
  account: string;
  createType: Function;
  sourceTargetDetails: SourceTargetState;
}

interface Output {
  transactionDisplayPayload: TransactionDisplayPayload | null;
  payloadHex: string | null;
}

export function getTransactionDisplayPayload({
  payload,
  account,
  createType,
  sourceTargetDetails
}: PayloadInput): Output {
  const {
    sourceChainDetails: {
      chain: sourceChain,
      configs: { ss58Format }
    },
    targetChainDetails: { chain: targetChain }
  } = sourceTargetDetails;
  //@ts-ignore
  const payloadType = createType(sourceChain, 'OutboundPayload', payload);
  const payloadHex = payloadType.toHex();
  //@ts-ignore
  const callType = createType(targetChain, 'BridgedOpaqueCall', payload.call);
  //@ts-ignore
  const call = createType(targetChain, 'Call', callType.toHex());
  const formatedAccount = encodeAddress(account, ss58Format);

  const transactionDisplayPayload = {} as TransactionDisplayPayload;
  const { spec_version, weight } = payload;
  transactionDisplayPayload.call = JSON.parse(call);
  transactionDisplayPayload.origin = {
    SourceAccount: formatedAccount
  };
  transactionDisplayPayload.weight = weight;
  transactionDisplayPayload.spec_version = spec_version;
  return { transactionDisplayPayload, payloadHex };
}

const stepEvaluator = (transactionValue: string | number | null, chainValue: string | number | null): boolean => {
  if (!transactionValue || !chainValue) return false;

  const bnChainValue = new BN(chainValue);
  const bnTransactionValue = new BN(transactionValue);

  return bnChainValue.gte(bnTransactionValue);
};

const completionStatus = (isCompleted: boolean): TransactionStatusEnum => {
  /*   if (transaction.id === 0) {
    return TransactionStatusEnum.NOT_STARTED;
  } */
  return isCompleted ? TransactionStatusEnum.COMPLETED : TransactionStatusEnum.IN_PROGRESS;
};

interface ApiCalls {
  targetApi: ApiPromise;
  stateCall: Function;
  createType: Function;
}

interface InputTransactionUpdates {
  transaction: TransactionStatusType;
  sourceSubscriptions: Subscriptions;
  targetSubscriptions: Subscriptions;
  apiCalls: ApiCalls;
  dispatchMessage: Function; // To type correctly
  laneId: string;
}

const getLatestReceivedNonce = async (
  blockNumber: string,
  sourceChain: string,
  targetChain: string,
  laneId: string,
  apiCalls: ApiCalls
) => {
  const { targetApi, stateCall, createType } = apiCalls;
  const { latestReceivedNonceMethodName } = getSubstrateDynamicNames(sourceChain);
  const blockHash = await targetApi.rpc.chain.getBlockHash(blockNumber);
  const latestReceivedNonceCall = await stateCall(
    targetChain,
    latestReceivedNonceMethodName,
    laneId,
    blockHash.toJSON()
  );

  // @ts-ignore
  const latestReceivedNonceCallType = createType(targetChain, 'MessageNonce', latestReceivedNonceCall);
  const latestReceivedNonce = latestReceivedNonceCallType.toString();
  return parseInt(latestReceivedNonce);
};

export const handleTransactionUpdates = async ({
  transaction,
  sourceSubscriptions,
  targetSubscriptions,
  dispatchMessage,
  apiCalls,
  laneId
}: InputTransactionUpdates) => {
  const {
    bestBlockFinalized,
    outboundLanes: { latestReceivedNonce: latestReceivedNonceOnSource }
  } = sourceSubscriptions;
  const {
    bestBridgedFinalizedBlock: bestBridgedFinalizedBlockOnTarget,
    bestBlock: bestBlockOnTarget
  } = targetSubscriptions;

  const { sourceChain, targetChain, deliveryBlock, status } = transaction;

  if (status === TransactionStatusEnum.COMPLETED) {
    return transaction;
  }

  const nonceOfFinalTargetBlock = await getLatestReceivedNonce(
    bestBlockFinalized,
    sourceChain,
    targetChain,
    laneId,
    apiCalls
  );
  const nonceOfBestTargetBlock = await getLatestReceivedNonce(
    bestBlockOnTarget,
    sourceChain,
    targetChain,
    laneId,
    apiCalls
  );

  // 1. We wait until the block transaction gets finalized  ( source.bestBlockFinalized is greater or equal to transaction.block )
  const sourceTransactionFinalized = stepEvaluator(transaction.block, bestBlockFinalized);
  // 2. When the target chain knows about a bigger source block number we infer that transaction block was realayed to target chain.
  const blockFinalityRelayed = stepEvaluator(transaction.block, bestBridgedFinalizedBlockOnTarget);
  // 3.1 We read the latest received nonce of the target chain rpc state call.
  // 3.2 With the value obtained we compare it with the transaction nonce, if the value is bigger or equal then means target chain is aware about this nonce.
  const messageDelivered = stepEvaluator(transaction.messageNonce, nonceOfBestTargetBlock);
  // 4.1 *
  // 4.2 We match the transaction nonce with the current nonce of the best finalized target block
  const messageFinalizedOnTarget = stepEvaluator(transaction.messageNonce, nonceOfFinalTargetBlock);

  // 5. Once the source chain is confirms through the latestReceivedNonceOnSource, that target chain is aware about the message nonce, the transaction is completed.
  const sourceConfirmationReceived = stepEvaluator(transaction.messageNonce, latestReceivedNonceOnSource);
  const onChainCompleted = (value: boolean) => completionStatus(value) === TransactionStatusEnum.COMPLETED;

  // 4.1 * We catch the best block on target related to the message delivery.
  let updateDeliveryBlock = false;
  if (messageDelivered && !deliveryBlock) {
    updateDeliveryBlock = true;
  }

  let setTransactionComplete = false;
  if (sourceConfirmationReceived) {
    setTransactionComplete = true;
    dispatchMessage(
      MessageActionsCreators.triggerSuccessMessage({
        message: `Transaction: ${shortenItem(transaction.blockHash)} is completed`
      })
    );
  }

  const updatedSteps = [
    {
      id: 'test-step-include-message-block',
      chainType: sourceChain,
      label: 'Include message in block',
      labelOnChain: transaction.block,
      status: completionStatus(!!transaction.block)
    },
    {
      id: 'test-step-finalized-block',
      chainType: sourceChain,
      label: 'Finalize block',
      status: completionStatus(sourceTransactionFinalized)
    },
    {
      id: 'test-step-relay-block',
      chainType: targetChain,
      label: 'Relay block',
      status: completionStatus(blockFinalityRelayed)
    },
    {
      id: 'test-step-deliver-message-block',
      chainType: targetChain,
      label: 'Deliver message in target block',
      labelOnChain: onChainCompleted(messageDelivered) && deliveryBlock,
      status: completionStatus(messageDelivered)
    },
    {
      id: 'test-step-finalized-message',
      chainType: targetChain,
      label: 'Finalize message',
      status: completionStatus(messageFinalizedOnTarget)
    },
    {
      id: 'test-step-confirm-delivery',
      chainType: sourceChain,
      label: 'Confirm delivery',
      status: completionStatus(sourceConfirmationReceived)
    }
  ];

  return {
    ...transaction,
    steps: updatedSteps,
    deliveryBlock: updateDeliveryBlock ? bestBlockOnTarget : deliveryBlock,
    status: setTransactionComplete ? TransactionStatusEnum.COMPLETED : status
  };
};
