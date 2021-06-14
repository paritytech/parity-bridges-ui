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

import { TransactionStatusType, UpdatedTransactionStatusType } from '../types/transactionTypes';

enum TransactionActionTypes {
  RESET_ESTIMATED_FEE = 'RESET_ESTIMATED_FEE',
  CLEAR_ESTIMATED_FEE = 'CLEAR_ESTIMATED_FEE',
  SET_RECEIVER_ADDRESS = 'SET_RECEIVER_ADDRESS',
  SET_UNFORMATTED_RECEIVER_ADDRESS = 'SET_UNFORMATTED_RECEIVER_ADDRESS',
  CREATE_TRANSACTION_STATUS = 'CREATE_TRANSACTION_STATUS',
  UPDATE_CURRENT_TRANSACTION_STATUS = 'UPDATE_CURRENT_TRANSACTION_STATUS',
  SET_TRANSACTION_COMPLETED = 'SET_TRANSACTION_COMPLETED',
  SET_RECEIVER_VALIDATION = 'SET_RECEIVER_VALIDATION',
  SET_DERIVED_RECEIVER_ACCOUNT = 'SET_DERIVED_RECEIVER_ACCOUNT',
  SET_GENERIC_RECEIVER_ACCOUNT = 'SET_GENERIC_RECEIVER_ACCOUNT',
  SET_PAYLOAD = 'SET_PAYLOAD',
  CLEAR_PAYLOAD = 'CLEAR_PAYLOAD'
}

const resetEstimatedFee = () => ({
  payload: {},
  type: TransactionActionTypes.RESET_ESTIMATED_FEE
});

const setEstimatedFee = (estimatedFee: string | null, estimatedFeeError: string | null) => ({
  payload: { estimatedFee, estimatedFeeError },
  type: TransactionActionTypes.CLEAR_ESTIMATED_FEE
});

const setPayload = (payload: Object | null, payloadError: string | null) => ({
  payload: { payload, payloadError },
  type: TransactionActionTypes.SET_PAYLOAD
});

const resetPayload = () => ({
  payload: {},
  type: TransactionActionTypes.SET_PAYLOAD
});

const setReceiverAddress = (receiverAddress: string | null) => ({
  payload: { receiverAddress },
  type: TransactionActionTypes.SET_RECEIVER_ADDRESS
});

const setUnformattedReceiverAddress = (unformattedReceiverAddress: string | null) => ({
  payload: { unformattedReceiverAddress },
  type: TransactionActionTypes.SET_UNFORMATTED_RECEIVER_ADDRESS
});

const createTransactionStatus = (initialTransaction: TransactionStatusType) => {
  return {
    payload: { initialTransaction },
    type: TransactionActionTypes.CREATE_TRANSACTION_STATUS
  };
};

const updateTransactionStatus = (updatedValues: UpdatedTransactionStatusType, id: string) => {
  return {
    payload: { id, updatedValues },
    type: TransactionActionTypes.UPDATE_CURRENT_TRANSACTION_STATUS
  };
};

const setGenericAccount = (genericReceiverAccount: string | null) => ({
  payload: { genericReceiverAccount },
  type: TransactionActionTypes.SET_GENERIC_RECEIVER_ACCOUNT
});

const setDerivedAccount = (derivedReceiverAccount: string | null) => ({
  payload: { derivedReceiverAccount },
  type: TransactionActionTypes.SET_DERIVED_RECEIVER_ACCOUNT
});

const TransactionActionCreators = {
  resetPayload,
  setEstimatedFee,
  createTransactionStatus,
  resetEstimatedFee,
  setReceiverAddress,
  setUnformattedReceiverAddress,
  updateTransactionStatus,
  setGenericAccount,
  setDerivedAccount,
  setPayload
};

export { TransactionActionCreators, TransactionActionTypes };
