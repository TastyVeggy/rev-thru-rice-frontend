import { Box, Button, Dialog, DialogContent, DialogTitle } from '@mui/material';
import React from 'react';

interface confirmDialogProps {
  open: boolean;
  title: string;
  onClose: () => void;
  onConfirm: () => void;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | undefined;
  children?: React.ReactNode;
}

export const ConfirmDialog: React.FC<confirmDialogProps> = ({
  open,
  title,
  onClose,
  onConfirm,
  maxWidth = undefined,
  children,
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth={maxWidth}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent
          sx={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          {children}
          <Box display='flex'>
            <Button variant='outlined' onClick={onClose} sx={{ mr: 2 }}>
              Cancel
            </Button>
            <Button
              variant='contained'
              sx={{ backgroundColor: '#FF0000' }}
              onClick={onConfirm}
            >
              Confirm
            </Button>
          </Box>
        </DialogContent>
      </Box>
    </Dialog>
  );
};
