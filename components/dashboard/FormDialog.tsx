import { CloseSharp } from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogProps,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
} from '@mui/material';
import { DText } from 'components/common';
import { margin, padding } from 'lib/constants';
import _ from 'lodash';
import * as React from 'react';

interface FormDialogProps extends DialogProps {
  title: string;
  description: string;
  open: boolean;
  value: string;
  handleClose: (e: React.SyntheticEvent) => void;
  inputChange: (e: React.SyntheticEvent) => void;
  error?: string | ((value: string) => string);
  cancelAction?: string;
  confirmAction?: string;
  onConfirm: (e: React.SyntheticEvent) => void;
  onCancel?: (e: React.SyntheticEvent) => void;
  inputLabel?: string;
  inputType?: string;
}
export const FormDialog: React.FC<FormDialogProps> = props => {
  const {
    error,
    value,
    open,
    handleClose,
    title,
    description,
    cancelAction,
    confirmAction,
    inputChange,
    inputLabel,
    inputType,
    onConfirm,
    onCancel,
  } = props;

  const [textfieldError, setTextfieldErrorState] = React.useState(
    error ? (!_.isFunction(error) ? error : error(value)) : ''
  );

  const setTextfieldError = (err: string) => {
    if (err == textfieldError) return;
    else setTextfieldErrorState(err);
  };

  const handleCancel = (e: React.SyntheticEvent) => {
    onCancel(e);
    handleClose(e);
  };
  const handleConfirm = (e: React.SyntheticEvent) => {
    onConfirm(e);
    handleClose(e);
  };

  React.useEffect(() => {
    if (_.isFunction(error)) {
      setTextfieldError(error(value));
    } else setTextfieldError(error);
  }, [value]);

  return (
    <Dialog open={open} onClose={handleClose}>
      <Box
        sx={{
          padding: padding * 3,
          backgroundColor: 'background.default',
        }}
      >
        <DialogTitle sx={{ mb: margin * 4 }}>
          <DText text={title} variant="h4" />
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
        <DialogContent sx={{ mb: margin * 4 }}>
          <Stack spacing={3}>
            <DialogContentText>
              <DText text={description} variant="h6" />{' '}
            </DialogContentText>
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
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>
            <DText text={cancelAction ?? 'Cancel'} />{' '}
          </Button>
          <Button onClick={handleConfirm} disabled={textfieldError != ''}>
            <DText text={confirmAction ?? 'Confirm'} />{' '}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};
