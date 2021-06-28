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
import { Card, makeStyles } from '@material-ui/core';

import { useSourceTarget } from '../contexts/SourceTargetContextProvider';
import { useTransactionContext } from '../contexts/TransactionContext';
import { SwitchSwitchTab } from '../types/transactionTypes';
import useApiCalls from '../hooks/api/useApiCalls';

export interface TransactionDisplayProps {
  size?: 'sm';
}

interface Props {
  transactionDisplayProps?: TransactionDisplayProps;
  tab: SwitchSwitchTab;
}

const useStyles = makeStyles((theme) => ({
  card: {
    '& p': {
      ...theme.typography.body2
    },
    '& svg': {
      marginBottom: '-0.2em',
      fontSize: '1.2em',
      marginRight: theme.spacing()
    },
    '& .header': {
      fontWeight: 500
    },
    '&.MuiPaper-root': {
      maxWidth: '100%',
      padding: theme.spacing(2),
      borderRadius: theme.spacing(1.5)
    }
  }
}));

const TransactionPayload = ({ tab, transactionDisplayProps }: Props) => {
  const classes = useStyles();
  const { payload } = useTransactionContext();
  const {
    sourceChainDetails: { chain: sourceChain }
  } = useSourceTarget();
  const { createType } = useApiCalls();

  //@ts-ignore
  const payloadType = createType(sourceChain, 'OutboundPayload', payload);
  const payloadHex = payloadType.toHex();
  const payloadDecoded = JSON.stringify(payload, (key, value) => {});

  if (tab === SwitchSwitchTab.PAYLOAD && payload) {
    return (
      <Card elevation={transactionDisplayProps?.size === 'sm' ? 23 : 24} className={classes.card}>
        {payloadHex}
      </Card>
    );
  }
  if (tab === SwitchSwitchTab.DECODED && payload) {
    return (
      <Card elevation={transactionDisplayProps?.size === 'sm' ? 23 : 24} className={classes.card}>
        <pre>{payloadDecoded}</pre>
      </Card>
    );
  }
  return null;
};

export default TransactionPayload;
