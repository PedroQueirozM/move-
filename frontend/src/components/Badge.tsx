import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'danger' | 'warning' | 'primary' | 'muted';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  className
}) => {
  const variantClasses = {
    primary: 'bg-move-primary text-move-on-primary font-bold',
    success: 'bg-move-success/20 text-move-success border border-move-success/30',
    danger: 'bg-move-danger/20 text-move-danger border border-move-danger/30',
    warning: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    muted: 'bg-move-surface text-move-muted border border-move-border'
  };

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide whitespace-nowrap',
          variantClasses[variant],
          className
        )
      )}
    >
      {children}
    </span>
  );
};
