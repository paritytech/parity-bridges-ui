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
  TransactionTypes,
  UpdatedTransactionStatusType,
  ReceiverPayload,
  PayloadEstimatedFee
} from '../types/transactionTypes';

enum TransactionActionTypes {
  SET_TRANSFER_AMOUNT = 'SET_TRANSFER_AMOUNT',
  SET_REMARK_INPUT = 'SET_REMARK_INPUT',
  SET_RECEIVER = 'SET_RECEIVER',
  SET_RECEIVER_ADDRESS = 'SET_RECEIVER_ADDRESS',
  SET_RECEIVER_VALIDATION = 'SET_RECEIVER_VALIDATION',
  SET_PAYLOAD_ESTIMATED_FEE = 'SET_PAYLOAD_ESTIMATED_FEE',
  COMBINE_REDUCERS = 'COMBINE_REDUCERS',
  CREATE_TRANSACTION_STATUS = 'CREATE_TRANSACTION_STATUS',
  UPDATE_CURRENT_TRANSACTION_STATUS = 'UPDATE_CURRENT_TRANSACTION_STATUS',
  SET_TRANSACTION_COMPLETED = 'SET_TRANSACTION_COMPLETED',
  SET_TRANSACTION_RUNNING = 'SET_TRANSACTION_RUNNING',
  SET_CUSTOM_CALL_INPUT = 'SET_CUSTOM_CALL_INPUT',
  SET_WEIGHT_INPUT = 'SET_WEIGHT_INPUT',
  RESET = 'RESET'
}

const setTransferAmount = (transferAmount: string | null, chainDecimals?: number) => {
  return {
    payload: { transferAmount, chainDecimals },
    type: TransactionActionTypes.SET_TRANSFER_AMOUNT
  };
};

const setPayloadEstimatedFee = (
  payloadEstimatedFeeError: string | null,
  payloadEstimatedFee: PayloadEstimatedFee | null,
  payloadEstimatedFeeLoading: boolean
) => ({
  payload: { payloadEstimatedFee, payloadEstimatedFeeError, payloadEstimatedFeeLoading },
  type: TransactionActionTypes.SET_PAYLOAD_ESTIMATED_FEE
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

type CombineReducersInput = {
  senderAccount: string | null;
  action: TransactionTypes;
};
const combineReducers = ({ senderAccount, action }: CombineReducersInput) => ({
  payload: { senderAccount, action },
  type: TransactionActionTypes.COMBINE_REDUCERS
});

const setRemarkInput = (remarkInput: string | null) => ({
  payload: { remarkInput },
  type: TransactionActionTypes.SET_REMARK_INPUT
});

const setCustomCallInput = (customCallInput: string | null) => ({
  payload: { customCallInput },
  type: TransactionActionTypes.SET_CUSTOM_CALL_INPUT
});

const setWeightInput = (weightInput: string | null) => ({
  payload: { weightInput },
  type: TransactionActionTypes.SET_WEIGHT_INPUT
});

const TransactionActionCreators = {
  combineReducers,
  setReceiverAddress,
  setReceiver,
  setTransferAmount,
  setPayloadEstimatedFee,
  setCustomCallInput,
  setWeightInput,
  setRemarkInput,
  setTransactionRunning,
  createTransactionStatus,
  updateTransactionStatus,
  reset
};

export { TransactionActionCreators, TransactionActionTypes };
