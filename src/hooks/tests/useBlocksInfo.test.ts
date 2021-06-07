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
import useBlocksInfo from '../useBlocksInfo';
import logger from '../../util/logger';

jest.spyOn(logger, 'error');
jest.mock('../useApiSubscription');
const useMockApiSubscription = useApiSubscription as jest.MockedFunction<any>;

const CHAIN = 'chain';

interface Props {
  chain: string;
  api: jest.Mocked<ApiPromise>;
  isApiReady: boolean;
}

describe('useBlocksInfo', () => {
  const bestNumberMock = jest.fn() as jest.MockedFunction<any>;
  const bestNumberFinalizedMock = jest.fn() as jest.MockedFunction<any>;

  const api: jest.Mocked<ApiPromise> = {
    derive: {
      // @ts-ignore
      chain: {
        bestNumber: bestNumberMock,
        bestNumberFinalized: bestNumberFinalizedMock
      }
    }
  };

  const props: Props = {
    api,
    isApiReady: true,
    chain: CHAIN
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('bestBlockFinalized & bestBlock', () => {
    it('should call hook useApiSubscription with callbacks api.derive.chain.bestNumber & api.derive.chain.bestNumberFinalized and isReady on true', () => {
      renderHook(() => useBlocksInfo(props));
      expect(useMockApiSubscription).toHaveBeenCalledTimes(2);

      expect(useMockApiSubscription.mock.calls[0][0]).toEqual(expect.any(Function));
      expect(useMockApiSubscription.mock.calls[0][1]).toBe(true);

      expect(useMockApiSubscription.mock.calls[1][0]).toEqual(expect.any(Function));
      expect(useMockApiSubscription.mock.calls[1][1]).toBe(true);
    });

    it('should call hook useApiSubscription with callbacks api.derive.chain.bestNumber & api.derive.chain.bestNumberFinalized and isReady on false beacause isApiReady is false', () => {
      props.isApiReady = false;
      renderHook(() => useBlocksInfo(props));
      expect(useMockApiSubscription).toHaveBeenCalledTimes(2);

      expect(useMockApiSubscription.mock.calls[0][1]).toBe(false);
      expect(useMockApiSubscription.mock.calls[1][1]).toBe(false);
    });
  });
});
