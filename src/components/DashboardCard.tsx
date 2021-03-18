// Copyright 2019-2020 Parity Technologies (UK) Ltd.
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

import { SOURCE } from '../constants';
import useDashboard from '../hooks/useDashboard';
import useDashboardProfile from '../hooks/useDashboardProfile';
import { ChainTypes } from '../types/sourceTargetTypes';

interface Props {
  chainType: ChainTypes;
  useApiContext: Function;
  className?: string;
}

const DashboardCard = ({ chainType, useApiContext, className }: Props) => {
  const { destination, local } = useDashboardProfile(chainType);
  const {
    bestBlockFinalized,
    bestBlock,
    importedHeaders: bestBridgedFinalizedBlock,
    outboundLanes: { totalMessages, pendingMessages },
    inboundLanes: { bridgeReceivedMessages }
  } = useDashboard({ destination, local, useApiContext });

  const headerText = chainType === SOURCE ? 'Source' : 'Target';
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
