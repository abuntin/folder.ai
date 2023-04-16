import * as React from 'react';
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { DText } from 'components/common';
import { CloseSharp } from '@mui/icons-material';

interface FormDialogProps extends DialogProps {
  title: string;
  description: string;
  cancelAction?: string;
  confirmAction?: string;
  onConfirm: (e: React.SyntheticEvent) => void;
  onCancel: (e: React.SyntheticEvent) => void;
  inputChange: (e: React.SyntheticEvent) => void;
  inputLabel?: string;
  inputType?: string;
}
export const FormDialog: React.FC<FormDialogProps> = props => {
  const [open, setOpen] = React.useState(true);

  const {
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

  const handleCancel = (e: React.SyntheticEvent) => {
    onCancel(e);
    handleClose();
  };
  const handleConfirm = (e: React.SyntheticEvent) => {
    onConfirm(e);
    handleClose();
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle sx={{ m: 0, p: 2 }}>
        {title}
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme => theme.palette.grey[500],
          }}
        >
          <CloseSharp />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>{description}</DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          label={inputLabel ?? ''}
          type={inputType ?? 'text'}
          fullWidth
          variant="standard"
          onChange={inputChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>
          <DText text={cancelAction ?? 'Cancel'} />{' '}
        </Button>
        <Button onClick={handleConfirm}>
          <DText text={confirmAction ?? 'Confirm'} />{' '}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
