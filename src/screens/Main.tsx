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

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import React from 'react';
import { Icon } from 'semantic-ui-react';
import styled from 'styled-components';

import Accounts from '../components/Accounts';
import CustomCall from '../components/CustomCall';
import DashboardCard from '../components/DashboardCard';
import Remark from '../components/Remark';
import SnackBar from '../components/SnackBar';
import Transactions from '../components/Transactions';
import Transfer from '../components/Transfer';
import { useKeyringContext } from '../contexts/KeyringContextProvider';
import { useSourceTarget } from '../contexts/SourceTargetContextProvider';
import { ChainDetails } from '../types/sourceTargetTypes';

interface Props {
  className?: string;
}

export function Main({ className }: Props) {
  const { extensionExists, accountExists } = useKeyringContext();
  const { sourceChainDetails, targetChainDetails } = useSourceTarget();

  const proj = [];

  if (!extensionExists) {
    proj.push(<p className="messageNote">Connect to a wallet. Install polkadotjs extension</p>);
  } else {
    if (!accountExists) {
      proj.push(
        <p className="messageNote">There are no accounts in the extension. Please create one. Please create one</p>
      );
    } else {
      proj.push(<Accounts />);
    }
  }

  return (
    <>
      <Container className={className}>
        <Grid container>
          <Grid item md={5}>{`${sourceChainDetails.sourceChain} => ${targetChainDetails.targetChain}`}</Grid>
        </Grid>
        <Grid container>
          <Grid item md={5}>
            <DashboardCard chainDetail={ChainDetails.SOURCE} />
          </Grid>
          <Grid item md={1}>
            <div className="switchButton">
              <Icon fitted name="exchange" />
            </div>
          </Grid>
          <Grid item md={5}>
            <DashboardCard chainDetail={ChainDetails.TARGET} />
          </Grid>
        </Grid>
        <Grid container>
          <Grid item md={12}>
            {proj}
          </Grid>
        </Grid>
        <Grid container>
          <Grid item md={12}>
            <Remark />
          </Grid>
        </Grid>
        <Grid container>
          <Grid item md={12}>
            <Transfer />
          </Grid>
        </Grid>
        <Grid container>
          <Grid item md={12}>
            <CustomCall />
          </Grid>
        </Grid>
        <Grid container>
          <Grid item md={12}>
            <Transactions />
          </Grid>
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

  .messageNote {
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    height: 50px;
    width: 100%;
    padding: 50px 0;
  }
`;
