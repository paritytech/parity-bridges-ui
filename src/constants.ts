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

export const CHAIN_1 = '1';
export const CHAIN_2 = '2';

export const INCORRECT_FORMAT = 'INCORRECT_FORMAT';
export const GENERIC = 'GENERIC';
export const GENERIC_SUBSTRATE_PREFIX = 42;

export const BASE_CUSTOM_TYPES1 = {
  HeaderId: {
    number: 'u64',
    hash: 'Hash'
  },
  PruningRange: {
    oldest_unpruned_block: 'u64',
    oldest_block_to_keep: 'u64'
  },
  FinalityVotes: {
    votes: 'Map<Address, u64>',
    ancestry: 'Vec<FinalityAncestor>'
  },
  FinalityAncestor: {
    id: 'HeaderId',
    submitter: 'Option<Address>',
    signers: 'Vec<Address>'
  },
  StoredHeader: {
    submitter: 'Option<Address>',
    header: 'Header',
    total_difficulty: 'U256',
    next_validator_set_id: 'u64',
    last_signal_block: 'Option<HeaderId>'
  },
  Header: {
    parent_hash: 'Hash',
    timestamp: 'u64',
    number: 'u64',
    author: 'Address',
    transactions_root: 'Hash',
    uncles_hash: 'Hash',
    extra_data: 'Bytes',
    state_root: 'Hash',
    receipts_root: 'Hash',
    log_bloom: 'Hash',
    gas_used: 'u64',
    gas_limit: 'u64',
    difficulty: 'u64',
    seal: 'Vec<Bytes>'
  },
  ScheduledChange: {
    validators: 'Vec<Address>',
    prev_signal_block: 'Option<HeaderId>'
  },
  ValidatorsSet: {
    validators: 'Vec<Address>',
    signal_block: 'Option<HeaderId>',
    enact_block: 'HeaderId'
  }
};

export const BASE_CUSTOM_TYPES = {
  Id: '[u8; 4]',
  InstanceId: 'Id',
  LaneId: 'Id',
  MessageKey: {
    lane_id: 'LaneId',
    nonce: 'MessageNonce'
  },
  MessageNonce: 'u64',
  BridgedBlockHash: 'u64'
};
