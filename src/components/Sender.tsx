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
import { makeStyles } from '@material-ui/core/styles';
import { encodeAddress } from '@polkadot/util-crypto';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { useSourceTarget } from '../contexts/SourceTargetContextProvider';
import useAccounts from '../hooks/useAccounts';
import useReceiver from '../hooks/useReceiver';
import { Account as AccountType } from '../types/accountTypes';
import formatAccounts from '../util/formatAccounts';
import getChainSS58 from '../util/getSS58';
import Account from './Account';
import SubHeader from './SubHeader';

interface Props {
  className?: string;
}

const useStyles = makeStyles(() => ({
  row: {
    minWidth: '100%',
    margin: '10px 0'
  }
}));

const Sender = ({ className }: Props) => {
  const classes = useStyles();
  const [chains, setChains] = useState<Array<string[]>>([]);
  const { account, accounts, derivedAccount, setCurrentAccount } = useAccounts();
  const {
    sourceChainDetails: { sourceChain },
    targetChainDetails: { targetChain }
  } = useSourceTarget();
  const { setReceiver } = useReceiver();

  useEffect(() => {
    if (!chains.length) {
      setChains([
        [sourceChain, targetChain],
        [targetChain, sourceChain]
      ]);
    }
  }, [chains.length, sourceChain, targetChain]);

  const value = account ? encodeAddress(account.address, getChainSS58(sourceChain)) : '';

  const onChange = (value: string, chain: string) => {
    setCurrentAccount(value, chain);
    setReceiver(null);
  };

  const renderAccounts = (chains: string[]) => {
    const [source, target] = chains;
    const formatedAccounts = formatAccounts(accounts, source);
    const items = formatedAccounts.map(({ text, value, key }: any) => (
      <MenuItem
        key={key}
        value={value}
        onClick={() => {
          onChange(value, source);
        }}
      >
        <div className={classes.row}>
          <Account accountName={text} value={value} chain={source} />
          <Account accountName={text} value={value} isDerived fromSender chain={target} />
        </div>
      </MenuItem>
    ));
    return [<SubHeader key={source} chain={source} />, items];
  };

  const getName = (account: AccountType) => (account!.meta.name as string).toLocaleUpperCase();

  const AccountSelected = () => {
    if (account) {
      const text = getName(account);
      return <Account accountName={text} value={value} chain={sourceChain} />;
    }
    return null;
  };

  return (
    <Container className={className}>
      <InputLabel className="label" id="demo-simple-select-label">
        {sourceChain} Account
      </InputLabel>
      <div className="senderSelect">
        <FormControl className="formControl">
          <Select
            value={value}
            name="name"
            inputProps={{ disableUnderline: true }}
            renderValue={(): React.ReactNode => <AccountSelected />}
          >
            {chains.map((chain) => renderAccounts(chain))}
          </Select>
        </FormControl>
      </div>

      <div className="derivedAccount">
        {derivedAccount && (
          <Account accountName={getName(account)} value={derivedAccount} isDerived chain={targetChain} />
        )}
      </div>
    </Container>
  );
};

export default styled(Sender)`
  margin: 40px 0;
  border: 1px solid;
  border-radius: 5px;
  width: 700px;
  padding-left: 0;
  .label {
    padding: 5px;
  }
  .senderSelect {
    min-height: 40px;
    width: 700px;
  }
  .formControl {
    min-height: 40px;
    width: 700px;
  }
  .derivedAccount {
    min-height: 40px;
    padding: 10px;
  }
  .chainSelect {
    font-size: 18px;
    color: blue !important;
  }
`;
