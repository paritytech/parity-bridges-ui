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
import { SourceTargetState } from '../types/sourceTargetTypes';
import type { InterfaceTypes } from '@polkadot/types/types';

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
  const payloadType = createType(sourceChain as keyof InterfaceTypes, 'OutboundPayload', payload);
  const payloadHex = payloadType.toHex();
  const callType = createType(targetChain as keyof InterfaceTypes, 'BridgedOpaqueCall', payload.call);
  const call = createType(targetChain as keyof InterfaceTypes, 'Call', callType.toHex());
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
