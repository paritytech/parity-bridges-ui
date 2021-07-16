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
import { Typography } from '@material-ui/core';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useSourceTarget } from '../contexts/SourceTargetContextProvider';
import { useTransactionContext } from '../contexts/TransactionContext';
import { transformToBaseUnit } from '../util/evalUnits';

export const EstimatedFee = (): React.ReactElement => {
  const { sourceChainDetails, targetChainDetails } = useSourceTarget();
  const { estimatedFee, estimatedFeeLoading } = useTransactionContext();
  const srcChainDecimals = sourceChainDetails.apiConnection.api.registry.chainDecimals[0];
  const { chainTokens } = targetChainDetails.apiConnection.api.registry;

  const [amount, setAmount] = useState<string>('0');

  useEffect(() => {
    !estimatedFeeLoading && setAmount(transformToBaseUnit(estimatedFee || '0', srcChainDecimals));
  }, [estimatedFee, estimatedFeeLoading, srcChainDecimals]);

  return (
    <div>
      <Typography variant="body1" color="secondary">
        {`Estimated ${sourceChainDetails.chain} fee ${estimatedFeeLoading ? '...' : ':'}`}
        <Typography variant="subtitle2" component="span">
          {amount} {chainTokens}
        </Typography>
      </Typography>
    </div>
  );
};
