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

import { useCallback, useMemo, useState, useEffect } from 'react';
import usePrevious from './usePrevious';
import debounce from 'lodash/debounce';

type ValueType = string | null;
type Output = [ValueType, (event: React.ChangeEvent<HTMLInputElement>) => void, ValueType];

interface Input {
  initialValue: ValueType;
  wait?: number;
  transformCallback?: (value: ValueType) => void;
  dispatchCallback?: (value: ValueType) => void;
}

export const useDebounceState = ({ initialValue, wait = 500, transformCallback, dispatchCallback }: Input): Output => {
  const [value, setValue] = useState(initialValue);
  const [debounced, setDebounced] = useState(initialValue);
  const previousDebounced = usePrevious(debounced);
  const setDebouncedCallback = useMemo(() => debounce((value) => setDebounced(value), wait), [wait]);

  const setValueCallback = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
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
    previousDebounced !== debounced && dispatchCallback && dispatchCallback(debounced);
  }, [debounced, dispatchCallback, previousDebounced]);

  return [value, setValueCallback, debounced];
};

export default useDebounceState;
