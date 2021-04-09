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

import useDashboard from '../hooks/useDashboard';
import { ChainDetails } from '../types/sourceTargetTypes';

interface Props {
  chainDetail: ChainDetails;
  className?: string;
}

const DashboardCard = ({ chainDetail, className }: Props) => {
  const {
    bestBlockFinalized,
    bestBlock,
    bestBridgedFinalizedBlock,
    outboundLanes: { totalMessages, pendingMessages },
    inboundLanes: { bridgeReceivedMessages },
    local
  } = useDashboard(chainDetail);

  const headerText = chainDetail === ChainDetails.SOURCE ? 'Source' : 'Target';
  return (
    <Container className={className}>
      <Card className="container">
        <Card.Content header={`${headerText}: ${local}`} />
        <Card.Description className="description">
          <div>Best Block: {bestBlock}</div>
          <div>Best Finalized block: {bestBlockFinalized}</div>

          <div>Pending Messages: {pendingMessages}</div>
          <div>Total Messages: {totalMessages}</div>

          <hr className="divider" />
          <div>Best Target Finalized block: {bestBridgedFinalizedBlock}</div>
          <div>Received Messages: {bridgeReceivedMessages}</div>
        </Card.Description>
      </Card>
    </Container>
  );
};
export default styled(DashboardCard)`
  word-wrap: break-word;
  .divider {
    max-width: 80%;
  }
  .description {
    margin: 10px;
  }
`;
