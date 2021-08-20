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

import { ApiPromise } from '@polkadot/api';
import { Configs } from '../types/sourceTargetTypes';
import { getSubstrateDynamicNames } from './getSubstrateDynamicNames';

export const getConfigs = async (apiPromise: ApiPromise): Promise<Configs> => {
  const properties = apiPromise.registry.getChainProperties();
  const { ss58Format } = properties!;
  const systemChain = await apiPromise.rpc.system.chain();
  const chainName = systemChain.split(' ')[0];
  const logoUrl = require(`../assets/chainsLogos/${chainName.toLowerCase()}.png`).default;

  return { chainName, ss58Format: parseInt(ss58Format.toString()), logoUrl };
};

export const getBridgeId = (sourceApi: ApiPromise, targetChain: string): Uint8Array => {
  const { bridgedMessages } = getSubstrateDynamicNames(targetChain);
  const bridgeId = sourceApi.consts[bridgedMessages].bridgedChainId.toU8a();

  if (!bridgeId) {
    throw new Error(`Missing bridgeId for ${targetChain} in ${bridgedMessages} pallet.`);
  }

  return bridgeId;
};
