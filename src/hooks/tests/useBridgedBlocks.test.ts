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
import useBridgedBlocks from '../useBridgedBlocks';

interface Props {
  chain: string;
  api: jest.Mocked<ApiPromise>;
  isApiReady: boolean;
}

const chain1 = 'chain1';
const chain2 = 'chain2';

jest.mock('../../util/getSubstrateDynamicNames', () => () => ({ bridgedGrandpaChain: chain2 }));

describe('useBridgedBlocks', () => {
  const bridgedGrandpaChain = chain2;
  const bestFinalizedMock = jest.fn() as jest.MockedFunction<any>;
  const importedHeadersMock = jest.fn() as jest.MockedFunction<any>;
  const unsubBestFinalized = jest.fn();
  const unsubImportedHeaders = jest.fn();

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
    bestFinalizedMock.mockResolvedValue(unsubBestFinalized);
    importedHeadersMock.mockResolvedValue(unsubImportedHeaders);

    props = {
      api,
      isApiReady: true,
      chain: chain1
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('bestFinalized', () => {
    it('should call the query api.query.chain2.bestFinalized with expected callback function', () => {
      renderHook(() => useBridgedBlocks(props));
      expect(bestFinalizedMock).toHaveBeenCalledWith(expect.any(Function));
    });

    it('should unsubscribe both subscriptions when useEffect gets unmounted', async () => {
      const { waitFor } = renderHook(() => useBridgedBlocks(props));
      waitFor(() => {
        expect(unsubBestFinalized).toHaveBeenCalled();
      });
    });

    it('should NOT call the query api.query.chain2.bestFinalized because the api is not ready', () => {
      props.isApiReady = false;
      renderHook(() => useBridgedBlocks(props));
      expect(bestFinalizedMock).not.toHaveBeenCalled();
    });
  });

  describe('importedHeaders', () => {
    it('should call the query api.query.chain2.importedHeaders with the value of setBestFinalizedBlock & callback', async () => {
      const bestFinalizedBlock = '546';
      const { result, waitFor } = renderHook(() => useBridgedBlocks(props));

      act(() => {
        result.current.setBestFinalizedBlock(bestFinalizedBlock);
      });

      waitFor(() => {
        expect(importedHeadersMock).toHaveBeenCalledWith(bestFinalizedBlock, expect.any(Function));
      });
    });

    it('should unsubscribe when useEffect gets unmounted', async () => {
      const bestFinalizedBlock = '546';
      const { result, waitFor } = renderHook(() => useBridgedBlocks(props));

      act(() => {
        result.current.setBestFinalizedBlock(bestFinalizedBlock);
      });

      waitFor(() => {
        expect(unsubImportedHeaders).toHaveBeenCalled();
      });
    });

    it('should NOT call the query api.query.chain2.importedHeaders because the api is not ready', () => {
      props.isApiReady = false;
      renderHook(() => useBridgedBlocks(props));
      expect(importedHeadersMock).not.toHaveBeenCalled();
    });
  });
});
