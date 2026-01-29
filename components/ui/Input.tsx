
import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, icon, ...props }, ref) => {
        return (
            <div className="relative w-full">
                {icon && (
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none z-10">
                        {icon}
                    </div>
                )}
                <input
                    type={type}
                    className={cn(
                        "flex h-[60px] w-full rounded-2xl border-none bg-white px-6 py-4 text-[15px] font-medium text-[#0F172A] shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#4FD1D9]/50 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 hover:shadow-[0_4px_20px_-2px_rgba(0,0,0,0.08)]",
                        icon && "pl-12", // Add left padding if icon exists
                        className
                    )}
                    ref={ref}
                    {...props}
                />
            </div>
        );
    }
);
Input.displayName = 'Input';
