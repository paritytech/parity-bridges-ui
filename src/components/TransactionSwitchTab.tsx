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

import React, { useState } from 'react';
import { Box } from '@material-ui/core';
import { ButtonSwitchMode } from './Buttons';
import TransactionPayload from './TransactionPayload';
import { DisplayPayload } from '../types/transactionTypes';
import { SwitchTabEnum } from '../types/transactionTypes';
import { useCallback } from 'react';
import { TransactionStatusEnum } from '../types/transactionTypes';

export interface TransactionDisplayProps {
  size?: 'sm';
}
interface Props {
  transactionDisplayProps?: TransactionDisplayProps;
  children: JSX.Element | JSX.Element[];
  payloadHex: string | null;
  transactionDisplayPayload: DisplayPayload | null;
  status: TransactionStatusEnum;
  type?: string;
  sourceChain: string;
  targetChain: string;
  sourceAccount: string | undefined;
  senderCompanionAccount: string | undefined;
  senderName?: string | null;
  transferAmount?: string | null | undefined;
}

const TransactionSwitchTab = ({
  transactionDisplayProps,
  children,
  payloadHex,
  transactionDisplayPayload,
  type,
  status,
  sourceChain,
  targetChain,
  sourceAccount,
  senderName,
  senderCompanionAccount,
  transferAmount
}: Props) => {
  const [tab, setTab] = useState(SwitchTabEnum.RECEIPT);

  const getColorByState = (value: string) => (value === tab ? 'primary' : 'secondary');

  const setTabCallback = useCallback((value: SwitchTabEnum) => () => setTab(value), []);

  return (
    <>
      <Box mt={2}>
        <ButtonSwitchMode
          color={getColorByState(SwitchTabEnum.PAYLOAD)}
          onClick={setTabCallback(SwitchTabEnum.PAYLOAD)}
        >
          Payload
        </ButtonSwitchMode>
        <ButtonSwitchMode
          color={getColorByState(SwitchTabEnum.RECEIPT)}
          onClick={setTabCallback(SwitchTabEnum.RECEIPT)}
        >
          Receipt
        </ButtonSwitchMode>
        <ButtonSwitchMode
          color={getColorByState(SwitchTabEnum.DECODED)}
          onClick={setTabCallback(SwitchTabEnum.DECODED)}
        >
          Decoded
        </ButtonSwitchMode>
      </Box>
      {tab === SwitchTabEnum.RECEIPT && children}
      <TransactionPayload
        tab={tab}
        type={type}
        status={status}
        transactionDisplayProps={transactionDisplayProps}
        payloadHex={payloadHex}
        transactionDisplayPayload={transactionDisplayPayload}
        sourceChain={sourceChain}
        targetChain={targetChain}
        sourceAccount={sourceAccount}
        senderName={senderName}
        senderCompanionAccount={senderCompanionAccount}
        transferAmount={transferAmount}
      />
    </>
  );
};

export default TransactionSwitchTab;
