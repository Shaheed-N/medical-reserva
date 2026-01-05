import React from 'react';
import type { ComponentProps } from 'react';
import './Input.css';

export interface InputProps extends Omit<ComponentProps<'input'>, 'size'> {
    label?: string;
    error?: string;
    hint?: string;
    size?: 'sm' | 'md' | 'lg';
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    fullWidth?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    (
        {
            label,
            error,
            hint,
            size = 'md',
            leftIcon,
            rightIcon,
            fullWidth = true,
            className = '',
            id,
            ...props
        },
        ref
    ) => {
        const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
        const hasError = !!error;

        return (
            <div className={`input-wrapper ${fullWidth ? 'input-full' : ''} ${className}`}>
                {label && (
                    <label htmlFor={inputId} className="input-label">
                        {label}
                        {props.required && <span className="input-required">*</span>}
                    </label>
                )}

                <div className={`input-container input-${size} ${hasError ? 'input-error' : ''}`}>
                    {leftIcon && <span className="input-icon input-icon-left">{leftIcon}</span>}

                    <input
                        ref={ref}
                        id={inputId}
                        className={`input-field ${leftIcon ? 'has-left-icon' : ''} ${rightIcon ? 'has-right-icon' : ''}`}
                        aria-invalid={hasError}
                        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
                        {...props}
                    />

                    {rightIcon && <span className="input-icon input-icon-right">{rightIcon}</span>}
                </div>

                {error && (
                    <span id={`${inputId}-error`} className="input-error-text" role="alert">
                        {error}
                    </span>
                )}

                {hint && !error && (
                    <span id={`${inputId}-hint`} className="input-hint">
                        {hint}
                    </span>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;
