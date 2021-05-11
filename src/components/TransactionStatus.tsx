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

import { Codec } from '@polkadot/types/types';
import BN from 'bn.js';
import React, { useEffect, useState } from 'react';

import { Box, Card, makeStyles, Typography } from '@material-ui/core';
import { ButtonSwitchMode } from './Buttons';
import { IconTxStatus } from './Icons';

import { useSourceTarget } from '../contexts/SourceTargetContextProvider';
import useDashboard from '../hooks/useDashboard';
import useLaneId from '../hooks/useLaneId';
import useLoadingApi from '../hooks/useLoadingApi';
import { ChainDetails } from '../types/sourceTargetTypes';
import { Step, TransactionStatusEnum, TransanctionStatus } from '../types/transactionTypes';
import getSubstrateDynamicNames from '../util/getSubstrateDynamicNames';
interface Props {
  transaction: TransanctionStatus;
  onComplete: () => void;
}

const useStyles = makeStyles((theme) => ({
  card: {
    '& p': {
      ...theme.typography.body2
    },
    '& svg': {
      marginBottom: '-0.2em',
      fontSize: '1.2em',
      marginRight: theme.spacing()
    },
    '& .header': {
      fontWeight: 500
    },
    '&.MuiPaper-root': {
      maxWidth: '100%',
      padding: theme.spacing(2),
      borderRadius: theme.spacing(1.5)
    }
  }
}));

