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

import { useCallback, useMemo, useState, Dispatch, useEffect } from 'react';
import usePrevious from './usePrevious';
import debounce from 'lodash/debounce';

type Output<T> = [T, (value: T) => void, T];

interface Input<T> {
  initialValue: T;
  wait?: number;
  transformCallback?: (value: T) => void;
  dispatchCallback?: Dispatch<T>;
}

export const useDebounceState = <T>({
  initialValue,
  wait = 250,
  transformCallback,
  dispatchCallback
}: Input<T>): Output<T> => {
  const [value, setValue] = useState(initialValue);
  const [debounced, setDebounced] = useState(initialValue);
  const previousDebounced = usePrevious(debounced);
  const setDebouncedCallback = useMemo(() => debounce((value) => setDebounced(value), wait), [wait]);

  const setValueCallback = useCallback(
    (value: T) => {
      setValue(value);
      if (transformCallback) {
        const transformedValue = transformCallback(value);
        setDebouncedCallback(transformedValue);
      } else {
        setDebouncedCallback(value);
      }
    },
    [setDebouncedCallback, transformCallback]
  );

  useEffect(() => {
    previousDebounced && previousDebounced !== debounced && dispatchCallback && dispatchCallback(debounced);
  }, [debounced, dispatchCallback, previousDebounced]);

  return [value, setValueCallback, debounced];
};

export default useDebounceState;
