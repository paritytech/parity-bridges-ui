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

describe('transactionReducer', () => {
  describe('SET_RECEIVER', () => {
    const payload = {
      unformattedReceiverAddress: '',
      sourceChainDetails,
      targetChainDetails
    };

    it('should return the according transaction state for a companion address and its corresponding derived account.', () => {
      payload.unformattedReceiverAddress = '5rERgaT1Z8nM3et2epA5i1VtEBfp5wkhwHtVE8HK7BRbjAH2';
      const action = TransactionActionCreators.setReceiver(payload);
      const result = transactionReducer(state, action);
      expect(result).toEqual({
        ...state,
        derivedReceiverAccount: '5rERgaT1Z8nM3et2epA5i1VtEBfp5wkhwHtVE8HK7BRbjAH2',
        receiverAddress: '5rERgaT1Z8nM3et2epA5i1VtEBfp5wkhwHtVE8HK7BRbjAH2',
        unformattedReceiverAddress: '5rERgaT1Z8nM3et2epA5i1VtEBfp5wkhwHtVE8HK7BRbjAH2',
        showBalance: true,
        formatFound: 'chain1'
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
        formatFound: 'chain2'
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
        formatFound: 'GENERIC'
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
        formatFound: 'INCORRECT_FORMAT'
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
        formatFound: 8
      });
    });
  });
});
