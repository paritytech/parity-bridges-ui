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
import { Balance } from '@polkadot/types/interfaces';
import { formatBalance } from '@polkadot/util';
import BN from 'bn.js';
import { useEffect, useState } from 'react';

import { MessageActionsCreators } from '../actions/messageActions';
import { getChainConfigs } from '../configs/substrateProviders';
import { useUpdateMessageContext } from '../contexts/MessageContext';
import { useSourceTarget } from '../contexts/SourceTargetContextProvider';
import getDeriveAccount from '../util/getDeriveAccount';
import logger from '../util/logger';

type State = {
  chainTokens: string;
  formattedBalance: string;
  free: Balance;
};

const ZERO = new BN(0);

const initValues = {
  chainTokens: '-',
  formattedBalance: '0',
  free: new BN(ZERO) as Balance
};

const useBalance = (name: string, address: string, chain: string | undefined, providedSi: boolean = false): State[] => {
  const { dispatchMessage } = useUpdateMessageContext();
  const [sourceState, setSourceState] = useState<State>(initValues);
  const [targetState, setTargetState] = useState<State>(initValues);
  const {
    sourceChainDetails: {
      sourceApiConnection: { api: sourceApi },
      sourceChain
    },
    targetChainDetails: {
      targetApiConnection: { api: targetApi },
      targetChain
    }
  } = useSourceTarget();

  useEffect((): (() => void) => {
    let unsubscribeSource: Promise<VoidFn>;
    let unsubscribeTarget: Promise<VoidFn>;

    const chainsConfigs = getChainConfigs();
    const { SS58Format } = chainsConfigs[chain === sourceChain ? targetChain : sourceChain];
    const { bridgeId } = chainsConfigs[chain === sourceChain ? sourceChain : targetChain];
    const derivedAddress = getDeriveAccount({
      SS58Format,
      address: address,
      bridgeId
    });

    const getBalance = async (api: ApiPromise, address: string, setState: any): Promise<VoidFn> => {
      try {
        const u = await api.query.system.account(address, ({ data }): void => {
          setState({
            chainTokens: data.free.registry.chainTokens[0],
            formattedBalance: formatBalance(data.free, {
              decimals: api.registry.chainDecimals[0],
              forceUnit: '-',
              withSi: providedSi
            }),
            free: data.free
          });
        });
        return Promise.resolve(u);
      } catch (e) {
        dispatchMessage(MessageActionsCreators.triggerErrorMessage({ message: e.message }));
        logger.error(e.message);
        return Promise.reject();
      }
    };

    if (address) {
      unsubscribeSource = getBalance(sourceApi, address, setSourceState);
      unsubscribeTarget = getBalance(targetApi, derivedAddress, setTargetState);
    }
    return async (): Promise<void> => {
      unsubscribeSource && (await unsubscribeSource)();
      unsubscribeTarget && (await unsubscribeTarget)();
    };
  }, [name, address, chain, sourceChain, targetChain, sourceApi, targetApi, providedSi, dispatchMessage]);

  return [sourceState, targetState];
};

export default useBalance;
