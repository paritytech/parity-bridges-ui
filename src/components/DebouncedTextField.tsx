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
import { TextField } from '@material-ui/core';
import useDebounceState from '../hooks/react/useDebounceState';
import { useCallback } from 'react';
import { useUpdateTransactionContext } from '../contexts/TransactionContext';
import { TransactionActionCreators } from '../actions/transactionActions';

type ValueType = string | null;

interface Props {
  id?: string;
  placeholder?: string;
  label?: string;
  classes?: string;
  InputProps?: Object;
  helperText?: string | undefined | null;
  variant?: 'standard' | 'filled' | 'outlined' | undefined;
  fullWidth?: boolean;
  multiline?: boolean;
  rows?: number;
  dispatchCallback?: (value: ValueType) => void;
  initialValue?: ValueType;
  disabled?: boolean;
}

export function DebouncedTextField({
  id,
  placeholder,
  classes,
  helperText,
  InputProps,
  label,
  variant,
  fullWidth,
  multiline,
  rows,
  dispatchCallback,
  initialValue = '',
  disabled = false
}: Props) {
  const { dispatchTransaction } = useUpdateTransactionContext();
  const [value, setValue] = useDebounceState({ initialValue, dispatchCallback });

  // set the transaction button to false on every change.
  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      dispatchTransaction(TransactionActionCreators.disableTXButton());
      setValue(event);
    },
    [dispatchTransaction, setValue]
  );

  return (
    <TextField
      id={id}
      label={label}
      value={value}
      variant={variant}
      placeholder={placeholder}
      className={classes}
      autoComplete="off"
      fullWidth={fullWidth}
      multiline={multiline}
      helperText={helperText}
      InputProps={InputProps}
      rows={rows}
      onChange={onChange}
      disabled={disabled}
    />
  );
}
