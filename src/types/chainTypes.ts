// Copyright 2019-2020 @paritytech/bridge-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { CHAIN_1, CHAIN_2 } from '../util/substrateProviders';

const chains = [CHAIN_1, CHAIN_2] as const;
export type Chains = typeof chains[number];
