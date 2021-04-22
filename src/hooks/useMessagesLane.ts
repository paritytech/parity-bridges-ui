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
import BN from 'bn.js';
import { useEffect, useState } from 'react';

import { useLaneId } from '../hooks';
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
  const [outboundLanes, setOutboudLanes] = useState({
    latestReceivedNonce: '0',
    pendingMessages: '0',
    totalMessages: '0'
  });
  const [inboundLanes, setInboudLanes] = useState({ bridgeReceivedMessages: '0' });

  const laneId = useLaneId();
  const { bridgedMessages, latestReceivedNonceMethodName } = getSubstrateDynamicNames(chain);
  useEffect(() => {
    if (!api || !isApiReady || !api.query[bridgedMessages] || !chain) {
      return;
    }

    // to-do: review after depending on action to perform
    let unsubscribeOutboundLanes: () => void;
    let unsubscribeInboundLanes: () => void;
    api.query[bridgedMessages]
      .outboundLanes(laneId, (res: any) => {
        const latest_generated_nonce = res.get('latest_generated_nonce').toString();
        const latest_received_nonce = res.get('latest_received_nonce').toString();
        const pendingMessages = new BN(latest_generated_nonce).sub(new BN(latest_received_nonce));

        setOutboudLanes({
          latestReceivedNonce: latest_received_nonce.toString(),
          pendingMessages: pendingMessages.isNeg() ? '0' : pendingMessages.toString(),
          totalMessages: latest_generated_nonce
        });
      })
      .then((unsub) => {
        unsubscribeOutboundLanes = unsub;
      });
    api.query[bridgedMessages]
      .inboundLanes(laneId, (res: any) => {
        setInboudLanes({ bridgeReceivedMessages: res.get('last_confirmed_nonce').toString() });
      })
      .then((unsub) => {
        unsubscribeInboundLanes = unsub;
      });

    return function cleanup() {
      unsubscribeOutboundLanes && unsubscribeOutboundLanes();
      unsubscribeInboundLanes && unsubscribeInboundLanes();
    };
  }, [api, isApiReady, chain, bridgedMessages, laneId, latestReceivedNonceMethodName]);

  return { inboundLanes, outboundLanes };
};

export default useMessageLane;
