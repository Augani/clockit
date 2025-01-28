import {
  Box,
  Modal as MuiModal,
  ModalProps as MuiModalProps,
  Typography,
} from '@mui/material';
import clsx from 'clsx';
import React from 'react';

interface ModalProps extends MuiModalProps {
  title?: string;
}

const Modal: React.FC<ModalProps> = ({
  title,
  children,
  className,
  ...props
}) => {
  return (
    <MuiModal {...props}>
      <Box
        className={clsx(
          'bg-surface rounded-2xl shadow-card p-6 max-w-md mx-auto',
          className
        )}
      >
        {title && <Typography variant="h6">{title}</Typography>}
        {children}
      </Box>
    </MuiModal>
  );
};

export default Modal;
