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

export interface TransactionContextType {
  estimatedFee: string | null;
  receiverAddress: string | null;
  transactions: Array<TransanctionStatus>;
  derivedReceiverAccount: string | null;
  genericReceiverAccount: string | null;
}

export interface Payload {
  [propName: string]: any;
}

export interface UpdatedTransanctionStatus {
  [propName: string]: any;
}

export enum TransactionStatusEnum {
  CREATED = 'CREATED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export interface TransanctionStatus extends UpdatedTransanctionStatus {
  input: string;
  sourceChain: string;
  targetChain: string;
  sourceAccount: null | string;
  receiverAddress: null | string;
  type: string;
  status: TransactionStatusEnum;
}
export interface TransactionState {
  estimatedFee: string | null;
  receiverAddress: string | null;
  derivedReceiverAccount: string | null;
  genericReceiverAccount: string | null;
  transactions: Array<TransanctionStatus>;
}

export type TransactionsActionType = { type: TransactionActionTypes; payload: Payload };

export enum TransactionTypes {
  CUSTOM = 'CUSTOM',
  TRANSFER = 'TRANSFER',
  REMARK = 'REMARK'
}

export interface Step {
  chainType: string;
  label: string;
  status: string;
}
