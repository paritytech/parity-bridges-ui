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

import { hexToU8a, isHex, u8aToHex } from '@polkadot/util';
import { useEffect, useState } from 'react';
import { useAccountContext } from '../../contexts/AccountContextProvider';
import { useSourceTarget } from '../../contexts/SourceTargetContextProvider';
import useLoadingApi from '../connections/useLoadingApi';
import { TransactionState, TransactionTypes } from '../../types/transactionTypes';
import logger from '../../util/logger';
import { useGUIContext } from '../../contexts/GUIContextProvider';

interface TransactionFunction {
  call: Uint8Array | null;
  weight: number | null;
}

export default function useTransactionType(transactionState: TransactionState): TransactionFunction {
  const { areApiReady } = useLoadingApi();
  const {
    targetChainDetails: {
      apiConnection: { api: targetApi }
    }
  } = useSourceTarget();
  const { action } = useGUIContext();
  const { account } = useAccountContext();
  const { receiverAddress, transferAmount, remarkInput, customCallInput, weightInput } = transactionState;

  const [values, setValues] = useState<TransactionFunction>({
    call: null,
    weight: null
  });

  useEffect(() => {
    async function getValues() {
      let weight: number = 0;
      let call: Uint8Array | null = null;

      if (account) {
        switch (action) {
          case TransactionTypes.REMARK:
            call = (await targetApi.tx.system.remark(remarkInput)).toU8a();
            logger.info(`system::remark: ${u8aToHex(call)}`);
            // TODO [#121] Figure out what the extra bytes are about
            call = call.slice(2);
            weight = (await targetApi.tx.system.remark(remarkInput).paymentInfo(account)).weight.toNumber();
            break;
          case TransactionTypes.TRANSFER:
            if (receiverAddress) {
              call = (await targetApi.tx.balances.transfer(receiverAddress, transferAmount || 0)).toU8a();
              logger.info(`balances::transfer: ${u8aToHex(call)}`);
              // TODO [#121] Figure out what the extra bytes are about
              call = call.slice(2);
              weight = (
                await targetApi.tx.balances.transfer(receiverAddress, transferAmount || 0).paymentInfo(account)
              ).weight.toNumber();
            }
            break;
          case TransactionTypes.CUSTOM:
            if (customCallInput) {
              call = isHex(customCallInput) ? hexToU8a(customCallInput.toString()) : null;
              weight = parseInt(weightInput!);
            }

            break;
          default:
            throw new Error(`Unknown type: ${action}`);
        }
        setValues({ call, weight });
      }
    }

    if (areApiReady) {
      getValues();
    }
  }, [
    account,
    action,
    areApiReady,
    customCallInput,
    receiverAddress,
    remarkInput,
    targetApi.tx.balances,
    targetApi.tx.system,
    transferAmount,
    weightInput
  ]);

  return values;
}
