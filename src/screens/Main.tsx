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
import { Button, Icon } from 'semantic-ui-react';
import styled from 'styled-components';

import ActionsTypes from '../actions/actionTypes';
import Accounts from '../components/Accounts';
import DashboardCard from '../components/DashboardCard';
import Remark from '../components/Remark';
import Transfer from '../components/Transfer';
import { SOURCE, TARGET } from '../constants';
import { useApiSourcePromiseContext } from '../contexts/ApiPromiseSourceContext';
import { useApiTargetPromiseContext } from '../contexts/ApiPromiseTargetContext';
import { useSourceTarget, useUpdateSourceTarget } from '../contexts/SourceTargetContextProvider';
import useLoadingApi from '../hooks/useLoadingApi';

interface Props {
  className?: string;
}

export function Main({ className }: Props) {
  const isLoading = useLoadingApi();
  const { sourceChain, targetChain } = useSourceTarget();

  const { dispatchSourceTarget } = useUpdateSourceTarget();
  const onChangeSourceTarget = () =>
    dispatchSourceTarget({
      payload: {},
      type: ActionsTypes.SWITCH_CHAINS
    });
  return (
    <>
      <Container className={className}>
        <Grid>
          <Grid.Row>
            <Grid.Column width={5}>{`${sourceChain} => ${targetChain}`}</Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={1} />
            <Grid.Column width={5}>
              <DashboardCard chainType={SOURCE} useApiContext={useApiSourcePromiseContext} />
            </Grid.Column>
            <Grid.Column width={1}>
              <div className="switchButton">
                <Button disabled={!isLoading} onClick={onChangeSourceTarget}>
                  <Icon fitted name="exchange" />
                </Button>
              </div>
            </Grid.Column>
            <Grid.Column width={5}>
              <DashboardCard chainType={TARGET} useApiContext={useApiTargetPromiseContext} />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={12}>
              <Remark />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={12}>
              <Accounts />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={12}>
              <Transfer />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
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
