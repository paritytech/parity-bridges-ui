// Copyright 2019-2020 @paritytech/bridge-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { Container, Grid } from 'semantic-ui-react';
import { Button, Icon } from 'semantic-ui-react';
import styled from 'styled-components';

import ActionsTypes from '../actions/actionTypes';
import DashboardCard from '../components/DashboardCard';
<<<<<<< HEAD
import { SOURCE, TARGET } from '../constants';
=======
import Remark from '../components/Remark';
import { SOURCE,TARGET } from '../constants';
>>>>>>> 9c0323c (Remark testing)
import { useApiSourcePromiseContext } from '../contexts/ApiPromiseSourceContext';
import { useApiTargetPromiseContext } from '../contexts/ApiPromiseTargetContext';
import { useUpdateSourceTarget } from '../contexts/SourceTargetContextProvider';
import useLoadingApi from '../hooks/useLoadingApi';

interface Props {
  className?: string;
}

<<<<<<< HEAD
export function Main({ className }: Props) {
  const isLoading = useLoadingApi();

  const { dispatchSourceTarget } = useUpdateSourceTarget();
  return (
    <>
      <Container className={className}>
        <Grid>
          <Grid.Row>
            <Grid.Column width={1} />
            <Grid.Column width={5}>
              <DashboardCard chainType={SOURCE} useApiContext={useApiSourcePromiseContext} />
            </Grid.Column>
            <Grid.Column width={1}>
              <div className="switchButton">
                <Button
                  disabled={!isLoading}
                  onClick={() => dispatchSourceTarget({ payload: {}, type: ActionsTypes.SWITCH_CHAINS })}
                >
                  <Icon fitted name="exchange" />
                </Button>
              </div>
            </Grid.Column>
            <Grid.Column width={5}>
              <DashboardCard chainType={TARGET} useApiContext={useApiTargetPromiseContext} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </>
  );
=======
export function Main({ className }:Props) {

	const isLoading = useLoadingApi();

	const { dispatchSourceTarget } = useUpdateSourceTarget();
	return (
		<>
			<Container className={className}>
				<Grid>
					<Grid.Row>
						<Grid.Column width={1}/>
						<Grid.Column width={5}>
							<DashboardCard
								chainType={SOURCE}
								useApiContext={useApiSourcePromiseContext}
							/>
						</Grid.Column>
						<Grid.Column width={1} >
							<div className='switchButton'>
								<Button disabled={!isLoading} onClick={() => dispatchSourceTarget({ payload: {}, type: ActionsTypes.SWITCH_CHAINS })}><Icon fitted name='exchange' /></Button>
							</div>
						</Grid.Column>
						<Grid.Column width={5}>
							<DashboardCard
								chainType={TARGET}
								useApiContext={useApiTargetPromiseContext}
							/>

						</Grid.Column>
					</Grid.Row>
					<Grid.Row >
						<Grid.Column width={12} >
							<Remark />
						</Grid.Column>

					</Grid.Row>
				</Grid>

			</Container>

		</>
	);
>>>>>>> 9c0323c (Remark testing)
}

export default styled(Main)`
  .switchButton {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;
