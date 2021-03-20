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

import { DependencyList, EffectCallback, useEffect, useRef } from 'react';

/**
 * Exactly like React's `useEffect`, but skips initial render. Tries to
 * reproduce `componentDidUpdate` behavior.
 *
 * @see https://stackoverflow.com/questions/53179075/with-useeffect-how-can-i-skip-applying-an-effect-upon-the-initial-render/53180013#53180013
 */
export function useDidUpdateEffect(fn: EffectCallback, inputs?: DependencyList): void {
  const didMountRef = useRef(false);

  return useEffect(() => {
    if (didMountRef.current) fn();
    else didMountRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, inputs);
}
