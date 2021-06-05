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

import { renderHook, act } from '@testing-library/react-hooks';
import { useMakesSubscription } from '../useMakeSubscription';

const unsubMessage = 'unsubscribed';

describe('useBridgedBlocks', () => {
  const cbMock = jest.fn() as jest.MockedFunction<any>;
  const unsubMock = jest.fn().mockReturnValue(unsubMessage);

  beforeEach(() => {
    //cbMock.mockResolvedValue(unsubMock);
    cbMock.mockReturnValue('alalalal');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('bestFinalized', () => {
    it('should call callback function and unsubscribe', async () => {
      cbMock.mockRejectedValue(new Error('Async error'));
      const { unmount } = await renderHook(() => useMakesSubscription(cbMock, true));

      unmount();
      act(() => expect(unsubMock).toHaveBeenCalled());

      /*
      console.log('unsubMock.mock.calls', unsubMock.mock.calls);

      expect(cbMock).toHaveBeenCalled();
      expect(unsubMock).toHaveBeenCalled(); */
    });

    /*     it('should not call unsubscribe both subscriptions when useEffect gets unmounted', async () => {
      const { waitFor } = renderHook(() => useMakesSubscription(cbMock, false));

      waitFor(() => {
        expect(cbMock).toHaveBeenCalled();
        expect(unsubMock).not.toHaveBeenCalled();
      });
    }); */

    /*     it('should NOT call the query api.query.chain2.bestFinalized because the api is not ready', () => {
      renderHook(() => useBridgedBlocks(props));
      expect(bestFinalizedMock).not.toHaveBeenCalled();
    }); */
  });
});
