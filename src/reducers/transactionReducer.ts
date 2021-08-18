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

import type { InterfaceTypes } from '@polkadot/types/types';
import { TransactionActionTypes } from '../actions/transactionActions';
import {
  updateTransaction,
  isReadyToExecute,
  setReceiver,
  shouldCalculatePayloadFee
} from '../util/transactions/reducer';
import { TransactionsActionType, TransactionState } from '../types/transactionTypes';
import logger from '../util/logger';
import { evalUnits } from '../util/evalUnits';
import { getTransactionDisplayPayload } from '../util/transactions';
import { isHex } from '@polkadot/util';

export default function transactionReducer(state: TransactionState, action: TransactionsActionType): TransactionState {
  const transactionReadyToExecute = isReadyToExecute({ ...state, ...action.payload });
  switch (action.type) {
    case TransactionActionTypes.SET_PAYLOAD_ESTIMATED_FEE: {
      const {
        payloadEstimatedFeeError,
        payloadEstimatedFee: { estimatedFee, payload },
        payloadEstimatedFeeLoading,
        sourceTargetDetails,
        createType,
        isBridged
      } = action.payload;

      const { senderAccount, transferAmount, receiverAddress } = state;

      const readyToExecute = payloadEstimatedFeeLoading ? false : transactionReadyToExecute;

      let payloadHex = null;
      let transactionDisplayPayload = null;

      if (senderAccount) {
        if (payload && isBridged) {
          const updated = getTransactionDisplayPayload({
            payload,
            account: senderAccount,
            createType,
            sourceTargetDetails
          });
          payloadHex = updated.payloadHex;
          transactionDisplayPayload = updated.transactionDisplayPayload;
        }
        if (!isBridged && receiverAddress && transferAmount) {
          transactionDisplayPayload = {
            sourceAccount: senderAccount,
            transferAmount: transferAmount.toNumber(),
            receiverAddress: receiverAddress
          };
        }
      }

      return {
        ...state,
        estimatedFee: !payloadEstimatedFeeError && transactionReadyToExecute ? estimatedFee : null,
        payloadEstimatedFeeError,
        payloadEstimatedFeeLoading,
        payload: payloadEstimatedFeeError ? null : payload,

        transactionReadyToExecute: readyToExecute,
        shouldEvaluatePayloadEstimatedFee: false,
        payloadHex,
        transactionDisplayPayload
      };
    }

    case TransactionActionTypes.SET_BATCH_PAYLOAD_ESTIMATED_FEE: {
      const { batchedTransactionState } = action.payload;

      return {
        ...state,
        batchedTransactionState,
        transactionReadyToExecute: Boolean(batchedTransactionState && state.estimatedFee),
        shouldEvaluatePayloadEstimatedFee: false
      };
    }

    case TransactionActionTypes.SET_TRANSFER_AMOUNT: {
      const { transferAmount, chainDecimals } = action.payload;
      if (!transferAmount) {
        return {
          ...state,
          transferAmount,
          transferAmountError: null,
          transactionReadyToExecute: false
        };
      }
      const [actualValue, message] = evalUnits(transferAmount, chainDecimals);
      const shouldEvaluatePayloadEstimatedFee = shouldCalculatePayloadFee(state, { transferAmount: actualValue });

      return {
        ...state,
        transferAmount: actualValue || null,
        transferAmountError: message,
        transactionReadyToExecute,
        estimatedFee: null,
        shouldEvaluatePayloadEstimatedFee
      };
    }
    case TransactionActionTypes.SET_REMARK_INPUT: {
      const { remarkInput } = action.payload;

      if (remarkInput.startsWith('0x')) {
        if (isHex(remarkInput)) {
          const shouldEvaluatePayloadEstimatedFee = shouldCalculatePayloadFee(state, { remarkInput });
          return {
            ...state,
            remarkInput: remarkInput as string,
            transactionReadyToExecute,
            shouldEvaluatePayloadEstimatedFee
          };
        }
      }

      return {
        ...state,
        remarkInput,
        transactionReadyToExecute: false,
        shouldEvaluatePayloadEstimatedFee: false,
        estimatedFee: null,
        payload: null,
        payloadEstimatedFeeError: 'Invalid remark input'
      };
    }
    case TransactionActionTypes.SET_CUSTOM_CALL_INPUT: {
      const { customCallInput, createType, targetChain } = action.payload;
      if (!customCallInput) {
        return {
          ...state,
          customCallInput,
          transactionReadyToExecute: false,
          customCallError: null,
          shouldEvaluatePayloadEstimatedFee: false
        };
      }
      let customCallError = null;
      let shouldEvaluatePayloadEstimatedFee = false;
      try {
        createType(targetChain as keyof InterfaceTypes, 'Call', customCallInput);
        shouldEvaluatePayloadEstimatedFee = shouldCalculatePayloadFee(state, { customCallInput });
      } catch (e) {
        customCallError = e;
        logger.error('Wrong call', e);
      }

      return {
        ...state,
        customCallInput,
        transactionReadyToExecute: transactionReadyToExecute && !customCallError,
        estimatedFee: customCallError || !customCallInput ? null : state.estimatedFee,
        customCallError,
        shouldEvaluatePayloadEstimatedFee
      };
    }
    case TransactionActionTypes.SET_WEIGHT_INPUT: {
      const { weightInput } = action.payload;
      const shouldEvaluatePayloadEstimatedFee = shouldCalculatePayloadFee(state, { weightInput });

      return {
        ...state,
        weightInput: weightInput,
        transactionReadyToExecute: transactionReadyToExecute && !state.customCallError,
        shouldEvaluatePayloadEstimatedFee,
        estimatedFee: weightInput ? state.estimatedFee : null
      };
    }

    case TransactionActionTypes.RESET:
      return {
        ...state,
        resetedAt: Date.now().toString(),
        derivedReceiverAccount: null,
        estimatedFee: null,
        payloadEstimatedFeeError: null,
        shouldEvaluatePayloadEstimatedFee: false,
        batchedTransactionState: null,
        genericReceiverAccount: null,
        receiverAddress: null,
        transferAmount: null,
        transferAmountError: null,
        remarkInput: '',
        customCallInput: '',
        customCallError: null,
        weightInput: '',
        unformattedReceiverAddress: null,
        addressValidationError: null,
        payload: null,
        transactionDisplayPayload: null,
        payloadHex: null,
        showBalance: false,
        formatFound: null,
        transactionReadyToExecute: false
      };
    case TransactionActionTypes.SET_RECEIVER_ADDRESS: {
      const { receiverAddress } = action.payload;
      const shouldEvaluatePayloadEstimatedFee = shouldCalculatePayloadFee(state, { receiverAddress });
      return {
        ...state,
        receiverAddress,
        transactionReadyToExecute,
        shouldEvaluatePayloadEstimatedFee
      };
    }

    case TransactionActionTypes.CREATE_TRANSACTION_STATUS:
      return { ...state, transactions: [action.payload.initialTransaction, ...state.transactions] };
    case TransactionActionTypes.UPDATE_CURRENT_TRANSACTION_STATUS:
      return updateTransaction(state, action.payload);
    case TransactionActionTypes.SET_RECEIVER:
      return setReceiver(state, action.payload.receiverPayload);
    case TransactionActionTypes.SET_TRANSACTION_RUNNING:
      return { ...state, transactionRunning: action.payload.transactionRunning, transactionReadyToExecute: false };
    case TransactionActionTypes.SET_SENDER_AND_ACTION: {
      const { senderAccount, action: transactionType } = action.payload;
      const shouldEvaluatePayloadEstimatedFee = shouldCalculatePayloadFee(state, {
        senderAccount,
        action: transactionType
      });
      return {
        ...state,
        senderAccount: senderAccount,
        action: transactionType,
        shouldEvaluatePayloadEstimatedFee
      };
    }

    case TransactionActionTypes.UPDATE_TRANSACTIONS_STATUS: {
      const { evaluateTransactionStatusError, transactions, evaluatingTransactions } = action.payload;
      return {
        ...state,
        transactions: transactions && !evaluateTransactionStatusError ? transactions : state.transactions,
        evaluatingTransactions,
        evaluateTransactionStatusError
      };
    }
    default:
      throw new Error(`Unknown type: ${action.type}`);
  }
}
