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
import People from '@material-ui/icons/People';
import { encodeAddress } from '@polkadot/util-crypto';
import ctx from 'classnames';
import React, { useState } from 'react';
import styled from 'styled-components';

import { getChainConfigs } from '../configs/substrateProviders';
import { useSourceTarget } from '../contexts/SourceTargetContextProvider';
import useBalance from '../hooks/useBalance';
import useReceiver from '../hooks/useReceiver';
import getDeriveAccount from '../util/getDeriveAccount';

interface Props {
  value: string;
  className?: string;
  isDerived?: boolean;
  onClick?: any;
}

export enum ConvertionType {
  COMPANION = 'COMPANION',
  DERIVED_TARGET = 'DERIVED_TARGET'
}

const GenericAccount = ({ className, value, onClick }: Props) => {
  const [selected, setSelected] = useState('');
  const {
    targetChainDetails: {
      targetApiConnection: { api: targetApi },
      targetChain
    },
    sourceChainDetails: { sourceChain }
  } = useSourceTarget();
  const { setReceiver } = useReceiver();
  const chainsConfigs = getChainConfigs();
  const { bridgeId, SS58Format: sourceSS58Format } = chainsConfigs[sourceChain];
  const { SS58Format: targetSS58Format } = chainsConfigs[targetChain];

  const companionAddress = encodeAddress(value, targetSS58Format);
  const companionState = useBalance(targetApi, companionAddress, true);

  const sourceAddressType = encodeAddress(value, sourceSS58Format);
  const targetAddressFormat = getDeriveAccount({
    SS58Format: targetSS58Format,
    address: sourceAddressType,
    bridgeId
  });
  const derivedState = useBalance(targetApi, targetAddressFormat, true);

  console.log('companionAddress', companionAddress);
  console.log('targetAddressFormat', targetAddressFormat);

  const setCompanionAsTarget = () => {
    setSelected(ConvertionType.COMPANION);
    setReceiver(companionAddress);
  };

  const setTargetAsTarget = () => {
    setSelected(ConvertionType.DERIVED_TARGET);
    setReceiver(targetAddressFormat);
  };

  const getClassName = (addressType: string) => ctx('row', selected === addressType && 'selected');

  return (
    <Container className={className}>
      <div className="row" onClick={onClick}>
        <div className="icon">
          <People />
        </div>
        <div className="address">
          <p>Generic: {value}</p>
        </div>
      </div>
      <div className={getClassName(ConvertionType.COMPANION)} onClick={setCompanionAsTarget}>
        <div className="icon">
          <People />
        </div>
        <div className="address">
          <p>Companion: {companionAddress}</p>
        </div>

        <div className="balance">
          <p>{companionState ? companionState.formattedBalance : '-'}</p>
        </div>
      </div>
      <div className={getClassName(ConvertionType.DERIVED_TARGET)} onClick={setTargetAsTarget}>
        <div className="icon">
          <People />
        </div>
        <div className="address">
          <p>Target Derived Address: {targetAddressFormat}</p>
        </div>
        <div className="balance">
          <p>{derivedState ? derivedState.formattedBalance : '-'}</p>
        </div>
      </div>
    </Container>
  );
};

export default styled(GenericAccount)`
  margin: auto 0;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  min-width: 800px;
  .row {
    width: 100%
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
