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

/* eslint-disable @typescript-eslint/no-unused-vars */

import { renderHook, act } from '@testing-library/react-hooks';
import useBridgedBlocks from '../useBridgedBlocks';

const chain1 = 'chain1';
const chain2 = 'chain2';

jest.mock('../../util/getSubstrateDynamicNames', () => () => ({ bridgedGrandpaChain: chain2 }));

describe('useBridgedBlocks', () => {
  const bridgedGrandpaChain = chain2;
  const bestFinalized = jest.fn() as jest.MockedFunction<any>;
  const importedHeaders = jest.fn() as jest.MockedFunction<any>;

  const api = {
    query: {
      [bridgedGrandpaChain]: {
        bestFinalized,
        importedHeaders
      }
    }
  };

  let props = {};

  beforeEach(() => {
    props = {
      api,
      isApiReady: true,
      chain: chain1
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call the query api.query.chain2.bestFinalized with expected callback function', () => {
    renderHook(() => useBridgedBlocks(props));

    expect(api.query[bridgedGrandpaChain].bestFinalized).toHaveBeenCalledWith(expect.any(Function));
  });

  it('should NOT call the query api.query.chain2.bestFinalized because loader is not ready', () => {
    props.isApiReady = false;
    renderHook(() => useBridgedBlocks(props));

    expect(api.query[bridgedGrandpaChain].bestFinalized).not.toHaveBeenCalled();
  });

  it('should NOT call the query api.query.chain2.useBridgedBlocks because bestFinalizedBlock was not yet set', () => {
    renderHook(() => useBridgedBlocks(props));

    expect(api.query[bridgedGrandpaChain].importedHeaders).not.toHaveBeenCalled();
  });

  it('should call the query api.query.chain2.importedHeaders with the value of setBestFinalizedBlock & callback', () => {
    const bestFinalizedBlock = '546';
    const { result } = renderHook(() => useBridgedBlocks(props));

    act(() => {
      result.current.setBestFinalizedBlock(bestFinalizedBlock);
    });

    expect(api.query[bridgedGrandpaChain].importedHeaders).toHaveBeenCalledWith(
      bestFinalizedBlock,
      expect.any(Function)
    );
  });
});
