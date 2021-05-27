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
import useBridgedBlocks from '../useBridgedBlocks';

const chain1 = 'chain1';
const chain2 = 'chain2';

jest.mock('../../util/getSubstrateDynamicNames', () => () => ({ bridgedGrandpaChain: chain2 }));

describe('useBridgedBlocks', () => {
  const bridgedGrandpaChain = chain2;
  const bestFinalizedMock = jest.fn() as jest.MockedFunction<any>;
  const importedHeadersMock = jest.fn() as jest.MockedFunction<any>;
  const unsubBestFinalized = jest.fn();
  const unsubImportedHeaders = jest.fn();

  const api = {
    query: {
      [bridgedGrandpaChain]: {
        bestFinalized: bestFinalizedMock,
        importedHeaders: importedHeadersMock
      }
    }
  };

  let props = {};

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

    it('should unsubscribe when useEffect gets unmounted', async () => {
      const { unmount } = await renderHook(() => useBridgedBlocks(props));
      unmount();
      expect(unsubBestFinalized).toHaveBeenCalled();
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
      const { result } = await renderHook(() => useBridgedBlocks(props));

      act(() => {
        result.current.setBestFinalizedBlock(bestFinalizedBlock);
      });

      expect(importedHeadersMock).toHaveBeenCalledWith(bestFinalizedBlock, expect.any(Function));
    });

    it('should unsubscribe when useEffect gets unmounted', async () => {
      const bestFinalizedBlock = '546';
      const { result, unmount } = await renderHook(() => useBridgedBlocks(props));

      act(() => {
        result.current.setBestFinalizedBlock(bestFinalizedBlock);
      });
      unmount();
      expect(unsubImportedHeaders).toHaveBeenCalled();
    });

    it('should NOT call the query api.query.chain2.importedHeaders because the api is not ready', () => {
      props.isApiReady = false;
      renderHook(() => useBridgedBlocks(props));
      expect(importedHeadersMock).not.toHaveBeenCalled();
    });
  });
});
