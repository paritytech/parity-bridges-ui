// Copyright 2019-2020 @paritytech/bridge-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
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
