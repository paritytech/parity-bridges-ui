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

import useCurrentExecutionStatus from '../hooks/useCurrentExecutionStatus';

interface Props {
  className?: string;
}

const CurrentExecutionStatus = ({ className }: Props) => {
  const { step1, step2, step3, step4, step5, step6, show } = useCurrentExecutionStatus();

  if (!show) {
    return null;
  }
  return (
    <Container className={className}>
      <Card className="container">
        <Card.Content header="Current Transaction" />
        <Card.Description className="description">
          <div>Step 1: {step1}</div>
          <div>Step 2: {step2}</div>
          <div>Step 3: {step3}</div>
          <div>Step 4: {step4}</div>
          <div>Step 5: {step5}</div>
          <div>Step 6: {step6}</div>
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
