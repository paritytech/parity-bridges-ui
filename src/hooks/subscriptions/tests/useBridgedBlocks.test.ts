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
import { renderHook, act } from '@testing-library/react-hooks';
import { useApiSubscription } from '../useApiSubscription';
import { useSourceTarget } from '../../../contexts/SourceTargetContextProvider';
import { ChainDetails } from '../../../types/sourceTargetTypes';
import useBridgedBlocks from '../useBridgedBlocks';
import logger from '../../../util/logger';

jest.spyOn(logger, 'error');

const chain1 = 'chain1';
const chain2 = 'chain2';

const state = {
  [ChainDetails.SOURCE]: {
    chain: chain1
  },
  [ChainDetails.TARGET]: {
    chain: chain2
  }
};

interface Props {
  chain: string;
  api: jest.Mocked<ApiPromise>;
  isApiReady: boolean;
}

jest.mock('../../../util/getSubstrateDynamicNames', () => ({
  getSubstrateDynamicNames: () => ({ bridgedGrandpaChain: chain2 })
}));
jest.mock('../useApiSubscription');
jest.mock('../../../contexts/SourceTargetContextProvider', () => ({
  useSourceTarget: jest.fn()
}));

const useMockApiSubscription = useApiSubscription as jest.MockedFunction<any>;

describe('useBridgedBlocks', () => {
  const bridgedGrandpaChain = chain2;
  const bestFinalizedMock = jest.fn() as jest.MockedFunction<any>;
  const importedHeadersMock = jest.fn() as jest.MockedFunction<any>;

  const api: jest.Mocked<ApiPromise> = {
    // @ts-ignore
    query: {
      [bridgedGrandpaChain]: {
        bestFinalized: bestFinalizedMock,
        importedHeaders: importedHeadersMock
      }
    }
  };

  let props = {} as Props;

  beforeEach(() => {
    props = {
      api,
      isApiReady: true,
      chain: chain1
    } as Props;
    (useSourceTarget as jest.Mock).mockReturnValue(state);
    jest.clearAllMocks();
  });

  describe('bestFinalized', () => {
    it('should call the query api.query.chain2.bestFinalized with isReady true but api.derive.chain.bestNumberFinalized with false', () => {
      renderHook(() => useBridgedBlocks(props));
      expect(useMockApiSubscription.mock.calls[0][0]).toEqual(expect.any(Function));
      expect(useMockApiSubscription.mock.calls[0][1]).toBe(true);

      expect(useMockApiSubscription.mock.calls[1][0]).toEqual(expect.any(Function));
      expect(useMockApiSubscription.mock.calls[1][1]).toBe(false);
    });

    it('should call hook useApiSubscription with callbacks api.derive.chain.bestNumber & api.derive.chain.bestNumberFinalized with isReady to false', () => {
      props.isApiReady = false;
      renderHook(() => useBridgedBlocks(props));
      expect(useMockApiSubscription).toHaveBeenCalledTimes(2);

      expect(useMockApiSubscription.mock.calls[0][1]).toBe(false);
      expect(useMockApiSubscription.mock.calls[1][1]).toBe(false);
    });
  });

  describe('importedHeaders', () => {
    it('should call hook useApiSubscription isReady on true because a bestFinalizedBlock provided.', async () => {
      const bestFinalizedBlock = '546';
      const { result } = renderHook(() => useBridgedBlocks(props));

      act(() => {
        result.current.setBestFinalizedBlock(bestFinalizedBlock);
      });

      expect(useMockApiSubscription.mock.calls[3][0]).toEqual(expect.any(Function));
      expect(useMockApiSubscription.mock.calls[3][1]).toBe(true);
    });
  });
});
