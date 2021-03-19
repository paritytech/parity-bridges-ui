// Copyright 2019-2020 @paritytech/bridge-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SignerOptions } from '@polkadot/api/types';
import { web3FromSource } from '@polkadot/extension-dapp';
import type { KeyringPair } from '@polkadot/keyring/types';
import { Codec } from '@polkadot/types/types';
import { u8aToHex } from '@polkadot/util';

import { useAccountContext } from '../contexts/AccountContextProvider';
import { useApiSourcePromiseContext } from '../contexts/ApiPromiseSourceContext';
import { useApiTargetPromiseContext } from '../contexts/ApiPromiseTargetContext';
import { useSourceTarget } from '../contexts/SourceTargetContextProvider';
import useLaneId from '../hooks/useLaneId';

function useSendMessage({ isExecuting, callback, input }) {
  const { api: sourceApi } = useApiSourcePromiseContext();
  const { api: targetApi } = useApiTargetPromiseContext();
  const lane_id = useLaneId();
  const { targetChain } = useSourceTarget();
  const { account, receiverAddress } = useAccountContext();

  const sendLaneMessage = async () => {
    try {
      if (isExecuting || !account || !receiverAddress) {
        return;
      }
      callback(true);

      const transferCall = await targetApi.tx.balances.transfer(receiverAddress, input);
      const transferInfo = await sourceApi.tx.balances.transfer(receiverAddress, input).paymentInfo(account);
      const weight = transferInfo.weight.toNumber();

      const call = transferCall.toU8a();

      const payload = {
        call,
        origin: {
          SourceAccount: account.addressRaw
        },
        spec_version: 1,
        weight
      };

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
      const estimatedFee = estimatedFeeType.toString();

      const bridgeMessage = sourceApi.tx[`bridge${targetChain}MessageLane`].sendMessage(lane_id, payload, estimatedFee);
      const options: Partial<SignerOptions> = {
        nonce: -1
      };
      let sourceAccount: string | KeyringPair = account;
      if (account.meta.isInjected) {
        const injector = await web3FromSource(account.meta.source as string);
        options.signer = injector.signer;
        sourceAccount = account.address;
      }
      await bridgeMessage.signAndSend(sourceAccount, { ...options });
    } catch (e) {
      throw new Error(e);
      console.error(e);
    } finally {
      callback();
    }
  };

  return sendLaneMessage;
}

export default useSendMessage;
