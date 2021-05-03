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
import moment from 'moment';

import { MessageActionsCreators } from '../actions/messageActions';
import { TransactionActionCreators } from '../actions/transactionActions';
import { useAccountContext } from '../contexts/AccountContextProvider';
import { useUpdateMessageContext } from '../contexts/MessageContext';
import { useSourceTarget } from '../contexts/SourceTargetContextProvider';
import { useTransactionContext, useUpdateTransactionContext } from '../contexts/TransactionContext';
import useLaneId from '../hooks/useLaneId';
import useTransactionPreparation from '../hooks/useTransactionPreparation';
import { TransactionStatusEnum, TransactionTypes } from '../types/transactionTypes';
import getSubstrateDynamicNames from '../util/getSubstrateDynamicNames';
import logger from '../util/logger';

interface Props {
  isValidCall?: boolean;
  isRunning: boolean;
  setIsRunning: (status: boolean) => void;
  input: string;
  type: string;
  weightInput?: string;
}

function useSendMessage({ isRunning, isValidCall, setIsRunning, input, type, weightInput }: Props) {
  const { estimatedFee, receiverAddress } = useTransactionContext();
  const { dispatchTransaction } = useUpdateTransactionContext();
  const laneId = useLaneId();
  const {
    sourceChainDetails: {
      sourceApiConnection: { api: sourceApi },
      sourceChain
    },
    targetChainDetails: { targetChain }
  } = useSourceTarget();
  const { account } = useAccountContext();
  const { payload } = useTransactionPreparation({ input, isValidCall, type, weightInput });
  const { dispatchMessage } = useUpdateMessageContext();

  const sendLaneMessage = async () => {
    if (!account || isRunning) {
      return;
    }
    const id = moment().format('x');
    setIsRunning(true);
    return makeCall(id);
  };

  const makeCall = async (id: string) => {
    try {
      if (!account || isRunning) {
        return;
      }

      const { bridgedMessages } = getSubstrateDynamicNames(targetChain);
      const bridgeMessage = sourceApi.tx[bridgedMessages].sendMessage(laneId, payload, estimatedFee);
      logger.info('bridge::sendMessage', bridgeMessage.toHex());
      const options: Partial<SignerOptions> = {
        nonce: -1
      };
      let sourceAccount: string | KeyringPair = account;
      if (account.meta.isInjected) {
        const injector = await web3FromSource(account.meta.source as string);
        options.signer = injector.signer;
        sourceAccount = account.address;
      }
      const unsub = await bridgeMessage.signAndSend(sourceAccount, { ...options }, ({ events = [], status }) => {
        if (status.isReady) {
          dispatchTransaction(
            TransactionActionCreators.createTransactionStatus({
              block: null,
              blockHash: null,
              id,
              input,
              messageNonce: null,
              receiverAddress,
              sourceAccount: account.address,
              sourceChain,
              status: TransactionStatusEnum.CREATED,
              targetChain,
              type
            })
          );
        }
        if (status.isBroadcast) {
          dispatchMessage(MessageActionsCreators.triggerInfoMessage({ message: 'Transaction was broadcasted' }));
        }
        if (status.isInBlock) {
          events.forEach(({ event: { data, method } }) => {
            if (method.toString() === 'MessageAccepted') {
              const messageNonce = data.toArray()[1].toString();
              sourceApi.rpc.chain
                .getBlock(status.asInBlock)
                .then((res) => {
                  const block = res.block.header.number.toString();
                  dispatchTransaction(
                    TransactionActionCreators.updateTransactionStatus(
                      {
                        block,
                        blockHash: status.asInBlock.toString(),
                        messageNonce,
                        status: TransactionStatusEnum.IN_PROGRESS
                      },
                      id
                    )
                  );
                })
                .catch((e) => {
                  logger.error(e.message);
                  throw new Error('Issue reading block information.');
                });
            }
          });
        }
        if (status.isFinalized) {
          logger.info(`Transaction included at blockHash ${status.asFinalized}`);
          unsub();
        }
      });
    } catch (e) {
      dispatchMessage(MessageActionsCreators.triggerErrorMessage({ message: e.message }));
      logger.error(e.message);
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
      case TransactionTypes.CUSTOM:
        return isRunning || !account || !input || !weightInput || !isValidCall;
        break;
      default:
        throw new Error(`Unknown type: ${type}`);
    }
  };

  return { isButtonDisabled, sendLaneMessage };
}

export default useSendMessage;
