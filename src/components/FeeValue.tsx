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
import { Typography, Tooltip } from '@material-ui/core';
import { fade, makeStyles } from '@material-ui/core/styles';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';

const useStyles = makeStyles((theme) => ({
  container: {
    minHeight: '20px',
    display: 'flex'
  },
  tooltipIcon: {
    ...theme.typography.body1,
    marginTop: 2,
    marginLeft: 2,
    '&:not(:hover)': {
      color: fade(theme.palette.text.hint, 0.75)
    }
  },
  value: {
    backgroundColor: '#f5dada',
    fontFamily: 'monospace',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1)
  },
  textContainer: {
    marginLeft: theme.spacing(0.5)
  }
}));

interface Props {
  chainTokens: string;
  amount: string;
  tooltip?: string;
  showPlus?: boolean;
}

interface TextStyle {
  text: string;
  background?: boolean;
}

const CustomTypography = ({ text, background = false }: TextStyle) => {
  const classes = useStyles();
  return (
    <div className={classes.textContainer}>
      <Typography variant="body1" className={background ? classes.value : ''}>
        {text}
      </Typography>
    </div>
  );
};

export default function FeeValue({ tooltip = '', chainTokens, amount, showPlus = false }: Props) {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <CustomTypography text={amount} background />
      <CustomTypography text={chainTokens} />

      {tooltip && (
        <Tooltip title={tooltip} arrow placement="top">
          <HelpOutlineIcon className={classes.tooltipIcon} />
        </Tooltip>
      )}
      {showPlus && <CustomTypography text={'+'} />}
    </div>
  );
}
