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

import logger from '../util/logger';

interface Result<T> {
  error: string | null;
  data: T | null;
}
interface DispatchGenericCallInput<T> {
  call: (...args: any[]) => Promise<T>;
  dispatch?: (error: string | null, data: T | null, loading: boolean) => void;
  emptyData?: T | null;
}

export const genericCall = async <T>({
  call,
  emptyData = null,
  dispatch
}: DispatchGenericCallInput<T>): Promise<Result<T>> => {
  let data = emptyData;
  let error = null;
  const executeDispatch = (error: string | null, data: T | null, loading: boolean) =>
    dispatch && dispatch(error, data, loading);

  try {
    executeDispatch(null, emptyData, true);
    data = await call();
  } catch (e) {
    error = e.message;
    logger.error(error);
  } finally {
    executeDispatch(error, data, false);
  }
  return { data, error };
};

export default { genericCall };
