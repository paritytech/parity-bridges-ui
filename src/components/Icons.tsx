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

import { makeStyles } from '@material-ui/core/styles';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import FiberManualRecordTwoToneIcon from '@material-ui/icons/FiberManualRecordTwoTone';
import React from 'react';

import { TransactionStatusEnum } from '../types/transactionTypes';

const useStyles = makeStyles((theme) => ({
  error: {
    color: theme.palette.error.main
  },
  success: {
    color: theme.palette.success.main
  }
}));

interface IconTxStatusProps {
  status: keyof typeof TransactionStatusEnum;
}

interface IconApiStatusProps {
  status: boolean;
  className?: string;
}
export const IconTxStatus = ({ status }: IconTxStatusProps) => {
  switch (status) {
    case TransactionStatusEnum.COMPLETED:
      return <CheckCircleOutlineIcon id="check-circle-icon" />;
    case TransactionStatusEnum.IN_PROGRESS:
      return <AutorenewIcon id="auto-new-icon" />;
    case TransactionStatusEnum.FAILED:
      return <ErrorOutlineIcon id="error-outline-icon" />;
    case TransactionStatusEnum.NOT_STARTED:
      return <FiberManualRecordTwoToneIcon id="fiber-manual-two-icon" />;
    default:
      return <FiberManualRecordIcon id="fiber-manual-icon" />;
  }
};

export const IconApiStatus = ({ status, className }: IconApiStatusProps) => {
  const classes = useStyles();
  return <FiberManualRecordIcon className={`${status ? classes.success : classes.error} ${className}`} />;
};
