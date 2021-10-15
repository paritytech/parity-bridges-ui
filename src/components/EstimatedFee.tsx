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

import { useEffect, useState } from 'react';
import { Typography, makeStyles } from '@material-ui/core';
import React from 'react';
import { useSourceTarget } from '../contexts/SourceTargetContextProvider';
import { useTransactionContext } from '../contexts/TransactionContext';
import { transformToBaseUnit } from '../util/evalUnits';
import { Alert } from '.';

const useStyles = makeStyles(() => ({
  container: {
    minHeight: '20px'
  }
}));

export const EstimatedFee = (): React.ReactElement => {
  const classes = useStyles();
  const { sourceChainDetails, targetChainDetails } = useSourceTarget();
  const {
    estimatedSourceFee,
    estimatedTargetFee,
    payloadEstimatedFeeLoading,
    transactionRunning,
    evaluateTransactionStatusError
  } = useTransactionContext();
  const srcChainDecimals = sourceChainDetails.apiConnection.api.registry.chainDecimals[0];
  const tarChainDecimals = targetChainDetails.apiConnection.api.registry.chainDecimals[0];

  const { chainTokens: srcChainTokens } = sourceChainDetails.apiConnection.api.registry;
  const { chainTokens: tarChainTokens } = targetChainDetails.apiConnection.api.registry;

  const [amounts, setAmounts] = useState<{
    sourceFeeAmount: string | null;
    targetFeeAmount: string | null;
  } | null>(null);

  useEffect(() => {
    if (!payloadEstimatedFeeLoading) {
      const sourceFeeAmount = estimatedSourceFee ? transformToBaseUnit(estimatedSourceFee, srcChainDecimals) : null;

      console.log('estimatedTargetFee', estimatedTargetFee);
      console.log('tarChainDecimals', tarChainDecimals);

      const targetFeeAmount = estimatedTargetFee ? transformToBaseUnit(estimatedTargetFee, tarChainDecimals) : null;
      setAmounts({ sourceFeeAmount, targetFeeAmount });
    }
  }, [estimatedSourceFee, estimatedTargetFee, payloadEstimatedFeeLoading, srcChainDecimals, tarChainDecimals]);

  const feeLabel = `Estimated ${sourceChainDetails.chain} fee`;
  const feeLabelTarget = `Estimated ${targetChainDetails.chain} fee`;

  return evaluateTransactionStatusError ? (
    <Alert severity="error">{evaluateTransactionStatusError}</Alert>
  ) : (
    <div className={classes.container}>
      <Typography variant="body1" color="secondary">
        {payloadEstimatedFeeLoading && !transactionRunning
          ? `${feeLabel}...`
          : amounts?.sourceFeeAmount
          ? `${feeLabel}: ${amounts?.sourceFeeAmount} ${srcChainTokens}`
          : null}
      </Typography>

      <Typography variant="body1" color="secondary">
        {payloadEstimatedFeeLoading && !transactionRunning
          ? `${feeLabelTarget}...`
          : amounts?.targetFeeAmount
          ? `${feeLabelTarget}: ${amounts?.targetFeeAmount} ${tarChainTokens}`
          : null}
      </Typography>
    </div>
  );
};
