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

import Button from '@material-ui/core/Button';
import React from 'react';

import { INCORRECT_FORMAT } from '../constants';
import { useTransactionContext } from '../contexts/TransactionContext';
interface Props {
  receiverToDerive: {
    formatFound: string;
    formattedAccount: string;
  };
  targetChain: string;
  onDeriveReceiver: () => void;
}

export default function AccountFormatFeedback({ receiverToDerive, targetChain, onDeriveReceiver }: Props) {
  const { isReceiverValid, receiverAddress } = useTransactionContext();
  const { formatFound, formattedAccount } = receiverToDerive;

  if (formatFound && !isReceiverValid && receiverAddress) {
    if (formatFound === INCORRECT_FORMAT) {
      return (
        <p>
          Address provided does not seem to belong to any recognized chain for this bridge. Please provide a valid
          address.
        </p>
      );
    }
    return (
      <div>
        <p>The address provided has a format from a {formatFound} chain.</p>
        <p>
          Please confirm if you want to transfer to the corresponding {targetChain} account {formattedAccount}
        </p>
        <Button variant="contained" onClick={onDeriveReceiver}>
          Set {targetChain} address receiver
        </Button>
      </div>
    );
  }
  return null;
}
