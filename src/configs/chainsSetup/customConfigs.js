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

const dotenv = require('dotenv');
const result = dotenv.config();

if (result.error) {
  throw result.error;
}

const customTypesDir = './src/configs/substrateCustomTypes';

const rialtoUrl =
  'https://raw.githubusercontent.com/paritytech/parity-bridges-common/master/deployments/types-rialto.json';
const millauUrl =
  'https://raw.githubusercontent.com/paritytech/parity-bridges-common/master/deployments/types-millau.json';

const chain1Url = result.parsed.REACT_APP_CUSTOM_TYPES_URL_CHAIN_1 || rialtoUrl;
const chain2Url = result.parsed.REACT_APP_CUSTOM_TYPES_URL_CHAIN_2 || millauUrl;

const customTypes = [
  {
    path: `${customTypesDir}/chain1.json`,
    url: chain1Url
  },
  {
    path: `${customTypesDir}/chain2.json`,
    url: chain2Url
  }
];

module.exports = customTypes;
