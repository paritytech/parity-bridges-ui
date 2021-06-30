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

import { evalUnits, EvalMessages } from '../evalUnits';

describe('Tests suite - evalUnits', () => {
  // Happy paths
  it('Should input string', () => {
    const [actualResult, msg] = evalUnits('666');
    expect(actualResult).toBe(666);
    expect(msg).toBe(EvalMessages.SUCCESS);
  });

  // FOR SOME REASON JEST DO NOT WANT TO WORK WITH BN (????)

  it('Should accept as input, float (dot for decimal symbol)', () => {
    const [actualResult, msg] = evalUnits('1.23');
    expect(actualResult).toBe(1.23);
    expect(msg).toBe(EvalMessages.SUCCESS);
  });

  it('Should accept as input, float (comma for decimal symbol)', () => {
    const [actualResult, msg] = evalUnits('1,23');
    expect(actualResult).toBe(1.23);
    expect(msg).toBe(EvalMessages.SUCCESS);
  });

  it('Should accept as input an expression (1k)', () => {
    const [actualResult, msg] = evalUnits('1k');
    expect(actualResult?.toString()).toBe('1000');
    expect(msg).toBe(EvalMessages.SUCCESS);
  });

  it('Should accept as input an float expression with dot as symbol (1.2k)', () => {
    const [actualResult, msg] = evalUnits('1.2k');
    expect(actualResult?.toString()).toBe('1200');
    expect(msg).toBe(EvalMessages.SUCCESS);
  });

  it('Should accept as input an float expression with commas as symbol (1,2k)', () => {
    const [actualResult, msg] = evalUnits('1,2k');
    expect(actualResult?.toString()).toBe('1200');
    expect(msg).toBe(EvalMessages.SUCCESS);
  });

  // Extreme happy paths
  it('Should accept as input an expression (3Y)', () => {
    const [actualResult, msg] = evalUnits('3Y');
    expect(actualResult?.toString()).toBe('3000000000000000');
    expect(msg).toBe(EvalMessages.SUCCESS);
  });

  it('Should accept as input an expression (7.9Y)', () => {
    const [actualResult, msg] = evalUnits('7.9Y');
    expect(actualResult?.toString()).toBe('7900000000000000');
    expect(msg).toBe(EvalMessages.SUCCESS);
  });

  // Not so happy paths
  it('Should accept as input an expression (5f) and respond with "Negative" error', () => {
    const [actualResult, msg] = evalUnits('5f');
    expect(actualResult?.toString()).toBe('-5000000000000000');
    expect(msg).toBe(EvalMessages.NEGATIVE);
  });

  it('Should accept as input something gibberish (good23) and return error message', () => {
    const [actualValue, msg] = evalUnits('good23');
    expect(actualValue).toBeFalsy;
    expect(msg).toBe(EvalMessages.GIBBERISH);
  });

  it('Should accept as input double decimal symbols (1,23.445k) and return error message', () => {
    const [actualValue, msg] = evalUnits('1,23.445k');
    expect(actualValue).toBeFalsy;
    expect(msg).toBe(EvalMessages.GIBBERISH);
  });

  it('Should accept as input a HUGE number and be fine with that', () => {
    const [, msg] = evalUnits((Number.MAX_SAFE_INTEGER + 10).toString());
    expect(msg).toBe(EvalMessages.SUCCESS);
  });
});
