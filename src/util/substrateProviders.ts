// Copyright 2019-2020 @paritytech/bridge-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { WsProvider } from '@polkadot/api';
import { ApiOptions } from '@polkadot/api/types';

import customTypesMillau from '../customTypesMillau';
import customTypesRialto from '../customTypesRialto';
interface Providers {
	[key: string]: string
}

interface CustomTypes {
	[key: string]: ApiOptions['types'];
}

export const RIALTO = 'Rialto';
export const MILLAU = 'Millau';

export const RIALTO_SUBSTRATE_PROVIDER = process.env.REACT_APP_RIALTO_SUBSTRATE_PROVIDER || 'wss://wss.rialto.brucke.link';
export const MILLAU_SUBSTRATE_PROVIDER = process.env.REACT_APP_MILLAU_SUBSTRATE_PROVIDER || 'wss://wss.millau.brucke.link';

export const providers: Providers = {
	[MILLAU]: MILLAU_SUBSTRATE_PROVIDER,
	[RIALTO]: RIALTO_SUBSTRATE_PROVIDER
};

export const customTypes: CustomTypes = {
	[MILLAU]: customTypesMillau,
	[RIALTO]: customTypesRialto
};

export const getProvider = (chain: string) => new WsProvider(providers[chain]);

