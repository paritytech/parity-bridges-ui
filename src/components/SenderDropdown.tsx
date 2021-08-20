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

import { Divider, FormControl, FormGroup, makeStyles, Popover } from '@material-ui/core';
import React, { useMemo, useState } from 'react';
import { useAccountContext } from '../contexts/AccountContextProvider';
import { useGUIContext } from '../contexts/GUIContextProvider';
import SenderAccountsList from './SenderAccountsList';
import SenderActionSwitch from './SenderActionSwitch';

interface Props {
  anchorEl: HTMLElement | null;
  handleClose: () => void;
}

const useStyles = makeStyles((theme) => ({
  paper: {
    minWidth: theme.spacing(60),
    maxHeight: theme.spacing(50)
  },
  senderActions: {
    borderBottom: `1px solid ${theme.palette.divider}`
  }
}));

export default function SenderDropdown({ anchorEl, handleClose }: Props) {
  const classes = useStyles();
  const [showEmpty, setShowEmpty] = useState(true);
  const [showCompanion, setShowCompanion] = useState(true);
  const { isBridged } = useGUIContext();
  const { displaySenderAccounts } = useAccountContext();
  const chains = useMemo(() => Object.keys(displaySenderAccounts), [displaySenderAccounts]);
  const open = Boolean(anchorEl);
  const id = open ? 'test-sender-component' : undefined;

  return (
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
          <SenderAccountsList
            chain={chains[0]}
            showCompanion={showCompanion}
            showEmpty={showEmpty}
            handleClose={handleClose}
          />
          <Divider />
          <SenderAccountsList
            chain={chains[1]}
            showCompanion={showCompanion}
            showEmpty={showEmpty}
            handleClose={handleClose}
          />
        </>
      ) : null}
    </Popover>
  );
}
