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

import { encodeAddress } from '@polkadot/util-crypto';
import React, { useState } from 'react';
import { useUpdateTransactionContext } from '../contexts/TransactionContext';
import { TransactionActionCreators } from '../actions/transactionActions';
import { makeStyles } from '@material-ui/core/styles';
import { useSourceTarget } from '../contexts/SourceTargetContextProvider';
import useBalance from '../hooks/useBalance';
import getDeriveAccount from '../util/getDeriveAccount';
import shorterItem from '../util/shortenItem';
import { getBridgeId } from '../util/getConfigs';
import AccountDisplay, { AddressKind } from './AccountDisplay';
import { Paper } from '@material-ui/core';
import { styleAccountCompanion } from '.';

interface Props {
  value: string;
  isDerived?: boolean;
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

const NATIVE = 'NATIVE';
const COMPANION = 'COMPANION';

const GenericAccount = ({ value }: Props) => {
  const [selected, setSelected] = useState('');
  const classes = useStyles();

  const { dispatchTransaction } = useUpdateTransactionContext();
  const {
    sourceChainDetails: { sourceConfigs },
    targetChainDetails: {
      targetConfigs,
      targetApiConnection: { api: targetApi }
    }
  } = useSourceTarget();

  const nativeAddress = encodeAddress(value, targetConfigs.ss58Format);
  const nativeState = useBalance(targetApi, nativeAddress, true);

  const companionAddress = getDeriveAccount({
    ss58Format: targetConfigs.ss58Format,
    address: value,
    bridgeId: getBridgeId(targetConfigs, sourceConfigs.chainName)
  });
  const companionState = useBalance(targetApi, companionAddress, true);

  const looseHelperAccount = () => {
    setSelected('');
    dispatchTransaction(TransactionActionCreators.setReceiverAddress(null));
  };

  const setNativeAsTarget = () => {
    if (selected) {
      looseHelperAccount();
      return;
    }
    setSelected(NATIVE);
    dispatchTransaction(TransactionActionCreators.setReceiverAddress(nativeAddress));
  };

  const setCompanionAsTarget = () => {
    if (selected) {
      looseHelperAccount();
      return;
    }
    setSelected(COMPANION);
    dispatchTransaction(TransactionActionCreators.setReceiverAddress(companionAddress));
  };

  const shortGenericAddress = shorterItem(value);
  return (
    <Paper elevation={!selected ? 23 : 0}>
      {(!selected || selected === NATIVE) && (
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
      {(!selected || selected === COMPANION) && (
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
