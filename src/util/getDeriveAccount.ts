// Copyright 2019-2020 @paritytech/bridge-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { compactAddLength, stringToU8a } from '@polkadot/util';
import { blake2AsHex, decodeAddress, encodeAddress } from '@polkadot/util-crypto';

interface Data {
  SS58Format: number;
  accountDerivation: string;
  bridgeId: string;
  address: string;
}

export default function getDeriveAccount({ SS58Format = 42, accountDerivation, bridgeId, address }: Data): string {
  const input = [
    ...compactAddLength(stringToU8a(accountDerivation)),
    ...stringToU8a(bridgeId),
    ...decodeAddress(address)
  ];
  return encodeAddress(blake2AsHex(Uint8Array.from(input)), SS58Format);
}
