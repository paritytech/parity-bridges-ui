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

import React, { useEffect, useState } from 'react';

import { useSourceTarget } from '../contexts/SourceTargetContextProvider';
import { Step, TransactionStatusEnum } from '../types/transactionTypes';

import { createEmptyInternalSteps, createEmptySteps, getFormattedAmount } from '../util/transactions/';
import { useTransactionContext } from '../contexts/TransactionContext';
import { useGUIContext } from '../contexts/GUIContextProvider';
import { useAccountContext } from '../contexts/AccountContextProvider';
import { getName } from '../util/accounts';
import TransactionContainer from './TransactionContainer';
import { TransactionTypes } from '../types/transactionTypes';

interface Props {
  type: TransactionTypes;
}

const TransactionStatusMock = ({ type }: Props) => {
  const [steps, setSteps] = useState<Array<Step>>([]);
  const { isBridged } = useGUIContext();
  const {
    sourceChainDetails: { chain: sourceChain },
    targetChainDetails: {
      chain: targetChain,
      apiConnection: { api: targetApi }
    }
  } = useSourceTarget();

  const { account, companionAccount } = useAccountContext();

  const { payloadHex, transactionDisplayPayload, transferAmount, action, receiverAddress } = useTransactionContext();

  useEffect(() => {
    if (isBridged) {
      setSteps(createEmptySteps(sourceChain, targetChain));
    } else {
      setSteps(createEmptyInternalSteps(sourceChain));
    }
  }, [isBridged, sourceChain, targetChain]);

  return (
    <TransactionContainer
      transaction={{
        payloadHex,
        transactionDisplayPayload,
        status: TransactionStatusEnum.NOT_STARTED,
        sourceChain,
        targetChain,
        sourceAccount: account && account.address,
        senderCompanionAccount: companionAccount,
        senderName: account && getName(account),
        transferAmount: getFormattedAmount(targetApi, transferAmount, action),
        type,
        steps,
        receiverAddress,
        deliveryBlock: null
      }}
      expanded
    />
  );
};

export default TransactionStatusMock;
