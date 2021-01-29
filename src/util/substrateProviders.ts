// Copyright 2019-2020 @paritytech/bridge-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { WsProvider } from '@polkadot/api';

interface Providers  {
  [key: string]: string
}

export const RIALTO : string = 'Rialto';
export const MILLAU: string = 'Millau';

export const RIALTO_SUBSTRATE_PROVIDER = process.env.RIALTO_SUBSTRATE_PROVIDER || 'wss://wss.rialto.brucke.link';
export const MILLAU_SUBSTRATE_PROVIDER = process.env.MILLAU_SUBSTRATE_PROVIDER || 'wss://wss.millau.brucke.link';

export const providers: Providers = {
	MILLAU: MILLAU_SUBSTRATE_PROVIDER,
	RIALTO: RIALTO_SUBSTRATE_PROVIDER
};

export const getProvider = (chain: string) => new WsProvider(providers[chain]);