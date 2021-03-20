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

import { useEffect, useState } from 'react';

import { TARGET } from '../constants';
import { useSourceTarget } from '../contexts/SourceTargetContextProvider';
import { ChainTypes } from '../types/sourceTargetTypes';

interface Output {
  local: string;
  destination: string;
}

export default function useDashboardProfile(chainType: ChainTypes): Output {
  const { sourceChain, targetChain } = useSourceTarget();

  const [profile, setProfile] = useState({ destination: '', local: '' });

  useEffect(() => {
    let local = sourceChain;
    let destination = targetChain;
    if (chainType === TARGET) {
      local = targetChain;
      destination = sourceChain;
    }
    setProfile({ destination, local });
  }, [chainType, sourceChain, targetChain]);

  return profile;
}