const TransactionStatus = ({ transaction, onComplete }: Props) => {
  const classes = useStyles();
  const [nonceOfTargetFinalizedBlock, setNonceOfTargetFinalizedBlock] = useState<null | number>(null);
  const [latestReceivedNonceRuntimeApi, setLatestReceivedNonceRuntimeApi] = useState(0);
  const [steps, setSteps] = useState<Array<Step>>([]);

  const {
    sourceChainDetails: { sourceChain },
    targetChainDetails: {
      targetApiConnection: { api: targetApi },
      targetChain
    }
  } = useSourceTarget();
  const laneId = useLaneId();
  const areApiLoading = useLoadingApi();

  const {
    bestBlockFinalized,
    outboundLanes: { latestReceivedNonce: latestReceivedNonceOnSource }
  } = useDashboard(ChainDetails.SOURCE);
  const {
    bestBridgedFinalizedBlock: bestBridgedFinalizedBlockOnTarget,
    bestBlockFinalized: bestBlockFinalizedOnTarget
  } = useDashboard(ChainDetails.TARGET);
  const { latestReceivedNonceMethodName } = getSubstrateDynamicNames(sourceChain);
  const completed = transaction.status === TransactionStatusEnum.COMPLETED;

  useEffect(() => {
    if (!areApiLoading || !transaction) {
      return;
    }
    const getNonceByHash = async () => {
      const blockHash = await targetApi.rpc.chain.getBlockHash(bestBlockFinalizedOnTarget);
      const latestReceivedNonceCall = await targetApi.rpc.state.call<Codec>(
        latestReceivedNonceMethodName,
        laneId,
        blockHash.toJSON()
      );

      // @ts-ignore
      const latestReceivedNonceCallType = targetApi.registry.createType('MessageNonce', latestReceivedNonceCall);
      const latestReceivedNonce = latestReceivedNonceCallType.toString();
      setNonceOfTargetFinalizedBlock(parseInt(latestReceivedNonce));
    };

    const getLatestReceivedNonce = async () => {
      const latestReceivedNonceCall = await targetApi.rpc.state.call<Codec>(latestReceivedNonceMethodName, laneId);
      // @ts-ignore
      const latestReceivedNonceCallType = targetApi.registry.createType('MessageNonce', latestReceivedNonceCall);
      setLatestReceivedNonceRuntimeApi(parseInt(latestReceivedNonceCallType.toString()));
    };

    getNonceByHash();
    getLatestReceivedNonce();
  }, [
    areApiLoading,
    bestBlockFinalizedOnTarget,
    transaction,
    laneId,
    latestReceivedNonceMethodName,
    targetApi.registry,
    targetApi.rpc.chain,
    targetApi.rpc.state
  ]);

  useEffect(() => {
    if (!areApiLoading || !transaction || completed) {
      return;
    }

    const stepEvaluator = (transactionValue: string | number | null, chainValue: string | number | null): boolean => {
      if (!transactionValue || !chainValue) return false;

      const bnChainValue = new BN(chainValue);
      const bnTransactionValue = new BN(transactionValue);
      return bnChainValue.gt(bnTransactionValue);
    };

    const completionStatus = (isCompleted: boolean): TransactionStatusEnum => {
      if (transaction.id === 0) {
        return TransactionStatusEnum.NOT_STARTED;
      }
      return isCompleted ? TransactionStatusEnum.COMPLETED : TransactionStatusEnum.IN_PROGRESS;
    };

    const sourceTransactionFinalized = stepEvaluator(transaction.block, bestBlockFinalized);
    const blockFinalityRelayed = stepEvaluator(transaction.block, bestBridgedFinalizedBlockOnTarget);
    const messageDelivered = stepEvaluator(transaction.messageNonce, latestReceivedNonceRuntimeApi);
    const messageFinalizedOnTarget = stepEvaluator(transaction.messageNonce, nonceOfTargetFinalizedBlock);
    const sourceConfirmationReceived = stepEvaluator(transaction.messageNonce, latestReceivedNonceOnSource);

    if (sourceConfirmationReceived) {
      onComplete();
    }

    setSteps([
      {
        chainType: sourceChain,
        label: 'Include message in block',
        onChain: transaction.block,
        status: completionStatus(!!transaction.block)
      },
      {
        chainType: sourceChain,
        label: 'Finalize block',
        status: completionStatus(sourceTransactionFinalized)
      },
      {
        chainType: targetChain,
        label: 'Relay block',
        status: completionStatus(blockFinalityRelayed)
      },
      {
        chainType: targetChain,
        label: 'Deliver message',
        onChain: transaction.messageNonce,
        status: completionStatus(messageDelivered)
      },
      {
        chainType: targetChain,
        label: 'Finalize message in target block',
        // TODO [#113] We should remember the first block that caused the evaluator to go brrr.
        onChain:
          completionStatus(messageFinalizedOnTarget) === TransactionStatusEnum.COMPLETED && bestBlockFinalizedOnTarget,
        status: completionStatus(messageFinalizedOnTarget)
      },
      {
        chainType: sourceChain,
        label: 'Confirm delivery',
        status: completionStatus(sourceConfirmationReceived)
      }
    ]);
  }, [
    areApiLoading,
    bestBlockFinalized,
    bestBlockFinalizedOnTarget,
    bestBridgedFinalizedBlockOnTarget,
    completed,
    latestReceivedNonceOnSource,
    latestReceivedNonceRuntimeApi,
    nonceOfTargetFinalizedBlock,
    onComplete,
    sourceChain,
    targetChain,
    transaction
  ]);

  return (
    <>
      <Box mt={3}>
        <ButtonSwitchMode disabled> Payload!</ButtonSwitchMode>
        <ButtonSwitchMode color="primary"> Receipt</ButtonSwitchMode>
        <ButtonSwitchMode disabled> Human</ButtonSwitchMode>
      </Box>
      <Card elevation={24} className={classes.card}>
        <Box className="header" component="p">
          <IconTxStatus status={transaction.status} /> {transaction.type} {transaction.sourceChain} {'->'}{' '}
          {transaction.targetChain}
        </Box>
        {steps.map(({ chainType, label, onChain, status }, idx) => (
          <p key={idx}>
            <IconTxStatus status={status} /> {chainType}: {label}&nbsp;
            {onChain && (
              <Box pt={0.25} pb={0.25} pl={0.5} pr={0.5} component="span" border={1} borderRadius={6}>
                <Typography component="span" variant="subtitle2">
                  {onChain}
                </Typography>
              </Box>
            )}
          </p>
        ))}
      </Card>
    </>
  );
};

export default TransactionStatus;
