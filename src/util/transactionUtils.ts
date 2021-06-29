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
import { encodeAddress } from '@polkadot/util-crypto';

export function isTransactionCompleted(transaction: TransactionStatusType): boolean {
  return transaction.status === TransactionStatusEnum.COMPLETED;
}

interface PayloadInput {
  payload: Payload;
  ss58Format: number;
  account: string;
  createType: Function;
  targetChain: string;
}

export function getTransactionDisplayPayload({
  payload,
  ss58Format,
  account,
  createType,
  targetChain
}: PayloadInput): TransactionDisplayPayload {
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
  return transactionDisplayPayload;
}
