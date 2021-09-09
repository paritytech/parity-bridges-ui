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

import React, { useCallback } from 'react';

import { Divider, FormControl, FormGroup, makeStyles } from '@material-ui/core';
import SenderFilterInput from './SenderFilterInput';
import SenderActionSwitch from './SenderActionSwitch';
import { useGUIContext } from '../contexts/GUIContextProvider';

interface Props {
  setFilter: (value: React.SetStateAction<string | null>) => void;
  setShowCompanion: (value: React.SetStateAction<boolean>) => void;
  setShowEmpty: (value: React.SetStateAction<boolean>) => void;
  showCompanion: boolean;
  showEmpty: boolean;
}

const useStyles = makeStyles((theme) => ({
  filters: {
    borderBottom: `1px solid ${theme.palette.divider}`
  }
}));

export default function SenderFilters({ setFilter, setShowEmpty, setShowCompanion, showEmpty, showCompanion }: Props) {
  const classes = useStyles();
  const { isBridged } = useGUIContext();

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFilter(event.target.value);
    },
    [setFilter]
  );

  return (
    <div className={classes.filters}>
      <SenderFilterInput handleChange={handleChange} />
      <Divider />
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
  );
}
