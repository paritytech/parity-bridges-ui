// Copyright 2019-2020 @paritytech/bridge-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React, { useContext, useReducer } from 'react';

import sourceTargetReducer from '../reducers/sourceTargetReducer';
import type { SourceTarget, SourceTargetAction } from '../types/sourceTargetTypes';
import { CHAIN_1, CHAIN_2 } from '../util/substrateProviders';

export interface UpdateSourceTargetContext {
  dispatchSourceTarget: React.Dispatch<SourceTargetAction>;
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
  const [currentSourceTarget, dispatchSourceTarget] = useReducer(sourceTargetReducer, {
    sourceChain: CHAIN_1,
    targetChain: CHAIN_2
  });

  return (
    <SourceTargetContext.Provider value={currentSourceTarget}>
      <UpdateSourceTargetContext.Provider value={{ dispatchSourceTarget }}>
        {children}
      </UpdateSourceTargetContext.Provider>
    </SourceTargetContext.Provider>
  );
}
