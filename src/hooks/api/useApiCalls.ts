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
import { Text, Bytes } from '@polkadot/types';
import { Codec } from '@polkadot/types/types';
import { ApiCallsContextType } from '../../types/apiCallsTypes';
import useChainGetters from '../chain/useChainGetters';
import { useSourceTarget } from '../../contexts/SourceTargetContextProvider';
import { TransactionActionCreators } from '../../actions/transactionActions';
import { web3FromSource } from '@polkadot/extension-dapp';
import { KeyringPair } from '@polkadot/keyring/types';
import { SignerOptions } from '@polkadot/api/types';
import { TransactionStatusEnum, TransactionTypes } from '../../types/transactionTypes';
import { MessageActionsCreators } from '../../actions/messageActions';
import logger from '../../util/logger';
import { formatBalance } from '@polkadot/util';
import { getBridgeId } from '../../util/getConfigs';
import getDeriveAccount from '../../util/getDeriveAccount';
import { useKeyringContext } from '../../contexts/KeyringContextProvider';
import { ApiPromise } from '@polkadot/api';
import { encodeAddress } from '@polkadot/util-crypto';
import { AccountActionCreators } from '../../actions/accountActions';
import { BalanceState } from '../../types/accountTypes';
import { createEmptyInternalSteps } from '../../util/transactions';

const useApiCalls = (): ApiCallsContextType => {
  const { sourceChainDetails, targetChainDetails } = useSourceTarget();
  const {
    apiConnection: { api: sourceApi },
    chain: sourceChain
  } = sourceChainDetails;
  const { keyringPairs, keyringPairsReady } = useKeyringContext();
  const { getValuesByChain } = useChainGetters();

  const createType = useCallback(
    (chain, type, data) => {
      const { api } = getValuesByChain(chain);
      return api.registry.createType(type, data);
    },
    [getValuesByChain]
  );

  const stateCall = useCallback(
    (chain: string, methodName: string | Text, data: string | Uint8Array | Bytes, at) => {
      const { api } = getValuesByChain(chain);

      const params: [string | Text, string | Uint8Array | Bytes] = [methodName, data];
      if (at) {
        params.push(at);
      }

      return api.rpc.state.call<Codec>(...params);
    },
    [getValuesByChain]
  );

  const internalTransfer = useCallback(
    async (dispatchers, transfersData) => {
      const { dispatchTransaction, dispatchMessage } = dispatchers;
      const { receiverAddress, transferAmount, account } = transfersData;
      const type = TransactionTypes.INTERNAL_TRANSFER;

      const id = Date.now().toString();
      dispatchTransaction(TransactionActionCreators.setTransactionRunning(true));

      try {
        const transfer = sourceApi.tx.balances.transfer(receiverAddress, transferAmount);
        const options: Partial<SignerOptions> = {
          nonce: -1
        };
        let sourceAccount: string | KeyringPair = account;
        if (account.meta.isInjected) {
          const injector = await web3FromSource(account.meta.source as string);
          options.signer = injector.signer;
          sourceAccount = account.address;
        }

        const transactionDisplayPayload = {
          sourceAccount: account?.address || sourceAccount,
          transferAmount: transferAmount.toNumber(),
          receiverAddress
        };

        const unsub = await transfer.signAndSend(sourceAccount, { ...options }, async ({ status }) => {
          const steps = createEmptyInternalSteps(sourceChain);
          if (status.isReady) {
            dispatchTransaction(
              TransactionActionCreators.createTransactionStatus({
                block: null,
                blockHash: null,
                deliveryBlock: null,
                id,
                input: transferAmount,
                messageNonce: null,
                receiverAddress,
                sourceAccount: account.address,
                sourceChain,
                status: TransactionStatusEnum.IN_PROGRESS,
                targetChain: '',
                type,
                transactionDisplayPayload,
                payloadHex: transfer.toHex(),
                steps
              })
            );
          }

          if (status.isBroadcast) {
            dispatchMessage(MessageActionsCreators.triggerInfoMessage({ message: 'Transaction was broadcasted' }));
            dispatchTransaction(TransactionActionCreators.reset());
          }

          if (status.isInBlock) {
            try {
              const res = await sourceApi.rpc.chain.getBlock(status.asInBlock);
              const block = res.block.header.number.toString();
              dispatchTransaction(
                TransactionActionCreators.updateTransactionStatus(
                  {
                    block,
                    blockHash: status.asInBlock.toString()
                  },
                  id
                )
              );
            } catch (e) {
              logger.error(e.message);
              throw new Error('Issue reading block information.');
            }
          }

          if (status.isFinalized) {
            dispatchTransaction(
              TransactionActionCreators.updateTransactionStatus(
                {
                  status: TransactionStatusEnum.FINALIZED
                },
                id
              )
            );
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
    [sourceApi.rpc.chain, sourceApi.tx.balances, sourceChain]
  );

  const updateSenderAccountsInformation = useCallback(
    async (dispatchAccount) => {
      const formatBalanceAddress = (data: any, api: ApiPromise): BalanceState => {
        return {
          chainTokens: data.registry.chainTokens[0],
          formattedBalance: formatBalance(data.free, {
            decimals: api.registry.chainDecimals[0],
            withUnit: api.registry.chainTokens[0],
            withSi: true
          }),
          free: data.free
        };
      };

      if (!keyringPairsReady || !keyringPairs.length) {
        return {};
      }

      const getAccountInformation = async (sourceRole: any, targetRole: any) => {
        const {
          apiConnection: { api: sourceApi },
          chain: sourceChain,
          configs: sourceConfigs
        } = sourceRole;
        const {
          apiConnection: { api: targetApi },
          configs: targetConfigs
        } = targetRole;

        const accounts = await Promise.all(
          keyringPairs.map(async (accountKeyring) => {
            const { address, meta } = accountKeyring;
            const sourceAddress = encodeAddress(address, sourceConfigs.ss58Format);
            const toDerive = {
              ss58Format: targetConfigs.ss58Format,
              address: sourceAddress || '',
              bridgeId: getBridgeId(targetApi, sourceChain)
            };
            const { data } = await sourceApi.query.system.account(sourceAddress);
            const sourceBalance = formatBalanceAddress(data, sourceApi);

            const companionAddress = getDeriveAccount(toDerive);
            const { data: dataCompanion } = await targetApi.query.system.account(companionAddress);
            const targetBalance = formatBalanceAddress(dataCompanion, targetApi);

            const name = (meta.name as string).toLocaleUpperCase();

            return {
              sourceChain,
              sourceAccount: { address: sourceAddress, accountKeyring, balance: sourceBalance, name },
              companionAccount: { address: companionAddress, balance: targetBalance, name }
            };
          })
        );

        return accounts;
      };

      const sourceAddresses = await getAccountInformation(sourceChainDetails, targetChainDetails);
      const targetAddresses = await getAccountInformation(targetChainDetails, sourceChainDetails);

      dispatchAccount(AccountActionCreators.setDisplaySenderAccounts([...sourceAddresses, ...targetAddresses]));
    },
    [keyringPairs, keyringPairsReady, sourceChainDetails, targetChainDetails]
  );

  return { createType, stateCall, internalTransfer, updateSenderAccountsInformation };
};

export default useApiCalls;
