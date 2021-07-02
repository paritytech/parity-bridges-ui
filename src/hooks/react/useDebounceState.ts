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
import debounce from 'lodash/debounce';

type Output = [string | null, string | null, Function];

export const useDebounceState = (initialValue: string | null, wait: number = 500): Output => {
  const [value, setValue] = useState(initialValue);
  const [debounced, setDebounced] = useState(value);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const setDebouncedCallback = useCallback(
    debounce((value) => setDebounced(value), wait),
    []
  );

  const setValueCallback = useCallback(
    (value: string | null) => {
      setValue(value);
      setDebouncedCallback(value);
    },
    [setDebouncedCallback]
  );

  return [value, debounced, setValueCallback];
};

export default useDebounceState;
