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

import { Box, Card, makeStyles, Typography } from '@material-ui/core';
import { ButtonSwitchMode } from './Buttons';
import { IconTxStatus } from './Icons';

import { useSourceTarget } from '../contexts/SourceTargetContextProvider';
import { Step, TransactionStatusEnum } from '../types/transactionTypes';

interface Props {
  type?: string;
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

const TransactionStatusMock = ({ type }: Props) => {
  const classes = useStyles();
  const [steps, setSteps] = useState<Array<Step>>([]);

  const {
    sourceChainDetails: { chain: sourceChain },
    targetChainDetails: { chain: targetChain }
  } = useSourceTarget();

  useEffect(() => {
    setSteps([
      {
        chainType: sourceChain,
        label: 'Include message in block',
        labelOnChain: '',
        status: TransactionStatusEnum.NOT_STARTED
      },
      {
        chainType: sourceChain,
        label: 'Finalise block',
        status: TransactionStatusEnum.NOT_STARTED
      },
      {
        chainType: targetChain,
        label: 'Relay block',
        status: TransactionStatusEnum.NOT_STARTED
      },
      {
        chainType: targetChain,
        label: 'Deliver message',
        labelOnChain: '',
        status: TransactionStatusEnum.NOT_STARTED
      },
      {
        chainType: targetChain,
        label: 'Finalise message in target block',
        labelOnChain: '',
        status: TransactionStatusEnum.NOT_STARTED
      },
      {
        chainType: sourceChain,
        label: 'Confirm delivery',
        status: TransactionStatusEnum.NOT_STARTED
      }
    ]);
  }, [sourceChain, targetChain]);

  return (
    <>
      <ButtonSwitchMode disabled> Payload</ButtonSwitchMode>
      <ButtonSwitchMode color="primary"> Receipt</ButtonSwitchMode>
      <ButtonSwitchMode disabled> Human</ButtonSwitchMode>
      <Card elevation={24} className={classes.card}>
        <Box className="header" component="p">
          <IconTxStatus status={TransactionStatusEnum.NOT_STARTED} /> {type} {sourceChain} {'->'} {targetChain}
        </Box>
        {steps.map(({ chainType, label, labelOnChain, status }, idx) => (
          <p key={idx}>
            <IconTxStatus status={status} /> {chainType}: {label}&nbsp;
            {labelOnChain && (
              <Box pt={0.25} pb={0.25} pl={0.5} pr={0.5} component="span" border={1} borderRadius={6}>
                <Typography component="span" variant="subtitle2">
                  {labelOnChain}
                </Typography>
              </Box>
            )}
          </p>
        ))}
      </Card>
    </>
  );
};

export default TransactionStatusMock;
