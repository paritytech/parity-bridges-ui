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

import { Box, Divider, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import KeyboardReturnIcon from '@material-ui/icons/KeyboardReturn';
import React from 'react';

import { useSourceTarget } from '../contexts/SourceTargetContextProvider';
import useDashboard from '../hooks/useDashboard';
import { ChainDetails } from '../types/sourceTargetTypes';

// As this is placed as a child in the Material UI Select component, for some reason style components classes are not working.
// This way to inject the styles works.
const useStyles = makeStyles((theme) => ({
  main: {
    position: 'relative',
    ...theme.typography.h4,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.spacing(0.5),
    '& .MuiIconButton-root': {
      backgroundColor: theme.palette.background.paper,
      position: 'absolute',
      top: 0,
      bottom: 0,
      right: '-1rem',
      width: '2rem',
      height: '2rem',
      margin: 'auto',
      border: `1px solid ${theme.palette.divider}`,
      transform: 'rotate(-90deg)',
      transition: 'transform .15s',
      '&:hover': {
        transform: 'rotate(90deg)',
        '& svg': {
          transform: 'translateY(4px)',
          transition: 'transform .1s',
          '&.onlyHover': {
            opacity: 1,
            transform: 'scale(-1) translateY(4px)'
          }
        }
      },
      '& svg.onlyHover': {
        opacity: 0,
        position: 'absolute',
        transform: 'scale(-1)'
      }
    }
  },
  statsEntry: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: theme.typography.subtitle2.fontSize,
    paddingLeft: 1,
    paddingRight: 2,
    '& span': {
      ...theme.typography.subtitle2
    }
  }
}));

export const NetworkSides = () => {
  const classes = useStyles();
  const { sourceChainDetails, targetChainDetails } = useSourceTarget();
  return (
    <Box marginY={2} className={classes.main}>
      <Box p>{sourceChainDetails.sourceChain}</Box>
      <Divider />
      <IconButton size="small">
        <KeyboardReturnIcon className="onlyHover" fontSize="small" />
        <KeyboardReturnIcon fontSize="small" />
      </IconButton>
      <Box p>{targetChainDetails.targetChain}</Box>
    </Box>
  );
};

export const NetworkStats = () => {
  const classes = useStyles();
  const dbSource = useDashboard(ChainDetails.SOURCE);

  return (
    <>
      <Box className={classes.statsEntry}>
        Finilised blocks:
        <span>
          {dbSource?.bestBlockFinalized} / {dbSource?.bestBlock}
        </span>
      </Box>
      <Box className={classes.statsEntry}>
        Bridged blocks:
        <span>{dbSource?.bestBridgedFinalizedBlock}</span>
      </Box>
      <Box className={classes.statsEntry}>
        Crossed msgs:
        <span>{dbSource?.outboundLanes.totalMessages}</span>
      </Box>
      <Box className={classes.statsEntry}>
        Queue:<span>{dbSource?.outboundLanes.pendingMessages}</span>
      </Box>
    </>
  );
};
