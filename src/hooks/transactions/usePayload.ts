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
import { useAccountContext } from '../../contexts/AccountContextProvider';
import { useCallback } from 'react';
import { useApiCallsContext } from '../../contexts/ApiCallsContextProvider';
import { useSourceTarget } from '../../contexts/SourceTargetContextProvider';
import { TransactionActionCreators } from '../../actions/transactionActions';
import { useUpdateTransactionContext } from '../../contexts/TransactionContext';
import useDispatchGenericCall from '../api/useDispatchGenericCall';
import logger from '../../util/logger';
import type { InterfaceTypes } from '@polkadot/types/types';

interface Input {
  call: Uint8Array | null;
  weight: number | null;
}

export const usePayload = ({ call, weight }: Input) => {
  const { createType } = useApiCallsContext();
  const {
    sourceChainDetails: { chain: sourceChain },
    targetChainDetails: {
      apiConnection: { api: targetApi }
    }
  } = useSourceTarget();
  const { dispatchTransaction } = useUpdateTransactionContext();
  const { account } = useAccountContext();

  const payloadCallback = useCallback(() => {
    if (!account || !call || !weight) {
      return null;
    }

    const payload = {
      call: compactAddLength(call!),
      origin: {
        SourceAccount: account!.addressRaw
      },
      spec_version: targetApi.consts.system.version.specVersion.toNumber(),
      weight
    };
    const payloadType = createType(sourceChain as keyof InterfaceTypes, 'OutboundPayload', payload);
    logger.info(`OutboundPayload: ${JSON.stringify(payload)}`);
    logger.info(`OutboundPayload.toHex(): ${payloadType.toHex()}`);
    return payload;
  }, [account, call, createType, sourceChain, targetApi, weight]);

  const dispatch = useCallback(
    (error: string | null, data: any) => dispatchTransaction(TransactionActionCreators.setPayload(error, data)),
    [dispatchTransaction]
  );

  const { execute } = useDispatchGenericCall({
    call: payloadCallback,
    dispatch
  });

  return execute;
};

export default usePayload;
