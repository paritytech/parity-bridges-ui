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

import type { KeyringPair } from '@polkadot/keyring/types';
import React from 'react';
import { Container, Dropdown } from 'semantic-ui-react';
import styled from 'styled-components';

import { useSourceTarget } from '../contexts/SourceTargetContextProvider';
import useAccounts from '../hooks/useAccounts';

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

  const onChange = (evt: any, { value }: any) => {
    setCurrentAccount(value);
  };

  return (
    <Container className={className}>
      <p>{sourceChain}</p>
      <Dropdown
        value={value}
        onChange={onChange}
        placeholder="Select Account"
        fluid
        selection
        options={formatOptions(accounts)}
      />
      <p>{derivedAccount && `Derived account on ${targetChain}: ${derivedAccount}`}</p>
    </Container>
  );
};

export default styled(Accounts)``;
