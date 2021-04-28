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
import { makeStyles } from '@material-ui/core/styles';
import { useSourceTarget } from '../contexts/SourceTargetContextProvider';
import { useTransactionContext } from '../contexts/TransactionContext';
import Account from './Account';
import GenericAddress from './GenericAccount';

const useStyles = makeStyles(() => ({
  container: {
    minWidth: '100%',
    padding: '0',
    marginBottom: '20px',
    display: 'flex',
    flexDirection: 'column'
  },
  derived: {
    padding: '10px',
    minHeight: '50px',
    minWidth: '100%',
    border: '1px solid grey',
    borderRadius: '0 0 5px 5px',
    borderTop: 'none'
  },
  input: {
    minWidth: '100%'
  }
}));

const ReceiverDerivedAccount = () => {
  const classes = useStyles();
  const { genericReceiverAccount, derivedReceiverAccount } = useTransactionContext();

  const {
    targetChainDetails: { targetChain }
  } = useSourceTarget();

  if (genericReceiverAccount) {
    return <GenericAddress value={genericReceiverAccount} />;
  }
  if (derivedReceiverAccount) {
    return (
      <div className={classes.derived}>
        <Account value={derivedReceiverAccount} chain={targetChain} isDerived />
      </div>
    );
  }
  return null;
};

export default ReceiverDerivedAccount;
