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

import type { Payload } from '../types/messageTypes';

enum MessageActionsTypes {
  TRIGGER_MESSAGE = 'TRIGGER_MESSAGE',
  CLEAR_MESSAGE = 'CLEAR_MESSAGE'
}

const triggerInfoMessage = (payload: Payload) => ({
  payload: { message: payload.message, variant: 'info' },
  type: MessageActionsTypes.TRIGGER_MESSAGE
});

const triggerSuccessMessage = (payload: Payload) => ({
  payload: { message: payload.message, variant: 'success' },
  type: MessageActionsTypes.TRIGGER_MESSAGE
});

const triggerErrorMessage = (payload: Payload) => ({
  payload: { message: payload.message, variant: 'error' },
  type: MessageActionsTypes.TRIGGER_MESSAGE
});

const triggerWarningMessage = (payload: Payload) => ({
  payload: { message: payload.message, variant: 'warning' },
  type: MessageActionsTypes.TRIGGER_MESSAGE
});

const clearMessage = () => ({
  payload: {},
  type: MessageActionsTypes.CLEAR_MESSAGE
});

const MessageActionsCreators = {
  clearMessage,
  triggerErrorMessage,
  triggerInfoMessage,
  triggerSuccessMessage,
  triggerWarningMessage
};

export { MessageActionsTypes, MessageActionsCreators };
