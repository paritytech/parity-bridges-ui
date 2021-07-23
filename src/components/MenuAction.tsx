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

import { ButtonBase, Popover } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import React, { useEffect } from 'react';
import { MenuActionItemsProps } from '../types/guiTypes';
import { TransactionTypes } from '../types/transactionTypes';

// As this is placed as a child in the Material UI Select component, for some reason style components classes are not working.
// This way to inject the styles works.
const useStyles = makeStyles((theme) => ({
  menu: {
    background: theme.palette.secondary.light,
    padding: theme.spacing(),
    borderRadius: theme.spacing()
  },
  item: {
    ...theme.typography.button,
    display: 'flex',
    margin: theme.spacing(0.2),
    paddingLeft: theme.spacing(0.75),
    paddingRight: theme.spacing(0.75),
    borderRadius: theme.spacing(0.5),
    '&:not(.current):hover': {
      color: theme.palette.primary.contrastText,
      background: theme.palette.primary.main
    },
    '&.current': {
      marginBottom: theme.spacing(3),
      color: theme.palette.text.hint,
      '&:hover': {
        color: theme.palette.secondary.contrastText,
        background: theme.palette.secondary.light
      }
    },
    '&.disabled': {
      color: theme.palette.text.disabled,
      pointerEvents: 'none'
    }
  }
}));

interface MenuActionProps {
  actions: MenuActionItemsProps[];
  action: TransactionTypes;
  changeMenu: (type: TransactionTypes) => void;
}

export const MenuAction = ({ actions, changeMenu, action }: MenuActionProps) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const [id, setId] = React.useState<string | undefined>(undefined);
  const [open, setOpen] = React.useState<boolean>(false);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen(!open);
  };

  useEffect(() => {
    setOpen(Boolean(anchorEl));
    setId(anchorEl ? 'simple-popover' : undefined);
  }, [anchorEl]);

  const item = actions.find(({ type }) => type === action);

  return (
    <>
      <ButtonBase className={`${classes.item} current`} onClick={handleClick}>
        {item?.title || '-'}
        <ArrowDropDownIcon />
      </ButtonBase>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={() => setOpen(false)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 24
        }}
        PaperProps={{
          className: classes.menu
        }}
      >
        {actions.map((i, n) => (
          <ButtonBase
            className={`${classes.item} ${!i.isEnabled && 'disabled'}`}
            key={n}
            onClick={() => {
              setOpen(!open);
              changeMenu(i.type);
            }}
          >
            {i.title}
          </ButtonBase>
        ))}
      </Popover>
    </>
  );
};
