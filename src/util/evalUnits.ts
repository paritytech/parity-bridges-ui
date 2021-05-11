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
const si = [
  { value: -1e24, symbol: 'y' },
  { value: -1e21, symbol: 'z' },
  { value: -1e18, symbol: 'a' },
  { value: -1e15, symbol: 'f' },
  { value: -1e12, symbol: 'p' },
  { value: -1e9, symbol: 'n' },
  { value: -1e6, symbol: 'μ' },
  { value: -1e3, symbol: 'm' },
  { value: 1, symbol: '' },
  { value: 1e3, symbol: 'k' },
  { value: 1e6, symbol: 'M' },
  { value: 1e9, symbol: 'G' },
  { value: 1e12, symbol: 'T' },
  { value: 1e15, symbol: 'P' },
  { value: 1e18, symbol: 'E' },
  { value: 1e21, symbol: 'Z' },
  { value: 1e24, symbol: 'Y' }
];

const floats = /^[0-9]*[.]{1}[0-9]*$/;
const ints = /^[0-9]+$/;
const alphaFloats = /^[0-9]*[.]{1}[0-9]*[a-zA-Z]{1}$/;
const alphaInts = /^[0-9]*[a-zA-Z]{1}$/;

export function evalUnits(input: string): [number | null, string] {
  if (!floats.test(input) && !ints.test(input) && !alphaInts.test(input) && !alphaFloats.test(input)) {
    return [null, 'Input is not correct. Either use numbers with dot as decimal symbol or expression (e.g. 1k, 1.3m).'];
  }

  if (floats.test(input) || ints.test(input)) {
    return [parseFloat(input), ''];
  } else if (alphaInts.test(input) || alphaFloats.test(input)) {
    const numericPart = parseFloat(input);
    const charPart = input.replace(/[0-9.]/g, '');
    const siVal = si.find((s) => s.symbol === charPart);
    if (siVal) {
      return [numericPart * siVal.value, ''];
    } else {
      return [null, 'Provided symbol is not correct'];
    }
  } else {
    return [null, 'Sonmething went wrong'];
  }
}
