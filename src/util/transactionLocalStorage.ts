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

import { CHAIN_1, CHAIN_2 } from '../configs/substrateProviders';
import { TransanctionStatus } from '../types/transactionTypes';
import getSubstrateDynamicNames from './getSubstrateDynamicNames';
import logger from './logger';

const appendNewTransaction = (transaction: TransanctionStatus) => {
  const { storageKey } = getSubstrateDynamicNames(`${CHAIN_1}-${CHAIN_2}`);
  try {
    const rawTransactions = localStorage.getItem(storageKey);
    if (!rawTransactions || !rawTransactions.length) {
      const first = [transaction];
      return localStorage.setItem(storageKey, JSON.stringify(first));
    }
    const transactions = JSON.parse(rawTransactions);
    transactions.push(transaction);
    return localStorage.setItem(storageKey, JSON.stringify(transactions));
  } catch (e) {
    logger.error(e);
    throw new Error('Issue appending new transaction to local storage');
  }
};

export { appendNewTransaction };
