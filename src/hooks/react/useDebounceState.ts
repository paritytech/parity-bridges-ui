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
  reset?: boolean;
}

export const useDebounceState = ({
  initialValue,
  wait = 500,
  transformCallback,
  dispatchCallback,
  reset
}: Input): Output => {
  const [value, setValue] = useState(initialValue);
  const [debounced, setDebounced] = useState(initialValue);
  const [toReset, setToReset] = useState(false);
  const [shouldDispatch, setShouldDispatch] = useState(true);

  const previousDebounced = usePrevious(debounced);
  const previousReset = usePrevious(reset);
  const setDebouncedCallback = useMemo(() => debounce((value) => setDebounced(value), wait), [wait]);

  const setValueCallback = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setValue(value || '');
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
    if (shouldDispatch && previousDebounced !== debounced && dispatchCallback) {
      dispatchCallback(debounced);
    }
  }, [debounced, dispatchCallback, previousDebounced, shouldDispatch]);

  // Mechanism to reset local state input when the transaction is executed.
  // In case no reset parameter is set to the hook, this process will not execute.
  useEffect(() => {
    if (value && debounced && !toReset && reset && previousReset !== reset) {
      setToReset(true);
      setShouldDispatch(false);
    }
    if (toReset && reset) {
      setValue('');
      setDebounced(null);
      setToReset(false);
    }

    if (!shouldDispatch && !reset && previousReset !== reset) {
      setShouldDispatch(true);
    }
  }, [reset, previousReset, setValue, value, debounced, toReset, shouldDispatch]);

  return [value, setValueCallback, debounced];
};

export default useDebounceState;
