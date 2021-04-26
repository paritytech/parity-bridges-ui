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

import { Card, CardContent, CardHeader, Container } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';

import { Step, TransactionStatusEnum, TransanctionStatus } from '../types/transactionTypes';

interface Props {
  className?: string;
  steps: Array<Step>;
  transaction: TransanctionStatus;
}

const TransactionDisplay = ({ transaction, steps, className }: Props) => {
  if (!steps.length) {
    return null;
  }

  const status = transaction.status === TransactionStatusEnum.COMPLETED ? 'Completed' : 'In Progress';
  return (
    <Container className={className}>
      <Card className="card">
        <CardHeader className="description" title={`Transaction: ${transaction.type}`} />
        <CardContent>
          <h4>Status: {status}</h4>
          {steps.map(({ chainType, label, status }, idx) => (
            <p key={idx}>
              {chainType}: {label}: {status}
            </p>
          ))}
        </CardContent>
      </Card>
    </Container>
  );
};

export default styled(TransactionDisplay)`
  word-wrap: break-word;
  .card {
    min-width: 80%;
  }
  .description {
    margin: 10px;
  }
`;
