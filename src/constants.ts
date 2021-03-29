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

export const SOURCE = 'sourceChain';
export const TARGET = 'targetChain';

export const ESTIMATED_FEE_RUNTIME_API_CALL = 'OutboundLaneApi_estimate_message_delivery_and_dispatch_fee';

export const expectedChainVariables = ['SUBSTRATE_PROVIDER', 'SS58_PREFIX', 'BRIDGE_ID'];

export const expectedCommonVariables = ['LANE_ID', 'KEYRING_DEV_LOAD_ACCOUNTS', 'ACCOUNT_DERIVATION'];
