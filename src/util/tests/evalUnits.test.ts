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
  it('Should input integer', () => {
    const [actualValue, msg] = evalUnits('666');
    expect(actualValue).toBe(666);
    expect(msg).toBe(EvalMessages.SUCCESS);
  });

  it('Should accept as input, float (dot for decimal symbol)', () => {
    const [actualValue, msg] = evalUnits('1.23');
    expect(actualValue).toBe(1.23);
    expect(msg).toBe(EvalMessages.SUCCESS);
  });

  it('Should accept as input, float (comma for decimal symbol)', () => {
    const [actualValue, msg] = evalUnits('1,23');
    expect(actualValue).toBe(1.23);
    expect(msg).toBe(EvalMessages.SUCCESS);
  });

  it('Should accept as input an expression (1k)', () => {
    const [actualValue, msg] = evalUnits('1k');
    expect(actualValue).toBe(1e3);
    expect(msg).toBe(EvalMessages.SUCCESS);
  });

  it('Should accept as input an float expression with dot as symbol (1.2k)', () => {
    const [actualValue, msg] = evalUnits('1.2k');
    expect(actualValue).toBe(1.2 * 1e3);
    expect(msg).toBe(EvalMessages.SUCCESS);
  });

  it('Should accept as input an float expression with commas as symbol (1,2k)', () => {
    const [actualValue, msg] = evalUnits('1,2k');
    expect(actualValue).toBe(1.2 * 1e3);
    expect(msg).toBe(EvalMessages.SUCCESS);
  });

  // Extreme happy paths
  it('Should accept as input an expression (5y)', () => {
    const [actualValue, msg] = evalUnits('5y');
    expect(actualValue).toBe(5 * -1e24);
    expect(msg).toBe(EvalMessages.SUCCESS);
  });

  it('Should accept as input an expression (1.2z)', () => {
    const [actualValue, msg] = evalUnits('1.2z');
    expect(actualValue).toBe(1.2 * -1e21);
    expect(msg).toBe(EvalMessages.SUCCESS);
  });

  it('Should accept as input an expression (3Y)', () => {
    const [actualValue, msg] = evalUnits('3Y');
    expect(actualValue).toBe(3 * 1e24);
    expect(msg).toBe(EvalMessages.SUCCESS);
  });

  it('Should accept as input an expression (7.9E)', () => {
    const [actualValue, msg] = evalUnits('7.9E');
    expect(actualValue).toBe(7.9 * 1e18);
    expect(msg).toBe(EvalMessages.SUCCESS);
  });

  // Not so happy paths
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
});
