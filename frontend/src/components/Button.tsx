import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-bold rounded-xl transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-move-primary focus:ring-offset-2 focus:ring-offset-move-bg';

  const variantClasses = {
    primary: 'bg-move-primary text-move-on-primary hover:bg-move-primary-hover active:scale-[0.98]',
    secondary: 'bg-transparent text-move-text border border-move-border hover:bg-move-surface-card hover:border-move-primary',
    danger: 'bg-move-surface text-move-primary border border-move-border hover:bg-move-border active:scale-[0.98]',
    ghost: 'bg-transparent text-move-muted hover:text-move-text hover:bg-move-surface'
  };

  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-sm px-4 py-2.5',
    lg: 'text-base px-6 py-3.5'
  };

  return (
    <button
      className={twMerge(
        clsx(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && 'w-full',
          className
        )
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
