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

import BN from 'bn.js';

const getSiValue = (si: number): BN => new BN(10).pow(new BN(si));

const si = [
  { value: getSiValue(24), symbol: 'y' },
  { value: getSiValue(21), symbol: 'z' },
  { value: getSiValue(18), symbol: 'a' },
  { value: getSiValue(15), symbol: 'f' },
  { value: getSiValue(12), symbol: 'p' },
  { value: getSiValue(9), symbol: 'n' },
  { value: getSiValue(6), symbol: 'μ' },
  { value: getSiValue(3), symbol: 'm' },
  { value: new BN(1), symbol: '' },
  { value: getSiValue(3), symbol: 'k' },
  { value: getSiValue(6), symbol: 'M' },
  { value: getSiValue(9), symbol: 'G' },
  { value: getSiValue(12), symbol: 'T' },
  { value: getSiValue(15), symbol: 'P' },
  { value: getSiValue(18), symbol: 'E' },
  { value: getSiValue(21), symbol: 'Y' },
  { value: getSiValue(24), symbol: 'Z' }
];

const allowedSymbols = si
  .map((s) => s.symbol)
  .join(', ')
  .replace(', ,', ',');
const floats = '^[+]?[0-9]*[.,]{1}[0-9]*$';
const ints = '^[+]?[0-9]+$';
const alphaFloats = '^[+]?[0-9]*[.,]{1}[0-9]*[' + allowedSymbols + ']{1}$';
const alphaInts = '^[+]?[0-9]*[' + allowedSymbols + ']{1}$';

export enum EvalMessages {
  GIBBERISH = 'Input is not correct. Use numbers, floats or expression (e.g. 1k, 1.3m)',
  ZERO = 'You cannot send 0 funds',
  SUCCESS = '',
  SYMBOL_ERROR = 'Provided symbol is not correct',
  GENERAL_ERROR = 'Check your input. Something went wrong'
}

/**
 * A function that identifes integer/float(comma or dot)/expressions (such as 1k)
 * and converts to actual value (or reports an error).
 * @param {string} input
 * @returns {[number | null, string]} an array of 2 items
 * the first is the actual calculated number (or null if none) while
 * the second is the message that should appear in case of error
 */
export function evalUnits(input: string, chainDecimals: number): [BN | null, string] {
  //sanitize input to remove + char if exists
  input = input && input.replace('+', '');
  if (
    !new RegExp(floats).test(input) &&
    !new RegExp(ints).test(input) &&
    !new RegExp(alphaInts).test(input) &&
    !new RegExp(alphaFloats).test(input)
  ) {
    return [null, EvalMessages.GIBBERISH];
  }
  // find the character from the alphanumerics
  const symbol = input.replace(/[0-9.,]/g, '');
  // find the value from the si list
  const siVal = si.find((s) => s.symbol === symbol);
  const numberStr = input.replace(symbol, '').replace(',', '.');
  let numeric: BN = new BN(0);
  if (siVal) {
    const containDecimal = input.replace(/[,]/g, '.').includes('.');
    if (containDecimal) {
      const [decPart, fracPart] = numberStr.replace(/[,]/g, '.').split('.');
      const decimals = fracPart.length;
      const exp = new BN(10).pow(new BN(decimals));
      if (symbol.toUpperCase() === symbol || symbol === 'k') {
        numeric = new BN(new BN(decPart).mul(exp).add(new BN(fracPart)))
          .mul(new BN(10).pow(new BN(chainDecimals)))
          .mul(siVal.value)
          .div(exp);
      } else {
        numeric = new BN(new BN(decPart).mul(exp).add(new BN(fracPart)))
          .mul(new BN(10).pow(new BN(chainDecimals)))
          .div(siVal.value)
          .div(exp);
      }
    } else {
      if (symbol.toUpperCase() === symbol || symbol === 'k') {
        numeric = new BN(new BN(numberStr).mul(new BN(10).pow(new BN(chainDecimals)))).mul(siVal.value);
      } else {
        numeric = new BN(new BN(numberStr).mul(new BN(10).pow(new BN(chainDecimals)))).div(siVal.value);
      }
    }
    if (numeric.eq(new BN(0))) {
      return [null, EvalMessages.ZERO];
    }
    return [numeric, EvalMessages.SUCCESS];
  }
  return [null, EvalMessages.SYMBOL_ERROR];
}
