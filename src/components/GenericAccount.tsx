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

import Container from '@material-ui/core/Container';
import { encodeAddress } from '@polkadot/util-crypto';
import React from 'react';
import { useUpdateTransactionContext } from '../contexts/TransactionContext';
import { TransactionActionCreators } from '../actions/transactionActions';
import { getChainConfigs } from '../configs/substrateProviders';
import { makeStyles } from '@material-ui/core/styles';
import { useSourceTarget } from '../contexts/SourceTargetContextProvider';
import useBalance from '../hooks/useBalance';
import useReceiver from '../hooks/useReceiver';
import getDeriveAccount from '../util/getDeriveAccount';
import AccountDisplay from './AccountDisplay';

interface Props {
  value: string;
  isDerived?: boolean;
}

const useStyles = makeStyles(() => ({
  container: {
    padding: '0',
    float: 'left'
  },
  native: {
    border: '1px solid',
    borderTop: 'none',
    padding: '5px 0'
  },
  companion: {
    border: '1px solid',
    borderTop: 'none',
    borderRadius: '0 0 5px 5px',
    padding: '5px 0'
  }
}));

const GenericAccount = ({ value }: Props) => {
  const classes = useStyles();
  const {
    targetChainDetails: {
      targetApiConnection: { api: targetApi },
      targetChain
    },
    sourceChainDetails: { sourceChain }
  } = useSourceTarget();
  const { setReceiver } = useReceiver();

  const { dispatchTransaction } = useUpdateTransactionContext();
  const chainsConfigs = getChainConfigs();
  const { bridgeId, SS58Format: sourceSS58Format } = chainsConfigs[sourceChain];
  const { SS58Format: targetSS58Format } = chainsConfigs[targetChain];

  const nativeAddress = encodeAddress(value, targetSS58Format);
  const nativeState = useBalance(targetApi, nativeAddress, true);

  const sourceAddressType = encodeAddress(value, sourceSS58Format);
  const companionAddress = getDeriveAccount({
    SS58Format: targetSS58Format,
    address: sourceAddressType,
    bridgeId
  });
  const companionState = useBalance(targetApi, companionAddress, true);

  const setReceiverandCleanGeneric = (address: string) => {
    dispatchTransaction(TransactionActionCreators.setGenericAccount(null));
    dispatchTransaction(TransactionActionCreators.setDerivedAccount(nativeAddress));

    setReceiver(address);
  };

  const setNativeAsTarget = () => {
    setReceiverandCleanGeneric(nativeAddress);
  };

  const setCompanionAsTarget = () => {
    setReceiverandCleanGeneric(companionAddress);
  };

  return (
    <Container className={classes.container}>
      <div className={classes.native} onClick={setNativeAsTarget}>
        <AccountDisplay accountName="Native" address={nativeAddress} balance={nativeState.formattedBalance} />
      </div>
      <div className={classes.companion} onClick={setCompanionAsTarget}>
        <AccountDisplay address={companionAddress} accountName="Companion" balance={companionState.formattedBalance} />
      </div>
    </Container>
  );
};

export default GenericAccount;
