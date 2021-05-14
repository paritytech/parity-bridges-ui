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

import { MenuItem, Select } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { encodeAddress } from '@polkadot/util-crypto';
import React, { useEffect, useState } from 'react';

import { useSourceTarget } from '../contexts/SourceTargetContextProvider';
import useAccounts from '../hooks/useAccounts';
import useReceiver from '../hooks/useReceiver';
import { Account as AccountType } from '../types/accountTypes';
import formatAccounts from '../util/formatAccounts';
import Account from './Account';
import AccountDisplay, { AddressKind } from './AccountDisplay';
import { SelectLabel, styleAccountCompanion } from '../components';
import useChainGetters from '../hooks/useChainGetters';

// TDOO replace MUI Select with MUI Popover it wraps around or Autocomplete to have more control over appearance

const useStyles = makeStyles((theme) => ({
  networkHeading: {
    padding: theme.spacing(2),
    paddingBottom: 0,
    borderTop: `1px solid ${theme.palette.divider}`,
    ...theme.typography.overline,
    color: theme.palette.text.hint,
    '&:first-child': {
      paddingTop: 0,
      border: 'none'
    }
  },
  selectAccountMainItem: {
    display: 'block',
    paddingTop: theme.spacing(),
    paddingBottom: theme.spacing(),
    paddingLeft: theme.spacing(1.75)
  },
  accountMain: {
    '& .MuiSelect-select': {
      padding: theme.spacing(1.25),
      paddingTop: theme.spacing(0.5),
      paddingRight: theme.spacing(3),
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: theme.spacing(1.5),
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0
    }
  },
  accountCompanion: {
    ...styleAccountCompanion(theme)
  }
}));

const Sender = () => {
  const classes = useStyles();
  const [chains, setChains] = useState<Array<string[]>>([]);
  const { account, accounts, derivedAccount, setCurrentAccount } = useAccounts();
  const {
    sourceChainDetails: {
      sourceChain,
      sourceConfigs: { ss58Format }
    },
    targetChainDetails: { targetChain }
  } = useSourceTarget();
  const { setReceiver } = useReceiver();
  const { getValuesByChain } = useChainGetters();

  useEffect(() => {
    if (!chains.length) {
      setChains([
        [sourceChain, targetChain],
        [targetChain, sourceChain]
      ]);
    }
  }, [chains.length, sourceChain, targetChain]);

  const value = account ? encodeAddress(account.address, ss58Format) : 'init';

  const onChange = (value: string, chain: string) => {
    setCurrentAccount(value, chain);
    setReceiver(null);
  };

  const renderAccounts = (chains: string[]) => {
    const [source, target] = chains;
    const { ss58Format } = getValuesByChain(source);
    const formatedAccounts = formatAccounts(accounts, ss58Format);
    const items = formatedAccounts.map(({ text, value, key }: any) => (
      <MenuItem
        className={classes.selectAccountMainItem}
        key={key}
        value={value}
        onClick={() => {
          onChange(value, source);
        }}
      >
        <Account friendlyName={text} value={value} chain={source} />
        <Account friendlyName={text} value={value} chain={target} isDerived hideAddress />
      </MenuItem>
    ));
    return [
      <div className={classes.networkHeading} key={source}>
        {source}
      </div>,
      items
    ];
  };

  const getName = (account: AccountType) => (account!.meta.name as string).toLocaleUpperCase();

  const AccountSelected = () => {
    if (account) {
      const text = getName(account);
      return <Account friendlyName={text} value={value} chain={sourceChain} />;
    }
    return <AccountDisplay friendlyName="Select sender account" hideAddress />;
  };

  return (
    <>
      <Select
        disableUnderline
        fullWidth
        className={classes.accountMain}
        value={value}
        renderValue={(): React.ReactNode => (
          <>
            <SelectLabel>Sender</SelectLabel>
            <AccountSelected />
          </>
        )}
      >
        {chains.map((chain) => renderAccounts(chain))}
      </Select>
      <div className={classes.accountCompanion}>
        {derivedAccount ? (
          <Account
            friendlyName={getName(account)}
            value={value}
            chain={targetChain}
            isDerived
            hideAddress
            withTooltip
          />
        ) : (
          <AccountDisplay friendlyName="Sender" addressKind={AddressKind.COMPANION} hideAddress />
        )}
      </div>
    </>
  );
};

export default Sender;
