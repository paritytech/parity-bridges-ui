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

import { TransactionActionCreators } from '../actions/transactionActions';
import { INCORRECT_FORMAT } from '../constants';
import { useSourceTarget } from '../contexts/SourceTargetContextProvider';
import { useUpdateTransactionContext } from '../contexts/TransactionContext';
import getReceiverAddress from '../util/getReceiverAddress';
import logger from '../util/logger';

export default function useReceiver() {
  const { dispatchTransaction } = useUpdateTransactionContext();

  const {
    targetChainDetails: { targetChain },
    sourceChainDetails: { sourceChain }
  } = useSourceTarget();

  const setReceiver = (address: string | null) =>
    dispatchTransaction(TransactionActionCreators.setReceiverAddress(address));

  const setUnformattedReceiver = (address: string | null) =>
    dispatchTransaction(TransactionActionCreators.setUnformattedReceiverAddress(address));

  const validateAccount = (receiver: string) => {
    try {
      const { address, formatFound } = getReceiverAddress({
        targetChain,
        sourceChain,
        receiverAddress: receiver
      });

      return { formatFound, formattedAccount: address };
    } catch (e) {
      logger.error(e.message);
      if (e.message === INCORRECT_FORMAT) {
        return { formatFound: e.message, formattedAccount: receiver };
      }
    }
  };

  return { setReceiver, setUnformattedReceiver, validateAccount };
}
