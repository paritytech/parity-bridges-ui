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

import React from 'react';
import { Card, Container } from 'semantic-ui-react';
import styled from 'styled-components';

import { useTransactionContext } from '../contexts/TransactionContext';
import useCurrentExecutionStatus from '../hooks/useCurrentExecutionStatus';
import { TransactionStatusEnum } from '../types/transactionTypes';

interface Props {
  className?: string;
}

const CurrentExecutionStatus = ({ className }: Props) => {
  const steps = useCurrentExecutionStatus();
  const { currentTransaction } = useTransactionContext();

  if (!steps.length || !currentTransaction) {
    return null;
  }

  const status = currentTransaction.status === TransactionStatusEnum.COMPLETED ? 'Completed' : 'In Progress';
  return (
    <Container className={className}>
      <Card className="card">
        <Card.Content header={`Transaction: ${status}`} />
        <Card.Description className="description">
          {steps.map(({ chainType, label, status }, idx) => (
            <p key={idx}>
              {chainType}: {label}: {status}
            </p>
          ))}
        </Card.Description>
      </Card>
    </Container>
  );
};

export default styled(CurrentExecutionStatus)`
  word-wrap: break-word;
  .card {
    min-width: 80%;
  }
  .description {
    margin: 10px;
  }
`;
