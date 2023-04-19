import { CloseSharp } from '@mui/icons-material';
import {
  Button,
  Unstable_Grid2 as Grid,
  Dialog,
  DialogActions,
  DialogProps,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
} from '@mui/material';
import { DText } from 'components/common';
import { borderRadius, margin, padding } from 'lib/constants';
import _ from 'lodash';
import * as React from 'react';

export interface FormDialogProps extends DialogProps {
  title?: string;
  open: boolean;
  value?: string;
  onConfirm?: (e: React.SyntheticEvent) => void;
  handleClose?: (e: React.SyntheticEvent) => void;
  error?: string | ((value: string) => string);
  cancelAction?: string;
  confirmAction?: string;
  onCancel?: (e: React.SyntheticEvent) => void;
  inputChange?: (e: React.SyntheticEvent, ...args) => void;
  inputLabel?: string;
  inputType?: string;
  content?: React.ReactNode;
  textfield?: boolean;
  actions?: boolean;
  titleVariant?:
    | 'button'
    | 'caption'
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'inherit'
    | 'overline'
    | 'subtitle1'
    | 'subtitle2'
    | 'body1'
    | 'body2';
}
export const FormDialog: React.FC<FormDialogProps> = props => {
  const {
    error,
    value = '',
    open,
    handleClose = ((e) => null),
    title = '',
    cancelAction,
    confirmAction,
    inputChange,
    inputLabel,
    inputType,
    onConfirm = ((e) => null),
    onCancel,
    content,
    textfield = true,
    actions = true,
    titleVariant = 'h4',
  } = props;

  const [textfieldError, setTextfieldErrorState] = React.useState(
    error ? (!_.isFunction(error) ? error : error(value)) : ''
  );

  const setTextfieldError = (err: string) => {
    if (err == textfieldError) return;
    else setTextfieldErrorState(err);
  };

  const handleCancel = (e: React.SyntheticEvent) => {
    onCancel && onCancel(e);
    handleClose(e);
  };
  const handleConfirm = (e: React.SyntheticEvent) => {
    onConfirm && onConfirm(e);
    handleClose(e);
  };

  React.useEffect(() => {
    if (_.isFunction(error)) {
      setTextfieldError(error(value));
    } else setTextfieldError(error);
  }, [value]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          borderRadius: borderRadius * 3,
          padding: padding * 3,
          backgroundColor: 'action.active',
        },
        elevation: 2
      }}
    >
      <DialogTitle sx={{ mb: margin * 4 }}>
        <DText text={title} variant={titleVariant} fontWeight="regular" />
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme => theme.palette.primary.main,
          }}
        >
          <CloseSharp />
        </IconButton>
      </DialogTitle>
      {content ?? <></>}
      {textfield && (
        <TextField
          autoFocus
          label={inputLabel ?? ''}
          type={inputType ?? 'text'}
          fullWidth
          variant="standard"
          onChange={inputChange}
          error={textfieldError != ''}
          helperText={<DText text={textfieldError} />}
          value={value}
        />
      )}
      {actions && (
        <DialogActions>
          <Button onClick={handleCancel}>
            <DText text={cancelAction ?? 'Cancel'} />{' '}
          </Button>
          <Button onClick={handleConfirm} disabled={textfieldError != ''}>
            <DText text={confirmAction ?? 'Confirm'} />{' '}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};
