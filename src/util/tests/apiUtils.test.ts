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

import { genericCall } from '../apiUtlis';

describe('genericCall', () => {
  let successCall: jest.Mock<any[], any>;
  let failedCall: jest.Mock;
  const testData = 'this is a data message';
  const message = 'this is an error message';
  const emptyData = { testData: 'empty' };
  beforeEach(() => {
    successCall = jest.fn().mockResolvedValue({ testData });
    failedCall = jest.fn().mockRejectedValue({ message });
  });

  describe('returned values', () => {
    describe('without emptyData', () => {
      it('should return expected data with no errors', async () => {
        const { data, error } = await genericCall({ call: successCall });
        expect(error).toBeNull();
        expect(data).toEqual({ testData });
      });

      it('should fail and null data and error mesage', async () => {
        const { data, error } = await genericCall({ call: failedCall });
        expect(data).toBeNull();
        expect(error).toEqual(message);
      });
    });

    describe('with emptyData', () => {
      it('should return expected data with no errors', async () => {
        const { data, error } = await genericCall({ call: successCall, emptyData });
        expect(error).toBeNull();
        expect(data).toEqual(testData);
      });

      it('should fail and null data and error mesage', async () => {
        const { data, error } = await genericCall({ call: failedCall, emptyData });
        expect(data).toEqual(emptyData);
        expect(error).toEqual(message);
      });
    });
  });

  describe('dispatchers', () => {
    let dispatch: jest.Mock;

    beforeEach(() => {
      dispatch = jest.fn();
    });

    describe('without emptyData', () => {
      it('should call dispatch according to successful execution with no empty data provided', async () => {
        await genericCall({ call: successCall, dispatch });
        expect(dispatch.mock.calls[0]).toEqual([null, null, true]);
        expect(dispatch.mock.calls[1]).toEqual([null, testData, false]);
      });
      it('should call dispatch according to a failed execution with no empty data provided', async () => {
        await genericCall({ call: failedCall, dispatch });
        expect(dispatch.mock.calls[0]).toEqual([null, null, true]);
        expect(dispatch.mock.calls[1]).toEqual([message, null, false]);
      });
    });

    describe('with emptyData', () => {
      it('should call dispatch according to successful execution with no empty data provided', async () => {
        await genericCall({ call: successCall, dispatch, emptyData });
        expect(dispatch.mock.calls[0]).toEqual([null, emptyData, true]);
        expect(dispatch.mock.calls[1]).toEqual([null, testData, false]);
      });
      it('should call dispatch according to a failed execution with no empty data provided', async () => {
        await genericCall({ call: failedCall, dispatch, emptyData });
        expect(dispatch.mock.calls[0]).toEqual([null, emptyData, true]);
        expect(dispatch.mock.calls[1]).toEqual([message, emptyData, false]);
      });
    });
  });
});
