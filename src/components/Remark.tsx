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

import Keyring from '@polkadot/keyring';
import { Codec } from '@polkadot/types/types';
import { u8aToHex } from '@polkadot/util';
import React, { useState } from 'react';
import { Button, Container, Input } from 'semantic-ui-react';
import styled from 'styled-components';

import { useAccountContext } from '../contexts/AccountContextProvider';
import { useApiSourcePromiseContext } from '../contexts/ApiPromiseSourceContext';
import { useApiTargetPromiseContext } from '../contexts/ApiPromiseTargetContext';
import { useSourceTarget } from '../contexts/SourceTargetContextProvider';
import useLaneId from '../hooks/useLaneId';
import useLoadingApi from '../hooks/useLoadingApi';

interface Props {
  className?: string;
}

const Remark = ({ className }: Props) => {
  const { targetChain } = useSourceTarget();
  const { api: sourceApi } = useApiSourcePromiseContext();
  const { api: targetApi } = useApiTargetPromiseContext();
  const [isExecuting, setIsExecuting] = useState(false);

  const areApiReady = useLoadingApi();
  const [remarkInput, setRemarkInput] = useState('0x');
  const lane_id = useLaneId();
  const [executionStatus, setExecutionStatus] = useState('');
  const { account: currentAccount } = useAccountContext();

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setExecutionStatus('');
    setRemarkInput(event.target.value);
  };

  async function sendMessageRemark() {
    if (isExecuting) {
      return false;
    }
    setIsExecuting(true);

    try {
      if (!currentAccount) {
        return;
      }
      const account = currentAccount;
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
      setExecutionStatus('Remark delivered');
    } catch (e) {
      setExecutionStatus('Remark failed');

      console.error(e);
    } finally {
      setIsExecuting(false);
    }
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
      {executionStatus !== '' && (
        <div className="status">
          <p>{executionStatus}</p>
        </div>
      )}
    </Container>
  );
};

export default styled(Remark)`
  display: flex !important;
  justify-content: center !important;
`;
