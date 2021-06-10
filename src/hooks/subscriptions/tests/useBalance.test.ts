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

import { ApiPromise } from '@polkadot/api';
import { renderHook } from '@testing-library/react-hooks';
import { useApiSubscription } from '../useApiSubscription';
import useBalance from '../useBalance';
import useLoadingApi from '../../connections/useLoadingApi';

import logger from '../../../util/logger';

jest.spyOn(logger, 'error');
jest.mock('../useApiSubscription');
jest.mock('../../connections/useLoadingApi');
const useMockApiSubscription = useApiSubscription as jest.MockedFunction<any>;

describe('useBalance', () => {
  const getBalanceMock = jest.fn() as jest.MockedFunction<any>;
  const address = '1bJDU65';
  const providedSi = true;

  const api: jest.Mocked<ApiPromise> = {
    query: {
      // @ts-ignore
      system: {
        account: getBalanceMock
      }
    }
  };

  beforeEach(() => {
    (useLoadingApi as jest.Mock).mockReturnValue({ areApiReady: true });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('useBalance', () => {
    it('should call hook useApiSubscription with api.query.system.account and isReady parameter on true', () => {
      renderHook(() => useBalance(api, address, providedSi));
      expect(useMockApiSubscription).toHaveBeenCalledTimes(1);

      expect(useMockApiSubscription.mock.calls[0][0]).toEqual(expect.any(Function));
      expect(useMockApiSubscription.mock.calls[0][1]).toBe(true);
    });

    it('should call hook useApiSubscription with api.query.system.account and isReady parameter on false because there is no account provided', () => {
      renderHook(() => useBalance(api, '', providedSi));
      expect(useMockApiSubscription).toHaveBeenCalledTimes(1);

      expect(useMockApiSubscription.mock.calls[0][1]).toBe(false);
    });

    it('should call hook useApiSubscription with api.query.system.account and isReady parameter on false because api are not loaded yet', () => {
      (useLoadingApi as jest.Mock).mockReturnValue({ areApiReady: false });
      renderHook(() => useBalance(api, address, providedSi));
      expect(useMockApiSubscription).toHaveBeenCalledTimes(1);

      expect(useMockApiSubscription.mock.calls[0][1]).toBe(false);
    });

    it('should call hook useApiSubscription with api.query.system.account and isReady parameter on false because api are not loaded yet and there is not account provided', () => {
      (useLoadingApi as jest.Mock).mockReturnValue({ areApiReady: false });
      renderHook(() => useBalance(api, '', providedSi));
      expect(useMockApiSubscription).toHaveBeenCalledTimes(1);

      expect(useMockApiSubscription.mock.calls[0][1]).toBe(false);
    });
  });
});
