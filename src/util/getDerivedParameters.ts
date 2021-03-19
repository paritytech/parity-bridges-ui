// Copyright 2019-2020 @paritytech/bridge-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { chainsConfigs } from './substrateProviders';
const getDerivedParameters = (chain: string) => {
  const { ss58Formats, accountDerivations, bridgeIds } = chainsConfigs;
  const SS58Format = ss58Formats[chain];
  const accountDerivation = accountDerivations[chain];
  const bridgeId = bridgeIds[chain];

  return { SS58Format, accountDerivation, bridgeId };
};

export default getDerivedParameters;
