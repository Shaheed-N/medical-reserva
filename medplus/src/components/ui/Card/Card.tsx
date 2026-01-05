import React from 'react';
import type { ComponentProps } from 'react';
import './Card.css';

export interface CardProps extends ComponentProps<'div'> {
    variant?: 'default' | 'glass' | 'elevated';
    padding?: 'none' | 'sm' | 'md' | 'lg';
    hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
    children,
    variant = 'default',
    padding = 'md',
    hoverable = false,
    className = '',
    ...props
}) => {
    const classes = [
        'card',
        `card-${variant}`,
        `card-padding-${padding}`,
        hoverable ? 'card-hoverable' : '',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={classes} {...props}>
            {children}
        </div>
    );
};

export interface CardHeaderProps extends ComponentProps<'div'> {
    title?: string;
    subtitle?: string;
    action?: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
    title,
    subtitle,
    action,
    children,
    className = '',
    ...props
}) => {
    return (
        <div className={`card-header ${className}`} {...props}>
            {(title || subtitle) && (
                <div className="card-header-content">
                    {title && <h3 className="card-title">{title}</h3>}
                    {subtitle && <p className="card-subtitle">{subtitle}</p>}
                </div>
            )}
            {children}
            {action && <div className="card-header-action">{action}</div>}
        </div>
    );
};

export const CardBody: React.FC<ComponentProps<'div'>> = ({
    children,
    className = '',
    ...props
}) => {
    return (
        <div className={`card-body ${className}`} {...props}>
            {children}
        </div>
    );
};

export const CardFooter: React.FC<ComponentProps<'div'>> = ({
    children,
    className = '',
    ...props
}) => {
    return (
        <div className={`card-footer ${className}`} {...props}>
            {children}
        </div>
    );
};

export default Card;
