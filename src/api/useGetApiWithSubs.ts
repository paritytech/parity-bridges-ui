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

// import { UnsubscribePromise } from '@polkadot/api/types';

/*********** TEMPORARY - PROBABLY WONT USE ****/

import { ApiPromise } from '@polkadot/api';
import { VoidFn } from '@polkadot/api/types';
import { useCallback } from 'react';
import { useMountedState } from '../hooks/react/useMountedState';
import { useApiSubscription } from '../hooks/subscriptions/useApiSubscription';

interface SomeInput {
  chain: string;
  api: ApiPromise;
  isApiReady: boolean;
  bridgeFunction: (options: DataType) => Promise<VoidFn>;
  separators: string[];
  apiMethod?: any;
  arg1?: any;
}

interface DataType {
  api: ApiPromise;
  apiMethod: string;
  separator: string;
  setter: any;
  arg1?: any;
}

export const useGetApiWithSubs = ({ isApiReady, api, chain, apiMethod, bridgeFunction, separators }: SomeInput) => {
  const isReady: boolean = !!(isApiReady && chain);
  const [stater1, setStater1] = useMountedState('');
  const [stater2, setStater2] = useMountedState('');

  console.log('leak?');

  const get1 = useCallback(
    () =>
      bridgeFunction({
        api,
        apiMethod,
        separator: separators[0],
        setter: setStater1
      }),
    [api, apiMethod, bridgeFunction, separators, setStater1]
  );

  const get2 = useCallback(
    () =>
      bridgeFunction({
        api,
        apiMethod,
        separator: separators[1],
        setter: setStater2
      }),
    [api, apiMethod, bridgeFunction, separators, setStater2]
  );

  useApiSubscription(get1, isReady);
  useApiSubscription(get2, isReady);

  return { stater1, stater2 };
};
