// Copyright 2019-2020 @paritytech/bridge-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from '@polkadot/api';
import { Hash } from '@polkadot/types/interfaces';
import { Codec } from '@polkadot/types/types';
import BN from 'bn.js';
import { useEffect, useState } from 'react';

interface HeaderId {
  number: BN;
  hash: Hash;
}

type CodecHeaderId = Codec & HeaderId;
// type CodecBestBloc = Codec & [HeaderId, any]

interface Props {
  chain: string;
  api: ApiPromise;
  isApiReady: boolean;
}

const useBridgedBlocks = ({ isApiReady, api, chain }: Props) => {
  const [importedHeaders, setImportedHeaders] = useState('');

  const bridgedChain = `bridge${chain}`;

  useEffect(() => {
    if (!api || !isApiReady || !chain) {
      return;
    }

    api.query[bridgedChain].bestFinalized((res: CodecHeaderId) => {
      const bestBridgedFinalizedBlock = res.toString();
      api.query[bridgedChain].importedHeaders(bestBridgedFinalizedBlock, (res: any) => {
        if (res.toJSON()) {
          setImportedHeaders(res.toJSON().header.number);
        }
      });
    });

    return function cleanup() {
      setImportedHeaders('');
    };
  }, [isApiReady, chain, api, bridgedChain]);

  return { importedHeaders };
};

export default useBridgedBlocks;
