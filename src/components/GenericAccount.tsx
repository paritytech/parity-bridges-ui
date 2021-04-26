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
import styled from 'styled-components';

import { AccountActionCreators } from '../actions/accountActions';
import { getChainConfigs } from '../configs/substrateProviders';
import { useUpdateAccountContext } from '../contexts/AccountContextProvider';
import { useSourceTarget } from '../contexts/SourceTargetContextProvider';
import useBalance from '../hooks/useBalance';
import useReceiver from '../hooks/useReceiver';
import getDeriveAccount from '../util/getDeriveAccount';
import AccountDisplay from './AccountDisplay';

interface Props {
  value: string;
  className?: string;
  isDerived?: boolean;
}

const GenericAccount = ({ className, value }: Props) => {
  const {
    targetChainDetails: {
      targetApiConnection: { api: targetApi },
      targetChain
    },
    sourceChainDetails: { sourceChain }
  } = useSourceTarget();
  const { setReceiver } = useReceiver();
  const { dispatchAccount } = useUpdateAccountContext();
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
    dispatchAccount(AccountActionCreators.setGenericAccount(null));
    dispatchAccount(AccountActionCreators.setDerivedAccount(nativeAddress));

    setReceiver(address);
  };

  const setNativeAsTarget = () => {
    setReceiverandCleanGeneric(nativeAddress);
  };

  const setCompanionAsTarget = () => {
    setReceiverandCleanGeneric(companionAddress);
  };

  return (
    <Container className={className}>
      <div className="row" onClick={setNativeAsTarget}>
        <AccountDisplay accountName="Native" address={nativeAddress} balance={nativeState.formattedBalance} hasBorder />
      </div>
      <div className="row" onClick={setCompanionAsTarget}>
        <AccountDisplay
          address={companionAddress}
          accountName="Companion"
          balance={companionState.formattedBalance}
          hasBorder
        />
      </div>
    </Container>
  );
};

export default styled(GenericAccount)`
  margin: auto 0;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  min-width: 100%;
  .row {
    min-width: 100%;
    flex-direction: column;
    min-width: 800px;
  }
  .icon {
    float: left;
  }
  .address {
    float: left;
    margin-left: 10px;
  }

  .balances {
    float: right;
    padding: 5px;
    border: 1px solid;
  }
  .selected {
    color: green;
  }
`;
