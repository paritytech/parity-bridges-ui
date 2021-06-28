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
import ReactJson from 'react-json-view';
import { SwitchSwitchTab } from '../types/transactionTypes';

import { DisplayPayload } from '../types/transactionTypes';

export interface TransactionDisplayProps {
  size?: 'sm';
}

interface Props {
  transactionDisplayProps?: TransactionDisplayProps;
  tab: SwitchSwitchTab;
  payloadHex: string | null;
  displayPayload: DisplayPayload | null;
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
    },
    wordBreak: 'break-word'
  }
}));

const TransactionPayload = ({ tab, transactionDisplayProps, payloadHex, displayPayload }: Props) => {
  const classes = useStyles();

  if (tab === SwitchSwitchTab.RECEIPT) {
    return null;
  }

  return (
    <Card elevation={transactionDisplayProps?.size === 'sm' ? 23 : 24} className={classes.card}>
      {tab === SwitchSwitchTab.PAYLOAD && payloadHex}
      {tab === SwitchSwitchTab.DECODED && displayPayload && (
        <ReactJson src={displayPayload} enableClipboard collapsed={1} name={false} />
      )}
    </Card>
  );
};

export default TransactionPayload;
