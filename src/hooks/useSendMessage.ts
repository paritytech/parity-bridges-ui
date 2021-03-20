// Copyright 2019-2020 @paritytech/bridge-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SignerOptions } from '@polkadot/api/types';
import { web3FromSource } from '@polkadot/extension-dapp';
import type { KeyringPair } from '@polkadot/keyring/types';

import { useAccountContext } from '../contexts/AccountContextProvider';
import { useApiSourcePromiseContext } from '../contexts/ApiPromiseSourceContext';
import { useSourceTarget } from '../contexts/SourceTargetContextProvider';
import useLaneId from '../hooks/useLaneId';

interface Message {
  successfull: string;
  error: string;
}
interface Props {
  isRunning: boolean;
  setIsRunning: (status: boolean) => void;
  setExecutionStatus: (message: string) => void;
  message: Message;
  input: string;
  estimatedFee: string | null;
  payload: any; // to build proper typescript payload type.
}

function useSendMessage({ isRunning, setIsRunning, setExecutionStatus, message, estimatedFee, payload }: Props) {
  const { api: sourceApi } = useApiSourcePromiseContext();

  const lane_id = useLaneId();
  const { targetChain } = useSourceTarget();
  const { account } = useAccountContext();

  const sendLaneMessage = async () => {
    try {
      if (!account || isRunning) {
        return;
      }
      setIsRunning(true);

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
      setExecutionStatus(message.successfull);
    } catch (e) {
      setExecutionStatus(message.error);
      console.log(e);
    } finally {
      setIsRunning(false);
    }
  };

  return sendLaneMessage;
}

export default useSendMessage;
