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
import AccountDisplay from './AccountDisplay';
import { AddressKind } from '../types/accountTypes';
import GenericAccount from './GenericAccount';
import shortenItem from '../util/shortenItem';
import { styleAccountCompanion } from './Inputs';

const useStyles = makeStyles((theme) => ({
  accountCompanion: {
    ...styleAccountCompanion(theme)
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
    targetChainDetails: { chain: targetChain }
  } = useSourceTarget();

  if (genericReceiverAccount) {
    return <GenericAccount value={genericReceiverAccount} />;
  }

  if (derivedReceiverAccount) {
    const shortUnformattedReceiver = shortenItem(unformattedReceiverAddress || '');
    return (
      <div className={classes.accountCompanion}>
        <Account
          friendlyName={shortUnformattedReceiver}
          value={receiverAddress!}
          chain={targetChain}
          id={`test-${AddressKind.COMPANION}-input`.toLowerCase()}
          isDerived
          hideAddress
          withTooltip
        />
      </div>
    );
  }

  if (!receiverAddress) {
    return (
      <div className={classes.accountCompanion}>
        <AccountDisplay />
      </div>
    );
  }

  return (
    <div className={classes.accountCompanion}>
      <AccountDisplay
        address={receiverAddress!}
        addressKind={AddressKind.NATIVE}
        id={`test-${AddressKind.NATIVE}-input`.toLowerCase()}
        withTooltip
      />
    </div>
  );
};

export default ReceiverDerivedAccount;
