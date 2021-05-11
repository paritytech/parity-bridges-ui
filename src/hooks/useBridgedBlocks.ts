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
import { VoidFn } from '@polkadot/api/types';
import { Hash } from '@polkadot/types/interfaces';
import { Codec } from '@polkadot/types/types';
import BN from 'bn.js';
import { useEffect, useState } from 'react';

import getSubstrateDynamicNames from '../util/getSubstrateDynamicNames';
interface HeaderId {
  number: BN;
  hash: Hash;
}

type CodecHeaderId = Codec & HeaderId;

interface Props {
  chain: string;
  api: ApiPromise;
  isApiReady: boolean;
}

const useBridgedBlocks = ({ isApiReady, api, chain }: Props) => {
  const [bestBridgedFinalizedBlock, setBestBridgedFinalizedBlock] = useState('');

  const { bridgedGrandpaChain } = getSubstrateDynamicNames(chain);
  useEffect((): (() => void) => {
    const shouldProceed: boolean = !!(api && isApiReady && chain);

    let unsubImportedHeaders: Promise<VoidFn> | null;
    const unsubBestFinalized: Promise<VoidFn> | null = shouldProceed
      ? api.query[bridgedGrandpaChain].bestFinalized((res: CodecHeaderId) => {
          const bestBridgedFinalizedBlock = res.toString();
          unsubImportedHeaders = shouldProceed
            ? api.query[bridgedGrandpaChain].importedHeaders(bestBridgedFinalizedBlock, (res: any) => {
                if (res.toJSON()) {
                  setBestBridgedFinalizedBlock(res.toJSON().number);
                }
              })
            : null;
        })
      : null;

    return async (): Promise<void> => {
      unsubBestFinalized && (await unsubBestFinalized)();
      unsubImportedHeaders && (await unsubImportedHeaders)();
    };
  }, [isApiReady, chain, api, bridgedGrandpaChain]);

  return { bestBridgedFinalizedBlock };
};

export default useBridgedBlocks;
