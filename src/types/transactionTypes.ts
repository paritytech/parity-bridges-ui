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

import { TransactionActionTypes } from '../actions/transactionActions';
import { ChainState } from './sourceTargetTypes';
import BN from 'bn.js';

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
  FAILED = 'FAILED'
}

export enum SwitchTabEnum {
  RECEIPT = 'RECEIPT',
  PAYLOAD = 'PAYLOAD',
  DECODED = 'DECODED'
}
export interface TransactionPayload {
  call: Uint8Array;
  origin: {
    SourceAccount: string;
  };
  spec_version: number;
  weight: number;
}

export interface TransactionDisplayPayload {
  call: Object;
  origin: Object;
  spec_version: string;
  weight: string;
}

export interface TransactionStatusType extends UpdatedTransactionStatusType {
  input: string;
  sourceChain: string;
  targetChain: string;
  sourceAccount: null | string;
  receiverAddress: null | string;
  type: string;
  status: TransactionStatusEnum;
}

export interface TransactionState {
  senderAccount: string | null;
  remarkInput: string;
  customCallInput: string;
  weightInput: string;
  transferAmount: BN | null;
  transferAmountError: string | null;
  estimatedFee: string | null;
  estimatedFeeError: string | null;
  estimatedFeeLoading: boolean;
  receiverAddress: string | null;
  unformattedReceiverAddress: string | null;
  derivedReceiverAccount: string | null;
  genericReceiverAccount: string | null;
  transactions: Array<TransactionStatusType>;
  transactionDisplayPayload: TransactionDisplayPayload;
  transactionRunning: boolean;
  transactionReadyToExecute: boolean;
  addressValidationError: string | null;
  showBalance: boolean;
  formatFound: string | null;
  payload: TransactionPayload | null;
  payloadError: string | null;
  payloadHex: string | null;
  action: TransactionTypes;
}

export type TransactionsActionType = { type: TransactionActionTypes; payload: Payload };

export enum TransactionTypes {
  CUSTOM = 'CUSTOM',
  TRANSFER = 'TRANSFER',
  REMARK = 'REMARK'
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
}
