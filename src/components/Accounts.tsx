// Copyright 2019-2020 @paritytech/bridge-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import type { KeyringPair } from '@polkadot/keyring/types';
import React from 'react';
import { Container, Dropdown } from 'semantic-ui-react';
import styled from 'styled-components';

import AccountActions from '../actions/accountActions';
import { useAccountContext, useUpdateAccountContext } from '../contexts/AccountContextProvider';
import { useSourceTarget } from '../contexts/SourceTargetContextProvider';
import useAccounts from '../hooks/useAccounts';
import useDerivedAccount from '../hooks/useDerivedAccount';

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
  const accounts = useAccounts();
  const derivedAccount = useDerivedAccount();
  const { dispatchAccount } = useUpdateAccountContext();
  const { sourceChain, targetChain } = useSourceTarget();
  const { account: currentAccount } = useAccountContext();

  const value = currentAccount?.address || '';

  const onChange = (evt: any, { value }: any) => {
    const account = accounts.find(({ address }) => address === value);
    if (account) {
      dispatchAccount({ payload: { account }, type: AccountActions.SET_ACCOUNT });
    }
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
      {derivedAccount && (
        <p>
          Derived account on {targetChain}: {derivedAccount}
        </p>
      )}
    </Container>
  );
};

export default styled(Accounts)``;
