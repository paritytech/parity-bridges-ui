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

import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { SelectLabel, styleAccountCompanion } from '.';
import { useAccountContext } from '../contexts/AccountContextProvider';
import AccountDisplay from './AccountDisplay';
import BridgedLocalWrapper from './BridgedLocalWrapper';
import { Account, AddressKind } from '../types/accountTypes';
import isNull from 'lodash/isNull';
import { Box, Divider, FormControl, FormGroup, Popover } from '@material-ui/core';
import useAccounts from '../hooks/accounts/useAccounts';
import SenderDropdownItem from './SenderDropdownItem';
import ChainHeader from './ChainHeader';
import SenderActionSwitch from './SenderActionSwitch';
import { useGUIContext } from '../contexts/GUIContextProvider';

const useStyles = makeStyles((theme) => ({
  autocomplete: {
    '& .MuiOutlinedInput-notchedOutline': {
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      borderWidth: '1px !important',
      borderColor: theme.palette.divider
    }
  },
  selectAccountMainItem: {
    display: 'block'
  },
  accountMain: {
    padding: theme.spacing(1.25),
    paddingTop: theme.spacing(0.5),
    paddingRight: theme.spacing(3),
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.spacing(1.5),
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0
  },
  accountCompanion: {
    ...styleAccountCompanion(theme)
  },
  sender: {
    minHeight: theme.spacing(10)
  },
  paper: {
    minWidth: theme.spacing(60),
    maxHeight: theme.spacing(50)
  },
  senderActions: {
    borderBottom: `1px solid ${theme.palette.divider}`
  }
}));

const getName = (account: Account) => (account!.meta.name as string).toLocaleUpperCase();

export default function Sender() {
  const { setCurrentAccount } = useAccounts();
  const {
    displaySenderAccounts,
    account,
    companionAccount,
    senderAccountBalance,
    senderCompanionAccountBalance
  } = useAccountContext();
  const classes = useStyles();
  const [showEmpty, setShowEmpty] = useState(true);
  const [showCompanion, setShowCompanion] = useState(true);
  const { isBridged } = useGUIContext();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const chains = Object.keys(displaySenderAccounts);

  return (
    <>
      <Box p={1} className={classes.accountMain}>
        <SelectLabel>Sender</SelectLabel>
        <AccountDisplay
          aria-describedby={id}
          onClick={handleClick}
          friendlyName={account ? getName(account) : 'Select sender account'}
          address={account?.address}
          balance={senderAccountBalance?.formattedBalance}
        />
      </Box>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
        classes={{
          paper: classes.paper
        }}
      >
        <div className={classes.senderActions}>
          <FormControl component="fieldset">
            <FormGroup aria-label="position" row>
              <SenderActionSwitch name="show empty" label="show empty" callback={setShowEmpty} checked={showEmpty} />
              {isBridged && (
                <SenderActionSwitch
                  name="show companion"
                  label="show companion"
                  callback={setShowCompanion}
                  checked={showCompanion}
                />
              )}
            </FormGroup>
          </FormControl>
        </div>
        {chains.length ? (
          <>
            <ChainHeader chain={chains[0]} />
            {displaySenderAccounts[chains[0]].map((option) => {
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
                    setCurrentAccount(option.account.address, chains[0]);
                    handleClose();
                  }}
                >
                  {showEmpty ? component : option.account.balance.formattedBalance !== '0' ? component : null}
                </div>
              );
            })}

            <Divider />

            <ChainHeader chain={chains[1]} />
            {displaySenderAccounts[chains[1]].map((option) => (
              <div
                className={classes.selectAccountMainItem}
                key={option.account.address}
                onClick={() => {
                  setCurrentAccount(option.account.address, chains[1]);
                  handleClose();
                }}
              >
                <AccountDisplay
                  friendlyName={option.account.name}
                  address={option.account.address}
                  balance={option.account.balance.formattedBalance}
                />
                <BridgedLocalWrapper>
                  <AccountDisplay
                    friendlyName={option.companionAccount.name}
                    address={option.companionAccount.address}
                    balance={option.companionAccount.balance.formattedBalance}
                  />
                </BridgedLocalWrapper>
              </div>
            ))}
          </>
        ) : null}
      </Popover>

      <BridgedLocalWrapper>
        <div className={classes.accountCompanion}>
          {companionAccount && !isNull(senderCompanionAccountBalance) ? (
            <AccountDisplay
              friendlyName={getName(account)}
              address={companionAccount}
              addressKind={AddressKind.COMPANION}
              balance={senderCompanionAccountBalance!.formattedBalance}
              hideAddress
              withTooltip
            />
          ) : (
            <AccountDisplay friendlyName="Sender" addressKind={AddressKind.COMPANION} hideAddress />
          )}
        </div>
      </BridgedLocalWrapper>
    </>
  );
}
