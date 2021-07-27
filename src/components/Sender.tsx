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
import cx from 'classnames';
import { MenuItem, Select } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { encodeAddress } from '@polkadot/util-crypto';
import { useSourceTarget } from '../contexts/SourceTargetContextProvider';
import useAccounts from '../hooks/accounts/useAccounts';
import useLoadingApi from '../hooks/connections/useLoadingApi';
import { Account as AccountType } from '../types/accountTypes';
import formatAccounts from '../util/formatAccounts';
import Account from './Account';
import AccountDisplay from './AccountDisplay';
import { AddressKind } from '../types/accountTypes';
import { SelectLabel, styleAccountCompanion } from '../components';
import useChainGetters from '../hooks/chain/useChainGetters';
import BridgedLocalWrapper from '../components/BridgedLocalWrapper';
import { useGUIContext } from '../contexts/GUIContextProvider';
import { useAccountContext } from '../contexts/AccountContextProvider';
import isNull from 'lodash/isNull';

// TODO replace MUI Select with MUI Popover it wraps around or Autocomplete to have more control over appearance

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
      borderRadius: theme.spacing(1.5)
    }
  },
  bridgedBottomBorders: {
    '& .MuiSelect-select': {
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0
    }
  },
  accountCompanion: {
    ...styleAccountCompanion(theme)
  }
}));

const Sender = () => {
  const { isBridged } = useGUIContext();
  const classes = useStyles();
  const [chains, setChains] = useState<Array<string[]>>([]);
  const { setCurrentAccount } = useAccounts();
  const {
    account,
    accounts,
    companionAccount,
    senderAccountBalance,
    senderCompanionAccountBalance
  } = useAccountContext();
  const {
    sourceChainDetails: {
      chain: sourceChain,
      configs: { ss58Format }
    },
    targetChainDetails: { chain: targetChain }
  } = useSourceTarget();
  const { getSS58PrefixByChain } = useChainGetters();

  const { areApiReady } = useLoadingApi();

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
  };

  const renderAccounts = (chains: string[]) => {
    const [source, target] = chains;
    const ss58Format = getSS58PrefixByChain(source);
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
        <BridgedLocalWrapper>
          <Account friendlyName={text} value={value} chain={target} isDerived hideAddress />
        </BridgedLocalWrapper>
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
      return (
        <AccountDisplay
          friendlyName={text}
          address={account.address}
          balance={senderAccountBalance?.formattedBalance}
        />
      );
    }
    return <AccountDisplay friendlyName="Select sender account" hideAddress />;
  };

  return (
    <>
      <Select
        id="test-sender-component"
        disableUnderline
        fullWidth
        disabled={!areApiReady}
        className={cx(classes.accountMain, isBridged ? classes.bridgedBottomBorders : '')}
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
      <BridgedLocalWrapper>
        <div className={classes.accountCompanion}>
          {companionAccount && !isNull(senderCompanionAccountBalance) ? (
            <AccountDisplay
              friendlyName={getName(account)}
              address={companionAccount}
              addressKind={AddressKind.COMPANION}
              balance={senderCompanionAccountBalance!.formattedBalance}
              hideAddress
              withTooltip
            />
          ) : (
            <AccountDisplay friendlyName="Sender" addressKind={AddressKind.COMPANION} hideAddress />
          )}
        </div>
      </BridgedLocalWrapper>
    </>
  );
};

export default Sender;
