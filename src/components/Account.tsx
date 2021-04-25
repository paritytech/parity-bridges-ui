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
import React from 'react';
import styled from 'styled-components';

import useApiBalance from '../hooks/useApiBalance';
import useBalance from '../hooks/useBalance';

interface Props {
  value: string;
  text?: string;
  className?: string;
  chain?: string | undefined;
  isDerived?: boolean;
  onClick?: any;
}

const Account = ({ className, text, value, chain, isDerived = false, onClick }: Props) => {
  const { api, address } = useApiBalance(value, chain, isDerived);
  const state = useBalance(api, address, true);
  const verifiedText = text ? text : value;

  return (
    <Container onClick={onClick} className={className}>
      <div className="icon">
        <People />
      </div>
      <div className="address">
        <p>{verifiedText}</p>
      </div>

      <div className="balance">
        <p>{state ? state.formattedBalance : '-'}</p>
      </div>
    </Container>
  );
};

export default styled(Account)`
  margin: auto 0;
  display: flex;
  justify-content: space-between;
  min-width: 700px;
  .icon {
    float: left;
  }
  .address {
    float: left;
    margin-left: 10px;
    min-width: 80%;
  }

  .balances {
    min-width: 20%;
    float: right;
    padding: 5px;
    border: 1px solid;
  }
`;
