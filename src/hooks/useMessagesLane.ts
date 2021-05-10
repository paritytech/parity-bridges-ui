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
import BN from 'bn.js';
import { useEffect } from 'react';

import { useMountedState } from '../hooks/useMountedState';
import { MessageActionsCreators } from '../actions/messageActions';
import { useUpdateMessageContext } from '../contexts/MessageContext';
import logger from '../util/logger';

import useLaneId from '../hooks/useLaneId';
import getSubstrateDynamicNames from '../util/getSubstrateDynamicNames';
interface Props {
  chain: string;
  api: ApiPromise;
  isApiReady: boolean;
}

interface Output {
  inboundLanes: {
    bridgeReceivedMessages: string;
  };
  outboundLanes: {
    pendingMessages: string;
    totalMessages: string;
    latestReceivedNonce: string;
  };
}

const useMessageLane = ({ isApiReady, api, chain }: Props): Output => {
  const { dispatchMessage } = useUpdateMessageContext();
  const [outboundLanes, setOutboudLanes] = useMountedState({
    latestReceivedNonce: '0',
    pendingMessages: '0',
    totalMessages: '0'
  });
  const [inboundLanes, setInboudLanes] = useMountedState({ bridgeReceivedMessages: '0' });

  const laneId = useLaneId();
  const { bridgedMessages, latestReceivedNonceMethodName } = getSubstrateDynamicNames(chain);

  useEffect((): (() => void) => {
    const getLane = async (setter: any, isOutbound?: boolean) => {
      try {
        if (isOutbound) {
          const u = await api.query[bridgedMessages].outboundLanes(laneId, (res: any) => {
            const latest_generated_nonce = res.get('latest_generated_nonce').toString();
            const latest_received_nonce = res.get('latest_received_nonce').toString();
            const pendingMessages = new BN(latest_generated_nonce).sub(new BN(latest_received_nonce));

            setter({
              latestReceivedNonce: latest_received_nonce.toString(),
              pendingMessages: pendingMessages.isNeg() ? '0' : pendingMessages.toString(),
              totalMessages: latest_generated_nonce
            });
          });
          return Promise.resolve(u);
        }
        const u = await api.query[bridgedMessages].inboundLanes(laneId, (res: any) => {
          setter({ bridgeReceivedMessages: res.get('last_confirmed_nonce').toString() });
        });
        return Promise.resolve(u);
      } catch (e) {
        dispatchMessage(MessageActionsCreators.triggerErrorMessage({ message: e.message }));
        logger.error(e.message);
        return Promise.reject();
      }
    };

    const shouldGetLane: boolean = !!(api && isApiReady && api.query[bridgedMessages] && chain);
    const unsubscribeOutboundLanes: Promise<VoidFn> | null = shouldGetLane ? getLane(setOutboudLanes, true) : null;
    const unsubscribeInboundLanes: Promise<VoidFn> | null = shouldGetLane ? getLane(setInboudLanes) : null;

    return async (): Promise<void> => {
      unsubscribeOutboundLanes && (await unsubscribeOutboundLanes)();
      unsubscribeInboundLanes && (await unsubscribeInboundLanes)();
    };
  }, [
    api,
    isApiReady,
    chain,
    bridgedMessages,
    laneId,
    latestReceivedNonceMethodName,
    setOutboudLanes,
    setInboudLanes,
    dispatchMessage
  ]);

  return { inboundLanes, outboundLanes };
};

export default useMessageLane;
