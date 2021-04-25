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

/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Container, TextField } from '@material-ui/core';
import React, { useState } from 'react';
import styled from 'styled-components';

import { useSourceTarget } from '../contexts/SourceTargetContextProvider';
import { useTransactionContext } from '../contexts/TransactionContext';
import useReceiver from '../hooks/useReceiver';
import Account from './Account';
import GenericAddress from './GenericAccount';

interface Props {
  className?: string;
}
const emptyReceiverToDerive = { formatFound: '', formattedAccount: '' };

const AccountInput = ({ className }: Props) => {
  const [addressInput, setAddresInput] = useState('');
  const [derivedAddress, setDeriveAddress] = useState('');
  const [isGeneric, setIsGeneric] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [receiverToDerive, setReceiverToDerive] = useState(emptyReceiverToDerive);
  const { setReceiver, validateAccount, setReceiverValidation } = useReceiver();
  const {
    targetChainDetails: { targetChain }
  } = useSourceTarget();
  const { receiverAddress } = useTransactionContext();
  const onClick = () => {
    setShowAccount(false);
    setIsGeneric(false);
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const receiver = event.target.value;

    setAddresInput(receiver);
    setIsGeneric(false);
    if (!receiver) {
      return;
    }
    const { formattedAccount, formatFound } = validateAccount(receiver)!;
    setShowAccount(true);
    if (formatFound === 'GENERIC') {
      setIsGeneric(true);
      return;
    }
    if (formatFound) {
      setReceiver(formattedAccount);
      setDeriveAddress(formattedAccount);
    } else {
      setDeriveAddress('');
      setReceiver(receiver);
    }
  };

  const onDeriveReceiver = () => {
    setReceiver(receiverToDerive.formattedAccount);
    setReceiverToDerive(emptyReceiverToDerive);
    setReceiverValidation(true);
  };

  /**

   cambiar logica para que muestre 3 casos:
  todo:  crear state que diga que caso es

  1) valid target account
  2) valid derived: muestra  addressInput arriba y derived abajo.
  3) seleccionador de caso: decodeAsTarget() o derived.
  */

  console.log('isGeneric', isGeneric);
  console.log('addressInput', addressInput);
  console.log('showAccount', showAccount);
  console.log('receiverAddress', receiverAddress);

  return (
    <Container className={className}>
      {!showAccount && (
        <TextField
          fullWidth
          onClick={onClick}
          onChange={onChange}
          value={addressInput}
          label="Receiver"
          variant="outlined"
        />
      )}
      <div className="values">
        {showAccount && receiverAddress && !derivedAddress && !isGeneric && (
          <>
            <div>
              <Account value={receiverAddress} chain={targetChain} onClick={onClick} />
            </div>
          </>
        )}
        {showAccount && derivedAddress && !isGeneric && (
          <div>
            <Account value={addressInput} chain={targetChain} onClick={onClick} />{' '}
            <Account value={derivedAddress} chain={targetChain} onClick={onClick} isDerived />{' '}
          </div>
        )}

        {isGeneric && (
          <div>
            <GenericAddress value={addressInput} onClick={onClick} />
          </div>
        )}
      </div>
    </Container>
  );
};

export default styled(AccountInput)`
  margin: auto 0;
  display: flex;
  justify-content: space-between;
  min-width: 100%;
  .icon {
    min-width: 20%;
    float: left;
  }
  .address {
    min-width: 60%;
  }

  .balances {
    min-width: 20%;
    float: right;
    padding: 5px;
    border: 1px solid;
  }
  .values {
    display: flex;
    flex-direction: column;
  }
`;
