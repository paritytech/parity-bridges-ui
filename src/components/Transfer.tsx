// Copyright 2019-2020 @paritytech/bridge-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { SignerOptions } from '@polkadot/api/types';
import { web3FromSource } from '@polkadot/extension-dapp';
import type { KeyringPair } from '@polkadot/keyring/types';
import { Codec } from '@polkadot/types/types';
import { u8aToHex } from '@polkadot/util';
import React, { useState } from 'react';
import { Button, Container, Grid, Input } from 'semantic-ui-react';
import styled from 'styled-components';

import AccountActions from '../actions/accountActions';
import { useAccountContext, useUpdateAccountContext } from '../contexts/AccountContextProvider';
import { useApiSourcePromiseContext } from '../contexts/ApiPromiseSourceContext';
import { useApiTargetPromiseContext } from '../contexts/ApiPromiseTargetContext';
import { useSourceTarget } from '../contexts/SourceTargetContextProvider';
import useLaneId from '../hooks/useLaneId';
import useLoadingApi from '../hooks/useLoadingApi';
import getReceiverAddress from '../util/getReceiverAddress';

interface Props {
  className?: string;
}

const Transfer = ({ className }: Props) => {
  const { targetChain } = useSourceTarget();
  const { api: sourceApi } = useApiSourcePromiseContext();
  const { api: targetApi } = useApiTargetPromiseContext();
  const [isExecuting, setIsExecuting] = useState(false);
  const areApiReady = useLoadingApi();
  const [transferInput, setTransferInput] = useState('0');
  const [receiver, setReceiver] = useState<string>('');
  const [receiverMessage, setReceiverMessage] = useState<string | null>();
  const lane_id = useLaneId();
  const [executionStatus, setExecutionStatus] = useState('');
  const { account: currentAccount, receiverAddress } = useAccountContext();
  const { dispatchAccount } = useUpdateAccountContext();

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setExecutionStatus('');
    setTransferInput(event.target.value);
  };

  const onDestinataryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setReceiver(event.target.value);
  };

  async function sendMessageTransfer() {
    if (isExecuting) {
      return false;
    }
    setIsExecuting(true);

    try {
      if (!currentAccount) {
        return;
      }
      const account = currentAccount;

      const transferCall = await targetApi.tx.balances.transfer(receiverAddress || receiver, transferInput);
      const transferInfo = await sourceApi.tx.balances.transfer(receiver, transferInput).paymentInfo(account);
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
      setExecutionStatus('Transfer delivered');
    } catch (e) {
      setExecutionStatus('Transfer failed');

      console.error(e);
    } finally {
      setIsExecuting(false);
    }
  }

  if (!areApiReady) {
    return null;
  }

  const onEnter = (e: any) => {
    if (e.key === 'Enter') {
      const receiverAddress = getReceiverAddress({ chain: targetChain, receiverAddress: receiver });
      if (receiverAddress !== receiver) {
        setReceiverMessage(`The format for the account is incorrect, funds will be sent to ${receiverAddress}`);
      }
      dispatchAccount({ payload: { receiverAddress }, type: AccountActions.SET_RECEIVER_ADDRESS });
    }
  };

  return (
    <Container className={className}>
      <Grid.Row>
        <Grid.Column>
          <label>Sender</label>
          <Input onChange={onChange} value={transferInput} />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column>
          <label>Receiver</label>
          <Input fluid onChange={onDestinataryChange} onKeyDown={onEnter} value={receiver} />
          {receiverMessage && <p>{receiverMessage}</p>}
          <Button disabled={isExecuting || !receiverAddress || !currentAccount} onClick={sendMessageTransfer}>
            Send Transfer
          </Button>
        </Grid.Column>
      </Grid.Row>

      {executionStatus !== '' && (
        <div className="status">
          <p>{executionStatus}</p>
        </div>
      )}
    </Container>
  );
};

export default styled(Transfer)``;
