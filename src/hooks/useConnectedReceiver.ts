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

import TransactionActions from '../actions/transactionActions';
import { useSourceTarget } from '../contexts/SourceTargetContextProvider';
import { useUpdateTransactionContext } from '../contexts/TransactionContext';
import getReceiverAddress from '../util/getReceiverAddress';

interface Props {
  setReceiverMessage: (message: string) => void;
  receiver: string;
}

export default function useConnectedReceiver(): Function {
  const { dispatchTransaction } = useUpdateTransactionContext();
  const { targetChain } = useSourceTarget();

  const setConnectedReceiver = ({ setReceiverMessage, receiver }: Props) => {
    setReceiverMessage('');
    try {
      const receiverAddress = getReceiverAddress({ chain: targetChain, receiverAddress: receiver });
      if (receiverAddress !== receiver) {
        setReceiverMessage(`The format for the account is incorrect, funds will be sent to ${receiverAddress}`);
      }
      dispatchTransaction({ payload: { receiverAddress }, type: TransactionActions.SET_RECEIVER_ADDRESS });
    } catch (e) {
      console.log('e', e);
      if (e.message === 'INCORRECT-FORMAT') {
        setReceiverMessage('Invalid address, please provide a valid address');
      }
    }
  };

  return setConnectedReceiver;
}
