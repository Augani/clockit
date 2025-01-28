import {
  CardContent,
  CardHeader,
  Card as MuiCard,
  CardProps as MuiCardProps,
} from '@mui/material';
import clsx from 'clsx';
import React from 'react';

interface CardProps extends MuiCardProps {
  title?: string;
  subtitle?: string;
}

const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  children,
  className,
  ...props
}) => {
  return (
    <MuiCard {...props} className={clsx(' shadow-card rounded-2xl', className)}>
      {title && <CardHeader title={title} subheader={subtitle} />}
      <CardContent>{children}</CardContent>
    </MuiCard>
  );
};

export default Card;
