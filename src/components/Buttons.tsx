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

import { Button, ButtonProps } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ForumIcon from '@material-ui/icons/Forum';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  contact: {
    backgroundColor: 'transparent',
    '&:hover': {
      backgroundColor: theme.palette.secondary.light
    }
  },
  switchMode: {
    fontSize: theme.typography.body2.fontSize
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

export const ButtonSwitchMode = ({ children, color = 'secondary', ...props }: ButtonProps) => {
  const classes = useStyles();
  return (
    <Button className={classes.switchMode} color={color} {...props}>
      {children}
    </Button>
  );
};
