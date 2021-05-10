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

import { useState, useEffect } from 'react';
import { useApiConnection } from './useApiConnection';
import isEmpty from 'lodash/isEmpty';
import { SourceTargetState, ChainDetails, ConnectionChainInformation, Configs } from '../types/sourceTargetTypes';

interface Props {
  connectionDetailsOne: ConnectionChainInformation;
  connectionDetailsTwo: ConnectionChainInformation;
  initConnectionDetailsOne: ConnectionChainInformation;
  initConnectionDetailsTwo: ConnectionChainInformation;
}

export function useConnections({
  connectionDetailsOne,
  connectionDetailsTwo,
  initConnectionDetailsOne,
  initConnectionDetailsTwo
}: Props) {
  const { configs: chain1Configs, polkadotjsUrl: polkadotjsUrl1, ...apiConnection1 } = useApiConnection(
    connectionDetailsOne,
    initConnectionDetailsOne
  );
  const { configs: chain2Configs, polkadotjsUrl: polkadotjsUrl2, ...apiConnection2 } = useApiConnection(
    connectionDetailsTwo,
    initConnectionDetailsTwo
  );
  const [connections, setConnections] = useState<SourceTargetState>({} as SourceTargetState);
  const [apiReady, setApiReady] = useState(false);

  useEffect(() => {
    if (chain1Configs && chain2Configs && apiConnection1 && apiConnection2) {
      const chainName1 = chain1Configs.chainName;
      const chainName2 = chain2Configs.chainName;
      const apiReady = apiConnection1.isApiReady && apiConnection2.isApiReady;

      const getBridgedSS58Format = (
        chainConfig: Configs,
        bridgedChainConfig: Configs,
        bridgedChain: string
      ): Configs => {
        const bridgeId: number[] = bridgedChainConfig!.bridgeIds![bridgedChain];
        chainConfig.bridgeId = bridgeId;
        return chainConfig;
      };

      if (chainName1 && chainName2 && apiReady && isEmpty(connections)) {
        const connections = {
          [ChainDetails.SOURCE]: {
            // We look for the bridged chain property in the bridgeIds object.
            sourceConfigs: getBridgedSS58Format(chain1Configs, chain2Configs, chainName1),
            sourceApiConnection: apiConnection1,
            sourceChain: chainName1,
            sourcePolkadotjsUrl: polkadotjsUrl1
          },
          [ChainDetails.TARGET]: {
            // We look for the bridged chain property in the bridgeIds object.
            targetConfigs: getBridgedSS58Format(chain2Configs, chain1Configs, chainName2),
            targetApiConnection: apiConnection2,
            targetChain: chainName2,
            targetPolkadotjsUrl: polkadotjsUrl2
          }
        };
        setConnections(connections);
        setApiReady(apiReady);
      }
    }
  }, [apiConnection1, apiConnection2, chain1Configs, chain2Configs, connections, polkadotjsUrl1, polkadotjsUrl2]);

  return { connections, apiReady };
}
