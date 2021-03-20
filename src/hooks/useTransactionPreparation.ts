// Copyright 2019-2020 @paritytech/bridge-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { Codec } from '@polkadot/types/types';
import { u8aToHex } from '@polkadot/util';
import { useEffect, useState } from 'react';

import TransactionActions from '../actions/transactionActions';
import { useAccountContext } from '../contexts/AccountContextProvider';
import { useApiSourcePromiseContext } from '../contexts/ApiPromiseSourceContext';
import { useApiTargetPromiseContext } from '../contexts/ApiPromiseTargetContext';
import { useSourceTarget } from '../contexts/SourceTargetContextProvider';
import { useUpdateTransactionContext } from '../contexts/TransactionContext';
import useLaneId from '../hooks/useLaneId';
import useLoadingApi from '../hooks/useLoadingApi';

interface Props {
  input: string;
}

interface FeeAndPayload {
  payload: any;
}

export default function useTransactionPreparation({ input }: Props): FeeAndPayload {
  const areApiReady = useLoadingApi();
  const { api: sourceApi } = useApiSourcePromiseContext();
  const { api: targetApi } = useApiTargetPromiseContext();
  const lane_id = useLaneId();
  const { targetChain } = useSourceTarget();
  const { account, receiverAddress } = useAccountContext();

  const [call, setCall] = useState<Uint8Array | null>(null);
  const [weight, setWeight] = useState<number | null>(null);
  const [payload, setPayload] = useState({});
  const { dispatchTransaction } = useUpdateTransactionContext();

  useEffect(() => {
    async function makeTransferCall() {
      if (receiverAddress) {
        const transferCall = await targetApi.tx.balances.transfer(receiverAddress, input);
        setCall(transferCall.toU8a());
      }
    }
    if (areApiReady) {
      makeTransferCall();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areApiReady, input, receiverAddress]);

  useEffect(() => {
    async function getWeight() {
      if (account && receiverAddress) {
        const transferInfo = await sourceApi.tx.balances.transfer(receiverAddress, input).paymentInfo(account);
        setWeight(transferInfo.weight.toNumber());
      }
    }
    if (areApiReady) {
      getWeight();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, areApiReady, input, receiverAddress]);

  useEffect(() => {
    async function calculateFee() {
      // Ignoring custom types missed for TS for now.
      // Need to apply: https://polkadot.js.org/docs/api/start/typescript.user
      // @ts-ignore
      const payloadType = sourceApi.registry.createType('OutboundPayload', payload);
      // @ts-ignore
      const messageFeeType = sourceApi.registry.createType('MessageFeeData', {
        lane_id,
        payload: u8aToHex(payloadType.toU8a())
      });

      const estimatedFeeCall = await sourceApi.rpc.state.call<Codec>(
        `To${targetChain}OutboundLaneApi_estimate_message_delivery_and_dispatch_fee`,
        u8aToHex(messageFeeType.toU8a())
      );

      // @ts-ignore
      const estimatedFeeType = sourceApi.registry.createType('Option<Balance>', estimatedFeeCall);
      const fee = estimatedFeeType.toString();
      dispatchTransaction({ payload: { estimatedFee: fee }, type: TransactionActions.SET_ESTIMATED_FEE });
    }
    if (areApiReady) {
      calculateFee();
    }
  }, [lane_id, payload, sourceApi.registry, sourceApi.rpc.state, targetChain, areApiReady, dispatchTransaction]);

  useEffect(() => {
    if (account) {
      setPayload({
        call,
        origin: {
          SourceAccount: account.addressRaw
        },
        spec_version: 1,
        weight
      });
    }
  }, [account, call, weight]);

  return {
    payload
  };
}
