
// Copyright 2019-2020 @paritytech/bridge-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// eslint-disable-next-line header/header
export default (address: string, eth: boolean = false) => {
	if (!address || address.length < 8) {
		return address;
	}

	return eth
		? `${address.substring(0, 8)}...${address.substring(address.length - 8)}`
		: `${address.substring(0, 6)}...${address.substring(address.length - 8)}`;
};