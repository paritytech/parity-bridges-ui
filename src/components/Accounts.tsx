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

import { Container, FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import { encodeAddress } from '@polkadot/util-crypto';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { useSourceTarget } from '../contexts/SourceTargetContextProvider';
import useAccounts from '../hooks/useAccounts';
import useConnectedReceiver from '../hooks/useConnectedReceiver';
import formatAccounts from '../util/formatAccounts';
import getChainSS58 from '../util/getSS58';
import Account from './Account';
import SubHeader from './SubHeader';

interface Props {
  className?: string;
}

const Accounts = ({ className }: Props) => {
  const [chains, setChains] = useState<Array<string>>([]);
  const { account, accounts, derivedAccount, setCurrentAccount } = useAccounts();
  const {
    sourceChainDetails: { sourceChain },
    targetChainDetails: { targetChain }
  } = useSourceTarget();
  const { setConnectedReceiver } = useConnectedReceiver();

  useEffect(() => {
    if (!chains.length) {
      setChains([sourceChain, targetChain]);
    }
  }, [chains.length, sourceChain, targetChain]);

  const value = account ? encodeAddress(account.address, getChainSS58(sourceChain)) : '';

  const onChange = (value: string, chain: string) => {
    setCurrentAccount(value, chain);
    setConnectedReceiver(null);
  };
  const renderAccounts = (chain: string) => {
    const formatedAccounts = formatAccounts(accounts, chain);
    const items = formatedAccounts.map(({ text, value, key }: any) => (
      <MenuItem
        key={key}
        value={value}
        onClick={() => {
          onChange(value, chain);
        }}
      >
        <Account text={text} value={value} showDerivedBalance chain={chain} />
      </MenuItem>
    ));
    return [<SubHeader key={chain} chain={chain} />, items];
  };

  const AccountSelected = () => {
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
          name="name"
          inputProps={{
            id: 'name-native-error'
          }}
          renderValue={(): React.ReactNode => <AccountSelected />}
        >
          {chains.map((chain) => renderAccounts(chain))}
        </Select>
      </FormControl>
      {derivedAccount && (
        <div className="formControl">
          <Account text="Derived Account" value={derivedAccount} />
        </div>
      )}
    </Container>
  );
};

export default styled(Accounts)`
  margin: 40px 0;
  .formControl {
    width: 700px;
  }
  .chainSelect {
    font-size: 18px;
    color: blue !important;
  }
`;
