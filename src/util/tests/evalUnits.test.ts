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

import { EvalMessages } from '../../types/transactionTypes';
import { evalUnits, transformToBaseUnit } from '../evalUnits';

const defaultChainDecimals = 9;

describe('Tests suite - evalUnits', () => {
  // Happy paths
  it('Should input string', () => {
    const [actualResult, msg] = evalUnits('666', defaultChainDecimals);
    expect(actualResult?.toString()).toBe('666000000000');
    expect(msg).toBe(EvalMessages.SUCCESS);
  });

  it('Should accept as input, float (dot for decimal symbol)', () => {
    const [actualResult, msg] = evalUnits('1.23', defaultChainDecimals);
    expect(actualResult?.toString()).toBe('1230000000');
    expect(msg).toBe(EvalMessages.SUCCESS);
  });

  it('Should accept as input, float (comma for decimal symbol)', () => {
    const [actualResult, msg] = evalUnits('1,23', defaultChainDecimals);
    expect(actualResult?.toString()).toBe('1230000000');
    expect(msg).toBe(EvalMessages.SUCCESS);
  });

  it('Should accept as input an expression (1k)', () => {
    const [actualResult, msg] = evalUnits('1k', defaultChainDecimals);
    expect(actualResult?.toString()).toBe('1000000000000');
    expect(msg).toBe(EvalMessages.SUCCESS);
  });

  it('Should accept as input an float expression with dot as dec separator (1.2k)', () => {
    const [actualResult, msg] = evalUnits('1.2k', defaultChainDecimals);
    expect(actualResult?.toString()).toBe('1200000000000');
    expect(msg).toBe(EvalMessages.SUCCESS);
  });

  it('Should accept as input an float expression with comma as dec separator (1,2k)', () => {
    const [actualResult, msg] = evalUnits('1,2k', defaultChainDecimals);
    expect(actualResult?.toString()).toBe('1200000000000');
    expect(msg).toBe(EvalMessages.SUCCESS);
  });

  it('Should accept as input an float expression with mili symbol (1.2m)', () => {
    const [actualResult, msg] = evalUnits('1.2m', defaultChainDecimals);
    expect(actualResult?.toString()).toBe('1200000');
    expect(msg).toBe(EvalMessages.SUCCESS);
  });

  it('Should accept as input an float expression with mili symbol (0.002μ)', () => {
    const [actualResult, msg] = evalUnits('0.002μ', defaultChainDecimals);
    expect(actualResult?.toString()).toBe('2');
    expect(msg).toBe(EvalMessages.SUCCESS);
  });

  it('Should accept as input an float expression with mili symbol (13000000f)', () => {
    const [actualResult, msg] = evalUnits('13000000f', defaultChainDecimals);
    expect(actualResult?.toString()).toBe('13');
    expect(msg).toBe(EvalMessages.SUCCESS);
  });

  it('Should accept as input an float expression (100000000000000000.1)', () => {
    const [actualResult, msg] = evalUnits('100000000000000000.1', defaultChainDecimals);
    expect(actualResult?.toString()).toBe('100000000000000000100000000');
    expect(msg).toBe(EvalMessages.SUCCESS);
  });

  // Not so happy paths
  it('Should accept as input something gibberish (good23) and return error message', () => {
    const [actualValue, msg] = evalUnits('good23', defaultChainDecimals);
    expect(actualValue).toBeFalsy;
    expect(msg).toBe(EvalMessages.GIBBERISH);
  });

  it('Should accept as input double decimal symbols (1,23.445k) and return error message', () => {
    const [actualValue, msg] = evalUnits('1,23.445k', defaultChainDecimals);
    expect(actualValue).toBeFalsy;
    expect(msg).toBe(EvalMessages.GIBBERISH);
  });
});

describe('Tests suite - transformToBaseUnit', () => {
  it('Should accept a fee (275002583) and return to Base unit', () => {
    const result = transformToBaseUnit('275002583', 9);
    expect(result).toBe('0.275002583');
  });
});
