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

import { useEffect } from 'react';
import { useTransactionContext } from '../../contexts/TransactionContext';
import useTransactionType from './useTransactionType';
import useEstimateFee from './useEstimateFee';
import usePayload from './usePayload';

interface Props {
  input: string | null;
  type: string;
  weightInput?: string | null;
  isValidCall?: boolean;
}

export default function useTransactionPreparation({ input, type, weightInput, isValidCall = true }: Props) {
  const { payload } = useTransactionContext();
  const { call, weight } = useTransactionType({ input, type, weightInput });

  const calculateFee = useEstimateFee();
  const updatePayload = usePayload({ call, weight });

  useEffect(() => {
    calculateFee(payload);
  }, [calculateFee, payload]);

  useEffect(() => {
    if (!isValidCall) {
      return;
    }
    updatePayload();
  }, [isValidCall, updatePayload]);
}
