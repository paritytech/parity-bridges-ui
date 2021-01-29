// Copyright 2019-2020 @paritytech/bridge-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { addresses } from '../constants';

// Parse the receiver of the funds on the substrate side.
//
// Supports a bunch of pre-defined addresses like alice|bob|joshy, etc.
export default function parseReceiver(recv: string): string {
	const v = recv.toLowerCase().replace(/[^a-z0-9]/, '') as keyof typeof addresses ;
	return addresses[v] || recv;
}
