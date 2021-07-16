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
const base = {
  env: {
    browser: true,
    node: true,
    es6: true
  },
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint', 'header', 'promise', 'react', 'react-hooks'],
  settings: {
    react: {
      pragma: 'React', // Pragma to use, default to "React"
      version: '16.9.0' // React version, default to the latest React stable release
    }
  }
};

module.exports =
  process.env.REACT_APP_IS_DEVELOPMENT === 'true'
    ? {
        ...base,
        extends: ['plugin:react/recommended', 'plugin:@typescript-eslint/eslint-recommended']
      }
    : {
        ...base,
        extends: [
          'plugin:prettier/recommended',
          'eslint:recommended',
          'plugin:react/recommended',
          'plugin:@typescript-eslint/eslint-recommended'
        ],
        rules: {
          '@typescript-eslint/no-unused-vars': 'error',
          'arrow-spacing': [
            'warn',
            {
              before: true,
              after: true
            }
          ],
          'no-debugger': 'warn',
          'comma-dangle': ['error', 'never'],
          'header/header': [2, './header.js'],
          'no-multiple-empty-lines': [
            'error',
            {
              max: 1
            }
          ],
          'no-tabs': [
            'error',
            {
              allowIndentationTabs: true
            }
          ],
          'no-trailing-spaces': ['warn'],
          'no-unused-vars': 'warn',
          'object-curly-spacing': ['error', 'always'],
          quotes: [
            'error',
            'single',
            {
              avoidEscape: true
            }
          ],
          'react-hooks/rules-of-hooks': 'error',
          'react-hooks/exhaustive-deps': 'warn',
          semi: [2, 'always'],
          'switch-colon-spacing': [
            'error',
            {
              after: true,
              before: false
            }
          ]
        }
      };
