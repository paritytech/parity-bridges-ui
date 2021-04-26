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

import { Container, InputBase } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { useState } from 'react';

import { AccountActionCreators } from '../actions/accountActions';
import { useUpdateAccountContext } from '../contexts/AccountContextProvider';
import { useSourceTarget } from '../contexts/SourceTargetContextProvider';
import useApiBalance from '../hooks/useApiBalance';
import useBalance from '../hooks/useBalance';
import useReceiver from '../hooks/useReceiver';
import AccountIdenticon from './AccountIdenticon';

const useStyles = makeStyles(() => ({
  container: {
    minWidth: '100%'
  }
}));

function ReceiverInput() {
  const classes = useStyles();
  const [addressInput, setAddresInput] = useState('');
  const [formatFound, setFormatFound] = useState('');
  const [error, setError] = useState('');

  const [showBalance, setShowBalance] = useState(false);

  const { setReceiver, validateAccount } = useReceiver();
  const { dispatchAccount } = useUpdateAccountContext();

  const { api, address } = useApiBalance(addressInput, formatFound, false);
  const state = useBalance(api, address, true);

  const {
    targetChainDetails: { targetChain }
  } = useSourceTarget();

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const receiver = event.target.value;
    dispatchAccount(AccountActionCreators.setGenericAccount(null));
    dispatchAccount(AccountActionCreators.setDerivedAccount(null));
    setAddresInput(receiver);
    setShowBalance(false);
    setError('');
    if (!receiver) {
      return;
    }

    const { formattedAccount, formatFound } = validateAccount(receiver)!;
    setFormatFound(formatFound);
    if (formatFound === 'INCORRECT_FORMAT') {
      setError('Invalid address.');
      return;
    }

    if (formatFound === 'GENERIC') {
      dispatchAccount(AccountActionCreators.setGenericAccount(receiver));
      return;
    }

    if (formatFound === targetChain) {
      setReceiver(formattedAccount);
    } else {
      dispatchAccount(AccountActionCreators.setDerivedAccount(formattedAccount));
      setReceiver(receiver);
    }

    setShowBalance(true);
  };

  return (
    <Container className={classes.container}>
      <div className="input">
        {showBalance && <AccountIdenticon address={addressInput} />}
        <InputBase fullWidth onChange={onChange} value={addressInput} />
        <p>{showBalance && state && state.formattedBalance}</p>
      </div>
      <div>
        <p>{error && error}</p>
      </div>
    </Container>
  );
}

export default ReceiverInput;
