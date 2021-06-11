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

import { useCallback } from 'react';
import { useMountedState } from '../react/useMountedState';

export const useApiGenericCall = (getStateCall: Function) => {
  const [isLoading, setIsLoading] = useMountedState<boolean>(false);
  const [error, setError] = useMountedState<unknown>(null);
  const [data, setData] = useMountedState<unknown>(null);

  const execute = useCallback(
    async (...params) => {
      try {
        setIsLoading(true);
        const stateCall = await getStateCall(...params);
        setData(stateCall);
        return stateCall;
      } catch (e) {
        setError(e);
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    },
    [setIsLoading, getStateCall, setData, setError]
  );

  return {
    isLoading,
    error,
    data,
    execute
  };
};

export default useApiGenericCall;
