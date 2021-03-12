// Copyright 2019-2020 @paritytech/bridge-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { useEffect, useState } from 'react';

import { useApiSourcePromiseContext } from '../contexts/ApiPromiseSourceContext';
import { useApiTargetPromiseContext } from '../contexts/ApiPromiseTargetContext';

export default function useLoadingApi(): boolean {
  const { isApiReady: isSourceApiReady } = useApiSourcePromiseContext();
  const { isApiReady: isTargetApiReady } = useApiTargetPromiseContext();

  const [areReady, setAreReady] = useState(false);

  useEffect(() => {
    setAreReady(isSourceApiReady && isTargetApiReady);
  }, [isSourceApiReady, isTargetApiReady]);

  return areReady;
}
