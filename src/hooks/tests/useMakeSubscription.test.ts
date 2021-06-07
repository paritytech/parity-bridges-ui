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

import { renderHook } from '@testing-library/react-hooks';
import { useMakesSubscription } from '../useMakeSubscription';
import logger from '../../util/logger';

jest.mock('../../util/logger', () => ({
  error: jest.fn().mockImplementation((message, e) => console.error(`${message} ${e}`))
}));

const unsubMessage = 'unsubscribed';

describe('useMakesSubscription', () => {
  const cbMock = jest.fn() as jest.MockedFunction<any>;
  const unsubMock = jest.fn().mockResolvedValue(unsubMessage);

  beforeEach(() => {
    cbMock.mockResolvedValue(unsubMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call callback function and unsubscribe', () => {
    renderHook(() => useMakesSubscription(cbMock, true));
    expect(cbMock).toHaveBeenCalled();
  });

  it('should NOT call unsubscription in cleanup function if api is not ready', () => {
    const { unmount } = renderHook(() => useMakesSubscription(cbMock, false));
    unmount();
    expect(unsubMock).not.toHaveBeenCalled();
  });

  it('should catch error because api failure', () => {
    const error = new Error('Async error');
    renderHook(() =>
      useMakesSubscription(() => {
        throw error;
      }, true)
    );
    expect(logger.error).toHaveBeenCalledWith('error executing subscription', error);
    expect(unsubMock).not.toHaveBeenCalled();
  });
});
