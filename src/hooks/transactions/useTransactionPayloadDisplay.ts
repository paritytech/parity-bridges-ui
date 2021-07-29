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

import { useEffect, useState } from 'react';
import { useSourceTarget } from '../../contexts/SourceTargetContextProvider';
import { useTransactionContext } from '../../contexts/TransactionContext';

import { TransactionDisplayPayload } from '../../types/transactionTypes';
import { getTransactionDisplayPayload } from '../../util/transactions/';
import useApiCalls from '../api/useApiCalls';
import { useAccountContext } from '../../contexts/AccountContextProvider';

interface Output {
  transactionDisplayPayload: TransactionDisplayPayload | null;
  payloadHex: string | null;
}

const emptyState = { payloadHex: null, transactionDisplayPayload: null };

const useTransactionPayloadDisplay = () => {
  const { payload } = useTransactionContext();

  const [payloadDisplay, setPayloadDisplay] = useState<Output>(emptyState);
  const sourceTargetDetails = useSourceTarget();
  const { createType } = useApiCalls();
  const { account } = useAccountContext();

  useEffect(() => {
    if (payload && account) {
      setPayloadDisplay(
        getTransactionDisplayPayload({
          payload,
          account: account.address,
          createType,
          sourceTargetDetails
        })
      );
    } else {
      setPayloadDisplay(emptyState);
    }
  }, [account, createType, payload, sourceTargetDetails]);

  return payloadDisplay;
};

export default useTransactionPayloadDisplay;
