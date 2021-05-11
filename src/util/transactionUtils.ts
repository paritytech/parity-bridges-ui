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

import { ChainDetails } from '../types/sourceTargetTypes';
import { TransactionStatusType, TransactionStatusEnum } from '../types/transactionTypes';
import { SourceTargetState } from '../types/sourceTargetTypes';

interface Input {
  useSourceTarget: () => SourceTargetState;
  transaction: TransactionStatusType;
}

export function getTransactionSourceTarget({ useSourceTarget, transaction }: Input) {
  const {
    sourceChainDetails: { sourceChain: currentSourceChain }
    // eslint-disable-next-line react-hooks/rules-of-hooks
  } = useSourceTarget();
  const { sourceChain, targetChain } = transaction;

  const sourceChainsMatch = sourceChain === currentSourceChain;

  const sourceTransaction = sourceChainsMatch ? ChainDetails.SOURCE : ChainDetails.TARGET;
  const targetTransaction = sourceChainsMatch ? ChainDetails.TARGET : ChainDetails.SOURCE;

  return { sourceTransaction, targetTransaction, sourceChain, targetChain };
}

export function isTransactionCompleted(transaction: TransactionStatusType): boolean {
  return transaction.status === TransactionStatusEnum.COMPLETED;
}
