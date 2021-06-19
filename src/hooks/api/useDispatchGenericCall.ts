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
interface DispatchGenericCallInput {
  call: Function;
  dispatch: Function;
  shouldExecute?: boolean | unknown;
}

export const useDispatchGenericCall = ({ call, dispatch, shouldExecute = true }: DispatchGenericCallInput) => {
  const execute = useCallback(
    async (...params: any[]) => {
      let data;
      let error;
      try {
        if (!shouldExecute) {
          return null;
        }
        dispatch(null, null);
        data = await call(...params);
        if (data) {
          dispatch(null, data);
        }
      } catch (e) {
        error = e;
        dispatch(e, null);
      }
      return { data, error };
    },
    [call, dispatch, shouldExecute]
  );

  return {
    execute
  };
};

export default useDispatchGenericCall;
