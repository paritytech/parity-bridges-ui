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
import { Codec } from '@polkadot/types/types';
import { u8aToHex } from '@polkadot/util';
import { useEffect, useState } from 'react';

import { TransactionActionCreators } from '../actions/transactionActions';
import { useAccountContext } from '../contexts/AccountContextProvider';
import { useSourceTarget } from '../contexts/SourceTargetContextProvider';
import { useUpdateTransactionContext } from '../contexts/TransactionContext';
import useLaneId from '../hooks/useLaneId';
import useLoadingApi from '../hooks/useLoadingApi';
import useTransactionType from '../hooks/useTransactionType';
import getSubstrateDynamicNames from '../util/getSubstrateDynamicNames';

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
  const areApiReady = useLoadingApi();
  const laneId = useLaneId();
  const {
    sourceChainDetails: {
      sourceApiConnection: { api: sourceApi }
    },
    targetChainDetails: { targetChain }
  } = useSourceTarget();
  const { account } = useAccountContext();

  const [payload, setPayload] = useState<null | {}>(null);
  const { call, weight } = useTransactionType({ input, type, weightInput });

  const { dispatchTransaction } = useUpdateTransactionContext();
  const { estimatedFeeMethodName } = getSubstrateDynamicNames(targetChain);

  useEffect(() => {
    const calculateFee = async () => {
      // Ignoring custom types missed for TS for now.
      // Need to apply: https://polkadot.js.org/docs/api/start/typescript.user
      // @ts-ignore
      const payloadType = sourceApi.registry.createType('OutboundPayload', payload);
      // @ts-ignore
      const messageFeeType = sourceApi.registry.createType('MessageFeeData', {
        lane_id: laneId,
        payload: u8aToHex(payloadType.toU8a())
      });

      const estimatedFeeCall = await sourceApi.rpc.state.call<Codec>(
        estimatedFeeMethodName,
        u8aToHex(messageFeeType.toU8a())
      );

      // @ts-ignore
      const estimatedFeeType = sourceApi.registry.createType('Option<Balance>', estimatedFeeCall);
      const estimatedFee = estimatedFeeType.toString();
      dispatchTransaction(TransactionActionCreators.estimateFee(estimatedFee));
    };

    if (areApiReady && payload) {
      calculateFee();
    }
  }, [
    areApiReady,
    dispatchTransaction,
    estimatedFeeMethodName,
    laneId,
    payload,
    sourceApi.registry,
    sourceApi.rpc.state,
    targetChain
  ]);

  useEffect(() => {
    const getPayload = async () => {
      if (account && call && weight) {
        const payload = {
          call,
          origin: {
            SourceAccount: account.addressRaw
          },
          spec_version: 1,
          weight
        };
        setPayload(payload);
      }
    };
    if (isValidCall) {
      getPayload();
    }
  }, [account, call, isValidCall, type, weight]);

  return {
    payload
  };
}
