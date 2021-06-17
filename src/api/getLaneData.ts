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
import { VoidFn } from '@polkadot/api/types';
import { DataType } from './types';
import { useGetApi, ReturnApi } from './useGetApi';
import BN from 'bn.js';

export const getLaneData = async ({ api, apiMethod, separator, arg1, setter }: DataType): Promise<VoidFn> => {
  if (separator === 'outbound') {
    return apiMethod
      ? await api.query[apiMethod].outboundLanes(arg1, (res: any) => {
          const latest_generated_nonce = res.get('latest_generated_nonce').toString();
          const latest_received_nonce = res.get('latest_received_nonce').toString();
          const pendingMessages = new BN(latest_generated_nonce).sub(new BN(latest_received_nonce));

          setter({
            latestReceivedNonce: latest_received_nonce.toString(),
            pendingMessages: pendingMessages.isNeg() ? '0' : pendingMessages.toString(),
            totalMessages: latest_generated_nonce
          });
        })
      : ({} as Promise<VoidFn>);
  } else if (separator === 'inbound') {
    return apiMethod
      ? await api.query[apiMethod].inboundLanes(arg1, (res: any) => {
          setter(res.get('last_confirmed_nonce').toString());
        })
      : ({} as Promise<VoidFn>);
  }
  return {} as Promise<VoidFn>;
};

export const useGetLaneData = (options: DataType): ReturnApi => {
  return useGetApi<DataType>(getLaneData, options);
};
