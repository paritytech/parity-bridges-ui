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
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUp from '@material-ui/icons/ArrowDropUp';
import AccountDisplay from './AccountDisplay';
import { useAccountContext } from '../contexts/AccountContextProvider';
import { makeStyles } from '@material-ui/core/styles';
import { Account } from '../types/accountTypes';
import { SelectLabel } from '.';
import { Box } from '@material-ui/core';
import { useSourceTarget } from '../contexts/SourceTargetContextProvider';

import { encodeAddress } from '@polkadot/util-crypto';

interface Props {
  handleClick: (event: React.MouseEvent<HTMLElement>) => void;
  anchorEl: HTMLElement | null;
}

const getName = (account: Account) => (account!.meta.name as string).toLocaleUpperCase();

const useStyles = makeStyles((theme) => ({
  accountMain: {
    padding: theme.spacing(1.25),
    paddingTop: theme.spacing(0.5),
    paddingRight: theme.spacing(0),
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.spacing(1.5),
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0
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
  },
  icon: {
    marginLeft: 'auto'
  },
  account: {
    width: '100%'
  }
}));

export default function SenderAccount({ handleClick, anchorEl }: Props) {
  const classes = useStyles();
  const { account, senderAccountBalance } = useAccountContext();
  const {
    sourceChainDetails: {
      configs: { ss58Format }
    }
  } = useSourceTarget();

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <Box onClick={handleClick} p={1} className={classes.accountMain} id="test-sender-component">
      <SelectLabel>Sender</SelectLabel>
      <Box display="flex">
        <div className={classes.account}>
          <AccountDisplay
            aria-describedby={id}
            friendlyName={account ? getName(account) : 'Select sender account'}
            address={account ? encodeAddress(account.address, ss58Format) : ''}
            balance={senderAccountBalance?.formattedBalance}
          />
        </div>
        <div className={classes.icon}>{open ? <ArrowDropUp /> : <ArrowDropDownIcon />}</div>
      </Box>
    </Box>
  );
}