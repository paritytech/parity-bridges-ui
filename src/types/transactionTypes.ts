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
import { TransactionActionTypes } from '../actions/transactionActions';
import { ChainState } from './sourceTargetTypes';

export interface Payload {
  [propName: string]: any;
}

export interface UpdatedTransactionStatusType {
  [propName: string]: any;
}

export enum TransactionStatusEnum {
  NOT_STARTED = 'NOT_STARTED',
  CREATED = 'CREATED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FINALIZED = 'FINALIZED',
  FAILED = 'FAILED'
}

export enum SwitchTabEnum {
  RECEIPT = 'RECEIPT',
  PAYLOAD = 'PAYLOAD',
  DECODED = 'DECODED'
}

export interface Fees {
  estimatedFeeMessageDelivery: string;
  estimatedFeeBridgeCall: string;
  estimatedFeeTarget: string;
}

export interface BridgedTransactionPayload {
  call: Uint8Array;
  origin: {
    SourceAccount: Uint8Array;
  };
  dispatch_fee_payment: { _enum: [PayFee] };
  spec_version: number;
  weight: number;
}

export interface InternalTransferPayload {
  sourceAccount: string | null;
  transferAmount: number;
  receiverAddress: string | null;
  weight: number;
}

export type TransactionPayload = BridgedTransactionPayload | InternalTransferPayload;

export interface TransactionDisplayPayload {
  call: Object;
  origin: Object;
  spec_version: string;
  dispatch_fee_payment: PayFee;
  weight: number;
}

export type PayloadEstimatedFee = {
  payload: TransactionPayload | null;
  estimatedSourceFee: string | null;
  estimatedFeeMessageDelivery: string | null;
  estimatedFeeBridgeCall: string | null;
  estimatedTargetFee: string | null;
};

export type DisplayPayload = TransactionDisplayPayload | InternalTransferPayload;

export interface TransactionStatusType extends UpdatedTransactionStatusType {
  input?: string;
  sourceChain: string;
  targetChain: string;
  senderCompanionAccount?: string | null;
  senderName: string | null;
  sourceAccount: null | string;
  receiverAddress: null | string;
  type: TransactionTypes;
  transferAmount?: string | null;
  status: TransactionStatusEnum;
  deliveryBlock: string | null;
}

export enum PayFee {
  AtTargetChain = 'AtTargetChain',
  AtSourceChain = 'AtSourceChain'
}

export interface TransactionState {
  resetedAt: string | null;
  senderAccount: string | null;
  remarkInput: string;
  customCallInput: string;
  customCallError: string | null;
  weightInput: string | null;
  transferAmount: BN | null;
  transferAmountError: string | null;
  payFee: PayFee;
  estimatedSourceFee: string | null;
  estimatedFeeMessageDelivery: string | null;
  estimatedFeeBridgeCall: string | null;
  estimatedTargetFee: string | null;
  receiverAddress: string | null;
  unformattedReceiverAddress: string | null;
  derivedReceiverAccount: string | null;
  genericReceiverAccount: string | null;
  transactions: Array<TransactionStatusType>;
  evaluatingTransactions: boolean;
  transactionDisplayPayload: DisplayPayload | null;
  transactionRunning: boolean;
  transactionToBeExecuted: boolean;
  transactionReadyToExecute: boolean;
  evaluateTransactionStatusError: string | null;
  addressValidationError: string | null;
  showBalance: boolean;
  formatFound: string | null;
  payload: TransactionPayload | null;
  payloadHex: string | null;
  shouldEvaluatePayloadEstimatedFee: boolean;
  payloadEstimatedFeeError: string | null;
  payloadEstimatedFeeLoading: boolean;
  batchedTransactionState: TransactionState | null;
  action: TransactionTypes;
}

export type TransactionsActionType = { type: TransactionActionTypes; payload: Payload };

export enum TransactionTypes {
  CUSTOM = 'CUSTOM',
  TRANSFER = 'TRANSFER',
  REMARK = 'REMARK',
  INTERNAL_TRANSFER = 'INTERNAL_TRANSFER'
}

export enum EvalMessages {
  GIBBERISH = 'Input is not correct. Use numbers, floats or expression (e.g. 1k, 1.3m)',
  ZERO = 'You cannot send 0 funds',
  SUCCESS = '',
  SYMBOL_ERROR = 'Provided symbol is not correct',
  GENERAL_ERROR = 'Check your input. Something went wrong'
}

export interface Step {
  id: string;
  chainType: string;
  label: string;
  labelOnChain?: string;
  status: keyof typeof TransactionStatusEnum;
}

export interface ReceiverPayload {
  unformattedReceiverAddress: string | null;
  sourceChainDetails: ChainState;
  targetChainDetails: ChainState;
  isBridged: boolean;
}
