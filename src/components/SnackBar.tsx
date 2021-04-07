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

import { useSnackbar } from 'notistack';
import React, { useEffect } from 'react';
import styled from 'styled-components';

import { MessageActionsCreators } from '../actions/messageActions';
import { useMessageContext, useUpdateMessageContext } from '../contexts/MessageContext';

const CloseButton = styled.button`
  display: inline-block;
  color: white;
  font-size: 1em;
  background: transparent;
  margin: 1em;
  padding: 0.25em 1em;
  border: none;
  display: block;
  outline: none;
  font-weight: 600;
`;

export default function SnackBar() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { message, variant } = useMessageContext();
  const { dispatchMessage } = useUpdateMessageContext();

  useEffect(() => {
    if (message && variant) {
      enqueueSnackbar(message, {
        action: <CloseButton onClick={() => closeSnackbar()}>CLOSE</CloseButton>,
        anchorOrigin: { horizontal: 'right', vertical: 'top' },
        variant
      });
      dispatchMessage(MessageActionsCreators.clearMessage());
    }
  }, [closeSnackbar, message, variant, enqueueSnackbar, dispatchMessage]);

  return null;
}
