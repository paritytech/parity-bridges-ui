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
import { EvalMessages } from '../types/transactionTypes';

const getSiValue = (si: number): BN => new BN(10).pow(new BN(si));

const si = [
  { value: getSiValue(24), symbol: 'y', isMil: true },
  { value: getSiValue(21), symbol: 'z', isMil: true },
  { value: getSiValue(18), symbol: 'a', isMil: true },
  { value: getSiValue(15), symbol: 'f', isMil: true },
  { value: getSiValue(12), symbol: 'p', isMil: true },
  { value: getSiValue(9), symbol: 'n', isMil: true },
  { value: getSiValue(6), symbol: 'μ', isMil: true },
  { value: getSiValue(3), symbol: 'm', isMil: true },
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
const floats = new RegExp('^[+]?[0-9]*[.,]{1}[0-9]*$');
const ints = new RegExp('^[+]?[0-9]+$');
const alphaFloats = new RegExp('^[+]?[0-9]*[.,]{1}[0-9]*[' + allowedSymbols + ']{1}$');
const alphaInts = new RegExp('^[+]?[0-9]*[' + allowedSymbols + ']{1}$');

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
  if (!floats.test(input) && !ints.test(input) && !alphaInts.test(input) && !alphaFloats.test(input)) {
    return [null, EvalMessages.GIBBERISH];
  }
  // find the character from the alphanumerics
  const symbol = input.replace(/[0-9.,]/g, '');
  // find the value from the si list
  const siVal = si.find((s) => s.symbol === symbol);
  const numberStr = input.replace(symbol, '').replace(',', '.');
  let numeric: BN = new BN(0);

  if (!siVal) {
    return [null, EvalMessages.SYMBOL_ERROR];
  }
  const decimalsBn = new BN(10).pow(new BN(chainDecimals));
  const containDecimal = numberStr.includes('.');
  const [decPart, fracPart] = numberStr.split('.');
  const fracDecimals = fracPart?.length || 0;
  const fracExp = new BN(10).pow(new BN(fracDecimals));
  numeric = containDecimal ? new BN(new BN(decPart).mul(fracExp).add(new BN(fracPart))) : new BN(new BN(numberStr));
  numeric = numeric.mul(decimalsBn);
  if (containDecimal) {
    numeric = siVal.isMil ? numeric.div(siVal.value).div(fracExp) : numeric.mul(siVal.value).div(fracExp);
  } else {
    numeric = siVal.isMil ? numeric.div(siVal.value) : numeric.mul(siVal.value);
  }
  if (numeric.eq(new BN(0))) {
    return [null, EvalMessages.ZERO];
  }
  return [numeric, EvalMessages.SUCCESS];
}

export function transformToBaseUnit(estFee: string, chainDecimals: number): string {
  const t = estFee.length - chainDecimals;
  let s = '';
  // if chainDecimals are more than the estFee length
  if (t < 0) {
    // add 0 in front (1 less as we want the 0.)
    for (let i = 0; i < Math.abs(t) - 1; i++) {
      s += '0';
    }
    s = s + estFee;
    // remove trailing 0s
    for (let i = 0; i < s.length; i++) {
      if (s.slice(s.length - 1) !== '0') break;
      s = s.substring(0, s.length - 1);
    }
    s = '0.' + s;
  } else {
    s = (parseInt(estFee) / 10 ** chainDecimals).toString();
  }
  return parseFloat(s) !== 0 ? s : '0';
}
