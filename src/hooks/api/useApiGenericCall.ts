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

interface CustomStatusCall {
  customSetIsLoading: (isCalculatingFee: boolean) => void | boolean;
  customSetError: (error: string) => void | string;
  customSetData: (data: unknown) => void | unknown;
}

export const useApiGenericCall = (customStatusCalls?: CustomStatusCall) => {
  const [isLoading, setIsLoading] = useMountedState<boolean>(false);
  const [error, setError] = useMountedState<unknown>(null);
  const [data, setData] = useMountedState<unknown>(null);

  const getCustomStatusCalls = useCallback(() => {
    if (customStatusCalls) {
      const { customSetIsLoading, customSetError, customSetData } = customStatusCalls;
      return {
        customSetIsLoading,
        customSetError,
        customSetData
      };
    }

    return {
      customSetIsLoading: (isCalculatingFee: boolean) => isCalculatingFee,
      customSetError: (error: string) => error,
      customSetData: (data: any) => data
    };
  }, [customStatusCalls]);

  const execute = useCallback(
    async (getStateCall) => {
      const { customSetIsLoading, customSetData, customSetError } = getCustomStatusCalls();
      try {
        setIsLoading(true);
        customSetIsLoading(true);
        const stateCall = await getStateCall();
        setData(stateCall);
        customSetData(stateCall);
        return stateCall;
      } catch (e) {
        setError(e);
        customSetError(e);
        setIsLoading(false);
        customSetIsLoading(false);
      }
    },
    [getCustomStatusCalls, setIsLoading, setData, setError]
  );

  return {
    isLoading,
    error,
    data,
    execute
  };
};

export default useApiGenericCall;
