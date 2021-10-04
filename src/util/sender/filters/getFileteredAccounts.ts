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

import { DisplayAccounts } from '../../../types/accountTypes';

interface Parameters {
  displaySenderAccounts: DisplayAccounts;
  chain: string;
  filters: string[];
  chainMatch: string | undefined;
}

export default function getFilteredAccounts({ displaySenderAccounts, chain, filters, chainMatch }: Parameters) {
  const items = displaySenderAccounts[chain];
  const upperChain = chain.toLocaleUpperCase();

  const getItemsFiltered = () => {
    if (filters.length) {
      const match = (input: string, caseSensitive = true) => {
        let show = false;

        const field = caseSensitive ? input : input.toUpperCase();
        filters.forEach((f) => {
          if (field.includes(caseSensitive ? f : f.toUpperCase())) {
            show = true;
          }
        });
        return show;
      };

      return items.filter(({ account, companionAccount }) => {
        const matchAddress = match(account.address);
        const matchCompanionAddress = match(companionAccount.address);
        const matchName = match(account.name, false);

        if (matchName && filters.length === 1) {
          return true;
        }

        if (matchName && !matchAddress && !matchCompanionAddress && filters.length > 1) {
          return false;
        }

        return matchAddress || matchCompanionAddress || matchName;
      });
    }
    return [];
  };

  if (!chainMatch && !filters.length) {
    return items;
  }

  if (chainMatch && !upperChain.includes(chainMatch)) {
    return [];
  }

  const filteredItems = getItemsFiltered();

  if (chainMatch && upperChain.includes(chainMatch) && !filters.length) {
    return items;
  }

  if (filteredItems.length) {
    return filteredItems;
  }

  return [];
}
