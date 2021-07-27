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

import { ApiPromise } from '@polkadot/api';
import { TransactionDisplayPayload, TransactionState, TransactionTypes } from '../../types/transactionTypes';

export const state: TransactionState = {
  senderAccount: null,
  transferAmount: null,
  remarkInput: '0x',
  customCallInput: '0x',
  weightInput: '',
  transferAmountError: null,
  estimatedFee: null,
  receiverAddress: null,
  unformattedReceiverAddress: null,
  derivedReceiverAccount: null,
  genericReceiverAccount: null,
  transactions: [],
  transactionDisplayPayload: {} as TransactionDisplayPayload,
  transactionRunning: false,
  transactionReadyToExecute: false,
  addressValidationError: null,
  showBalance: false,
  formatFound: null,
  payload: null,
  payloadHex: null,
  payloadEstimatedFeeError: null,
  payloadEstimatedFeeLoading: false,
  action: TransactionTypes.TRANSFER
};

export const apiConnection = {
  api: {} as ApiPromise,
  isApiReady: true
};

export const sourceConfigs = {
  bridgeIds: { chain2: [1, 2, 3] },
  chainName: 'chain1',
  ss58Format: 48
};

export const targetConfigs = {
  bridgeIds: { chain1: [1, 2, 3] },
  chainName: 'chain2',
  ss58Format: 60
};

export const sourceChainDetails = {
  configs: sourceConfigs,
  apiConnection,
  chain: 'chain1',
  polkadotjsUrl: 'url1'
};

export const targetChainDetails = {
  configs: targetConfigs,
  apiConnection,
  chain: 'chain2',
  polkadotjsUrl: 'url2'
};
