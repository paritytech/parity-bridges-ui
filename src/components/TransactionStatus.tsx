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

import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { TransactionStatusType } from '../types/transactionTypes';
import TransactionSwitchTab from './TransactionSwitchTab';
import TransactionReceipt from './TransactionReceipt';
import TransactionHeader from './TransactionHeader';
import TransactionAccounts from './TransactionAccounts';

export interface TransactionDisplayProps {
  size?: 'sm';
}
interface Props {
  transaction: TransactionStatusType;
  transactionDisplayProps?: TransactionDisplayProps;
}

const TransactionStatus = ({ transaction }: Props) => {
  const {
    payloadHex,
    transactionDisplayPayload,
    sourceChain,
    targetChain,
    sourceAccount,
    senderCompanionAccount,
    senderName,
    transferAmount,
    type,
    status,
    steps
  } = transaction;

  return (
    /*     <>
      <TransactionHeader
        type={type}
        status={status}
        sourceChain={sourceChain}
        targetChain={targetChain}
        senderName={senderName}
        sourceAccount={sourceAccount ? sourceAccount : undefined}
        senderCompanionAccount={senderCompanionAccount ? senderCompanionAccount : undefined}
        transferAmount={transferAmount}
      />
      <TransactionSwitchTab
        payloadHex={payloadHex}
        transactionDisplayPayload={transactionDisplayPayload}
        status={transaction.status}
      >
        <TransactionReceipt steps={transaction.steps} />
      </TransactionSwitchTab>
    </> */
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
        <TransactionHeader
          type={type}
          status={status}
          sourceChain={sourceChain}
          targetChain={targetChain}
          transferAmount={transferAmount}
        />
      </AccordionSummary>
      <AccordionDetails>
        <TransactionAccounts
          senderName={senderName}
          sourceAccount={sourceAccount ? sourceAccount : undefined}
          senderCompanionAccount={senderCompanionAccount ? senderCompanionAccount : undefined}
        />
        <TransactionSwitchTab payloadHex={payloadHex} transactionDisplayPayload={transactionDisplayPayload}>
          <TransactionReceipt steps={steps} />
        </TransactionSwitchTab>
      </AccordionDetails>
    </Accordion>
  );
};

export default TransactionStatus;
