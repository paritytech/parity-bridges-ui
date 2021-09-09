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
      configs: { ss58Format: sourceSS58Format, logoUrl: sourceLogoUrl }
    },
    targetChainDetails: {
      apiConnection: { api: targetApi, isApiReady: targetIsApiReady },
      chain: targetChain,
      configs: { ss58Format: targetSS58Format, logoUrl: targetLogoUrl }
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
            substrateValues: getSubstrateDynamicNames(targetChain),
            logoUrl: sourceLogoUrl
          };
        case targetChain:
          return {
            ss58Format: targetSS58Format,
            api: targetApi,
            isApiReady: targetIsApiReady,
            substrateValues: getSubstrateDynamicNames(sourceChain),
            logoUrl: targetLogoUrl
          };
        default:
          throw new Error(`Unknown type: ${chain}`);
      }
    },
    [
      sourceApi,
      sourceChain,
      sourceIsApiReady,
      sourceLogoUrl,
      sourceSS58Format,
      targetApi,
      targetChain,
      targetIsApiReady,
      targetLogoUrl,
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

  return { getValuesByChain, getSS58PrefixByChain };
};

export default useChainGetters;
