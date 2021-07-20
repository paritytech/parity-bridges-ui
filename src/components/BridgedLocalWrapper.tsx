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
import { useGUIContext } from '../contexts/GUIContextProvider';

interface Props {
  children: React.ReactElement | null;
  blurred?: boolean;
  showLocal?: boolean;
}

export default function BridgedLocalWrapper({ children, blurred = false, showLocal = false }: Props) {
  const { isBridged } = useGUIContext();

  if (!isBridged && blurred) {
    return <div style={{ opacity: '20%' }}>{children}</div>;
  }

  if (!isBridged && showLocal) {
    return children;
  }

  if (!isBridged) {
    return null;
  }

  if (isBridged && !showLocal) {
    return children;
  }

  return null;
}
