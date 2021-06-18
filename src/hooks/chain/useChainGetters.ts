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

import { useCallback } from 'react';
import { GENERIC, GENERIC_SUBSTRATE_PREFIX } from '../../constants';
import { useSourceTarget } from '../../contexts/SourceTargetContextProvider';
import { getSubstrateDynamicNames } from '../../util/getSubstrateDynamicNames';

const useChainGetters = () => {
  const {
    sourceChainDetails: {
      apiConnection: { api: sourceApi, isApiReady: sourceIsApiReady },
      chain: sourceChain,
      configs: { ss58Format: sourceSS58Format }
    },
    targetChainDetails: {
      apiConnection: { api: targetApi, isApiReady: targetIsApiReady },
      chain: targetChain,
      configs: { ss58Format: targetSS58Format }
    }
  } = useSourceTarget();

  const getValuesByChain = useCallback(
    (chain: string) => {
      switch (chain) {
        case sourceChain:
          return {
            ss58Format: sourceSS58Format,
            api: sourceApi,
            isApiReady: sourceIsApiReady,
            substrateValues: getSubstrateDynamicNames(targetChain)
          };
        case targetChain:
          return {
            ss58Format: targetSS58Format,
            api: targetApi,
            isApiReady: targetIsApiReady,
            substrateValues: getSubstrateDynamicNames(sourceChain)
          };
        default:
          throw new Error(`Unknown type: ${chain}`);
      }
    },
    [
      sourceApi,
      sourceChain,
      sourceIsApiReady,
      sourceSS58Format,
      targetApi,
      targetChain,
      targetIsApiReady,
      targetSS58Format
    ]
  );

  const getSS58PrefixByChain = (chain: string) => {
    switch (chain) {
      case GENERIC:
        return GENERIC_SUBSTRATE_PREFIX;
      case targetChain:
        return targetSS58Format;
      case sourceChain:
        return sourceSS58Format;
      default:
        throw new Error(`Unknown type: ${chain}`);
    }
  };

  const getChainBySS58Prefix = (prefix: string) => {
    const intPrefix: number = parseInt(prefix, 10);
    switch (intPrefix) {
      case GENERIC_SUBSTRATE_PREFIX:
        return GENERIC;
      case targetSS58Format:
        return targetChain;
      case sourceSS58Format:
        return sourceChain;
      default:
        return '';
    }
  };

  return { getValuesByChain, getChainBySS58Prefix, getSS58PrefixByChain };
};

export default useChainGetters;
