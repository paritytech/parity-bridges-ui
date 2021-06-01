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
import { SubmittableExtrinsic } from '@polkadot/api/types';
import type { Registry, AnyNumber } from '@polkadot/types/types';
import type { Bytes } from '@polkadot/types/primitive';

import type { SignedBlock, BlockHash, BlockNumber } from '@polkadot/types/interfaces';
import { Codec } from '@polkadot/types/types';

import { TransactionState } from '../types/transactionTypes';

export type SendBridgeMessage = (
  chain: string,
  laneId: string,
  payload: Object,
  estimatedFee: TransactionState['estimatedFee']
) => SubmittableExtrinsic<'promise'>;

export type GetBlock = (chain: string, asInBlock?: BlockHash | string | Uint8Array) => Promise<SignedBlock>;

export type CreateType = Registry['createType'];

export type StateCall = (
  chain: string,
  data: Bytes | string | Uint8Array,
  at?: BlockHash | string | Uint8Array
) => Promise<Codec>;

type GetBlockHash = (chain: string, blockNumber?: BlockNumber | AnyNumber | Uint8Array) => Promise<BlockHash>;

export interface ApiCallsContextType {
  sendBridgeMessage: SendBridgeMessage;
  getBlock: GetBlock;
  getBlockHash: GetBlockHash;
  createType: CreateType;
  stateCall: StateCall;
}
