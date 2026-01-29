
import * as React from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    icon?: React.ReactNode;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, children, icon, ...props }, ref) => {
        return (
            <div className="relative w-full">
                {icon && (
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none z-10">
                        {icon}
                    </div>
                )}
                <select
                    className={cn(
                        "flex h-[60px] w-full appearance-none rounded-2xl border-none bg-white pl-12 pr-10 py-4 text-[15px] font-medium text-[#0F172A] shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] outline-none ring-offset-white focus:ring-2 focus:ring-[#4FD1D9]/50 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 hover:shadow-[0_4px_20px_-2px_rgba(0,0,0,0.08)] cursor-pointer",
                        !icon && "pl-6",
                        className
                    )}
                    ref={ref}
                    {...props}
                >
                    {children}
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[#94A3B8]">
                    <ChevronDown size={16} strokeWidth={2.5} />
                </div>
            </div>
        );
    }
);
Select.displayName = 'Select';
