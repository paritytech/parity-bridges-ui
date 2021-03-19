// Copyright 2019-2020 @paritytech/bridge-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { useEffect, useState } from 'react';

import { useApiSourcePromiseContext } from '../contexts/ApiPromiseSourceContext';
import { useApiTargetPromiseContext } from '../contexts/ApiPromiseTargetContext';

export default function useLoadingApi(): boolean {
  const transferInfo = await sourceApi.tx.balances.transfer(receiverAddress, input).paymentInfo(account);
  const weight = transferInfo.weight.toNumber();
}
