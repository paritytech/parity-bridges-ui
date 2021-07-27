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
import { web3FromSource } from '@polkadot/extension-dapp';
import type { KeyringPair } from '@polkadot/keyring/types';
import type { InterfaceTypes } from '@polkadot/types/types';
import moment from 'moment';
import { MessageActionsCreators } from '../../actions/messageActions';
import { TransactionActionCreators } from '../../actions/transactionActions';
import { useAccountContext } from '../../contexts/AccountContextProvider';
import { useUpdateMessageContext } from '../../contexts/MessageContext';
import { useSourceTarget } from '../../contexts/SourceTargetContextProvider';
import { useTransactionContext, useUpdateTransactionContext } from '../../contexts/TransactionContext';
import useLaneId from './useLaneId';
import { TransactionStatusEnum } from '../../types/transactionTypes';
import { getSubstrateDynamicNames } from '../../util/getSubstrateDynamicNames';
import { getTransactionDisplayPayload } from '../../util/transactionUtils';
import logger from '../../util/logger';
import useApiCalls from '../api/useApiCalls';

interface Props {
  input: string;
  type: string;
  weightInput?: string;
}

function useSendMessage({ input, type }: Props) {
  const { estimatedFee, receiverAddress, payload } = useTransactionContext();
  const { dispatchTransaction } = useUpdateTransactionContext();
  const laneId = useLaneId();
  const sourceTargetDetails = useSourceTarget();
  const {
    sourceChainDetails: {
      apiConnection: { api: sourceApi },
      chain: sourceChain
    },
    targetChainDetails: { chain: targetChain }
  } = sourceTargetDetails;
  const { account } = useAccountContext();
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
        const bridgeMessage = sourceApi.tx[bridgedMessages].sendMessage(laneId, payload, estimatedFee);
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
                type,
                payloadHex,
                transactionDisplayPayload
              })
            );
          }

          if (status.isBroadcast) {
            dispatchMessage(MessageActionsCreators.triggerInfoMessage({ message: 'Transaction was broadcasted' }));
            dispatchTransaction(TransactionActionCreators.reset());
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
            logger.info(`Transaction finalized at blockHash ${status.asFinalized}`);

            unsub();
          }
        });
      } catch (e) {
        dispatchMessage(MessageActionsCreators.triggerErrorMessage({ message: e.message }));
        logger.error(e.message);
      } finally {
        dispatchTransaction(TransactionActionCreators.setTransactionRunning(false));
      }
    },
    [
      account,
      createType,
      dispatchMessage,
      dispatchTransaction,
      estimatedFee,
      input,
      laneId,
      payload,
      receiverAddress,
      sourceApi.rpc.chain,
      sourceApi.tx,
      sourceChain,
      sourceTargetDetails,
      targetChain,
      type
    ]
  );

  const sendLaneMessage = useCallback(() => {
    const id = moment().format('x');
    dispatchTransaction(TransactionActionCreators.setTransactionRunning(true));
    return makeCall(id);
  }, [dispatchTransaction, makeCall]);

  return sendLaneMessage;
}

export default useSendMessage;
