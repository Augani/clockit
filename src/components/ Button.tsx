import {
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
} from '@mui/material';
import clsx from 'clsx';
import React from 'react';

interface ButtonProps extends MuiButtonProps {
  loading?: boolean; // Add custom property for loading state
}

const Button: React.FC<ButtonProps> = ({
  loading,
  children,
  className,
  ...props
}) => {
  return (
    <MuiButton
      {...props}
      className={clsx(
        'px-4 shadow-button',
        className,
        props.variant === 'contained'
          ? 'bg-primary text-white'
          : 'border-primary text-primary'
      )}
      disabled={loading || props.disabled}
    >
      {loading ? 'Loading...' : children}
    </MuiButton>
  );
};

export default Button;
