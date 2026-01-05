import React from 'react';
import type { ComponentProps } from 'react';
import './Button.css';

export interface ButtonProps extends ComponentProps<'button'> {
    variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    disabled,
    className = '',
    ...props
}) => {
    const baseClasses = 'btn';
    const variantClass = `btn-${variant}`;
    const sizeClass = `btn-${size}`;
    const widthClass = fullWidth ? 'btn-full' : '';
    const loadingClass = isLoading ? 'btn-loading' : '';

    return (
        <button
            className={`${baseClasses} ${variantClass} ${sizeClass} ${widthClass} ${loadingClass} ${className}`.trim()}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && (
                <span className="btn-spinner" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" className="spinner-icon">
                        <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeDasharray="60"
                            strokeDashoffset="20"
                        />
                    </svg>
                </span>
            )}
            {!isLoading && leftIcon && <span className="btn-icon-left">{leftIcon}</span>}
            <span className="btn-text">{children}</span>
            {!isLoading && rightIcon && <span className="btn-icon-right">{rightIcon}</span>}
        </button>
    );
};

export default Button;
