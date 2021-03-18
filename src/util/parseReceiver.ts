// Copyright 2019-2020 Parity Technologies (UK) Ltd.
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

import { addresses } from '../constants';

// Parse the receiver of the funds on the substrate side.
//
// Supports a bunch of pre-defined addresses like alice|bob|joshy, etc.
export default function parseReceiver(recv: string): string {
  const v = recv.toLowerCase().replace(/[^a-z0-9]/, '') as keyof typeof addresses;
  return addresses[v] || recv;
}
