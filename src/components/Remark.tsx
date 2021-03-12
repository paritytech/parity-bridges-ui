// Copyright 2019-2020 @paritytech/bridge-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import Keyring from '@polkadot/keyring';
import { Codec } from '@polkadot/types/types';
import { u8aToHex } from '@polkadot/util';
import React, { useState } from 'react';
import { Button, Container, Input } from 'semantic-ui-react';
import styled from 'styled-components';

import { useApiSourcePromiseContext } from '../contexts/ApiPromiseSourceContext';
import { useApiTargetPromiseContext } from '../contexts/ApiPromiseTargetContext';
import useLaneId from '../hooks/useLaneId';
import useLoadingApi from '../hooks/useLoadingApi';
interface Props {
  className?: string;
  targetChain: string;
}

const Remark = ({ className, targetChain }: Props) => {
  const { api: sourceApi } = useApiSourcePromiseContext();
  const { api: targetApi } = useApiTargetPromiseContext();
  const [isExecuting, setIsExecuting] = useState(false);

  const areApiReady = useLoadingApi();
  const [remarkInput, setRemarkInput] = useState('0x');
  const lane_id = useLaneId();

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRemarkInput(event.target.value);
  };

  async function sendMessageRemark() {
    if (isExecuting) {
      return false;
    }
    setIsExecuting(true);
    const keyring = new Keyring({ type: 'sr25519' });
    const account = keyring.addFromUri('//Alice');

    const remarkCall = await targetApi.tx.system.remark(remarkInput);
    const remarkInfo = await sourceApi.tx.system.remark(remarkInput).paymentInfo(account);
    const weight = remarkInfo.weight.toNumber();

    const call = remarkCall.toU8a();

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
    await bridgeMessage.signAndSend(account, { nonce: -1 });
    setIsExecuting(false);
  }

  if (!areApiReady) {
    return null;
  }

  return (
    <Container className={className}>
      <Input onChange={onChange} value={remarkInput} />
      <Button disabled={isExecuting} onClick={sendMessageRemark}>
        Send Remark
      </Button>
    </Container>
  );
};

export default styled(Remark)`
  display: flex !important;
  justify-content: center !important;
`;
