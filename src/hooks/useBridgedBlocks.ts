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
import { Hash } from '@polkadot/types/interfaces';
import { Codec } from '@polkadot/types/types';
import BN from 'bn.js';
import { useEffect } from 'react';
import { useMountedState } from '../hooks/useMountedState';
import { useIsMounted } from './useIsMounted';
import { getSubstrateDynamicNames } from '../util/getSubstrateDynamicNames';
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
  const isMounted = useIsMounted();
  const [bestBridgedFinalizedBlock, setBestBridgedFinalizedBlock] = useMountedState('');
  const [bestFinalizedBlock, setBestFinalizedBlock] = useMountedState('');
  const { bridgedGrandpaChain } = getSubstrateDynamicNames(chain);

  useEffect((): (() => void) | undefined => {
    let unsubBestFinalized: (() => void) | undefined;

    const shouldProceed: boolean = !!(api && isApiReady && chain && isMounted());
    if (shouldProceed) {
      api.query[bridgedGrandpaChain]
        .bestFinalized((res: CodecHeaderId) => {
          const bestFinalized = res.toString();
          setBestFinalizedBlock(bestFinalized);
        })
        .then((_unsub) => {
          unsubBestFinalized = _unsub;
        });
    }

    return () => {
      unsubBestFinalized && unsubBestFinalized();
    };
  }, [isApiReady, chain, api, bridgedGrandpaChain, isMounted, setBestFinalizedBlock]);

  useEffect((): (() => void) | undefined => {
    let unsubImportedHeaders: (() => void) | undefined;
    const shouldProceed: boolean = !!(api && isApiReady && chain && isMounted());
    if (shouldProceed) {
      api.query[bridgedGrandpaChain]
        .importedHeaders(bestFinalizedBlock, (res: any) => {
          if (res.toJSON()) {
            setBestBridgedFinalizedBlock(res.toJSON().number);
          }
        })
        .then((_unsub) => {
          unsubImportedHeaders = _unsub;
        });
    }

    return () => {
      unsubImportedHeaders && unsubImportedHeaders();
    };
  }, [isApiReady, chain, api, bridgedGrandpaChain, bestFinalizedBlock, isMounted, setBestBridgedFinalizedBlock]);

  return { bestBridgedFinalizedBlock, setBestFinalizedBlock };
};

export default useBridgedBlocks;
