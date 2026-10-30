import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold uppercase tracking-wider text-move-muted">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={twMerge(
            clsx(
              'w-full px-3.5 py-2.5 rounded-xl bg-move-surface border text-sm text-move-text transition-colors',
              'placeholder:text-move-muted/60',
              'focus:outline-none focus:ring-1 focus:ring-move-primary focus:border-move-primary',
              error ? 'border-move-danger' : 'border-move-border hover:border-move-muted',
              className
            )
          )}
          {...props}
        />
        {error ? (
          <p className="text-xs text-move-danger font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-move-muted">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
