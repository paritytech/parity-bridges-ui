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
import { Typography, Tooltip } from '@material-ui/core';
import { fade, makeStyles } from '@material-ui/core/styles';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import { useSourceTarget } from '../contexts/SourceTargetContextProvider';
import { useTransactionContext } from '../contexts/TransactionContext';
import { transformToBaseUnit } from '../util/evalUnits';
import round from 'lodash/round';
import { Alert } from '.';

const useStyles = makeStyles((theme) => ({
  container: {
    minHeight: '20px',
    display: 'flex'
  },
  tooltipIcon: {
    ...theme.typography.body1,
    marginTop: 2,
    marginLeft: 2,
    '&:not(:hover)': {
      color: fade(theme.palette.text.hint, 0.75)
    }
  }
}));

const getAmount = (fee: string | null, chainDecimals: number) =>
  fee ? round(parseFloat(transformToBaseUnit(fee, chainDecimals)), 2) : null;

export const EstimatedFee = (): React.ReactElement => {
  const classes = useStyles();
  const { sourceChainDetails, targetChainDetails } = useSourceTarget();
  const {
    estimatedSourceFee,
    estimatedFeeMessageDelivery,
    estimatedFeeBridgeCall,
    estimatedTargetFee,
    payloadEstimatedFeeLoading,
    transactionRunning,
    evaluateTransactionStatusError
  } = useTransactionContext();
  const srcChainDecimals = sourceChainDetails.apiConnection.api.registry.chainDecimals[0];
  const tarChainDecimals = targetChainDetails.apiConnection.api.registry.chainDecimals[0];

  const { chainTokens: srcChainTokens } = sourceChainDetails.apiConnection.api.registry;
  const { chainTokens: tarChainTokens } = targetChainDetails.apiConnection.api.registry;
  /*
  const estimatedFeeMessageDeliveryAmount = estimatedFeeMessageDelivery
    ? round(parseFloat(transformToBaseUnit(estimatedFeeMessageDelivery, srcChainDecimals)), 2)
    : null;

  const estimatedFeeBridgeCallAmount = estimatedFeeBridgeCall
    ? round(parseFloat(transformToBaseUnit(estimatedFeeBridgeCall, srcChainDecimals)), 2)
    : null;
  const estimatedSourceFeeAmount = estimatedSourceFee
    ? round(parseFloat(transformToBaseUnit(estimatedSourceFee, srcChainDecimals)), 2)
    : null;

  const targetFeeAmount = estimatedTargetFee
    ? round(parseFloat(transformToBaseUnit(estimatedTargetFee, tarChainDecimals)), 2)
    : null; */

  const estimatedFeeMessageDeliveryAmount = getAmount(estimatedFeeMessageDelivery, srcChainDecimals);
  const estimatedFeeBridgeCallAmount = getAmount(estimatedFeeBridgeCall, srcChainDecimals);
  const estimatedSourceFeeAmount = getAmount(estimatedSourceFee, srcChainDecimals);
  const targetFeeAmount = getAmount(estimatedTargetFee, tarChainDecimals);

  const feeLabel = `Estimated ${sourceChainDetails.chain} fee`;
  const feeLabelTarget = `Estimated ${targetChainDetails.chain} fee`;

  return evaluateTransactionStatusError ? (
    <Alert severity="error">{evaluateTransactionStatusError}</Alert>
  ) : (
    <>
      <div className={classes.container}>
        <Typography variant="body1" color="secondary">
          {payloadEstimatedFeeLoading && !transactionRunning
            ? `${feeLabel}...`
            : estimatedSourceFeeAmount
            ? `${feeLabel}: ${estimatedSourceFeeAmount} ${srcChainTokens}`
            : null}
        </Typography>
        {!payloadEstimatedFeeLoading && !transactionRunning && estimatedFeeMessageDeliveryAmount && (
          <Tooltip
            title={`Message Delivery Fee: ${estimatedFeeMessageDeliveryAmount} ${srcChainTokens} + Send Message Fee: ${estimatedFeeBridgeCallAmount} ${srcChainTokens}`}
            arrow
            placement="top"
          >
            <HelpOutlineIcon className={classes.tooltipIcon} />
          </Tooltip>
        )}
      </div>
      <Typography variant="body1" color="secondary">
        {payloadEstimatedFeeLoading && !transactionRunning
          ? `${feeLabelTarget}...`
          : targetFeeAmount
          ? `${feeLabelTarget}: ${targetFeeAmount} ${tarChainTokens}`
          : null}
      </Typography>
    </>
  );
};
