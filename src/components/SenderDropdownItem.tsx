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
import { Box, makeStyles, Typography, Tooltip } from '@material-ui/core';
import shorterItem from '../util/shortenItem';
import AccountIdenticon from './AccountIdenticon';
import { useGUIContext } from '../contexts/GUIContextProvider';

interface Props {
  name: string;
  balance: string;
  companionBalance: string;
  address: string;
  showCompanion: boolean;
  companionAddress: string;
}

const useStyles = makeStyles((theme) => ({
  topBalance: {
    minWidth: theme.spacing(14),
    marginLeft: theme.spacing(5)
  },

  bottomBalance: {
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.spacing(0.5),
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    minWidth: theme.spacing(14)
  },
  border: {
    border: `1px solid ${theme.palette.primary.light}`,
    borderRadius: theme.spacing(0.5),
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0
  },
  balanceBody: {
    fontSize: theme.spacing(1.4),
    padding: theme.spacing(0.2)
  },
  hoover: {
    backgroundColor: theme.palette.secondary.light
  },
  main: {
    width: '100%',
    padding: 0
  },
  box: {
    padding: theme.spacing(1.5),
    minHeight: theme.spacing(8.5)
  },
  address: {
    marginLeft: theme.spacing(0.5)
  },
  addressContainer: {
    maxWidth: theme.spacing(30)
  },
  tooltip: {
    maxWidth: 350
  }
}));

const SenderDropdownItem = ({ name, address, balance, companionBalance, showCompanion, companionAddress }: Props) => {
  const classes = useStyles();
  const [hoover, setHoover] = useState(false);
  const { isBridged } = useGUIContext();

  const companionTitle = ` Companion: ${companionAddress}`;
  let title = `Native: ${address}`;

  if (isBridged) {
    title = title.concat(companionTitle);
  }

  return (
    <div
      className={cx(classes.main, hoover ? classes.hoover : '')}
      onMouseEnter={() => {
        setHoover(true);
      }}
      onMouseLeave={() => {
        setHoover(false);
      }}
    >
      <Tooltip placement="top" title={title} aria-label="add" classes={{ tooltip: classes.tooltip }} arrow>
        <Box display="flex" className={classes.box} id="test-transaction-header" alignItems="start">
          <AccountIdenticon address={address} />
          <div className={classes.addressContainer}>
            <Typography noWrap classes={{ root: classes.address }}>
              {name} [{shorterItem(address)}]
            </Typography>
          </div>

          <Box
            marginLeft="auto"
            display="flex"
            flexDirection="column"
            alignItems="flex-end"
            id="test-transaction-header"
          >
            <Box
              className={cx(classes.topBalance, isBridged && showCompanion ? classes.border : '')}
              display="flex"
              justifyContent="flex-end"
            >
              <Typography component="p" className={classes.balanceBody}>
                {balance}
              </Typography>
            </Box>
            {showCompanion && isBridged && (
              <Box className={classes.bottomBalance} display="flex" justifyContent="flex-end">
                <Typography component="p" className={classes.balanceBody}>
                  {companionBalance}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Tooltip>
    </div>
  );
};

export default SenderDropdownItem;
