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

import { Dispatch, useEffect } from 'react';
import BN from 'bn.js';
import { AccountsActionType, AccountState } from '../../types/accountTypes';
import { useApiCallsContext } from '../../contexts/ApiCallsContextProvider';
import { useSubscriptionsContext } from '../../contexts/SubscriptionsContextProvider';
import { useMountedState } from '../react/useMountedState';

const BLOCK_DURATION = new BN('4');
const TIMER_DURATION = 30000;
const increaseBlock = (current: BN) => current.add(BLOCK_DURATION);
const getBlockAsBN = (block: string) => new BN(block);

const convertToBNAndIncrease = (block: string) => increaseBlock(getBlockAsBN(block));

export default function useAccountsContextSetUp(
  accountState: AccountState,
  dispatchAccount: Dispatch<AccountsActionType>
) {
  const {
    sourceSubscriptions: { bestBlock: currentSourceBlock },
    targetSubscriptions: { bestBlock: currentTargetBlock }
  } = useSubscriptionsContext();

  const [nextSourceBlockNumber, setNextSourceBlockNumber] = useMountedState<BN>(
    convertToBNAndIncrease(currentSourceBlock)
  );
  const [nextTargetBlockNumber, setNextTargetBlockNumber] = useMountedState<BN>(
    convertToBNAndIncrease(currentTargetBlock)
  );

  const [timerId, setTimerId] = useMountedState<NodeJS.Timeout | null>(null);

  const { updateSenderAccountsInformation } = useApiCallsContext();

  useEffect(() => {
    const currentBNSource = getBlockAsBN(currentSourceBlock);
    const currentBNTarget = getBlockAsBN(currentTargetBlock);
    if (currentBNSource.gte(nextSourceBlockNumber) && currentBNTarget.gte(nextTargetBlockNumber)) {
      updateSenderAccountsInformation(dispatchAccount);
      setNextSourceBlockNumber(increaseBlock(currentBNSource));
      setNextTargetBlockNumber(increaseBlock(currentBNTarget));
      if (timerId) {
        clearTimeout(timerId);
        setTimerId(null);
      }
    }
  }, [
    currentSourceBlock,
    currentTargetBlock,
    dispatchAccount,
    nextSourceBlockNumber,
    nextTargetBlockNumber,
    setNextSourceBlockNumber,
    setNextTargetBlockNumber,
    setTimerId,
    timerId,
    updateSenderAccountsInformation
  ]);

  useEffect(() => {
    if (!timerId) {
      const id = setTimeout(() => {
        updateSenderAccountsInformation(dispatchAccount);
        const increasedSourceBlock = increaseBlock(nextSourceBlockNumber);
        const increasedTargetBlock = increaseBlock(nextTargetBlockNumber);
        setNextSourceBlockNumber(increasedSourceBlock);
        setNextTargetBlockNumber(increasedTargetBlock);
        clearTimeout(timerId!);
        setTimerId(null);
      }, TIMER_DURATION);
      setTimerId(id);
    }
  }, [
    dispatchAccount,
    nextSourceBlockNumber,
    nextTargetBlockNumber,
    setNextSourceBlockNumber,
    setNextTargetBlockNumber,
    setTimerId,
    timerId,
    updateSenderAccountsInformation
  ]);
}
