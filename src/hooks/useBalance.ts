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
import { Balance } from '@polkadot/types/interfaces';
import { formatBalance } from '@polkadot/util';
import BN from 'bn.js';
import { useEffect, useState } from 'react';

import { useSourceTarget } from '../contexts/SourceTargetContextProvider';

type State = [string, Balance, boolean, string];

const ZERO = new BN(0);

const useBalance = (address: string, providedSi: boolean = false): State[] => {
  const [sourceState, setSourceState] = useState<State>(['0', new BN(ZERO) as Balance, true, '-']);
  const [targetState, setTargetState] = useState<State>(['0', new BN(ZERO) as Balance, true, '-']);

  const {
    sourceChainDetails: {
      sourceApiConnection: { api: sourceApi }
    },
    targetChainDetails: {
      targetApiConnection: { api: targetApi }
    }
  } = useSourceTarget();

  useEffect((): (() => void) => {
    let unsubscribeSource: null | (() => void) = null;
    let unsubscribeTarget: null | (() => void) = null;
    if (address) {
      sourceApi.query.system
        .account(address, ({ data }): void => {
          setSourceState([
            formatBalance(data.free, {
              decimals: sourceApi.registry.chainDecimals[0],
              forceUnit: '-',
              withSi: providedSi
            }),
            data.free,
            data.free.isZero(),
            data.free.registry.chainTokens[0]
          ]);
        })
        .then((u): void => {
          unsubscribeSource = u;
        })
        .catch(console.error);

      targetApi.query.system
        .account(address, ({ data }): void => {
          setTargetState([
            formatBalance(data.free, {
              decimals: sourceApi.registry.chainDecimals[0],
              forceUnit: '-',
              withSi: providedSi
            }),
            data.free,
            data.free.isZero(),
            data.free.registry.chainTokens[0]
          ]);
        })
        .then((u): void => {
          unsubscribeTarget = u;
        })
        .catch(console.error);
    }
    return (): void => {
      unsubscribeSource && unsubscribeSource();
      unsubscribeTarget && unsubscribeTarget();
    };
  }, [address, sourceApi, targetApi, providedSi]);

  return [sourceState, targetState];
};

export default useBalance;
