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

import { SignerOptions } from '@polkadot/api/types';
import { web3FromSource } from '@polkadot/extension-dapp';
import type { KeyringPair } from '@polkadot/keyring/types';

import { useAccountContext } from '../contexts/AccountContextProvider';
import { useApiSourcePromiseContext } from '../contexts/ApiPromiseSourceContext';
import { useSourceTarget } from '../contexts/SourceTargetContextProvider';
import { useTransactionContext } from '../contexts/TransactionContext';
import useLaneId from '../hooks/useLaneId';
import useTransactionPreparation from '../hooks/useTransactionPreparation';
import { TransactionTypes } from '../types/transactionTypes';
import logger from '../util/logger';
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
  type: string;
}

function useSendMessage({ isRunning, setIsRunning, setExecutionStatus, message, input, type }: Props) {
  const { api: sourceApi } = useApiSourcePromiseContext();
  const { estimatedFee, receiverAddress } = useTransactionContext();
  const laneId = useLaneId();
  const { targetChain } = useSourceTarget();
  const { account } = useAccountContext();
  const { payload } = useTransactionPreparation({ input, type });

  const sendLaneMessage = async () => {
    try {
      if (!account || isRunning) {
        return;
      }
      setIsRunning(true);

      const bridgeMessage = sourceApi.tx[`bridge${targetChain}Messages`].sendMessage(laneId, payload, estimatedFee);
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
      logger.error(e);
    } finally {
      setIsRunning(false);
    }
  };

  const isButtonDisabled = () => {
    switch (type) {
      case TransactionTypes.REMARK:
        return isRunning || !account;
        break;
      case TransactionTypes.TRANSFER:
        return isRunning || !receiverAddress || !account;
        break;
      default:
        throw new Error(`Unknown type: ${type}`);
    }
  };

  return { isButtonDisabled, sendLaneMessage };
}

export default useSendMessage;
