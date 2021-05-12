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

const expectedVariables = [
  'REACT_APP_CHAIN_1_SUBSTRATE_PROVIDER',
  'REACT_APP_CHAIN_2_SUBSTRATE_PROVIDER',
  'REACT_APP_LANE_ID',
  'REACT_APP_KEYRING_DEV_LOAD_ACCOUNTS'
];

const optionalVariables = [
  'REACT_APP_CHAIN_1_CUSTOM_TYPES_URL',
  'REACT_APP_CHAIN_2_CUSTOM_TYPES_URL',
  'REACT_APP_CHAIN_1_CUSTOM_HASHER',
  'REACT_APP_CHAIN_2_CUSTOM_HASHER'
];

const checkExpectedVariables = () => {
  for (const v of expectedVariables) {
    if (!process.env[v]) {
      throw new Error(`Missing ${v} variable`);
    }
  }
  return true;
};

const checkUnexpectedVariables = () => {
  for (const v of Object.keys(process.env)) {
    if (!expectedVariables.includes(v) && !optionalVariables.includes(v)) {
      throw new Error(`Unexpected ${v} variable found.`);
    }
  }
  return true;
};

const checkEnvVariable = (variable: string) => {
  const envVariable = process.env[variable];
  if (!envVariable) {
    throw new Error(`Env Variable ${variable} was not defined`);
  }
  return envVariable;
};

export { checkEnvVariable, checkExpectedVariables, checkUnexpectedVariables };
