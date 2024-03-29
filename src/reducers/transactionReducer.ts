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
  shouldCalculatePayloadFee,
  enoughFundsEvaluation
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
        payloadEstimatedFee: {
          estimatedSourceFee,
          estimatedFeeMessageDelivery,
          estimatedFeeBridgeCall,
          estimatedTargetFee,
          payload
        },
        payloadEstimatedFeeLoading,
        sourceTargetDetails,
        createType,
        isBridged,
        senderAccountBalance,
        senderCompanionAccountBalance
      } = action.payload;

      const { senderAccount, receiverAddress, transferAmount } = state;

      const { evaluateTransactionStatusError, notEnoughFundsToTransfer, notEnoughToPayFee } = enoughFundsEvaluation({
        transferAmount,
        senderCompanionAccountBalance,
        senderAccountBalance,
        estimatedSourceFee,
        estimatedTargetFee,
        action: state.action
      });

      const readyToExecute = payloadEstimatedFeeLoading
        ? false
        : transactionReadyToExecute && !notEnoughToPayFee && !notEnoughFundsToTransfer;

      let payloadHex = null;
      let transactionDisplayPayload = null;

      if (senderAccount && payload) {
        if (isBridged) {
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
            receiverAddress: receiverAddress,
            weight: payload.weight
          };
        }
      }

      return {
        ...state,
        estimatedSourceFee: !payloadEstimatedFeeError && transactionReadyToExecute ? estimatedSourceFee : null,
        estimatedTargetFee: !payloadEstimatedFeeError && transactionReadyToExecute ? estimatedTargetFee : null,
        estimatedFeeMessageDelivery:
          !payloadEstimatedFeeError && transactionReadyToExecute ? estimatedFeeMessageDelivery : null,
        estimatedFeeBridgeCall: !payloadEstimatedFeeError && transactionReadyToExecute ? estimatedFeeBridgeCall : null,
        payloadEstimatedFeeError,
        payloadEstimatedFeeLoading,
        payload: payloadEstimatedFeeError ? null : payload,
        transactionReadyToExecute: readyToExecute,
        shouldEvaluatePayloadEstimatedFee: false,
        payloadHex,
        transactionDisplayPayload,
        evaluateTransactionStatusError
      };
    }

    case TransactionActionTypes.SET_BATCH_PAYLOAD_ESTIMATED_FEE: {
      const { batchedTransactionState } = action.payload;

      return {
        ...state,
        batchedTransactionState,
        transactionReadyToExecute: Boolean(batchedTransactionState && state.estimatedSourceFee),
        shouldEvaluatePayloadEstimatedFee: false
      };
    }

    case TransactionActionTypes.SET_TRANSFER_AMOUNT: {
      const { transferAmount, chainDecimals } = action.payload;

      const [actualValue, message] = evalUnits(transferAmount, chainDecimals);
      if (!transferAmount) {
        return {
          ...state,
          transferAmount,
          transferAmountError: null,
          transactionReadyToExecute: false,
          estimatedSourceFee: null,
          estimatedFeeMessageDelivery: null,
          estimatedFeeBridgeCall: null,
          estimatedTargetFee: null,
          payload: null
        };
      }

      const shouldEvaluatePayloadEstimatedFee = shouldCalculatePayloadFee(state, { transferAmount: actualValue });

      return {
        ...state,
        transferAmount: actualValue || null,
        transferAmountError: message,
        transactionReadyToExecute: transactionReadyToExecute && !message,
        estimatedSourceFee: null,
        estimatedFeeMessageDelivery: null,
        estimatedFeeBridgeCall: null,
        estimatedTargetFee: null,
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
        estimatedSourceFee: null,
        estimatedFeeMessageDelivery: null,
        estimatedFeeBridgeCall: null,
        estimatedTargetFee: null,
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
        estimatedSourceFee: customCallError || !customCallInput ? null : state.estimatedSourceFee,
        estimatedTargetFee: customCallError || !customCallInput ? null : state.estimatedTargetFee,
        estimatedFeeMessageDelivery: customCallError || !customCallInput ? null : state.estimatedFeeMessageDelivery,
        estimatedFeeBridgeCall: customCallError || !customCallInput ? null : state.estimatedFeeBridgeCall,
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
        estimatedSourceFee: weightInput ? state.estimatedSourceFee : null,
        estimatedFeeMessageDelivery: weightInput ? state.estimatedFeeMessageDelivery : null,
        estimatedFeeBridgeCall: weightInput ? state.estimatedFeeBridgeCall : null
      };
    }

    case TransactionActionTypes.RESET:
      return {
        ...state,
        evaluateTransactionStatusError: null,
        resetedAt: Date.now().toString(),
        derivedReceiverAccount: null,
        estimatedSourceFee: null,
        estimatedFeeMessageDelivery: null,
        estimatedFeeBridgeCall: null,
        estimatedTargetFee: null,
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
      return {
        ...state,
        transactionRunning: action.payload.transactionRunning,
        transactionReadyToExecute: action.payload.transactionRunning ? false : state.transactionReadyToExecute
      };
    case TransactionActionTypes.SET_TRANSACTION_TO_BE_EXECUTED: {
      const { transactionToBeExecuted } = action.payload;
      return {
        ...state,
        transactionToBeExecuted
      };
    }

    case TransactionActionTypes.SET_ACTION: {
      const { action: transactionType } = action.payload;

      return {
        ...state,
        action: transactionType
      };
    }
    case TransactionActionTypes.SET_SENDER: {
      const { senderAccount } = action.payload;

      return {
        ...state,
        senderAccount
      };
    }
    case TransactionActionTypes.UPDATE_SENDER_BALANCES: {
      const { action: transactionType, senderAccount } = state;

      const shouldEvaluatePayloadEstimatedFee = shouldCalculatePayloadFee(state, {
        senderAccount,
        action: transactionType
      });

      return {
        ...state,
        shouldEvaluatePayloadEstimatedFee,
        transactionReadyToExecute: false
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
    case TransactionActionTypes.SET_TRANSFER_TYPE: {
      const { transferType } = action.payload;
      return {
        ...state,
        action: transferType
      };
    }
    case TransactionActionTypes.ENABLE_TX_BUTTON: {
      return {
        ...state,
        transactionReadyToExecute: true
      };
    }
    case TransactionActionTypes.DISABLE_TX_BUTTON: {
      return {
        ...state,
        transactionReadyToExecute: false
      };
    }
    case TransactionActionTypes.CHANGE_DISPATCH_FEE_PAY_CHAIN: {
      return {
        ...state,
        payFee: action.payload.payFee,
        shouldEvaluatePayloadEstimatedFee: true
      };
    }
    default:
      throw new Error(`Unknown type: ${action.type}`);
  }
}
