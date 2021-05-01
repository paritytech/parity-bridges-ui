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

import { Container } from '@material-ui/core';
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ReceiverInput from './ReceiverInput';
import ReceiverDerivedAccount from './ReceiverDerivedAccount';

const useStyles = makeStyles(() => ({
  container: {
    minWidth: '100%',
    padding: '0',
    marginBottom: '20px',
    display: 'flex',
    flexDirection: 'column'
  },
  input: {
    minWidth: '100%'
  }
}));

const Receiver = () => {
  const [error, setError] = useState('');
  const classes = useStyles();

  return (
    <Container className={classes.container}>
      <div className={classes.input}>
        <ReceiverInput setError={setError} />
      </div>
      <ReceiverDerivedAccount />
      <div>
        <p>{error}</p>
      </div>
    </Container>
  );
};

export default Receiver;
