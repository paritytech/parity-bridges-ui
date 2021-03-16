// Copyright 2019-2020 @paritytech/bridge-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { Container, Dropdown } from 'semantic-ui-react';
import styled from 'styled-components';

import useAccounts from '../hooks/useAccounts';
interface Props {
  className?: string;
}

const formatOptions = (accounts: Array<{ account: { name: string; address: string } }>) =>
  accounts.map(({ account: { name, address } }) => ({
    icon: 'user',
    key: address,
    text: name,
    value: address
  }));

const Accounts = ({ className }: Props) => {
  const accounts = useAccounts();
  return (
    <Container className={className}>
      <Dropdown placeholder="Select Account" fluid selection options={formatOptions(accounts)} />
      <p></p>
    </Container>
  );
};

export default styled(Accounts)``;
