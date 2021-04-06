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

import { MessageActionsTypes } from '../actions/messageActions';
import type { MessagesActionType, MessageState } from '../types/messageTypes';

export default function messageReducer(state: MessageState, action: MessagesActionType): MessageState {
  switch (action.type) {
    case MessageActionsTypes.CLEAR_MESSAGE:
      return { ...state, message: null, variant: null };
    case MessageActionsTypes.TRIGGER_MESSAGE:
      return { ...state, message: action.payload.message, variant: action.payload.variant };

    default:
      throw new Error(`Unknown type: ${action.type}`);
  }
}
