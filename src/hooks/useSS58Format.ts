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

import { GENERIC, GENERIC_SUBSTRATE_PREFIX } from '../constants';
import { useSourceTarget } from '../contexts/SourceTargetContextProvider';

type State = {
  getSS58ByChain: (chain: string) => number;
};

const useSS58Format = (): State => {
  const {
    sourceChainDetails: {
      sourceChain,
      sourceConfigs: { ss58Format: sourceSS58Format }
    },
    targetChainDetails: {
      targetChain,
      targetConfigs: { ss58Format: targetSS58Format }
    }
  } = useSourceTarget();

  const getSS58ByChain = (chain: string) => {
    switch (chain) {
      case sourceChain:
        return sourceSS58Format;
      case targetChain:
        return targetSS58Format;
      case GENERIC:
        return GENERIC_SUBSTRATE_PREFIX;
      default:
        throw new Error(`Unknown type: ${chain}`);
    }
  };

  return { getSS58ByChain };
};

export default useSS58Format;
