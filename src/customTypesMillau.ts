// Copyright 2019-2020 @paritytech/bridge-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
export default {
	'AuthoritySet': {
		'authorities': 'AuthorityList',
		'set_id': 'SetId'
	},
	'BridgedBlockHash': 'H256',
	'BridgedBlockHasher': 'BlakeTwoAndKeccak256',
	'BridgedBlockNumber': 'u64',
	'BridgedDigest': {
		'logs': 'Vec<BridgedDigestItem>'
	},

	'BridgedDigestItem': {
		'_enum': {
			'AuthoritiesChange': 'Vec<AuthorityId>',
			'ChangesTrieRoot': 'BridgedBlockHash',
			'Consensus': 'Consensus',
			'Other': 'Vec<u8>',
			'PreRuntime': 'PreRuntime',
			'Seal': 'Seal',
			'SealV0': 'SealV0'
		}
	},
	'BridgedHeader': {
		'digest': 'BridgedDigest',
		'extrinsics_root': 'BridgedBlockHash',
		'number': 'Compact<BridgedBlockNumber>',
		'parent_Hash': 'BridgedBlockHash',
		'state_root': 'BridgedBlockHash'
	},
	'Id': '[u8; 4]',
	'ImportedHeader': {
		'header': 'BridgedHeader',
		'is_finalized': 'bool',
		'requires_justification': 'bool',
		'signal_hash': 'Option<BridgedBlockHash>'
	},

	'InstanceId': 'Id',
	'LaneId': 'Id',

	'MessageId': '(Id, u64)',
	'MessageKey': {
		'lane_id': 'LaneId',
		'nonce:': 'MessageNonce'
	},
	'MessageNonce': 'u64',
	'OutboundLaneData': {
		'latest_generated_nonce': 'MessageNonce',
		'latest_received_nonce': 'MessageNonce',
		'oldest_unpruned_nonce': 'MessageNonce'
	}
};

