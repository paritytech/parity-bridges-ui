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

import { DisplayPayload } from '../../types/transactionTypes';
import { getDisplayPayload } from '../../util/transactionUtils';
import useApiCalls from '../api/useApiCalls';

const useTransactionPayloadDisplay = () => {
  const { payload, receiverAddress } = useTransactionContext();
  const [payloadHex, setPayloadHex] = useState<string | null>(null);
  const [displayPayload, setDisplayPayload] = useState<DisplayPayload | null>(null);

  const {
    sourceChainDetails: { chain: sourceChain }
  } = useSourceTarget();
  const { createType } = useApiCalls();

  useEffect(() => {
    if (!receiverAddress) {
      setPayloadHex(null);
      setDisplayPayload(null);
    }
    if (payload) {
      //@ts-ignore
      const payloadType = createType(sourceChain, 'OutboundPayload', payload);
      setPayloadHex(payloadType.toHex());
    }
    //@ts-ignorex
    setDisplayPayload(getDisplayPayload(payload));
  }, [receiverAddress, payload, setDisplayPayload, setPayloadHex, createType, sourceChain]);

  return { payloadHex, displayPayload };
};

export default useTransactionPayloadDisplay;
