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

import { Box, Card, makeStyles, Typography } from '@material-ui/core';
import React from 'react';

import { Step, TransanctionStatus } from '../types/transactionTypes';
import { ButtonSwitchMode } from './Buttons';
import { IconTxStatus } from './Icons';

interface Props {
  steps: Array<Step>;
  transaction: TransanctionStatus;
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
    }
  }
}));

export const TransactionDisplay = ({ transaction, steps }: Props) => {
  const classes = useStyles();
  if (!steps.length) return null;

  return (
    <>
      <ButtonSwitchMode disabled> Payload</ButtonSwitchMode>
      <ButtonSwitchMode color="primary"> Receipt</ButtonSwitchMode>
      <ButtonSwitchMode disabled> Human</ButtonSwitchMode>
      <Card elevation={24} className={classes.card}>
        <Box mb={1} className="header" component="p">
          <IconTxStatus status={transaction.status} /> {transaction.type} {transaction.sourceChain} {'->'}{' '}
          {transaction.targetChain}
        </Box>
        {steps.map(({ chainType, label, onChain, status }, idx) => (
          <p key={idx}>
            <IconTxStatus status={status} /> {chainType}: {label}
            {onChain && (
              <Box ml={1} pt={0.25} pb={0.25} pl={0.5} pr={0.5} component="span" border={1} borderRadius={6}>
                <Typography component="span" variant="subtitle2">
                  {onChain}
                </Typography>
              </Box>
            )}
          </p>
        ))}
      </Card>
    </>
  );
};
