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
import { Box, Divider, IconButton, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import { useSourceTarget } from '../contexts/SourceTargetContextProvider';
import onChainValues from '../hooks/useOnChainValues';
import { ChainDetails } from '../types/sourceTargetTypes';
import useLoadingApi from '../hooks/useLoadingApi';
import { IconApiStatus } from './Icons';

// As this is placed as a child in the Material UI Select component, for some reason style components classes are not working.
// This way to inject the styles works.
const useStyles = makeStyles((theme) => ({
  main: {
    position: 'relative',
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.spacing(0.5),
    '& .MuiIconButton-root': {
      backgroundColor: theme.palette.background.paper,
      position: 'absolute',
      top: 0,
      bottom: 0,
      right: theme.spacing(-1.5),
      width: theme.spacing(3),
      height: theme.spacing(3),
      margin: 'auto',
      border: `1px solid ${theme.palette.divider}`
    }
  },
  statsEntry: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: theme.spacing(),
    fontSize: theme.typography.subtitle2.fontSize,
    '& span': {
      ...theme.typography.subtitle2
    }
  },
  svg: {
    marginBottom: '0.2em',
    fontSize: '0.5em',
    marginRight: theme.spacing()
  }
}));

export const NetworkSides = () => {
  const classes = useStyles();
  const { sourceChainDetails, targetChainDetails } = useSourceTarget();
  const dbSource = onChainValues(ChainDetails.SOURCE);
  const dbTarget = onChainValues(ChainDetails.TARGET);
  const { sourceReady, targetReady } = useLoadingApi();

  return (
    <Box marginY={2} className={classes.main}>
      <Box p={1} className={classes.statsEntry}>
        <Typography variant="h4">
          <IconApiStatus className={classes.svg} status={sourceReady} />
          <a target="_blank" rel="noreferrer" href={sourceChainDetails.polkadotjsUrl}>
            {sourceChainDetails.chain}
          </a>
        </Typography>
        <span># {dbSource.bestBlock}</span>
      </Box>
      <Divider />
      <IconButton size="small">
        <ArrowDownwardIcon fontSize="small" />
      </IconButton>
      <Box p={1} className={classes.statsEntry}>
        <Typography variant="h4">
          <IconApiStatus className={classes.svg} status={targetReady} />
          <a target="_blank" rel="noreferrer" href={targetChainDetails.polkadotjsUrl}>
            {targetChainDetails.chain}
          </a>
        </Typography>
        <span style={{ opacity: 0.4 }}># {dbTarget.bestBlock}</span>
      </Box>
    </Box>
  );
};

export const NetworkStats = () => {
  const classes = useStyles();
  const dbSource = onChainValues(ChainDetails.SOURCE);
  const dbTarget = onChainValues(ChainDetails.TARGET);

  return (
    <>
      <Box className={classes.statsEntry}>
        Relayed blocks:
        <span>
          {dbTarget?.bestBridgedFinalizedBlock} / {dbSource?.bestBlockFinalized}
        </span>
      </Box>
      <Box className={classes.statsEntry}>
        Delivered messages:
        <span>{dbSource?.outboundLanes.totalMessages}</span>
      </Box>
      <Box className={classes.statsEntry}>
        Awaiting messages:
        <span>{dbSource?.outboundLanes.pendingMessages}</span>
      </Box>
    </>
  );
};
