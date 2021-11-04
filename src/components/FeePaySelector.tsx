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

import React, { useCallback } from 'react';
import { Typography, Select, MenuItem, makeStyles } from '@material-ui/core';
import ChainLogo from './ChainLogo';
import { PayFee } from '../types/transactionTypes';
import { useSourceTarget } from '../contexts/SourceTargetContextProvider';
import { useTransactionContext, useUpdateTransactionContext } from '../contexts/TransactionContext';
import { TransactionActionCreators } from '../actions/transactionActions';

const useStyles = makeStyles(() => ({
  container: {
    minHeight: '20px',
    display: 'flex',
    alignItems: 'center'
  }
}));

export default function FeePaySelector() {
  const classes = useStyles();
  const sourceTargetDetails = useSourceTarget();
  const { dispatchTransaction } = useUpdateTransactionContext();
  const { payFee } = useTransactionContext();

  const {
    sourceChainDetails: { chain: sourceChain },
    targetChainDetails: { chain: targetChain }
  } = sourceTargetDetails;

  const onChange = useCallback(
    (event) => {
      dispatchTransaction(TransactionActionCreators.changeDispatchFeePayChain(event.target.value));
    },
    [dispatchTransaction]
  );

  const chain = payFee === PayFee.AtSourceChain ? sourceChain : targetChain;

  return (
    <div className={classes.container}>
      <Typography variant="body1" color="secondary">
        Dispatch fee payed on:{' '}
      </Typography>
      <ChainLogo chain={chain} />

      <Select onChange={onChange} value={payFee} disableUnderline>
        <MenuItem value={PayFee.AtSourceChain}>Source Chain </MenuItem>
        <MenuItem value={PayFee.AtTargetChain}>Target Chain </MenuItem>
      </Select>
    </div>
  );
}
