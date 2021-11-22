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

import { useCallback } from 'react';
import { SignerOptions } from '@polkadot/api/types';
import type { SignedBlock } from '@polkadot/types/interfaces';
import { web3FromSource } from '@polkadot/extension-dapp';
import type { KeyringPair } from '@polkadot/keyring/types';
import type { InterfaceTypes } from '@polkadot/types/types';
import { MessageActionsCreators } from '../../actions/messageActions';
import { TransactionActionCreators } from '../../actions/transactionActions';
import { useAccountContext } from '../../contexts/AccountContextProvider';
import { useUpdateMessageContext } from '../../contexts/MessageContext';
import { useSourceTarget } from '../../contexts/SourceTargetContextProvider';
import { useTransactionContext, useUpdateTransactionContext } from '../../contexts/TransactionContext';
import useLaneId from './useLaneId';
import { TransactionStatusEnum, TransactionTypes } from '../../types/transactionTypes';
import { getSubstrateDynamicNames } from '../../util/getSubstrateDynamicNames';
import { createEmptySteps, getFormattedAmount, getTransactionDisplayPayload } from '../../util/transactions/';
import logger from '../../util/logger';
import useApiCalls from '../api/useApiCalls';
import { TX_CANCELLED } from '../../constants';
import { getName } from '../../util/accounts';

interface Props {
  input: string;
  type: TransactionTypes;
  weightInput?: string | null;
}

function useSendMessage({ input, type }: Props) {
  const { estimatedSourceFee, receiverAddress, payload, transferAmount } = useTransactionContext();
  const { dispatchTransaction } = useUpdateTransactionContext();
  const laneId = useLaneId();
  const sourceTargetDetails = useSourceTarget();
  const {
    sourceChainDetails: {
      apiConnection: { api: sourceApi },
      chain: sourceChain
    },
    targetChainDetails: {
      chain: targetChain,
      apiConnection: { api: targetApi }
    }
  } = sourceTargetDetails;
  const { account, companionAccount } = useAccountContext();
  const { createType } = useApiCalls();
  const { dispatchMessage } = useUpdateMessageContext();

  const makeCall = useCallback(
    async (id: string) => {
      try {
        if (!account || !payload) {
          return;
        }

        const payloadType = createType(sourceChain as keyof InterfaceTypes, 'OutboundPayload', payload);
        const payloadHex = payloadType.toHex();

        const { bridgedMessages } = getSubstrateDynamicNames(targetChain);
        const bridgeMessage = sourceApi.tx[bridgedMessages].sendMessage(laneId, payload, estimatedSourceFee);
        logger.info(`bridge::sendMessage ${bridgeMessage.toHex()}`);
        const options: Partial<SignerOptions> = {
          nonce: -1
        };
        let sourceAccount: string | KeyringPair = account;
        if (account.meta.isInjected) {
          const injector = await web3FromSource(account.meta.source as string);
          options.signer = injector.signer;
          sourceAccount = account.address;
        }

        const { transactionDisplayPayload } = getTransactionDisplayPayload({
          payload,
          account: account.address,
          createType,
          sourceTargetDetails
        });

        const formattedTransferAmount = getFormattedAmount(targetApi, transferAmount, type);

        const signed = await bridgeMessage.signAsync(sourceAccount, { ...options });

        dispatchTransaction(TransactionActionCreators.setTransactionToBeExecuted(false));
        dispatchTransaction(TransactionActionCreators.setTransactionRunning(true));

        const unsub = await signed.send(({ events = [], status }) => {
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
                senderName: getName(account),
                companionAccount,
                sourceChain,
                transferAmount: formattedTransferAmount,
                status: TransactionStatusEnum.CREATED,
                targetChain,
                type,
                payloadHex,
                transactionDisplayPayload,
                deliveryBlock: null,
                steps: createEmptySteps(sourceChain, targetChain)
              })
            );
          }

          if (status.isBroadcast) {
            dispatchMessage(MessageActionsCreators.triggerInfoMessage({ message: 'Transaction was broadcasted' }));
            dispatchTransaction(TransactionActionCreators.reset());
          }

          if (status.isInBlock) {
            dispatchTransaction(TransactionActionCreators.setTransactionRunning(false));
            events.forEach(({ event: { data, method } }) => {
              if (method.toString() === 'MessageAccepted') {
                const messageNonce = data.toArray()[1].toString();
                (sourceApi.rpc.chain.getBlock(status.asInBlock) as Promise<SignedBlock>)
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
            logger.info(`Transaction finalized at blockHash ${status.asFinalized}`);

            unsub();
          }
        });
      } catch (e) {
        if (e instanceof Error) {
          logger.error(e.message);
          if (e.message === TX_CANCELLED) {
            dispatchTransaction(TransactionActionCreators.enableTxButton());
            dispatchTransaction(TransactionActionCreators.setTransactionToBeExecuted(false));
            dispatchTransaction(TransactionActionCreators.setTransactionRunning(false));
            return dispatchMessage(
              MessageActionsCreators.triggerErrorMessage({ message: 'Transaction was cancelled from the extension.' })
            );
          }
          dispatchMessage(MessageActionsCreators.triggerErrorMessage({ message: e.message }));
        }
      } finally {
        dispatchTransaction(TransactionActionCreators.setTransactionToBeExecuted(false));
      }
    },
    [
      account,
      companionAccount,
      createType,
      dispatchMessage,
      dispatchTransaction,
      estimatedSourceFee,
      input,
      laneId,
      payload,
      receiverAddress,
      sourceApi.rpc.chain,
      sourceApi.tx,
      sourceChain,
      sourceTargetDetails,
      targetApi,
      targetChain,
      transferAmount,
      type
    ]
  );

  const sendLaneMessage = useCallback(() => {
    const id = Date.now().toString();

    dispatchTransaction(TransactionActionCreators.setTransactionToBeExecuted(true));

    return makeCall(id);
  }, [dispatchTransaction, makeCall]);

  return sendLaneMessage;
}

export default useSendMessage;
