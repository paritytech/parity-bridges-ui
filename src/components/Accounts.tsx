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

import Container from '@material-ui/core/Container';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import NativeSelect from '@material-ui/core/NativeSelect';
import Select from '@material-ui/core/Select';
import People from '@material-ui/icons/People';
import Star from '@material-ui/icons/Star';
import type { KeyringPair } from '@polkadot/keyring/types';
import React from 'react';
import styled from 'styled-components';

import { useSourceTarget } from '../contexts/SourceTargetContextProvider';
import useAccounts from '../hooks/useAccounts';
import Account from './Account';
import SubHeader from './SubHeader';

interface Props {
  className?: string;
}

const formatOptions = (accounts: Array<KeyringPair>) =>
  accounts.map(({ meta, address }) => ({
    icon: 'user',
    key: address,
    text: (meta.name as string).toLocaleUpperCase(),
    value: address
  }));

const Accounts = ({ className }: Props) => {
  const { account, accounts, derivedAccount, setCurrentAccount } = useAccounts();
  const {
    sourceChainDetails: { sourceChain },
    targetChainDetails: { targetChain }
  } = useSourceTarget();

  const value = account?.address || '';

  const onChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setCurrentAccount(event.target.value as string);
  };

  if (!accounts.length) {
    return null;
  }

  const formatedAccounts = formatOptions(accounts);

  const renderAccounts = ({ formatedAccounts, chain }: any) => {
    const items = formatedAccounts.map(({ text, value, key }: any) => (
      <MenuItem key={key} value={value}>
        <Account text={text} value={value} showDerivedBalance />
      </MenuItem>
    ));
    return [<SubHeader key={chain} chain={chain} />, items];
  };

  const Input = () => {
    if (account) {
      const text = (account.meta.name as string).toLocaleUpperCase();
      return <Account text={text} value={value} />;
    }
    return null;
  };

  return (
    <Container className={className}>
      <InputLabel id="demo-simple-select-label">{sourceChain} Account</InputLabel>
      <FormControl variant="outlined" className="formControl">
        <Select
          value={value}
          onChange={onChange}
          name="name"
          inputProps={{
            id: 'name-native-error'
          }}
          renderValue={(): React.ReactNode => <Input />}
        >
          {renderAccounts({ chain: sourceChain, formatedAccounts })}
        </Select>
      </FormControl>
      {derivedAccount && <Account text="Derived Account" value={derivedAccount} />}
    </Container>
  );
};

export default styled(Accounts)`
  .formControl {
    min-width: 700px;
  }
  .chainSelect {
    font-size: 18px;
    color: blue !important;
  }
`;
