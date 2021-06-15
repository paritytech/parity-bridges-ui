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
import AccountDisplay from './AccountDisplay';
import { useGenericAccount } from '../hooks/accounts/useGenericAccount';
import { AddressKind } from '../types/accountTypes';
import { Paper } from '@material-ui/core';
import { styleAccountCompanion } from '.';

interface Props {
  value: string;
}

const useStyles = makeStyles((theme) => ({
  accountCompanion: {
    ...styleAccountCompanion(theme),
    borderRadius: 0,
    '&:last-child': {
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
      borderRadius: theme.spacing(1.5)
    }
  },
  selectAccountCompanionItem: {
    '&:hover': {
      cursor: 'pointer',
      backgroundColor: theme.palette.secondary.light
    }
  }
}));

const GenericAccount = ({ value }: Props) => {
  const classes = useStyles();
  const {
    selected,
    shortGenericAddress,
    companionAddress,
    setNativeAsTarget,
    setCompanionAsTarget,
    nativeAddress,
    nativeState,
    companionState
  } = useGenericAccount(value);

  return (
    <Paper elevation={!selected ? 23 : 0}>
      {(!selected || selected === AddressKind.NATIVE) && (
        <AccountDisplay
          className={`${classes.accountCompanion} ${classes.selectAccountCompanionItem}`}
          onClick={setNativeAsTarget}
          address={nativeAddress}
          addressKind={AddressKind.NATIVE}
          balance={nativeState.formattedBalance}
          friendlyName={shortGenericAddress}
          hideAddress
          withTooltip
        />
      )}
      {(!selected || selected === AddressKind.COMPANION) && (
        <AccountDisplay
          className={`${classes.accountCompanion} ${classes.selectAccountCompanionItem}`}
          onClick={setCompanionAsTarget}
          address={companionAddress}
          addressKind={AddressKind.COMPANION}
          balance={companionState.formattedBalance}
          friendlyName={shortGenericAddress}
          hideAddress
          withTooltip
        />
      )}
    </Paper>
  );
};

export default GenericAccount;
