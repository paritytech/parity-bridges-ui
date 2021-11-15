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
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useSourceTarget } from '../contexts/SourceTargetContextProvider';
import { useTransactionContext } from '../contexts/TransactionContext';
import { Alert } from '.';
import { formatBalance } from '@polkadot/util';
import FeeValue from './FeeValue';
import { useGUIContext } from '../contexts/GUIContextProvider';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    marginTop: theme.spacing(1)
  }
}));

const getFormattedAmount = (fee: string | null, chainDecimals: number, chainTokens: string) =>
  fee
    ? formatBalance(fee, {
        decimals: chainDecimals,
        withUnit: chainTokens,
        withSi: true
      })
    : null;

export const EstimatedFee = (): React.ReactElement | null => {
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
  const { isBridged } = useGUIContext();
  const srcChainDecimals = sourceChainDetails.apiConnection.api.registry.chainDecimals[0];
  const tarChainDecimals = targetChainDetails.apiConnection.api.registry.chainDecimals[0];

  const { chainTokens: srcChainTokens } = sourceChainDetails.apiConnection.api.registry;
  const { chainTokens: tarChainTokens } = targetChainDetails.apiConnection.api.registry;

  const estimatedFeeMessageDeliveryAmount = getFormattedAmount(
    estimatedFeeMessageDelivery,
    srcChainDecimals,
    srcChainTokens[0]
  );
  const estimatedFeeBridgeCallAmount = getFormattedAmount(estimatedFeeBridgeCall, srcChainDecimals, srcChainTokens[0]);
  const estimatedSourceFeeAmount = getFormattedAmount(estimatedSourceFee, srcChainDecimals, srcChainTokens[0]);
  const targetFeeAmount = getFormattedAmount(estimatedTargetFee, tarChainDecimals, tarChainTokens[0]);

  if (evaluateTransactionStatusError) {
    return <Alert severity="error">{evaluateTransactionStatusError}</Alert>;
  }

  if (payloadEstimatedFeeLoading && !transactionRunning) {
    return (
      <Typography variant="body1" color="secondary">
        Calculating fee...
      </Typography>
    );
  } else if (estimatedSourceFeeAmount) {
    return (
      <div className={classes.container}>
        <Typography variant="body1" color="secondary">
          Estimated Fee value
        </Typography>
        <FeeValue
          amount={estimatedSourceFeeAmount}
          tooltip={
            isBridged
              ? `Message Delivery Fee: ${estimatedFeeMessageDeliveryAmount} ${srcChainTokens[0]} + Send Message Fee: ${estimatedFeeBridgeCallAmount} ${srcChainTokens[0]}`
              : null
          }
          showPlus={isBridged}
        />

        {isBridged && targetFeeAmount && <FeeValue amount={targetFeeAmount} />}
      </div>
    );
  }
  return null;
};
