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

import { formatBalance, hexToU8a, isHex, u8aToHex } from '@polkadot/util';
import type { SignedBlock, BlockHash } from '@polkadot/types/interfaces';
import type { Vec } from '@polkadot/types';

import BN from 'bn.js';
import { ApiPromise } from '@polkadot/api';
import {
  TransactionStatusType,
  TransactionStatusEnum,
  Payload,
  TransactionDisplayPayload,
  TransactionTypes,
  TransactionState,
  Step
} from '../../types/transactionTypes';
import shortenItem from '../shortenItem';
import has from 'lodash/has';
import { Subscriptions } from '../../types/subscriptionsTypes';
import { encodeAddress } from '@polkadot/util-crypto';
import { SourceTargetState } from '../../types/sourceTargetTypes';
import { MessageActionsCreators } from '../../actions/messageActions';
import { getSubstrateDynamicNames } from '../getSubstrateDynamicNames';
import isEmpty from 'lodash/isEmpty';
import type { InterfaceTypes } from '@polkadot/types/types';
import logger from '../logger';
import { Account } from '../../types/accountTypes';
import { MESSAGE_DISPATCH_EVENT, MESSAGE_NONCE_TYPE, OK } from '../../constants';

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

const LOCAL = 'LOCAL';

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
  const payloadType = createType(sourceChain as keyof InterfaceTypes, 'OutboundPayload', payload);
  const payloadHex = payloadType.toHex();
  const callType = createType(targetChain as keyof InterfaceTypes, 'BridgedOpaqueCall', payload.call);
  const call = createType(targetChain as keyof InterfaceTypes, 'Call', callType.toHex());
  const formatedAccount = encodeAddress(account, ss58Format);

  const transactionDisplayPayload = {} as TransactionDisplayPayload;
  const { spec_version, weight, dispatch_fee_payment } = payload;
  transactionDisplayPayload.call = JSON.parse(call);
  transactionDisplayPayload.origin = {
    SourceAccount: formatedAccount
  };
  transactionDisplayPayload.weight = weight;

  transactionDisplayPayload.dispatch_fee_payment = dispatch_fee_payment;
  transactionDisplayPayload.spec_version = spec_version;
  return { transactionDisplayPayload, payloadHex };
}

interface TransactionCallWeightInput {
  action: TransactionTypes;
  account: Account;
  targetApi: ApiPromise;
  transactionState: TransactionState;
}

export async function getTransactionCallWeight({
  action,
  account,
  targetApi,
  transactionState
}: TransactionCallWeightInput) {
  let weight: number = 0;
  let call: Uint8Array | null = null;
  const { receiverAddress, transferAmount, remarkInput, customCallInput, weightInput } = transactionState;

  if (account) {
    switch (action) {
      case TransactionTypes.REMARK:
        call = (await targetApi.tx.system.remark(remarkInput)).toU8a();
        // TODO [#121] Figure out what the extra bytes are about
        logger.info(`system::remark: ${u8aToHex(call)}`);
        weight = (await targetApi.tx.system.remark(remarkInput).paymentInfo(account)).weight.toNumber();
        break;
      case TransactionTypes.TRANSFER:
        if (receiverAddress) {
          call = (await targetApi.tx.balances.transfer(receiverAddress, transferAmount || 0)).toU8a();
          // TODO [#121] Figure out what the extra bytes are about
          logger.info(`balances::transfer: ${u8aToHex(call)}`);
          logger.info(`after balances::transfer: ${u8aToHex(call)}`);
          weight = (
            await targetApi.tx.balances.transfer(receiverAddress, transferAmount || 0).paymentInfo(account)
          ).weight.toNumber();
        }
        break;
      case TransactionTypes.CUSTOM:
        if (customCallInput) {
          call = isHex(customCallInput) ? hexToU8a(customCallInput.toString()) : null;
          weight = parseInt(weightInput!);
        }
        break;
      default:
        throw new Error(`Unknown type: ${action}`);
    }
  }
  return { call, weight };
}

interface FeeWeightInternal {
  api: ApiPromise;
  transactionState: TransactionState;
}

