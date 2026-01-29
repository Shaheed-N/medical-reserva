
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'outline';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'default', isLoading, children, disabled, ...props }, ref) => {
        return (
            <button
                ref={ref}
                disabled={isLoading || disabled}
                className={cn(
                    "inline-flex items-center justify-center rounded-[14px] font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
                    {
                        // Primary: Filled, #4FD1D9, Text #0F172A
                        'bg-[#4FD1D9] text-[#0F172A] hover:brightness-95 shadow-sm hover:shadow-md border border-transparent': variant === 'primary',
                        // Secondary: Outline, #0F172A text, rounded
                        'border-2 border-[#0F172A] text-[#0F172A] bg-transparent hover:bg-[#0F172A] hover:text-white': variant === 'secondary' || variant === 'outline',
                        // Tertiary: Text only, no background
                        'text-[#0F172A] bg-transparent hover:underline underline-offset-4': variant === 'tertiary',
                        // Ghost: minimal
                        'hover:bg-slate-100 text-[#0F172A]': variant === 'ghost',
                    },
                    {
                        'h-[52px] px-6 text-[15px]': size === 'default', // 48-56px range
                        'h-10 px-4 text-sm': size === 'sm',
                        'h-14 px-8 text-lg': size === 'lg',
                        'h-[52px] w-[52px]': size === 'icon',
                    },
                    className
                )}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {children}
            </button>
        );
    }
);
Button.displayName = 'Button';
