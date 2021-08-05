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

import { Box, Button, ButtonProps } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ForumIcon from '@material-ui/icons/Forum';
import React from 'react';
import { Web3Icon } from '.';

const useStyles = makeStyles((theme) => ({
  submit: {
    padding: theme.spacing(2),
    borderRadius: theme.spacing(1.75)
  },
  contact: {
    backgroundColor: 'transparent',
    '&:hover': {
      backgroundColor: theme.palette.secondary.light
    }
  },
  switchMode: {
    fontSize: theme.typography.body2.fontSize
  },
  drawerMenu: {
    justifyContent: 'end',
    '&.MuiButton-textPrimary': {
      backgroundColor: theme.palette.secondary.light
    }
  },
  installExtension: {
    padding: theme.spacing(2.5),
    borderRadius: theme.spacing(1.5),
    color: theme.palette.primary.dark,
    fontWeight: 400
  }
}));

export const ButtonExt = ({
  children,
  startIcon = <ForumIcon />,
  variant = 'contained',
  disableElevation = true,
  href = 'https://github.com/paritytech/parity-bridges-ui/issues',
  ...props
}: ButtonProps) => {
  const classes = useStyles();
  const openInNewTab = (url: string): void => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (newWindow) newWindow.opener = null;
  };
  return (
    <Button
      className={classes.contact}
      variant={variant}
      startIcon={startIcon}
      disableElevation={disableElevation}
      onClick={() => openInNewTab(href)}
      {...props}
    >
      {children}
    </Button>
  );
};

export const ButtonDrawerMenu = ({ children, color = 'secondary', fullWidth = true, ...props }: ButtonProps) => {
  const classes = useStyles();
  return (
    <Button className={classes.drawerMenu} color={color} fullWidth={fullWidth} {...props}>
      {children}
    </Button>
  );
};

export const ButtonInstallExtension = ({ children, color = 'secondary', fullWidth = true, ...props }: ButtonProps) => {
  const classes = useStyles();
  const openInNewTab = (): void => {
    const newWindow = window.open('https://polkadot.js.org/extension/', '_blank', 'noopener,noreferrer');
    if (newWindow) newWindow.opener = null;
  };
  return (
    <Button
      className={classes.installExtension}
      color={color}
      fullWidth={fullWidth}
      onClick={() => openInNewTab()}
      {...props}
    >
      <Box display="flex" justifyContent="space-between" width="100%">
        <span>{children}</span>
        <Web3Icon backgroundColor="#f29135" color="white">
          polkadot
        </Web3Icon>
      </Box>
    </Button>
  );
};

export const ButtonSwitchMode = ({ children, color = 'secondary', ...props }: ButtonProps) => {
  const classes = useStyles();
  return (
    <Button className={classes.switchMode} color={color} {...props}>
      {children}
    </Button>
  );
};

export const ButtonSubmit = ({
  children,
  color = 'primary',
  variant = 'contained',
  fullWidth = true,
  ...props
}: ButtonProps) => {
  const classes = useStyles();
  return (
    <Box mt={2} mb={2}>
      <Button
        id="test-button-submit"
        className={classes.submit}
        color={color}
        variant={variant}
        fullWidth={fullWidth}
        {...props}
      >
        {children}
      </Button>
    </Box>
  );
};
