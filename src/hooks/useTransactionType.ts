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

import { useEffect, useState } from 'react';

import { useAccountContext } from '../contexts/AccountContextProvider';
import { useApiSourcePromiseContext } from '../contexts/ApiPromiseSourceContext';
import { useApiTargetPromiseContext } from '../contexts/ApiPromiseTargetContext';
import { useTransactionContext } from '../contexts/TransactionContext';
import useLoadingApi from '../hooks/useLoadingApi';
import { TransactionTypes } from '../types/transactionTypes';
interface TransactionFunction {
  callFunction: Function | null;
  infoFunction: Function | null;
}

interface Props {
  input: string;
  type: string;
}

export default function useTransactionType({ input, type }: Props): TransactionFunction {
  const areApiReady = useLoadingApi();
  const { api: sourceApi } = useApiSourcePromiseContext();
  const { api: targetApi } = useApiTargetPromiseContext();
  const { account } = useAccountContext();
  const { receiverAddress } = useTransactionContext();

  const [transactionFunction, setTransactionFunction] = useState<TransactionFunction>({
    callFunction: null,
    infoFunction: null
  });

  useEffect(() => {
    if (areApiReady) {
      let callFunction = null;
      let infoFunction = null;
      if (targetApi.tx.balances && sourceApi.tx.balances && receiverAddress && account) {
        switch (type) {
          case TransactionTypes.REMARK:
            if (targetApi.tx.system && sourceApi.tx.system) {
              callFunction = () => targetApi.tx.system.remark(input);
              infoFunction = () => sourceApi.tx.system.remark(input).paymentInfo(account);
            }
            break;
          case TransactionTypes.TRANSFER:
            if (receiverAddress) {
              callFunction = () => targetApi.tx.balances.transfer(receiverAddress, input);
              infoFunction = () => sourceApi.tx.balances.transfer(receiverAddress, input).paymentInfo(account);
            }
            break;
          default:
            throw new Error(`Unknown type: ${type}`);
        }
        setTransactionFunction({ callFunction, infoFunction });
      }
    }
  }, [account, areApiReady, input, receiverAddress, sourceApi, targetApi, type]);

  return transactionFunction;
}
