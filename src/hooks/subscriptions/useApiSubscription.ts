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

import { UnsubscribePromise } from '@polkadot/api/types';
import { useEffect } from 'react';
import logger from '../../util/logger';

export function useApiSubscription(fn: () => UnsubscribePromise, isReady: boolean): void {
  useEffect(() => {
    if (!isReady) {
      return;
    }

    try {
      const unsub = fn();
      return () => {
        isReady &&
          unsub &&
          unsub
            .then((u) => u())
            .catch((e) => {
              logger.error('error unsubscribing', e);
            });
      };
    } catch (e) {
      logger.error('error executing subscription', e);
    }
  }, [fn, isReady]);
}
