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

import useApiBalance from '../hooks/subscriptions/useApiBalance';
import useBalance from '../hooks/subscriptions/useBalance';
import AccountDisplay, { AddressKind, Props as AccountDisplayProps } from './AccountDisplay';

interface Props extends AccountDisplayProps {
  chain?: string | undefined;
  value: string;
}

const Account = ({ value, chain, hideAddress = false, isDerived = false, ...props }: Props) => {
  const { api, address } = useApiBalance(value, chain, isDerived);

  const state = useBalance(api, address, true);

  return (
    <>
      <AccountDisplay
        address={address}
        balance={`${state.formattedBalance} ${state.formattedBalance === '0' ? state.chainTokens : ''}`}
        addressKind={isDerived ? AddressKind.COMPANION : undefined}
        hideAddress={hideAddress}
        {...props}
      />
    </>
  );
};

export default Account;
