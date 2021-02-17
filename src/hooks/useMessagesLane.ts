// Copyright 2019-2020 @paritytech/bridge-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from '@polkadot/api';
import { useEffect, useState } from 'react';

interface Props {
  chain: string;
  api: ApiPromise;
  isApiReady: boolean;
}

interface Output {
  inboundLanes: {
    bridgeReceivedMessages: number;
  };
  outboundLanes: {
    pendingMessages: number;
    totalMessages: number;
  };
}

const useMessageLane = ({ isApiReady, api, chain }: Props): Output => {
  const [outboundLanes, setOutboudLanes] = useState({ pendingMessages: 0, totalMessages: 0 });
  const [inboundLanes, setInboudLanes] = useState({ bridgeReceivedMessages: 0 });

  useEffect(() => {
    const bridgedMessagesLainChain = `bridge${chain}MessageLane`;

    if (!api || !isApiReady || !api.query[bridgedMessagesLainChain] || !chain) {
      return;
    }

    // to-do: review after depending on action to perform

    api.query[bridgedMessagesLainChain].outboundLanes('0x00000000', (res: any) => {
      const latest_generated_nonce = res.get('latest_generated_nonce').toNumber();
      const latest_received_nonce = res.get('latest_received_nonce').toNumber();
      const pendingMessages = latest_generated_nonce - latest_received_nonce;
      setOutboudLanes({
        pendingMessages: pendingMessages < 0 ? 0 : pendingMessages,
        totalMessages: latest_generated_nonce
      });
    });

    api.query[bridgedMessagesLainChain].inboundLanes('0x00000000', (res: any) => {
      setInboudLanes({ bridgeReceivedMessages: res.get('last_confirmed_nonce').toNumber() });
    });
  }, [api, isApiReady, chain]);

  useEffect(() => {
    if (!isApiReady) {
      setOutboudLanes({ pendingMessages: 0, totalMessages: 0 });
      setInboudLanes({ bridgeReceivedMessages: 0 });
    }
  }, [isApiReady]);

  return { inboundLanes, outboundLanes };
};

export default useMessageLane;
