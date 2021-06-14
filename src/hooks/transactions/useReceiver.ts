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

import React, { useCallback, useEffect, useState } from 'react';
import { TransactionActionCreators } from '../../actions/transactionActions';
import { INCORRECT_FORMAT, GENERIC } from '../../constants';
import { useSourceTarget } from '../../contexts/SourceTargetContextProvider';
import { useUpdateTransactionContext, useTransactionContext } from '../../contexts/TransactionContext';
import useChainGetters from '../chain/useChainGetters';
import getReceiverAddress from '../../util/getReceiverAddress';
import usePrevious from '../../hooks/react/usePrevious';
import logger from '../../util/logger';

export default function useReceiver() {
  const { dispatchTransaction } = useUpdateTransactionContext();
  const [formatFound, setFormatFound] = useState('');
  const [showBalance, setShowBalance] = useState(false);
  const { unformattedReceiverAddress } = useTransactionContext();
  const { targetChainDetails, sourceChainDetails } = useSourceTarget();

  const { chain: targetChain } = targetChainDetails;
  const prevTargetChain = usePrevious(targetChain);
  const { chain: sourceChain } = sourceChainDetails;

  const { getChainBySS58Prefix } = useChainGetters();

  const setReceiver = useCallback(
    (address: string | null) => dispatchTransaction(TransactionActionCreators.setReceiverAddress(address)),
    [dispatchTransaction]
  );

  const setUnformattedReceiver = useCallback(
    (address: string | null) => dispatchTransaction(TransactionActionCreators.setUnformattedReceiverAddress(address)),
    [dispatchTransaction]
  );

  const validateAccount = useCallback(
    (receiver: string) => {
      try {
        const { address, formatFound } = getReceiverAddress({
          getChainBySS58Prefix,
          targetChainDetails,
          sourceChainDetails,
          receiverAddress: receiver
        });

        return { formatFound, formattedAccount: address };
      } catch (e) {
        logger.error(e.message);
        if (e.message === INCORRECT_FORMAT) {
          return { formatFound: e.message, formattedAccount: receiver };
        }
      }
    },
    [getChainBySS58Prefix, sourceChainDetails, targetChainDetails]
  );

  const reset = useCallback(() => {
    dispatchTransaction(TransactionActionCreators.setGenericAccount(null));
    dispatchTransaction(TransactionActionCreators.setDerivedAccount(null));
    dispatchTransaction(TransactionActionCreators.setReceiverAddress(null));
    dispatchTransaction(TransactionActionCreators.setEstimateFee(''));
    setShowBalance(false);
    dispatchTransaction(TransactionActionCreators.setValidationError(''));
  }, [dispatchTransaction]);

  const onReceiverChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const receiver = event.target.value;
      reset();
      setUnformattedReceiver(receiver);
      if (!receiver) {
        return;
      }

      const { formattedAccount, formatFound } = validateAccount(receiver)!;
      setFormatFound(formatFound);
      if (formatFound === INCORRECT_FORMAT) {
        dispatchTransaction(TransactionActionCreators.setValidationError('Invalid address'));
        return;
      }

      if (formatFound === GENERIC) {
        dispatchTransaction(TransactionActionCreators.setGenericAccount(receiver));
        return;
      }

      if (formatFound === targetChain) {
        setReceiver(formattedAccount);
        setShowBalance(true);
        return;
      }

      if (formatFound === sourceChain) {
        dispatchTransaction(TransactionActionCreators.setDerivedAccount(formattedAccount));
        setReceiver(receiver);
        return;
      }

      dispatchTransaction(
        TransactionActionCreators.setValidationError(`Unsupported address SS58 prefix: ${formatFound}`)
      );
    },
    [dispatchTransaction, reset, setReceiver, setUnformattedReceiver, sourceChain, targetChain, validateAccount]
  );

  useEffect(() => {
    if (prevTargetChain !== targetChain) {
      reset();
      setUnformattedReceiver(null);
    }
    if (!unformattedReceiverAddress) {
      setShowBalance(false);
    }
  }, [unformattedReceiverAddress, setUnformattedReceiver, prevTargetChain, reset, targetChain]);

  return { formatFound, showBalance, onReceiverChange, setReceiver };
}
