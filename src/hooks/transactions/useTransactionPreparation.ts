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

import { compactAddLength } from '@polkadot/util';
import { useEffect, useState } from 'react';
import { useAccountContext } from '../../contexts/AccountContextProvider';
import { useSourceTarget } from '../../contexts/SourceTargetContextProvider';
import useLoadingApi from '../connections/useLoadingApi';
import useTransactionType from './useTransactionType';
import logger from '../../util/logger';
import { useApiCallsContext } from '../../contexts/ApiCallsContextProvider';
import { useEstimateFee } from './useEstimateFee';

interface Props {
  input: string;
  type: string;
  weightInput?: string;
  isValidCall?: boolean;
}

interface FeeAndPayload {
  payload: any;
}

export default function useTransactionPreparation({
  input,
  type,
  weightInput,
  isValidCall = true
}: Props): FeeAndPayload {
  const { areApiReady } = useLoadingApi();

  const {
    sourceChainDetails: { chain: sourceChain }
  } = useSourceTarget();
  const { account } = useAccountContext();

  const [payload, setPayload] = useState<null | {}>(null);
  const { call, weight } = useTransactionType({ input, type, weightInput });

  const { createType } = useApiCallsContext();
  const calculateFee = useEstimateFee();

  useEffect(() => {
    const asyncCalculateFee = async () => {
      await calculateFee(payload);
    };
    if (areApiReady && payload) {
      asyncCalculateFee();
    }
  }, [areApiReady, calculateFee, payload]);

  useEffect(() => {
    if (!(isValidCall && account && call && weight)) {
      return;
    }

    const payload = {
      call: compactAddLength(call),
      origin: {
        SourceAccount: account.addressRaw
      },
      // TODO [#122] This must not be hardcoded.
      spec_version: 1,
      weight
    };
    // @ts-ignore
    const payloadType = createType(sourceChain, 'OutboundPayload', payload);
    logger.info(`OutboundPayload: ${JSON.stringify(payload)}`);
    logger.info(`OutboundPayload.toHex(): ${payloadType.toHex()}`);
    setPayload(payload);
  }, [account, call, isValidCall, type, weight, createType, sourceChain]);

  return {
    payload
  };
}
