// Copyright 2019-2020 @paritytech/bridge-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

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
      <Card>
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
    margin-bottom: 10px;
  }
`;
