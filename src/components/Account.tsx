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

import useApiBalance from '../hooks/useApiBalance';
import useBalance from '../hooks/useBalance';
import AccountDisplay from './AccountDisplay';

interface Props {
  accountName?: string;
  chain?: string | undefined;
  className?: string;
  hideAddress?: boolean;
  isDerived?: boolean;
  onClick?: () => void;
  value: string;
}

const Account = ({ accountName, value, chain, hideAddress = false, isDerived = false }: Props) => {
  const { api, address } = useApiBalance(value, chain, isDerived);

  const state = useBalance(api, address, true);

  return (
    <AccountDisplay
      friendlyName={accountName}
      address={address}
      balance={state.formattedBalance}
      addressKind={isDerived ? 'companion' : undefined}
      hideAddress={hideAddress}
    />
  );
};

export default Account;
