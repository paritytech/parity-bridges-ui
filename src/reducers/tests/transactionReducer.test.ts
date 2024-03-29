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

import { state, sourceChainDetails, targetChainDetails } from './transactionReducerMocks';
import transactionReducer from '../transactionReducer';
import { TransactionActionCreators } from '../../actions/transactionActions';
import { TransactionPayload, TransactionTypes } from '../../types/transactionTypes';
import { compactAddLength } from '@polkadot/util';
import { getTransactionDisplayPayload } from '../../util/transactions';
import BN from 'bn.js';
import { SourceTargetState } from '../../types/sourceTargetTypes';
import { GENERIC } from '../../constants';

jest.mock('../../util/transactions');

describe('transactionReducer', () => {
  describe('SET_RECEIVER', () => {
    const payload = {
      unformattedReceiverAddress: '',
      sourceChainDetails,
      targetChainDetails,
      isBridged: true
    };
    describe('Bridge', () => {
      it('should return the according transaction state for a companion address and its corresponding companion account.', () => {
        payload.unformattedReceiverAddress = '5rERgaT1Z8nM3et2epA5i1VtEBfp5wkhwHtVE8HK7BRbjAH2';
        const action = TransactionActionCreators.setReceiver(payload);
        const result = transactionReducer(state, action);
        expect(result).toEqual({
          ...state,
          derivedReceiverAccount: '714dr3fW9PAKWMRn9Zcr6vtqn8gUEoKF7E2bDu5BniTMS4bo',
          receiverAddress: '5rERgaT1Z8nM3et2epA5i1VtEBfp5wkhwHtVE8HK7BRbjAH2',
          unformattedReceiverAddress: '5rERgaT1Z8nM3et2epA5i1VtEBfp5wkhwHtVE8HK7BRbjAH2',
          showBalance: true,
          formatFound: 'chain1',
          transactionReadyToExecute: false,
          payloadEstimatedFeeLoading: false,
          shouldEvaluatePayloadEstimatedFee: false,
          estimatedSourceFee: null,
          estimatedFeeMessageDelivery: null,
          estimatedFeeBridgeCall: null,
          estimatedTargetFee: null
        });
      });

      it('should return the according transaction state for a target native address.', () => {
        payload.unformattedReceiverAddress = '74GNQjmkcfstRftSQPJgMREchqHM56EvAUXRc266cZ1NYVW5';
        const action = TransactionActionCreators.setReceiver(payload);
        const result = transactionReducer(state, action);
        expect(result).toEqual({
          ...state,
          receiverAddress: '74GNQjmkcfstRftSQPJgMREchqHM56EvAUXRc266cZ1NYVW5',
          unformattedReceiverAddress: '74GNQjmkcfstRftSQPJgMREchqHM56EvAUXRc266cZ1NYVW5',
          showBalance: true,
          formatFound: 'chain2',
          transactionReadyToExecute: false,
          shouldEvaluatePayloadEstimatedFee: false
        });
      });

      it('should return the according transaction state for a generic address.', () => {
        payload.unformattedReceiverAddress = '5H3ZryLmpNwrochemdVFTq9WMJW39NCo5HWFEwRtjbVtrThD';
        const action = TransactionActionCreators.setReceiver(payload);
        const result = transactionReducer(state, action);
        expect(result).toEqual({
          ...state,
          genericReceiverAccount: '5H3ZryLmpNwrochemdVFTq9WMJW39NCo5HWFEwRtjbVtrThD',
          unformattedReceiverAddress: '5H3ZryLmpNwrochemdVFTq9WMJW39NCo5HWFEwRtjbVtrThD',
          formatFound: 'GENERIC',
          transactionReadyToExecute: false,
          shouldEvaluatePayloadEstimatedFee: false,
          estimatedSourceFee: null,
          estimatedFeeMessageDelivery: null,
          estimatedFeeBridgeCall: null,
          estimatedTargetFee: null
        });
      });

      it('should return the according transaction state for an invalid address.', () => {
        payload.unformattedReceiverAddress = 'invalid';
        const action = TransactionActionCreators.setReceiver(payload);
        const result = transactionReducer(state, action);
        expect(result).toEqual({
          ...state,
          unformattedReceiverAddress: 'invalid',
          addressValidationError: 'Invalid address',
          formatFound: 'INCORRECT_FORMAT',
          transactionReadyToExecute: false,
          shouldEvaluatePayloadEstimatedFee: false
        });
      });

      it('should return the according transaction state for unsupported prefix provided.', () => {
        payload.unformattedReceiverAddress = 'tH95Ew4kVD9VcwsyXaSdC74Noe3H8o6fJfnKhZezXHKHEcs';
        const action = TransactionActionCreators.setReceiver(payload);
        const result = transactionReducer(state, action);
        expect(result).toEqual({
          ...state,
          unformattedReceiverAddress: 'tH95Ew4kVD9VcwsyXaSdC74Noe3H8o6fJfnKhZezXHKHEcs',
          addressValidationError: 'Unsupported address SS58 prefix: 8',
          formatFound: '8',
          transactionReadyToExecute: false,
          shouldEvaluatePayloadEstimatedFee: false
        });
      });
    });
    describe('Local', () => {
      it('should return the according transaction state for native address.', () => {
        payload.unformattedReceiverAddress = '5smXQvbC88CDjy8SCpmPjEk4EDMoUTyvCvq2w3HhWj4pYQqz';
        payload.isBridged = false;
        const action = TransactionActionCreators.setReceiver(payload);
        const result = transactionReducer(state, action);
        expect(result).toEqual({
          ...state,
          unformattedReceiverAddress: payload.unformattedReceiverAddress,
          receiverAddress: payload.unformattedReceiverAddress,
          genericReceiverAccount: null,
          addressValidationError: null,
          showBalance: true,
          formatFound: payload.sourceChainDetails.chain
        });
      });

      it('should return the according transaction state for generic address.', () => {
        payload.unformattedReceiverAddress = '5H3ZryLmpNwrochemdVFTq9WMJW39NCo5HWFEwRtjbVtrThD';
        payload.isBridged = false;
        const action = TransactionActionCreators.setReceiver(payload);
        const result = transactionReducer(state, action);
        expect(result).toEqual({
          ...state,
          unformattedReceiverAddress: payload.unformattedReceiverAddress,
          receiverAddress: '5smXQvbC88CDjy8SCpmPjEk4EDMoUTyvCvq2w3HhWj4pYQqz',
          genericReceiverAccount: null,
          addressValidationError: null,
          showBalance: true,
          formatFound: GENERIC
        });
      });

      it('should return invalid account.', () => {
        payload.unformattedReceiverAddress = '74GNQjmkcfstRftSQPJgMREchqHM56EvAUXRc266cZ1NYVW5';
        payload.isBridged = false;
        const action = TransactionActionCreators.setReceiver(payload);
        const result = transactionReducer(state, action);
        expect(result).toEqual({
          ...state,
          unformattedReceiverAddress: payload.unformattedReceiverAddress,
          addressValidationError: 'Invalid Address',
          receiverAddress: null,
          genericReceiverAccount: null,
          showBalance: false,
          formatFound: null
        });
      });
    });
  });

  describe('SET_PAYLOAD_ESTIMATED_FEE', () => {
    type PayloadEstimatedFee = {
      payload: TransactionPayload | null;
      estimatedSourceFee: string | null;
      estimatedFeeMessageDelivery: string | null;
      estimatedFeeBridgeCall: string | null;
      estimatedTargetFee: string | null;
    };

    let payloadEstimatedFeeError: string | null;
    let payloadEstimatedFee: PayloadEstimatedFee;
    let payloadEstimatedFeeLoading: boolean;

    beforeEach(() => {
      payloadEstimatedFeeError = null;
      payloadEstimatedFee = {
        estimatedSourceFee: null,
        estimatedFeeMessageDelivery: null,
        estimatedFeeBridgeCall: null,
        estimatedTargetFee: null,
        payload: null
      };
      payloadEstimatedFeeLoading = false;
      (getTransactionDisplayPayload as jest.Mock).mockReturnValue({
        payloadHex: null,
        transactionDisplayPayload: null
      });
    });

    it('should return initial state regarding estimated fee', () => {
      const action = TransactionActionCreators.setPayloadEstimatedFee({
        payloadEstimatedFeeError,
        payloadEstimatedFee,
        payloadEstimatedFeeLoading,
        sourceTargetDetails: {} as SourceTargetState,
        //@ts-ignore
        createType: () => 'type',
        isBridged: true,
        senderAccountBalance: null,
        senderCompanionAccountBalance: null,
        chainDecimals: 9
      });
      const result = transactionReducer(state, action);

      expect(result).toEqual({
        ...state,
        estimatedSourceFee: null,
        estimatedFeeMessageDelivery: null,
        estimatedFeeBridgeCall: null,
        estimatedTargetFee: null,
        payloadEstimatedFeeError: null,
        payloadEstimatedFeeLoading: false,
        payload: null,
        transactionReadyToExecute: false
      });
    });
    it('should return loading estimated fee', () => {
      const payloadEstimatedFeeLoading = true;
      const action = TransactionActionCreators.setPayloadEstimatedFee({
        payloadEstimatedFeeError,
        payloadEstimatedFee,
        payloadEstimatedFeeLoading,
        sourceTargetDetails: {} as SourceTargetState,
        //@ts-ignore
        createType: () => 'type',
        isBridged: true,
        senderAccountBalance: null,
        senderCompanionAccountBalance: null,
        chainDecimals: 9
      });
      const result = transactionReducer(state, action);

      expect(result).toEqual({
        ...state,
        estimatedSourceFee: null,
        estimatedFeeMessageDelivery: null,
        estimatedFeeBridgeCall: null,
        estimatedTargetFee: null,
        payloadEstimatedFeeError: null,
        payloadEstimatedFeeLoading: true,
        payload: null,
        transactionReadyToExecute: false,
        payloadHex: null,
        transactionDisplayPayload: null
      });
    });

    it('should return corresponding error state for estimated fee', () => {
      payloadEstimatedFeeError = 'Error';
      const action = TransactionActionCreators.setPayloadEstimatedFee({
        payloadEstimatedFeeError,
        payloadEstimatedFee,
        payloadEstimatedFeeLoading,
        sourceTargetDetails: {} as SourceTargetState,
        //@ts-ignore
        createType: () => 'type',
        isBridged: true,
        senderAccountBalance: null,
        senderCompanionAccountBalance: null,
        chainDecimals: 9
      });
      const result = transactionReducer(state, action);

      expect(result).toEqual({
        ...state,
        estimatedSourceFee: null,
        estimatedFeeMessageDelivery: null,
        estimatedFeeBridgeCall: null,
        estimatedTargetFee: null,
        payloadEstimatedFeeError,
        payloadEstimatedFeeLoading: false,
        payload: null,
        transactionReadyToExecute: false,
        payloadHex: null,
        transactionDisplayPayload: null
      });
    });

    it('should return corresponding error state for estimated fee', () => {
      payloadEstimatedFeeError = 'Error';
      const action = TransactionActionCreators.setPayloadEstimatedFee({
        payloadEstimatedFeeError,
        payloadEstimatedFee,
        payloadEstimatedFeeLoading,
        sourceTargetDetails: {} as SourceTargetState,
        //@ts-ignore
        createType: () => 'type',
        isBridged: true,
        senderAccountBalance: null,
        senderCompanionAccountBalance: null,
        chainDecimals: 9
      });
      const result = transactionReducer(state, action);

      expect(result).toEqual({
        ...state,
        estimatedSourceFee: null,
        estimatedFeeMessageDelivery: null,
        estimatedFeeBridgeCall: null,
        estimatedTargetFee: null,
        payloadEstimatedFeeError,
        payloadEstimatedFeeLoading: false,
        payload: null,
        transactionReadyToExecute: false,
        payloadHex: null,
        transactionDisplayPayload: null
      });
    });

    it('should return corresponding estimated fee, payload and all the necessary conditions to execute the transaction', () => {
      const payloadHex = 'payloadHexMode';

      const createType = jest.fn();
      const payload = {
        call: compactAddLength(new Uint8Array([0, 0, 0, 0])),
        origin: {
          SourceAccount: new Uint8Array([0, 0, 0, 0])
        },
        spec_version: 1,
        weight: 1234
      };
      const transactionDisplayPayload = { payload };
      (getTransactionDisplayPayload as jest.Mock).mockReturnValue({
        payloadHex,
        transactionDisplayPayload
      });
      const estimatedSourceFee = '1234';
      const estimatedFeeMessageDelivery = '1234';
      const estimatedFeeBridgeCall = '1234';
      const estimatedTargetFee = '1234';
      payloadEstimatedFee = {
        estimatedSourceFee,
        estimatedFeeMessageDelivery,
        estimatedFeeBridgeCall,
        estimatedTargetFee,
        payload
      };
      const sourceTargetDetails = {} as SourceTargetState;
      const action = TransactionActionCreators.setPayloadEstimatedFee({
        payloadEstimatedFeeError,
        payloadEstimatedFee,
        payloadEstimatedFeeLoading,
        sourceTargetDetails,
        //@ts-ignore
        createType: () => 'type',
        isBridged: true,
        senderAccountBalance: null,
        senderCompanionAccountBalance: null,
        chainDecimals: 9
      });

      const newState = { ...state };
      newState.action = TransactionTypes.TRANSFER;
      newState.transferAmount = new BN(1);
      newState.receiverAddress = '74GNQjmkcfstRftSQPJgMREchqHM56EvAUXRc266cZ1NYVW5';
      newState.senderAccount = '5rERgaT1Z8nM3et2epA5i1VtEBfp5wkhwHtVE8HK7BRbjAH2';
      const result = transactionReducer(newState, action);

      expect(result).toEqual({
        ...newState,
        estimatedSourceFee,
        estimatedFeeMessageDelivery,
        estimatedFeeBridgeCall,
        estimatedTargetFee,
        payloadEstimatedFeeError: null,
        payloadEstimatedFeeLoading: false,
        payload,
        transactionReadyToExecute: true,
        payloadHex,
        transactionDisplayPayload
      });
    });
  });
});
