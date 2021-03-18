// Copyright 2019-2020 Parity Technologies (UK) Ltd.
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

import { formatBalance } from '@polkadot/util';

// Convert a string into a nicely formatted ETH balance string.
export function toEthBalance(v: string) {
  return formatBalance(v.toString(), {
    decimals: 18,
    withSi: true,
    withSiFull: true,
    withUnit: false
  });
}

// Convert a number or string into a nicely formatted substrate balance string.
export function toSubBalance(v: number | string) {
  return formatBalance(v, {
    decimals: 9,
    withSi: true,
    withSiFull: false,
    withUnit: false
  });
}
