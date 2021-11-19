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

/* eslint-disable @typescript-eslint/no-unused-vars */

import React from 'react';
import { Box, Typography, Grid, Container, Paper } from '@material-ui/core';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import isNull from 'lodash/isNull';
import { BoxSidebar, BoxUI, ButtonExt, MenuAction, NetworkSides, NetworkStats } from '../components';
import CustomCall from '../components/CustomCall';
import Sender from '../components/Sender';
import ExtensionAccountCheck from '../components/ExtensionAccountCheck';
import Remark from '../components/Remark';
import SnackBar from '../components/SnackBar';
import Transfer from '../components/Transfer';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import Transactions from '../components/Transactions';
import { useGUIContext } from '../contexts/GUIContextProvider';
import { TransactionTypes } from '../types/transactionTypes';
import { TransactionActionCreators } from '../actions/transactionActions';
import BridgedLocalWrapper from '../components/BridgedLocalWrapper';
import { useCallback } from 'react';
import { useTransactionContext, useUpdateTransactionContext } from '../contexts/TransactionContext';

const useStyles = makeStyles((theme) => ({
  root: {
    marginLeft: 'auto',
    maxHeight: '25px'
  },
  ui: {
    minWidth: '100%',
    marginTop: 50,
    padding: theme.spacing(3),

    marginLeft: 240,
    display: 'flex',
    justifyContent: 'center',
    '& .MuiPaper-root, .MuiOutlinedInput-notchedOutline': {
      borderRadius: theme.spacing(1.5)
    },
    '& > .MuiPaper-root': {
      width: 480,
      maxWidth: '100%',
      padding: theme.spacing(2)
    }
    //padding: theme.spacing(3),
    //paddingLeft: theme.spacing(3),
    /*     transition: 'padding-left .1s',
    backgroundColor: theme.palette.background.paper,
    '&.open': {
      paddingLeft: theme.spacing(3),
      [theme.breakpoints.down('md')]: {
        paddingLeft: theme.spacing(3)
      }
    },
    '& .MuiPaper-root, .MuiOutlinedInput-notchedOutline': {
      borderRadius: theme.spacing(1.5)
    },
    '& > .MuiPaper-root': {
      width: 480,
      maxWidth: '100%',
      padding: theme.spacing(2)
    },

    marginLeft: theme.spacing(3),
    maxWidth: theme.spacing(130) */
  },
  transactions: {
    marginLeft: 100,
    minWidth: 400
  },
  form: {
    minHeight: 650,
    maxHeight: 650
  }
}));

const ActionComponents = {
  [TransactionTypes.TRANSFER]: <Transfer />,
  [TransactionTypes.INTERNAL_TRANSFER]: <Transfer />,
  [TransactionTypes.REMARK]: <Remark />,
  [TransactionTypes.CUSTOM]: <CustomCall />
};

function Main() {
  const classes = useStyles();
  const { actions, action, setAction, isBridged, setBridged } = useGUIContext();
  const { dispatchTransaction } = useUpdateTransactionContext();
  const { transactionToBeExecuted } = useTransactionContext();

  const handleOnSwitch = useCallback(
    (event: React.MouseEvent<HTMLElement>, isBridged: boolean) => {
      if (!isNull(isBridged)) {
        setBridged(isBridged);
        dispatchTransaction(
          TransactionActionCreators.setTransferType(
            isBridged ? TransactionTypes.TRANSFER : TransactionTypes.INTERNAL_TRANSFER
          )
        );
      }
    },
    [dispatchTransaction, setBridged]
  );

  return (
    <>
      <BoxSidebar>
        <div>
          <Typography variant="button" color="secondary">
            Bridges UI
          </Typography>
          <NetworkSides />
          <BridgedLocalWrapper blurred>
            <NetworkStats />
          </BridgedLocalWrapper>
        </div>
        <ButtonExt> Help & Feedback </ButtonExt>
      </BoxSidebar>

      <Container className={classes.ui}>
        {!transactionToBeExecuted ? (
          <Paper elevation={24} className={classes.form}>
            <Grid item spacing={6}>
              <Box component="div" display="flex" marginY={2} textAlign="left" width="100%">
                <MenuAction actions={actions} action={action} changeMenu={setAction} />
                {action === TransactionTypes.TRANSFER && (
                  <ToggleButtonGroup
                    size="small"
                    value={isBridged}
                    exclusive
                    onChange={handleOnSwitch}
                    classes={{ root: classes.root }}
                  >
                    <ToggleButton value={false}>Internal</ToggleButton>
                    <ToggleButton value={true}>Bridge</ToggleButton>
                  </ToggleButtonGroup>
                )}
              </Box>
              <ExtensionAccountCheck component={<Sender />} />
              <Box marginY={2} textAlign="center" width="100%">
                <ArrowDownwardIcon fontSize="large" color="primary" />
              </Box>
              <Box>
                <>{ActionComponents[action]}</>
              </Box>
            </Grid>
          </Paper>
        ) : (
          <div>Successfully Submitted</div>
        )}
        <Grid item spacing={6} className={classes.transactions}>
          <Transactions type={action} />
        </Grid>
      </Container>
    </>
  );
}

export default Main;