export async function getFeeAndWeightForInternals({ api, transactionState }: FeeWeightInternal) {
  const { receiverAddress, transferAmount, senderAccount } = transactionState;
  const transfer = api.tx.balances.transfer(receiverAddress!, transferAmount || 0);

  const { partialFee, weight } = await transfer.paymentInfo(senderAccount!);
  return { estimatedFee: partialFee.toString(), weight: weight.toNumber() };
}

const stepEvaluator = (transactionValue: string | number | null, chainValue: string | number | null): boolean => {
  if (!transactionValue || !chainValue) return false;

  const bnChainValue = new BN(chainValue);
  const bnTransactionValue = new BN(transactionValue);

  return bnChainValue.gte(bnTransactionValue);
};

const completionStatus = (isCompleted: boolean): TransactionStatusEnum => {
  return isCompleted ? TransactionStatusEnum.COMPLETED : TransactionStatusEnum.IN_PROGRESS;
};

const evaluateAllSteps = (steps: Step[]) => {
  const notCompleted = steps.find(({ status }) => status !== TransactionStatusEnum.COMPLETED);
  return !notCompleted;
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

function deepFind(data: any[], value: string) {
  function iter(subData: any) {
    if (value === OK ? has(subData.toJSON(), 'ok') : subData.toString() === value) {
      result = subData;
      return true;
    }
    return Array.isArray(subData) && subData.some(iter);
  }

  let result;
  data.some(iter);
  return result;
}

const checkMessageDispatchedEvent = async (
  targetApi: ApiPromise,
  blockNumber: string | null,
  messageNonce: string | null
) => {
  if (!blockNumber || !messageNonce) {
    return TransactionStatusEnum.IN_PROGRESS;
  }
  const blockHash = (await targetApi.rpc.chain.getBlockHash(blockNumber)) as BlockHash;
  const signedBlock = (await targetApi.rpc.chain.getBlock(blockHash)) as SignedBlock;
  const allRecords = (await targetApi.query.system.events.at(signedBlock.block.header.hash)) as Vec<any>;

  let status = TransactionStatusEnum.FAILED;
  signedBlock.block.extrinsics.forEach((ext, index) => {
    const events = allRecords.filter(({ phase }) => phase.isApplyExtrinsic && phase.asApplyExtrinsic.eq(index));
    const found = events.find(({ event: { method, data } }) => {
      return method === MESSAGE_DISPATCH_EVENT && deepFind(data, messageNonce) && deepFind(data, OK);
    });
    if (found) {
      status = TransactionStatusEnum.COMPLETED;
    }
  });
  return status;
};

const getLatestReceivedNonce = async (
  blockNumber: string,
  sourceChain: string,
  targetChain: string,
  laneId: string,
  apiCalls: ApiCalls
) => {
  const { targetApi, stateCall, createType } = apiCalls;
  const { latestReceivedNonceMethodName } = getSubstrateDynamicNames(sourceChain);
  const blockHash = (await targetApi.rpc.chain.getBlockHash(blockNumber)) as BlockHash;
  const latestReceivedNonceCall = await stateCall(
    targetChain,
    latestReceivedNonceMethodName,
    laneId,
    blockHash.toJSON()
  );

  const latestReceivedNonceCallType = createType(targetChain, MESSAGE_NONCE_TYPE, latestReceivedNonceCall);
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

  const { sourceChain, targetChain, deliveryBlock, status, messageNonce, steps, type } = transaction;

  if (type === TransactionTypes.INTERNAL_TRANSFER) {
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
  const sourceConfirmationReceived =
    stepEvaluator(transaction.messageNonce, latestReceivedNonceOnSource) && messageFinalizedOnTarget;
  const onChainCompleted = (value: boolean) => completionStatus(value) === TransactionStatusEnum.COMPLETED;

  // 4.1 * We catch the best block on target related to the message delivery.
  let updateDeliveryBlock = false;
  if (messageDelivered && !deliveryBlock) {
    updateDeliveryBlock = true;
  }

  let setTransactionComplete = false;

  let messageDispatched = steps[4].status;
  if (steps[4].status !== TransactionStatusEnum.COMPLETED) {
    messageDispatched = await checkMessageDispatchedEvent(apiCalls.targetApi, deliveryBlock, messageNonce);
  }

  const updatedSteps = [
    step(1, sourceChain, completionStatus(!!transaction.block), transaction.block),
    step(2, sourceChain, completionStatus(sourceTransactionFinalized)),
    step(3, targetChain, completionStatus(blockFinalityRelayed)),
    step(4, targetChain, completionStatus(messageDelivered), onChainCompleted(messageDelivered) && deliveryBlock),
    step(5, targetChain, messageDispatched),
    step(6, targetChain, completionStatus(messageFinalizedOnTarget)),
    step(7, sourceChain, completionStatus(sourceConfirmationReceived))
  ];

  if (sourceConfirmationReceived) {
    const successfulTransfer = evaluateAllSteps(updatedSteps);
    if (successfulTransfer) {
      dispatchMessage(
        MessageActionsCreators.triggerSuccessMessage({
          message: `Transaction: ${shortenItem(transaction.blockHash)} is completed`
        })
      );
    } else {
      dispatchMessage(
        MessageActionsCreators.triggerErrorMessage({
          message: `Transaction: ${shortenItem(transaction.blockHash)} was not successful.`
        })
      );
    }
    setTransactionComplete = true;
  }

  return {
    ...transaction,
    steps: updatedSteps,
    deliveryBlock: updateDeliveryBlock ? bestBlockOnTarget : deliveryBlock,
    status: setTransactionComplete ? TransactionStatusEnum.COMPLETED : status,
    evaluating: false
  };
};

const bridgedSteps = [
  ['include-message-block', 'Include message in block'],
  ['finalized-block', 'Finalize block'],
  ['relay-block', 'Relay block'],
  ['deliver-message-block', 'Deliver message in target block'],
  ['message-dispatch-confirmation', 'Message dispatch confirmation'],
  ['finalized-message', 'Finalize message'],
  ['confirm-delivery', 'Confirm delivery']
];

const internalSteps = [
  ['include-message-block', 'Include message in block'],
  ['finalized-block', 'Finalize block']
];

const step = (step: number, chainType: string, status?: TransactionStatusEnum, labelOnChain?: any, type?: string) => {
  const steps = type === 'local' ? internalSteps : bridgedSteps;
  const obj = {
    id: 'test-step-' + steps[step - 1][0],
    chainType,
    label: steps[step - 1][1],
    status: status || TransactionStatusEnum.NOT_STARTED
  };
  if (!isEmpty(labelOnChain)) {
    return { ...obj, labelOnChain };
  }
  return obj;
};

export const createEmptySteps = (sourceChain: string, targetChain: string) => [
  step(1, sourceChain),
  step(2, sourceChain),
  step(3, targetChain),
  step(4, targetChain),
  step(5, targetChain),
  step(6, targetChain),
  step(7, sourceChain)
];

export const createEmptyInternalSteps = (sourceChain: string) => [
  step(1, sourceChain, undefined, null, LOCAL),
  step(2, sourceChain, undefined, null, LOCAL)
];

export const handleInternalTransactionUpdates = (transaction: TransactionStatusType, sourceChain: string) => {
  const { steps, block, status } = transaction;
  const updatedSteps = [...steps];
  let nextStatus = status;
  if (block && status !== TransactionStatusEnum.FINALIZED) {
    updatedSteps[0] = step(1, sourceChain, TransactionStatusEnum.COMPLETED, block, LOCAL);
  }

  if (status === TransactionStatusEnum.FINALIZED) {
    updatedSteps[1] = step(2, sourceChain, TransactionStatusEnum.COMPLETED, null, LOCAL);
    nextStatus = TransactionStatusEnum.COMPLETED;
  }

  return { ...transaction, steps: updatedSteps, status: nextStatus, evaluating: false };
};

export const getFormattedAmount = (api: ApiPromise, amount: BN | null, type: TransactionTypes): string | null => {
  if ((type === TransactionTypes.TRANSFER || type === TransactionTypes.INTERNAL_TRANSFER) && amount) {
    const decimals = api.registry.chainDecimals[0];
    const withUnit = api.registry.chainTokens[0];
    return formatBalance(amount, {
      decimals,
      withUnit,
      withSi: true
    });
  }
  return null;
};
