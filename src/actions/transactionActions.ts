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

import { BalanceState } from '../types/accountTypes';
import { CreateType } from '../types/apiCallsTypes';
import { SourceTargetState } from '../types/sourceTargetTypes';

import {
  TransactionStatusType,
  TransactionTypes,
  UpdatedTransactionStatusType,
  ReceiverPayload,
  PayloadEstimatedFee,
  TransactionState
} from '../types/transactionTypes';

enum TransactionActionTypes {
  SET_TRANSFER_AMOUNT = 'SET_TRANSFER_AMOUNT',
  SET_REMARK_INPUT = 'SET_REMARK_INPUT',
  SET_RECEIVER = 'SET_RECEIVER',
  SET_RECEIVER_ADDRESS = 'SET_RECEIVER_ADDRESS',
  SET_RECEIVER_VALIDATION = 'SET_RECEIVER_VALIDATION',
  SET_SENDER = 'SET_SENDER',
  SET_ACTION = 'SET_ACTION',
  SET_PAYLOAD_ESTIMATED_FEE = 'SET_PAYLOAD_ESTIMATED_FEE',
  CREATE_TRANSACTION_STATUS = 'CREATE_TRANSACTION_STATUS',
  UPDATE_CURRENT_TRANSACTION_STATUS = 'UPDATE_CURRENT_TRANSACTION_STATUS',
  SET_TRANSACTION_COMPLETED = 'SET_TRANSACTION_COMPLETED',
  SET_TRANSACTION_RUNNING = 'SET_TRANSACTION_RUNNING',
  SET_CUSTOM_CALL_INPUT = 'SET_CUSTOM_CALL_INPUT',
  SET_WEIGHT_INPUT = 'SET_WEIGHT_INPUT',
  UPDATE_TRANSACTIONS_STATUS = 'UPDATE_TRANSACTIONS_STATUS',
  SET_BATCH_PAYLOAD_ESTIMATED_FEE = 'SET_BATCH_PAYLOAD_ESTIMATED_FEE',
  UPDATE_SENDER_BALANCES = 'UPDATE_SENDER_BALANCES',
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
  payloadEstimatedFeeLoading: boolean,
  sourceTargetDetails: SourceTargetState,
  createType: CreateType,
  isBridged: boolean,
  senderAccountBalance: BalanceState | null,
  senderCompanionAccountBalance: BalanceState | null
) => ({
  payload: {
    payloadEstimatedFee,
    payloadEstimatedFeeError,
    payloadEstimatedFeeLoading,
    sourceTargetDetails,
    createType,
    isBridged,
    senderAccountBalance,
    senderCompanionAccountBalance
  },
  type: TransactionActionTypes.SET_PAYLOAD_ESTIMATED_FEE
});

const updateTransactionsStatus = (
  evaluateTransactionStatusError: string | null,
  transactions: TransactionStatusType[] | null,
  evaluatingTransactions: boolean
) => ({
  payload: { evaluateTransactionStatusError, transactions, evaluatingTransactions },
  type: TransactionActionTypes.UPDATE_TRANSACTIONS_STATUS
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

const setAction = (action: TransactionTypes) => ({
  payload: { action },
  type: TransactionActionTypes.SET_ACTION
});

const setSender = (senderAccount: string | null) => ({
  payload: { senderAccount },
  type: TransactionActionTypes.SET_SENDER
});

const setRemarkInput = (remarkInput: string | null) => ({
  payload: { remarkInput },
  type: TransactionActionTypes.SET_REMARK_INPUT
});

const setCustomCallInput = (customCallInput: string | null, createType: CreateType, targetChain: string) => ({
  payload: { customCallInput, createType, targetChain },
  type: TransactionActionTypes.SET_CUSTOM_CALL_INPUT
});

const setWeightInput = (weightInput: string | null) => ({
  payload: { weightInput },
  type: TransactionActionTypes.SET_WEIGHT_INPUT
});

const setBatchedEvaluationPayloadEstimatedFee = (batchedTransactionState: TransactionState | null) => ({
  payload: { batchedTransactionState },
  type: TransactionActionTypes.SET_BATCH_PAYLOAD_ESTIMATED_FEE
});

type UpdateSenderBalances = {
  senderAccountBalance: BalanceState | null;
  senderCompanionAccountBalance: BalanceState | null;
};

const updateSenderBalances = ({ senderAccountBalance, senderCompanionAccountBalance }: UpdateSenderBalances) => ({
  payload: { senderAccountBalance, senderCompanionAccountBalance },
  type: TransactionActionTypes.UPDATE_SENDER_BALANCES
});

const TransactionActionCreators = {
  setSender,
  setAction,
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
  updateTransactionsStatus,
  setBatchedEvaluationPayloadEstimatedFee,
  updateSenderBalances,
  reset
};

export { TransactionActionCreators, TransactionActionTypes };
