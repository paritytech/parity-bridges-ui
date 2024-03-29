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

import React, { useState, useCallback, useEffect } from 'react';
import cx from 'classnames';
import { Accordion, AccordionSummary, AccordionDetails, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { TransactionStatusType, TransactionStatusEnum } from '../types/transactionTypes';
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
  expanded: boolean;
  selected?: boolean;
}

const useStyles = makeStyles((theme) => ({
  header: {
    minWidth: '100%'
  },
  selectedBorder: {
    border: '1px solid',
    borderColor: theme.palette.primary.main
  },
  accordion: {
    marginTop: theme.spacing(2)
  }
}));

const TransactionContainer = ({ transaction, expanded, selected = false }: Props) => {
  const classes = useStyles();
  const {
    payloadHex,
    transactionDisplayPayload,
    sourceChain,
    targetChain,
    sourceAccount,
    companionAccount,
    senderName,
    transferAmount,
    type,
    status,
    steps,
    receiverAddress
  } = transaction;
  const [accordionExpanded, setAccordionExpanded] = useState(expanded);

  const onChange = useCallback(() => setAccordionExpanded(!accordionExpanded), [accordionExpanded]);

  useEffect(() => {
    if (status === TransactionStatusEnum.COMPLETED) {
      setAccordionExpanded(false);
    }
  }, [status]);

  return (
    <Accordion
      expanded={accordionExpanded}
      onChange={onChange}
      className={cx(classes.accordion, selected ? classes.selectedBorder : '')}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <div className={classes.header}>
          <TransactionHeader
            type={type}
            status={status}
            sourceChain={sourceChain}
            targetChain={targetChain}
            transferAmount={transferAmount}
          />
        </div>
      </AccordionSummary>
      <AccordionDetails>
        <Box component="div" width="100%">
          <TransactionAccounts
            senderName={senderName}
            sourceAccount={sourceAccount ? sourceAccount : undefined}
            senderCompanionAccount={companionAccount ? companionAccount : undefined}
            receiverAddress={receiverAddress ? receiverAddress : undefined}
            type={type}
          />

          <TransactionSwitchTab payloadHex={payloadHex} transactionDisplayPayload={transactionDisplayPayload}>
            <TransactionReceipt steps={steps} />
          </TransactionSwitchTab>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default TransactionContainer;
