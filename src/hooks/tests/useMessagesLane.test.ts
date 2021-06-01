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
import useMessagesLane from '../useMessagesLane';

const chain1 = 'chain1';
const chain2 = 'chain2';

interface Props {
  chain: string;
  api: jest.Mocked<ApiPromise>;
  isApiReady: boolean;
}

jest.mock('../../util/getSubstrateDynamicNames', () => () => ({
  bridgedMessages: chain2
}));

describe('useMessagesLane', () => {
  const outboundLanesMock = jest.fn() as jest.MockedFunction<any>;
  const inboundLanesMock = jest.fn() as jest.MockedFunction<any>;
  const unsubOutboundLanes = jest.fn();
  const unsubInboundLanes = jest.fn();

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
    outboundLanesMock.mockResolvedValue(unsubOutboundLanes);
    inboundLanesMock.mockResolvedValue(unsubInboundLanes);

    props = {
      api,
      isApiReady: true,
      chain: chain1
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call the query api.query.chain2.outboundLanes & api.query.chain2.importedHeaders with expected callback function', () => {
    renderHook(() => useMessagesLane(props));
    expect(outboundLanesMock).toHaveBeenCalledWith(expect.any(String), expect.any(Function));
    expect(inboundLanesMock).toHaveBeenCalledWith(expect.any(String), expect.any(Function));
  });

  it('should unsubscribe both subscriptions when useEffect gets unmounted', async () => {
    const { waitFor } = renderHook(() => useMessagesLane(props));
    waitFor(() => {
      expect(unsubOutboundLanes).toHaveBeenCalled();
      expect(unsubInboundLanes).toHaveBeenCalled();
    });
  });

  it('should NOT call the query api.query.chain2.outboundLanes & api.query.chain2.importedHeaders because the api is not ready', () => {
    props.isApiReady = false;
    renderHook(() => useMessagesLane(props));
    expect(outboundLanesMock).not.toHaveBeenCalled();
    expect(inboundLanesMock).not.toHaveBeenCalled();
  });
});
