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

import React, { useContext, useState } from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import useLocalStorage from '../hooks/transactions/useLocalStorage';
import { TransactionTypes } from '../types/transactionTypes';
import { light } from '../components';
import { MenuActionItemsProps } from '../types/guiTypes';
import useResetTransactionState from '../hooks/transactions/useResetTransactionState';

interface DrawerContextProps {
  drawer: string;
  setDrawer: React.Dispatch<React.SetStateAction<string>>;
  actions: MenuActionItemsProps[];
  action: TransactionTypes;
  setAction: (type: TransactionTypes) => void;
}
interface GUIContextProviderProps {
  children: React.ReactElement;
}

const DrawerContext = React.createContext({} as DrawerContextProps);

const actions = [
  {
    title: 'Transfer',
    isEnabled: true,
    type: TransactionTypes.TRANSFER
  },
  {
    title: 'Remark',
    isEnabled: true,
    type: TransactionTypes.REMARK
  },
  {
    title: 'Custom Call',
    isEnabled: true,
    type: TransactionTypes.CUSTOM
  }
];

export function useGUIContext() {
  return useContext(DrawerContext);
}

export function GUIContextProvider({ children }: GUIContextProviderProps): React.ReactElement {
  const [drawer, setDrawer] = useLocalStorage('storageDrawer');
  const [action, setAction] = useState<TransactionTypes>(TransactionTypes.TRANSFER);

  const value = { drawer, setDrawer, actions, action, setAction };
  useResetTransactionState(action);

  useResetTransactionState(action);

  return (
    <ThemeProvider theme={createMuiTheme(light)}>
      <DrawerContext.Provider value={value}>{children}</DrawerContext.Provider>
    </ThemeProvider>
  );
}
