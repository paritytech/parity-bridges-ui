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
import AccountDisplay, { AddressKind } from './AccountDisplay';
import GenericAccount from './GenericAccount';
import shortenItem from '../util/shortenItem';

const useStyles = makeStyles((theme) => ({
  accountHelper: {
    marginTop: -1,
    padding: theme.spacing(0.5),
    paddingLeft: theme.spacing(1.25),
    paddingRight: theme.spacing(3),
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.spacing(1.5),
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0
  }
}));

const ReceiverDerivedAccount = () => {
  const classes = useStyles();
  const {
    genericReceiverAccount,
    derivedReceiverAccount,
    receiverAddress,
    unformattedReceiverAddress
  } = useTransactionContext();

  const {
    targetChainDetails: { targetChain }
  } = useSourceTarget();

  if (genericReceiverAccount) {
    return <GenericAccount value={genericReceiverAccount} />;
  }

  if (derivedReceiverAccount) {
    const shortUnformattedReceiver = shortenItem(unformattedReceiverAddress || '');
    return (
      <div className={classes.accountHelper}>
        <Account
          accountName={shortUnformattedReceiver}
          value={receiverAddress!}
          chain={targetChain}
          isDerived
          hideAddress
        />
      </div>
    );
  } else if (!receiverAddress) {
    return (
      <div className={classes.accountHelper}>
        <AccountDisplay />
      </div>
    );
  }

  return (
    <div className={classes.accountHelper}>
      <AccountDisplay address={receiverAddress!} addressKind={AddressKind.NATIVE} derived />
    </div>
  );
};

export default ReceiverDerivedAccount;
