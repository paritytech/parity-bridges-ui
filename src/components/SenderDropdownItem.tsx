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
import cx from 'classnames';
import { Box, makeStyles, Typography } from '@material-ui/core';
import shorterItem from '../util/shortenItem';
import AccountIdenticon from './AccountIdenticon';

interface Props {
  name: string;
  balance: string;
  companionBalance: string;
  address: string;
}

const useStyles = makeStyles((theme) => ({
  topBalance: {
    border: `1px solid ${theme.palette.primary.light}`,
    borderRadius: theme.spacing(0.5),
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    minWidth: theme.spacing(14)
  },
  bottomBalance: {
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.spacing(0.5),
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    minWidth: theme.spacing(14)
  },
  balanceBody: {
    fontSize: theme.spacing(1.3)
  },
  hoover: {
    backgroundColor: theme.palette.secondary.light
  },
  main: {
    width: '100%',
    padding: 0
  },
  box: {
    padding: theme.spacing(1.5)
  }
}));

const SenderDropdownItem = ({ name, address, balance, companionBalance }: Props) => {
  const classes = useStyles();
  const [hoover, setHoover] = useState(false);
  return (
    <div
      className={cx(classes.main, hoover ? classes.hoover : '')}
      onMouseEnter={() => {
        console.log('on mouse enter ', name);
        setHoover(true);
      }}
      onMouseLeave={() => {
        console.log('on mouse leave ', name);
        setHoover(false);
      }}
    >
      <Box display="flex" className={classes.box} id="test-transaction-header" maxWidth>
        <AccountIdenticon address={address} />
        <Typography>
          {name} [{shorterItem(address)}]
        </Typography>
        <Box marginLeft="auto" display="flex" flexDirection="column" alignItems="flex-end" id="test-transaction-header">
          <Box className={classes.topBalance} display="flex" justifyContent="flex-end">
            <Typography component="p" className={classes.balanceBody}>
              {balance}
            </Typography>
          </Box>
          <Box className={classes.bottomBalance} display="flex" justifyContent="flex-end">
            <Typography component="p" className={classes.balanceBody}>
              {companionBalance}
            </Typography>
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default SenderDropdownItem;
