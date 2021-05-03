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
import React, { useState } from 'react';
import { useUpdateTransactionContext } from '../contexts/TransactionContext';
import { TransactionActionCreators } from '../actions/transactionActions';
import { getChainConfigs } from '../configs/substrateProviders';
import { makeStyles } from '@material-ui/core/styles';
import { useSourceTarget } from '../contexts/SourceTargetContextProvider';
import useBalance from '../hooks/useBalance';
import getDeriveAccount from '../util/getDeriveAccount';
import shorterItem from '../util/shortenItem';
import AccountDisplay, { AddressKind } from './AccountDisplay';

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

const NATIVE = 'NATIVE';
const DERIVED = 'DERIVED';

const GenericAccount = ({ value }: Props) => {
  const [selected, setSelected] = useState('');
  const classes = useStyles();
  const {
    targetChainDetails: {
      targetApiConnection: { api: targetApi },
      targetChain
    },
    sourceChainDetails: {
      sourceApiConnection: { api: sourceApi },
      sourceChain
    }
  } = useSourceTarget();

  const { dispatchTransaction } = useUpdateTransactionContext();
  const chainsConfigs = getChainConfigs();
  const { bridgeId } = chainsConfigs[sourceChain];
  const { SS58Format: targetSS58Format } = chainsConfigs[targetChain];

  const nativeAddress = encodeAddress(value, targetSS58Format);
  const nativeState = useBalance(sourceApi, nativeAddress, true);

  const derivedAddress = getDeriveAccount({
    SS58Format: targetSS58Format,
    address: value,
    bridgeId
  });
  const derivedState = useBalance(targetApi, derivedAddress, true);

  const setNativeAsTarget = () => {
    setSelected(NATIVE);
    dispatchTransaction(TransactionActionCreators.setReceiverAddress(nativeAddress));
  };

  const setCompanionAsTarget = () => {
    setSelected(DERIVED);
    dispatchTransaction(TransactionActionCreators.setReceiverAddress(derivedAddress));
  };

  const shortGenericAddress = shorterItem(value);
  return (
    <Container className={classes.container}>
      {(!selected || selected === NATIVE) && (
        <div className={classes.native} onClick={setNativeAsTarget}>
          <AccountDisplay
            address={nativeAddress}
            addressKind={AddressKind.NATIVE}
            balance={nativeState.formattedBalance}
            friendlyName={shortGenericAddress}
            hideAddress
          />
        </div>
      )}
      {(!selected || selected === DERIVED) && (
        <div className={classes.companion} onClick={setCompanionAsTarget}>
          <AccountDisplay
            address={derivedAddress}
            addressKind={AddressKind.COMPANION}
            balance={derivedState.formattedBalance}
            friendlyName={shortGenericAddress}
            hideAddress
          />
        </div>
      )}
    </Container>
  );
};

export default GenericAccount;
