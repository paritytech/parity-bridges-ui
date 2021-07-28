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

import { Dispatch, useCallback, useEffect } from 'react';
import BN from 'bn.js';
import { AccountsActionType, AccountState } from '../../types/accountTypes';
import { useApiCallsContext } from '../../contexts/ApiCallsContextProvider';
import { useSubscriptionsContext } from '../../contexts/SubscriptionsContextProvider';
import { useMountedState } from '../react/useMountedState';
import { BLOCK_DURATION, TIMER_DURATION } from '../../constants';

const increaseBlock = (current: BN) => current.add(BLOCK_DURATION);
const getBlockAsBN = (block: string) => new BN(block);

const convertToBNAndIncrease = (block: string) => increaseBlock(getBlockAsBN(block));

interface NextBlockNumbers {
  nextSourceBlockNumber: BN;
  nextTargetBlockNumber: BN;
}

export default function useSendersBalancesContext(
  accountState: AccountState,
  dispatchAccount: Dispatch<AccountsActionType>
) {
  const {
    sourceSubscriptions: { bestBlock: currentSourceBlock },
    targetSubscriptions: { bestBlock: currentTargetBlock }
  } = useSubscriptionsContext();

  const [nextBlockNumbers, setNextBlockNumber] = useMountedState<NextBlockNumbers>({
    nextSourceBlockNumber: convertToBNAndIncrease(currentSourceBlock),
    nextTargetBlockNumber: convertToBNAndIncrease(currentTargetBlock)
  });

  const [timerId, setTimerId] = useMountedState<NodeJS.Timeout | null>(null);

  const { updateSenderAccountsInformation } = useApiCallsContext();

  const updateAccounts = useCallback(() => {
    updateSenderAccountsInformation(dispatchAccount);
    const nextSourceBlockNumber = convertToBNAndIncrease(currentSourceBlock);
    const nextTargetBlockNumber = convertToBNAndIncrease(currentTargetBlock);
    setNextBlockNumber({
      nextSourceBlockNumber,
      nextTargetBlockNumber
    });

    // clear timer id if any
    if (timerId) {
      clearTimeout(timerId);
    }
    // set new timer
    const newTimerId = setTimeout(() => updateAccounts(), TIMER_DURATION);
    setTimerId(newTimerId);
  }, [
    dispatchAccount,
    currentSourceBlock,
    currentTargetBlock,
    setNextBlockNumber,
    setTimerId,
    timerId,
    updateSenderAccountsInformation
  ]);

  const blocksReached =
    getBlockAsBN(currentSourceBlock).gte(nextBlockNumbers.nextSourceBlockNumber) &&
    getBlockAsBN(currentTargetBlock).gte(nextBlockNumbers.nextTargetBlockNumber);

  useEffect(() => {
    if (blocksReached) {
      updateAccounts();
    }
  }, [blocksReached, updateAccounts, timerId]);
}
