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

import { u8aConcat } from '@polkadot/util';
import { ApiOptions } from '@polkadot/api/types';
import { blake2AsU8a, keccakAsU8a } from '@polkadot/util-crypto';
import { checkEnvVariable } from '../../util/envVariablesValidations';
import { Pairs } from '../../types/sourceTargetTypes';
import customTypesMillau from './customTypesMillau.json';
import customTypesRialto from './customTypesRialto.json';

export interface HasherTypes {
  hasher?: (data: Uint8Array) => Uint8Array;
  types: ApiOptions['types'];
}

function hasherH512(data: any) {
  return u8aConcat(blake2AsU8a(data), keccakAsU8a(data));
}

export const getSubstratePairConfigs = (): HasherTypes[] => {
  const pair = checkEnvVariable('REACT_APP_PAIR');
  switch (pair) {
    case Pairs.RIALTO_MILLAU:
      return [
        {
          types: customTypesRialto
        },
        {
          hasher: hasherH512,
          types: customTypesMillau
        }
      ];

    default:
      throw new Error(`Unknown chain: ${pair}`);
  }
};
