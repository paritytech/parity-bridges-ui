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
import { makeStyles } from '@material-ui/core/styles';
import { useAccountContext } from '../contexts/AccountContextProvider';
import ChainHeader from './ChainHeader';
import SenderDropdownItem from './SenderDropdownItem';
import useAccounts from '../hooks/accounts/useAccounts';

interface Props {
  chain: string;
  showCompanion: boolean;
  showEmpty: boolean;
  handleClose: () => void;
}

const useStyles = makeStyles(() => ({
  selectAccountMainItem: {
    display: 'block'
  }
}));

export default function SenderAccountsList({ chain, showCompanion, showEmpty, handleClose }: Props) {
  const { displaySenderAccounts } = useAccountContext();
  const { setCurrentAccount } = useAccounts();
  const classes = useStyles();
  return (
    <>
      <ChainHeader chain={chain} />
      {displaySenderAccounts[chain].map((option) => {
        const component = (
          <SenderDropdownItem
            name={option.account.name}
            address={option.account.address}
            balance={option.account.balance.formattedBalance}
            companionBalance={option.companionAccount.balance.formattedBalance}
            showCompanion={showCompanion}
          />
        );
        return (
          <div
            className={classes.selectAccountMainItem}
            key={option.account.address}
            onClick={() => {
              setCurrentAccount(option.account.address, chain);
              handleClose();
            }}
          >
            {showEmpty ? component : option.account.balance.formattedBalance !== '0' ? component : null}
          </div>
        );
      })}
    </>
  );
}
