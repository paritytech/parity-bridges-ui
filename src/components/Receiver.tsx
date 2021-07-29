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
import ReceiverInput from './ReceiverInput';
import ReceiverDerivedAccount from './ReceiverDerivedAccount';
import BridgedLocalWrapper from './BridgedLocalWrapper';
import { useTransactionContext } from '../contexts/TransactionContext';
import { Typography } from '@material-ui/core';

const Receiver = () => {
  const { addressValidationError } = useTransactionContext();

  return (
    <>
      <ReceiverInput />
      <BridgedLocalWrapper>
        <>
          <ReceiverDerivedAccount />
          <Typography variant="body2" color="error">
            {addressValidationError}
          </Typography>
        </>
      </BridgedLocalWrapper>
    </>
  );
};

export default Receiver;
