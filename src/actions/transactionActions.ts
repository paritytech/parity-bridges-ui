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

import { TransanctionStatus, UpdatedTransanctionStatus } from '../types/transactionTypes';

enum TransactionActionTypes {
  SET_ESTIMATED_FEE = 'SET_ESTIMATED_FEE',
  SET_RECEIVER_ADDRESS = 'SET_RECEIVER_ADDRESS',
  SET_UNFORMATTED_RECEIVER_ADDRESS = 'SET_UNFORMATTED_RECEIVER_ADDRESS',
  CREATE_TRANSACTION_STATUS = 'CREATE_TRANSACTION_STATUS',
  UPDATE_CURRENT_TRANSACTION_STATUS = 'UPDATE_CURRENT_TRANSACTION_STATUS',
  SET_TRANSACTION_COMPLETED = 'SET_TRANSACTION_COMPLETED',
  SET_RECEIVER_VALIDATION = 'SET_RECEIVER_VALIDATION',
  SET_DERIVED_RECEIVER_ACCOUNT = 'SET_DERIVED_RECEIVER_ACCOUNT',
  SET_GENERIC_RECEIVER_ACCOUNT = 'SET_GENERIC_RECEIVER_ACCOUNT'
}

const estimateFee = (estimatedFee: string) => ({
  payload: { estimatedFee },
  type: TransactionActionTypes.SET_ESTIMATED_FEE
});

const setReceiverAddress = (receiverAddress: string | null) => ({
  payload: { receiverAddress },
  type: TransactionActionTypes.SET_RECEIVER_ADDRESS
});

const setUnformattedReceiverAddress = (unformattedReceiverAddress: string | null) => ({
  payload: { unformattedReceiverAddress },
  type: TransactionActionTypes.SET_UNFORMATTED_RECEIVER_ADDRESS
});

const createTransactionStatus = (initialTransaction: TransanctionStatus) => {
  return {
    payload: { initialTransaction },
    type: TransactionActionTypes.CREATE_TRANSACTION_STATUS
  };
};

const updateTransactionStatus = (updatedValues: UpdatedTransanctionStatus, id: string) => {
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
  createTransactionStatus,
  estimateFee,
  setReceiverAddress,
  setUnformattedReceiverAddress,
  updateTransactionStatus,
  setGenericAccount,
  setDerivedAccount
};

export { TransactionActionCreators, TransactionActionTypes };
