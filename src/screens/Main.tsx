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

import { Container, Grid, Typography } from '@material-ui/core';
import React from 'react';

import {
  BoxMain,
  BoxSidebar,
  BoxUI,
  ButtonExt,
  MenuAction,
  MenuActionMockData,
  NetworkSides,
  NetworkStats
} from '../components';
import Accounts from '../components/Accounts';
import CustomCall from '../components/CustomCall';
import ExtensionAccountCheck from '../components/ExtensionAccountCheck';
import Remark from '../components/Remark';
import SnackBar from '../components/SnackBar';
import Transactions from '../components/Transactions';
import Transfer from '../components/Transfer';

function Main() {
  return (
    <BoxMain>
      <BoxSidebar>
        <div>
          <Typography variant="button">Bridges UI</Typography>
          <NetworkSides />
          <NetworkStats />
        </div>
        <ButtonExt> Help & Feedback </ButtonExt>
      </BoxSidebar>
      <BoxUI>
        <MenuAction items={MenuActionMockData} />
        <Container>
          <Grid container>
            <Grid item md={12}>
              <Accounts />
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
              <ExtensionAccountCheck component={<Accounts />} />
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
          </Grid>
        </Container>
        <SnackBar />
      </BoxUI>
    </BoxMain>
  );
}
export default Main;
