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

/* eslint-disable @typescript-eslint/no-unused-vars */

import React from 'react';
import { Card, Container } from 'semantic-ui-react';
import styled from 'styled-components';

import { SOURCE, TARGET } from '../constants';
import { useApiSourcePromiseContext } from '../contexts/ApiPromiseSourceContext';
import { useApiTargetPromiseContext } from '../contexts/ApiPromiseTargetContext';
import { useTransactionContext } from '../contexts/TransactionContext';
import useDashboard from '../hooks/useDashboard';
import useDashboardProfile from '../hooks/useDashboardProfile';
import useLoadingApi from '../hooks/useLoadingApi';

interface Props {
  className?: string;
}

const CurrentExecutionStatus = ({ className }: Props) => {
  const areApiLoading = useLoadingApi();
  const { currentTransaction } = useTransactionContext();
  const { destination: sourceDestination, local: sourceLocal } = useDashboardProfile(SOURCE);
  const { bestBlockFinalized } = useDashboard({
    destination: sourceDestination,
    local: sourceLocal,
    useApiContext: useApiSourcePromiseContext
  });
  const { destination, local } = useDashboardProfile(TARGET);
  const { bestBlock: targetSourceBlock } = useDashboard({
    destination,
    local,
    useApiContext: useApiTargetPromiseContext
  });
  if (!areApiLoading) {
    return null;
  }

  if (!currentTransaction) {
    return null;
  }

  const isDone = (status: boolean) => (status ? 'DONE' : 'RUNNING');

  const step1 = currentTransaction.block > 0 ? `included in block ${currentTransaction.block}` : 'RUNNING';
  const step2 = parseInt(targetSourceBlock) > currentTransaction.block;

  return (
    <Container className={className}>
      <Card className="container">
        <Card.Content header={'Transaction'} />
        <Card.Description className="description">
          <div>Step 1: {step1}</div>
          <div>Step 2: {isDone(step2)}</div>
        </Card.Description>
      </Card>
    </Container>
  );
};
export default styled(CurrentExecutionStatus)`
  word-wrap: break-word;
  .divider {
    max-width: 80%;
  }
  .description {
    margin: 10px;
  }
`;
