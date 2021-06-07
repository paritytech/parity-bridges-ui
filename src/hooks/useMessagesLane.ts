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

import BN from 'bn.js';
import { useCallback } from 'react';
import { SubscriptionInput } from '../types/subscriptionsTypes';
import { useMountedState } from '../hooks/useMountedState';
import { useApiSubscription } from './useApiSubscription';
import useLaneId from '../hooks/useLaneId';
import getSubstrateDynamicNames from '../util/getSubstrateDynamicNames';

interface Output {
  bridgeReceivedMessages: string;
  outboundLanes: {
    pendingMessages: string;
    totalMessages: string;
    latestReceivedNonce: string;
  };
}

const useMessagesLane = ({ isApiReady, api, chain }: SubscriptionInput): Output => {
  const [outboundLanes, setOutboudLanes] = useMountedState({
    latestReceivedNonce: '0',
    pendingMessages: '0',
    totalMessages: '0'
  });
  const [bridgeReceivedMessages, setBridgesReceivedMessages] = useMountedState('0');
  const laneId = useLaneId();
  const { bridgedMessages } = getSubstrateDynamicNames(chain);
  const isReady = !!(isApiReady && api.query[bridgedMessages] && chain);

  const getOutboundLaneData = useCallback(
    () =>
      api.query[bridgedMessages].outboundLanes(laneId, (res: any) => {
        const latest_generated_nonce = res.get('latest_generated_nonce').toString();
        const latest_received_nonce = res.get('latest_received_nonce').toString();
        const pendingMessages = new BN(latest_generated_nonce).sub(new BN(latest_received_nonce));

        setOutboudLanes({
          latestReceivedNonce: latest_received_nonce.toString(),
          pendingMessages: pendingMessages.isNeg() ? '0' : pendingMessages.toString(),
          totalMessages: latest_generated_nonce
        });
      }),
    [api.query, bridgedMessages, laneId, setOutboudLanes]
  );

  const getInboundLaneData = useCallback(
    () =>
      api.query[bridgedMessages].inboundLanes(laneId, (res: any) => {
        setBridgesReceivedMessages(res.get('last_confirmed_nonce').toString());
      }),
    [api.query, bridgedMessages, laneId, setBridgesReceivedMessages]
  );

  useApiSubscription(getOutboundLaneData, isReady);

  useApiSubscription(getInboundLaneData, isReady);

  return { bridgeReceivedMessages, outboundLanes };
};

export default useMessagesLane;
