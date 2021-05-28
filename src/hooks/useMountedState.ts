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

import { useCallback, useState } from 'react';
import { useIsMounted } from './useIsMounted';
import logger from '../util/logger';

/**
 * Like React's [useState](https://reactjs.org/docs/hooks-reference.html#usestate)
 * but it makes sure the component that uses this state hook is mounted before updating state
 * @param {D} initialValue
 * @returns {[D, Dispatch<D>]} an array of 2 items
 * the first is the current state, the second is a function that enables
 * updating the state if the component is not mounted
 *
 * D is the type passed when then useMountedState is used
 * e.g. const [pass, setPass] = useMountedState<string>('someString');
 */
export const useMountedState = <D>(initialState: D | (() => D)) => {
  const isMounted = useIsMounted();

  const [state, setState] = useState<D>(initialState);

  const setMountedState = useCallback(
    (value: D) => {
      if (isMounted()) {
        setState(value);
      } else {
        logger.warn('Warning: Trying to update the state of unmounted component.');
      }
    },
    [isMounted]
  );

  return [state, setMountedState] as const;
};
