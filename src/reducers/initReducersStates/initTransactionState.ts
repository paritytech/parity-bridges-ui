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

import { TransactionState, TransactionTypes } from '../../types/transactionTypes';

export const initTransactionState: TransactionState = {
  resetedAt: null,
  senderAccount: null,
  transferAmount: null,
  remarkInput: '',
  customCallInput: '',
  customCallError: null,
  weightInput: '',
  transferAmountError: null,
  estimatedFee: null,
  receiverAddress: null,
  unformattedReceiverAddress: null,
  derivedReceiverAccount: null,
  genericReceiverAccount: null,
  evaluatingTransactions: false,
  transactions: [],
  transactionDisplayPayload: null,
  transactionRunning: false,
  transactionReadyToExecute: false,
  evaluateTransactionStatusError: null,
  addressValidationError: null,
  showBalance: false,
  formatFound: null,
  payload: null,
  payloadHex: null,
  shouldEvaluatePayloadEstimatedFee: false,
  payloadEstimatedFeeError: null,
  payloadEstimatedFeeLoading: false,
  batchedTransactionState: null,
  action: TransactionTypes.TRANSFER
};
