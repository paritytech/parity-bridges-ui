// Copyright 2019-2020 @paritytech/bridge-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

const { stringToU8a } = require('@polkadot/util');
const { blake2AsHex, encodeAddress } = require('@polkadot/util-crypto');

function deriveAccount(data) {
  const SS58Prefix = 42;
  console.log('----------');
  console.log('derviedAccount', blake2AsHex(data));
  console.log('encodeAddress', encodeAddress(blake2AsHex(data), SS58Prefix));
}

console.log('rlto', stringToU8a('rlto'));
console.log('pallet-bridge/account-derivation/account', stringToU8a('pallet-bridge/account-derivation/account'));

deriveAccount(
  stringToU8a('pallet-bridge/account-derivation/account') +
    stringToU8a('rlto') +
    '5sauUXUfPjmwxSgmb3tZ5d6yx24eZX4wWJ2JtVUBaQqFbvEU'
);

console.log('expected: 5G6Vkt2VhS8occc66oUFZCSy56i45nuYmYZ4XiWgHAJbUiPW');

// pallet-bridge/account-derivation/accountrlto5sauUXUfPjmwxSgmb3tZ5d6yx24eZX4wWJ2JtVUBaQqFbvEU

/**
5G6Vkt2VhS8occc66oUFZCSy56i45nuYmYZ4XiWgHAJbUiPW
5GkS5dho2eismu9xwdad4mYboaWSP5kh8UdCELTJi7NPVTta
 */
