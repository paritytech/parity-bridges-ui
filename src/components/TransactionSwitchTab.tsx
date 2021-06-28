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
import { TransactionDisplayPayload } from '../types/transactionTypes';
import { SwitchTabType } from '../types/transactionTypes';

export interface TransactionDisplayProps {
  size?: 'sm';
}
interface Props {
  transactionDisplayProps?: TransactionDisplayProps;
  children: JSX.Element | JSX.Element[];
  payloadHex: string | null;
  TransactionDisplayPayload: TransactionDisplayPayload | null;
}

const TransactionSwitchTab = ({ transactionDisplayProps, children, payloadHex, TransactionDisplayPayload }: Props) => {
  const [tab, setTab] = useState(SwitchTabType.RECEIPT);

  const getColorByState = (value: string) => (value === tab ? 'primary' : 'secondary');

  return (
    <>
      <Box mt={2}>
        <ButtonSwitchMode color={getColorByState(SwitchTabType.PAYLOAD)} onClick={() => setTab(SwitchTabType.PAYLOAD)}>
          Payload
        </ButtonSwitchMode>
        <ButtonSwitchMode color={getColorByState(SwitchTabType.RECEIPT)} onClick={() => setTab(SwitchTabType.RECEIPT)}>
          Receipt
        </ButtonSwitchMode>
        <ButtonSwitchMode color={getColorByState(SwitchTabType.DECODED)} onClick={() => setTab(SwitchTabType.DECODED)}>
          Decoded
        </ButtonSwitchMode>
      </Box>
      {tab === SwitchTabType.RECEIPT && children}
      <TransactionPayload
        tab={tab}
        transactionDisplayProps={transactionDisplayProps}
        payloadHex={payloadHex}
        TransactionDisplayPayload={TransactionDisplayPayload}
      />
    </>
  );
};

export default TransactionSwitchTab;
