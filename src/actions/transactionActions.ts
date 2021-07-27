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
  UpdatedTransactionStatusType,
  ReceiverPayload,
  TransactionPayload
} from '../types/transactionTypes';

enum TransactionActionTypes {
  SET_TRANSFER_AMOUNT = 'SET_TRANSFER_AMOUNT',
  SET_ESTIMATED_FEE = 'SET_ESTIMATED_FEE',
  SET_PAYLOAD = 'SET_PAYLOAD',
  SET_PAYLOAD_ERROR = 'SET_PAYLOAD_ERROR',
  SET_RECEIVER = 'SET_RECEIVER',
  SET_RECEIVER_ADDRESS = 'SET_RECEIVER_ADDRESS',
  SET_RECEIVER_VALIDATION = 'SET_RECEIVER_VALIDATION',
  SET_SENDER_ACCOUNT = 'SET_SENDER_ACCOUNT',
  CREATE_TRANSACTION_STATUS = 'CREATE_TRANSACTION_STATUS',
  UPDATE_CURRENT_TRANSACTION_STATUS = 'UPDATE_CURRENT_TRANSACTION_STATUS',
  SET_TRANSACTION_COMPLETED = 'SET_TRANSACTION_COMPLETED',
  SET_TRANSACTION_RUNNING = 'SET_TRANSACTION_RUNNING',
  UPDATE_TRANSACTIONS_STATUS = 'UPDATE_TRANSACTIONS_STATUS',
  RESET = 'RESET'
}

const setTransferAmount = (transferAmount: string | null, chainDecimals?: number) => {
  return {
    payload: { transferAmount, chainDecimals },
    type: TransactionActionTypes.SET_TRANSFER_AMOUNT
  };
};

const setEstimatedFee = (
  estimatedFeeError: string | null,
  estimatedFee: string | null,
  estimatedFeeLoading: boolean
) => {
  return {
    payload: { estimatedFee, estimatedFeeError, estimatedFeeLoading },
    type: TransactionActionTypes.SET_ESTIMATED_FEE
  };
};

const updateTransactionsStatus = (
  evaludateTransactionStatusError: string | null,
  transactions: TransactionStatusType[] | null,
  evaluatingTransactions: boolean
) => ({
  payload: { evaludateTransactionStatusError, transactions, evaluatingTransactions },
  type: TransactionActionTypes.UPDATE_TRANSACTIONS_STATUS
});

const setPayload = (payloadError: string | null, payload: TransactionPayload | null) => ({
  payload: { payload, payloadError },
  type: TransactionActionTypes.SET_PAYLOAD
});

const setReceiverAddress = (receiverAddress: string | null) => ({
  payload: { receiverAddress },
  type: TransactionActionTypes.SET_RECEIVER_ADDRESS
});

const setReceiver = (receiverPayload: ReceiverPayload) => ({
  payload: { receiverPayload },
  type: TransactionActionTypes.SET_RECEIVER
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

const reset = () => ({
  payload: {},
  type: TransactionActionTypes.RESET
});

const setTransactionRunning = (transactionRunning: boolean) => ({
  payload: { transactionRunning },
  type: TransactionActionTypes.SET_TRANSACTION_RUNNING
});

const setSenderAccount = (senderAccount: string | null) => ({
  payload: { senderAccount },
  type: TransactionActionTypes.SET_SENDER_ACCOUNT
});

const TransactionActionCreators = {
  setSenderAccount,
  setReceiverAddress,
  setReceiver,
  setTransferAmount,
  setEstimatedFee,
  setTransactionRunning,
  createTransactionStatus,
  updateTransactionStatus,
  updateTransactionsStatus,
  setPayload,
  reset
};

export { TransactionActionCreators, TransactionActionTypes };
