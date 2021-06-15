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
import useMessagesLane from '../useMessagesLane';

const chain1 = 'chain1';
const chain2 = 'chain2';
interface Props {
  chain: string;
  api: jest.Mocked<ApiPromise>;
  isApiReady: boolean;
}

jest.mock('../../chain/useLaneId', () => () => '0x00');

jest.mock('../useApiSubscription');
jest.mock('../../../util/getSubstrateDynamicNames', () => ({
  getSubstrateDynamicNames: () => ({ bridgedMessages: chain2 })
}));

const useMockApiSubscription = useApiSubscription as jest.MockedFunction<any>;

describe('useMessagesLane', () => {
  const outboundLanesMock = jest.fn() as jest.MockedFunction<any>;
  const inboundLanesMock = jest.fn() as jest.MockedFunction<any>;

  const api: jest.Mocked<ApiPromise> = {
    // @ts-ignore
    query: {
      [chain2]: {
        outboundLanes: outboundLanesMock,
        inboundLanes: inboundLanesMock
      }
    }
  };

  let props = {} as Props;

  beforeEach(() => {
    props = {
      api,
      isApiReady: true,
      chain: chain1
    };
    jest.clearAllMocks();
  });

  it('should call hook useApiSubscription with callbacks api.query[bridgedMessages].outboundLanes & api.query[bridgedMessages].inboundLanes and isReady on true', () => {
    renderHook(() => useMessagesLane(props));
    expect(useMockApiSubscription).toHaveBeenCalledTimes(2);

    expect(useMockApiSubscription.mock.calls[0][0]).toEqual(expect.any(Function));
    expect(useMockApiSubscription.mock.calls[0][1]).toBe(true);

    expect(useMockApiSubscription.mock.calls[1][0]).toEqual(expect.any(Function));
    expect(useMockApiSubscription.mock.calls[1][1]).toBe(true);
  });

  it('should call hook useApiSubscription with callbacks api.query[bridgedMessages].outboundLanes & api.query[bridgedMessages].inboundLanes and isReady on false beacause isApiReady is false', () => {
    props.isApiReady = false;
    renderHook(() => useMessagesLane(props));
    expect(useMockApiSubscription).toHaveBeenCalledTimes(2);

    expect(useMockApiSubscription.mock.calls[0][1]).toBe(false);
    expect(useMockApiSubscription.mock.calls[1][1]).toBe(false);
  });
});
