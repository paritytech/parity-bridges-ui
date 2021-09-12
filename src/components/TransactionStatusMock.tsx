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
import { Step, TransactionStatusEnum, TransactionTypes } from '../types/transactionTypes';
import TransactionReceipt from './TransactionReceipt';
import TransactionSwitchTab from './TransactionSwitchTab';
import { createEmptyInternalSteps, createEmptySteps } from '../util/transactions/';
import { useTransactionContext } from '../contexts/TransactionContext';
import { useGUIContext } from '../contexts/GUIContextProvider';
interface Props {
  type?: string;
}

const TransactionStatusMock = ({ type }: Props) => {
  const [steps, setSteps] = useState<Array<Step>>([]);
  const { isBridged } = useGUIContext();
  const {
    sourceChainDetails: { chain: sourceChain },
    targetChainDetails: { chain: targetChain }
  } = useSourceTarget();

  const { payloadHex, transactionDisplayPayload } = useTransactionContext();

  useEffect(() => {
    if (isBridged) {
      setSteps(createEmptySteps(sourceChain, targetChain));
    } else {
      setSteps(createEmptyInternalSteps(sourceChain));
    }
  }, [isBridged, sourceChain, targetChain]);

  return (
    <TransactionSwitchTab
      payloadHex={payloadHex}
      transactionDisplayPayload={transactionDisplayPayload}
      type={type}
      status={TransactionStatusEnum.NOT_STARTED}
      sourceChain={sourceChain}
      targetChain={targetChain}
    >
      <TransactionReceipt
        steps={steps}
        type={isBridged ? type : TransactionTypes.INTERNAL_TRANSFER}
        status={TransactionStatusEnum.NOT_STARTED}
        sourceChain={sourceChain}
        targetChain={targetChain}
      />
    </TransactionSwitchTab>
  );
};

export default TransactionStatusMock;
