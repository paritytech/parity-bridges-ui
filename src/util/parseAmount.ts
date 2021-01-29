// Copyright 2019-2020 @paritytech/bridge-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/// Parse the amount field and support SI shorthands for `kilo` (k) and `million` (m).
export default function parseAmount(val: string) {
	return val.replace(/,/gi, '.').replace(/k/gi, '000').replace(/m/gi, '000000');
}

