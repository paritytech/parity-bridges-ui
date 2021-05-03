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
import { Connection } from '../types/sourceTargetTypes';

export function useConnection() {
  const { configs: chain1Configs, polkadotjsUrl: polkadotjsUrl1, ...apiConnection1 } = useApiConnection('1');
  const { configs: chain2Configs, polkadotjsUrl: polkadotjsUrl2, ...apiConnection2 } = useApiConnection('2');
  const [connections, setConnections] = useState<Connection[] | []>([]);
  const [apiReady, setApiReady] = useState(false);

  useEffect(() => {
    if (chain1Configs && chain2Configs && apiConnection1 && apiConnection2) {
      const chainName1 = chain1Configs.chainName;
      const chainName2 = chain2Configs.chainName;

      if (chainName1 && chainName2) {
        const connections = [
          {
            apiConnection: apiConnection1,
            configs: chain1Configs,
            chainName: chainName1,
            polkadotjsUrl: polkadotjsUrl1
          },
          {
            apiConnection: apiConnection2,
            configs: chain2Configs,
            chainName: chainName2,
            polkadotjsUrl: polkadotjsUrl2
          }
        ];
        setConnections(connections);
      }
    }
  }, [apiConnection1, apiConnection2, chain1Configs, chain2Configs, polkadotjsUrl1, polkadotjsUrl2]);

  useEffect(() => {
    setApiReady(apiConnection1.isApiReady && apiConnection2.isApiReady);
  }, [apiConnection1, apiConnection2]);

  return { connections, apiReady };
}
