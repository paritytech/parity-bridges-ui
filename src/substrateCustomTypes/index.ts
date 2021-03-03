// Copyright 2019-2020 @paritytech/bridge-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { ApiOptions } from '@polkadot/api/types';

import customTypesMillau from './customTypesMillau.json';
import customTypesRialto from './customTypesRialto.json';

interface Types {
  [key: string]: ApiOptions['types'];
}

const types: Types = {
  Millau: customTypesMillau,
  Rialto: customTypesRialto
};

export default types;
