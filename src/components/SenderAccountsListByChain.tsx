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

import React, { useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useAccountContext } from '../contexts/AccountContextProvider';
import ChainHeader from './ChainHeader';
import SenderDropdownItem from './SenderDropdownItem';
import useAccounts from '../hooks/accounts/useAccounts';

interface Props {
  chainMatch: string | undefined;
  chain: string;
  showCompanion: boolean;
  showEmpty: boolean;
  handleClose: () => void;
  filters: string[];
}

const useStyles = makeStyles(() => ({
  selectAccountMainItem: {
    display: 'block'
  }
}));

export default function SenderAccountsListByChain({
  chainMatch,
  chain,
  showCompanion,
  showEmpty,
  handleClose,
  filters
}: Props) {
  const { displaySenderAccounts } = useAccountContext();
  const { setCurrentAccount } = useAccounts();
  const classes = useStyles();

  const accounts = useMemo(() => {
    const items = displaySenderAccounts[chain];
    const upperChain = chain.toLocaleUpperCase();

    const getItemsFiltered = () => {
      if (filters.length) {
        const match = (input: string, caseSensitive = false) => {
          let field = input;
          let show = false;
          if (!caseSensitive) {
            field = input.toUpperCase();
            filters.forEach((f) => {
              if (field.includes(f.toUpperCase())) {
                show = true;
              }
            });
            return show;
          }

          filters.forEach((f) => {
            console.log('----');
            console.log('f', f);
            console.log('field', field);
            console.log('field.includes(f)', field.includes(f));

            if (field.includes(f)) {
              show = true;
            }
          });
          return show;
        };

        return items.filter(({ account, companionAccount }) => {
          const matchAddress = match(account.address, true);
          const matchCompanionAddress = match(companionAccount.address, true);
          const matchName = match(account.name);
          return matchAddress || matchCompanionAddress || matchName;
        });
      }
      return [];
    };

    if (chainMatch && !upperChain.includes(chainMatch)) {
      return [];
    }

    const filteredItems = getItemsFiltered();
    console.log('filteredItems', filteredItems);
    if (filteredItems.length) {
      return filteredItems;
    }

    if (!chainMatch) {
      return items;
    }

    return [];
  }, [chain, displaySenderAccounts, filters, chainMatch]);

  return (
    <>
      {Boolean(accounts.length) && <ChainHeader chain={chain} />}
      {accounts.map((option) => {
        const component = (
          <SenderDropdownItem
            name={option.account.name}
            address={option.account.address}
            balance={option.account.balance.formattedBalance}
            companionBalance={option.companionAccount.balance.formattedBalance}
            companionAddress={option.companionAccount.address}
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
