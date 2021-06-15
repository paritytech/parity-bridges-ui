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
import { useState, useCallback } from 'react';

export interface ReturnApi {
  isLoading: boolean;
  error: unknown;
  data: unknown;
  execute: () => any;
  executeCb: () => Promise<VoidFn>;
}

export const useGetApi = <T>(apiCall: any, args: T): ReturnApi => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(null);
  const [data, setData] = useState<unknown>(null);

  const execute = async () => {
    try {
      setIsLoading(true);
      const laneData = await apiCall(args);
      setData(laneData);
      return laneData;
    } catch (e) {
      setError(e);
      setIsLoading(false);
      throw e;
    }
  };

  return {
    isLoading,
    error,
    data,
    execute,
    executeCb: useCallback(execute, [apiCall, args])
  };
};
