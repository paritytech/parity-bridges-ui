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
import useChainProfile from '../useChainProfile';
import { ChainDetails } from '../../types/sourceTargetTypes';

import { useSourceTarget } from '../../contexts/SourceTargetContextProvider';

const sourceChain = 'sourceChain';
const targetChain = 'targetChain';
const valueSource = 'valueSource';
const valueTarget = 'valueTarget';

const state = {
  [ChainDetails.SOURCE]: {
    chain: sourceChain,
    value: valueSource
  },
  [ChainDetails.TARGET]: {
    chain: targetChain,
    value: valueTarget
  }
};

jest.mock('../../contexts/SourceTargetContextProvider', () => ({
  useSourceTarget: jest.fn()
}));

describe('useChainProfile', () => {
  beforeEach(() => (useSourceTarget as jest.Mock).mockReturnValue(state));
  it('should retrieve source -> target', () => {
    const { result } = renderHook(() => useChainProfile(ChainDetails.SOURCE));

    expect(result.current).toEqual({
      target: targetChain,
      source: sourceChain,
      value: valueSource
    });
  });

  it('should retrieve target -> source', () => {
    const { result } = renderHook(() => useChainProfile(ChainDetails.TARGET));

    expect(result.current).toEqual({
      target: sourceChain,
      source: targetChain,
      value: valueTarget
    });
  });

  it('should retrieve empty profile', () => {
    (useSourceTarget as jest.Mock).mockReturnValue({});
    const { result } = renderHook(() => useChainProfile(ChainDetails.TARGET));

    expect(result.current).toEqual({
      apiConnection: {
        api: {},
        isApiReady: false
      },
      target: '',
      source: '',
      polkadotjsUrl: ''
    });
  });
});
