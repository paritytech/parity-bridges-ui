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

export default function getChainMatches(
  displaySenderAccounts: DisplayAccounts,
  filterInput: string | null
): [string[], string[], string | undefined] {
  const chains = Object.keys(displaySenderAccounts);
  const splitFilter = filterInput ? filterInput.split(' ').filter((n) => n !== '') : [];

  let chainMatch: string | undefined;
  let fullChainNameMatched = '';
  if (splitFilter.length) {
    splitFilter.forEach((f) =>
      chains.forEach((c) => {
        const upperC = c.toUpperCase();
        if (upperC.includes(f.toUpperCase())) {
          chainMatch = f.toUpperCase();
          if (upperC === f.toUpperCase()) {
            fullChainNameMatched = upperC;
          }
        }
      })
    );
  }

  if (chainMatch) {
    if (fullChainNameMatched) {
      const filters = splitFilter.filter((sf) => sf.toUpperCase() !== fullChainNameMatched);
      return [chains, filters, fullChainNameMatched];
    }
    const filters = splitFilter.filter((sf) => sf.toUpperCase() !== chainMatch);
    return [chains, filters, chainMatch];
  }

  return [chains, splitFilter, undefined];
}
