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
import { Container, Grid } from 'semantic-ui-react';
import { Button, Dimmer, Icon, Loader } from 'semantic-ui-react';
import styled from 'styled-components';

import { SourceTargetActionsCreators } from '../actions/sourceTargetActions';
import Accounts from '../components/Accounts';
import CustomCall from '../components/CustomCall';
import DashboardCard from '../components/DashboardCard';
import Remark from '../components/Remark';
import SnackBar from '../components/SnackBar';
import Transactions from '../components/Transactions';
import Transfer from '../components/Transfer';
import { useSourceTarget, useUpdateSourceTarget } from '../contexts/SourceTargetContextProvider';
import useLoadingApi from '../hooks/useLoadingApi';
import { ChainDetails } from '../types/sourceTargetTypes';

interface Props {
  className?: string;
}

export function Main({ className }: Props) {
  const areApiLoading = useLoadingApi();
  const { sourceChainDetails, targetChainDetails } = useSourceTarget();

  const { dispatchChangeSourceTarget } = useUpdateSourceTarget();
  const onChangeSourceTarget = () => dispatchChangeSourceTarget(SourceTargetActionsCreators.switchChains());

  if (!areApiLoading) {
    return (
      <Dimmer active>
        <Loader />
      </Dimmer>
    );
  }

  return (
    <>
      <Container className={className}>
        <Grid>
          <Grid.Row>
            <Grid.Column
              width={5}
            >{`${sourceChainDetails.sourceChain} => ${targetChainDetails.targetChain}`}</Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={1} />
            <Grid.Column width={5}>
              <DashboardCard chainDetail={ChainDetails.SOURCE} />
            </Grid.Column>
            <Grid.Column width={1}>
              <div className="switchButton">
                <Button disabled={!areApiLoading} onClick={onChangeSourceTarget}>
                  <Icon fitted name="exchange" />
                </Button>
              </div>
            </Grid.Column>
            <Grid.Column width={5}>
              <DashboardCard chainDetail={ChainDetails.TARGET} />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={12}>
              <Accounts />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={12}>
              <Remark />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={12}>
              <Transfer />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={12}>
              <CustomCall />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={12}>
              <Transactions />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
      <SnackBar />
    </>
  );
}

export default styled(Main)`
  .switchButton {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;
