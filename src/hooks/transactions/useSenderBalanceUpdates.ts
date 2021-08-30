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

import { Dispatch, useEffect } from 'react';
import isEqual from 'lodash/isEqual';
import { TransactionActionCreators } from '../../actions/transactionActions';

import { TransactionsActionType } from '../../types/transactionTypes';
import usePrevious from '../react/usePrevious';
import { BalanceState } from '../../types/accountTypes';

const useSenderBalanceUpdates = (
  senderAccountBalance: BalanceState | null,
  senderCompanionAccountBalance: BalanceState | null,
  dispatchTransaction: Dispatch<TransactionsActionType>
) => {
  const prevSenderAccountBalance = usePrevious(senderAccountBalance);
  const prevSenderCompanionAccountBalance = usePrevious(senderCompanionAccountBalance);

  useEffect((): void => {
    if (
      (senderAccountBalance &&
        senderCompanionAccountBalance &&
        !isEqual(prevSenderAccountBalance, senderAccountBalance)) ||
      !isEqual(prevSenderCompanionAccountBalance, senderCompanionAccountBalance)
    )
      dispatchTransaction(
        TransactionActionCreators.updateSenderBalances({
          senderAccountBalance,
          senderCompanionAccountBalance
        })
      );
  }, [
    dispatchTransaction,
    prevSenderAccountBalance,
    prevSenderCompanionAccountBalance,
    senderAccountBalance,
    senderCompanionAccountBalance
  ]);
};

export default useSenderBalanceUpdates;
