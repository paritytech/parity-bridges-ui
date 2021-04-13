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

import { ChainDetails } from '../types/sourceTargetTypes';
import useBlocksInfo from './useBlocksInfo';
import useBridgedBlocks from './useBridgedBlocks';
import useDashboardProfile from './useDashboardProfile';
import useMessagesLane from './useMessagesLane';

const useDashboard = (ChainDetail: ChainDetails) => {
  const { api, destination, local, isApiReady, polkadotjsUrl } = useDashboardProfile(ChainDetail);

  const blockInfo = useBlocksInfo({ api, chain: local, isApiReady });
  const bridgedBlocks = useBridgedBlocks({ api, chain: destination, isApiReady });
  const messagesLane = useMessagesLane({ api, chain: destination, isApiReady });

  return { ...blockInfo, ...bridgedBlocks, ...messagesLane, local, polkadotjsUrl };
};

export default useDashboard;
