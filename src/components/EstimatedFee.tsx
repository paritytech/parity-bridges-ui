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
import { Typography, makeStyles } from '@material-ui/core';
import { useSourceTarget } from '../contexts/SourceTargetContextProvider';
import { useTransactionContext } from '../contexts/TransactionContext';

const useStyles = makeStyles(() => ({
  container: {
    minHeight: '20px'
  }
}));

export const EstimatedFee = (): React.ReactElement => {
  const classes = useStyles();
  const { sourceChainDetails, targetChainDetails } = useSourceTarget();
  const { estimatedFeeLoading, estimatedFeeTransformed } = useTransactionContext();
  const { chainTokens } = targetChainDetails.apiConnection.api.registry;

  if (!estimatedFeeTransformed) {
    return <div className={classes.container}></div>;
  }

  return (
    <div className={classes.container}>
      <Typography variant="body1" color="secondary">
        Estimated {sourceChainDetails.chain} fee:{' '}
        {estimatedFeeLoading ? (
          '...'
        ) : (
          <Typography variant="subtitle2" component="span">
            {estimatedFeeTransformed} {chainTokens}
          </Typography>
        )}
      </Typography>
    </div>
  );
};
