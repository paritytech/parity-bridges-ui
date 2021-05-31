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

import getSubstrateDynamicNames from '../util/getSubstrateDynamicNames';
import { ChainDetails } from '../types/sourceTargetTypes';
import { TransactionState } from '../types/transactionTypes';

import { useSourceTarget } from '../contexts/SourceTargetContextProvider';

const useApiCalls = () => {
  const {
    sourceChainDetails: {
      apiConnection: { api: sourceApi },
      chain: sourceChain
    },
    targetChainDetails: {
      apiConnection: { api: targetApi },
      chain: targetChain
    }
  } = useSourceTarget();

  const bridgeMessage = (laneId: string, payload: Object, estimatedFee: TransactionState['estimatedFee']) => {
    const { bridgedMessages } = getSubstrateDynamicNames(targetChain);
    return sourceApi.tx[bridgedMessages].sendMessage(laneId, payload, estimatedFee);
  };

  return { bridgeMessage };
};

export default useApiCalls;
