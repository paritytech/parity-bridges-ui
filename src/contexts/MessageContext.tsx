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

import React, { useContext, useReducer } from 'react';

import messageReducer from '../reducers/messageReducer';
import { MessageContextType, MessagesActionType } from '../types/messageTypes';

interface MessageContextProviderProps {
  children: React.ReactElement;
}

export interface UpdateMessageContext {
  dispatchMessage: React.Dispatch<MessagesActionType>;
}

export const MessageContext: React.Context<MessageContextType> = React.createContext({} as MessageContextType);

export const UpdateMessageContext: React.Context<UpdateMessageContext> = React.createContext(
  {} as UpdateMessageContext
);

export function useMessageContext() {
  return useContext(MessageContext);
}

export function useUpdateMessageContext() {
  return useContext(UpdateMessageContext);
}

export function MessageContextProvider(props: MessageContextProviderProps): React.ReactElement {
  const { children = null } = props;

  const [message, dispatchMessage] = useReducer(messageReducer, {
    message: null,
    variant: null
  });

  return (
    <MessageContext.Provider value={message}>
      <UpdateMessageContext.Provider value={{ dispatchMessage }}>{children}</UpdateMessageContext.Provider>
    </MessageContext.Provider>
  );
}
