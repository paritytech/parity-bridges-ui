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

import {
  TransactionStatusType,
  TransactionStatusEnum,
  Payload,
  TransactionDisplayPayload
} from '../types/transactionTypes';

export function isTransactionCompleted(transaction: TransactionStatusType): boolean {
  return transaction.status === TransactionStatusEnum.COMPLETED;
}

export function getTransactionDisplayPayload(payload: Payload): TransactionDisplayPayload {
  const toObject = (arr: Array<any>): Object => Object.fromEntries(Object.entries(arr));
  const transactionDisplayPayload = {} as TransactionDisplayPayload;
  const { call, origin, spec_version, weight } = payload;
  transactionDisplayPayload.call = toObject(call);
  transactionDisplayPayload.origin = {
    SourceAccount: toObject(origin.SourceAccount)
  };
  transactionDisplayPayload.weight = weight;
  transactionDisplayPayload.spec_version = spec_version;
  return transactionDisplayPayload;
}
