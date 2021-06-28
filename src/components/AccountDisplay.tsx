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

import { fade, makeStyles } from '@material-ui/core/styles';
import React from 'react';
import Balance from './Balance';
import shorterItem from '../util/shortenItem';
import AccountIdenticon from './AccountIdenticon';
import { Box, Tooltip } from '@material-ui/core';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import { AddressKind } from '../types/accountTypes';

export interface Props {
  friendlyName?: string | null;
  isDerived?: boolean;
  addressKind?: AddressKind | string;
  address?: string;
  hideAddress?: boolean;
  onClick?: () => void;
  balance?: string | null | undefined;
  className?: string;
  withTooltip?: boolean;
  id?: string | undefined;
}

const useStyles = makeStyles((theme) => ({
  address: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: theme.spacing(),
    marginRight: theme.spacing(),
    width: '100%',
    overflow: 'auto'
  },
  missingAddress: {
    color: theme.palette.text.disabled
  },
  tooltipIcon: {
    ...theme.typography.body1,
    marginTop: 2,
    marginLeft: 2,
    '&:not(:hover)': {
      color: fade(theme.palette.text.hint, 0.75)
    }
  }
}));

const AccountDisplay = ({
  address = '',
  addressKind,
  balance,
  friendlyName,
  hideAddress = false,
  onClick,
  className,
  withTooltip,
  id
}: Props) => {
  const classes = useStyles();
  const displayText = () => {
    const shortAddress = shorterItem(address);
    const name = friendlyName ? `${friendlyName} [${shortAddress}]` : shortAddress;
    const justFriendlyName = friendlyName || shortAddress;
    const displayName = hideAddress ? justFriendlyName : name;

    if (addressKind) {
      return `${addressKind}(${displayName})`;
    }

    return displayName;
  };

  return (
    <Box onClick={onClick} display="flex" alignItems="center" className={className}>
      <AccountIdenticon address={address} />
      <div className={`${classes.address} ${!address && classes.missingAddress}`} id={id}>
        {displayText()}
        {withTooltip && (
          <Tooltip title={address} arrow placement="top" interactive>
            <HelpOutlineIcon className={classes.tooltipIcon} />
          </Tooltip>
        )}
      </div>
      <Balance balance={balance} />
    </Box>
  );
};

export default AccountDisplay;
