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

import { CHAIN_1, CHAIN_2 } from '../configs/substrateProviders';
import sourceTargetReducer from '../reducers/sourceTargetReducer';
import type { SourceTarget, SourceTargetAction } from '../types/sourceTargetTypes';

export interface UpdateSourceTargetContext {
  dispatchChangeSourceTarget: React.Dispatch<SourceTargetAction>;
}

export interface SourceTargetContextProps {
  children?: React.ReactElement;
}

export const SourceTargetContext: React.Context<SourceTarget> = React.createContext({} as SourceTarget);

export function useSourceTarget() {
  return useContext(SourceTargetContext);
}

export const UpdateSourceTargetContext: React.Context<UpdateSourceTargetContext> = React.createContext(
  {} as UpdateSourceTargetContext
);

export function useUpdateSourceTarget() {
  return useContext(UpdateSourceTargetContext);
}

export function SourceTargetContextProvider({ children }: SourceTargetContextProps): React.ReactElement {
  const [currentSourceTarget, dispatchChangeSourceTarget] = useReducer(sourceTargetReducer, {
    sourceChain: CHAIN_1,
    targetChain: CHAIN_2
  });

  return (
    <SourceTargetContext.Provider value={currentSourceTarget}>
      <UpdateSourceTargetContext.Provider value={{ dispatchChangeSourceTarget }}>
        {children}
      </UpdateSourceTargetContext.Provider>
    </SourceTargetContext.Provider>
  );
}
