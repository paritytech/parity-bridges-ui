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

import React, { useState, useCallback } from 'react';

import { makeStyles, Popover } from '@material-ui/core';
import SenderAccountsLoading from './SenderAccountsLoading';
import SenderFilters from './SenderFilters';
import { useAccountContext } from '../contexts/AccountContextProvider';
import SenderAccountsSection from './SenderAccountsSection';
interface Props {
  anchorEl: HTMLElement | null;
  removeAnchor: () => void;
}

const useStyles = makeStyles((theme) => ({
  paper: {
    minWidth: theme.spacing(60),
    maxHeight: theme.spacing(50)
  }
}));

export default function SenderDropdown({ anchorEl, removeAnchor }: Props) {
  const classes = useStyles();
  const [showEmpty, setShowEmpty] = useState(true);
  const [showCompanion, setShowCompanion] = useState(true);
  const [filter, setFilter] = useState<string | null>(null);
  const { initialLoadingAccounts } = useAccountContext();
  const open = Boolean(anchorEl);
  const id = open ? 'test-sender-component' : undefined;

  const handleClose = useCallback(() => {
    removeAnchor();
    setFilter(null);
  }, [removeAnchor]);

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
      {initialLoadingAccounts ? (
        <SenderAccountsLoading />
      ) : (
        <>
          <SenderFilters
            setFilter={setFilter}
            setShowEmpty={setShowEmpty}
            setShowCompanion={setShowCompanion}
            showEmpty={showEmpty}
            showCompanion={showCompanion}
          />
          <SenderAccountsSection
            showEmpty={showEmpty}
            showCompanion={showCompanion}
            filter={filter}
            handleClose={handleClose}
          />
        </>
      )}
    </Popover>
  );
}
