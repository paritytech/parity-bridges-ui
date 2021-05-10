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
import { useEffect, useState } from 'react';
import logger from '../util/logger';
import { getChainName } from '../util/getConfigs';
import { ConnectionChainInformation } from '../types/sourceTargetTypes';
import { BASE_CUSTOM_TYPES } from '../constants';

export default function useApiChainName(connectionDetails: ConnectionChainInformation): string {
  const [apiPromise, setApiPromise] = useState<ApiPromise>({} as ApiPromise);
  const [chainName, setChainName] = useState('');
  const { chainNumber, provider } = connectionDetails;

  useEffect(() => {
    const connect = async () => {
      try {
        const apiPromise = await ApiPromise.create({ provider: provider, types: BASE_CUSTOM_TYPES });
        const chainName = await getChainName(apiPromise);
        setApiPromise(apiPromise);
        setChainName(chainName);
        logger.info(`Chain ${chainNumber} connected and chain name ${chainName} was retrieved`);
      } catch (err) {
        logger.error(`Chain ${chainNumber}: Error creating connection. Details: ${err.message}`);
      }
    };
    if (!chainName) {
      connect();
    }
    // Want to run this only once in hte beggining
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const disconnect = async () => {
      await apiPromise
        .disconnect()
        .catch((err) => logger.error(`Chain ${chainNumber}: Error disconnecting. Details: ${err.message}`));
      logger.info(`Chain ${chainNumber} disconnected`);
    };

    if (apiPromise.isConnected && chainName) {
      disconnect();
    }
  }, [apiPromise, chainName, chainNumber]);

  return chainName;
}
