import React from 'react';

interface SkeletonProps {
    className?: string;
    width?: string | number;
    height?: string | number;
    borderRadius?: string | number;
    circle?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
    className = "",
    width,
    height,
    borderRadius,
    circle = false
}) => {
    const style: React.CSSProperties = {
        width: width,
        height: height,
        borderRadius: circle ? '50%' : borderRadius || '0.5rem',
    };

    return (
        <div
            className={`animate-pulse bg-slate-200 dark:bg-slate-700 ${className}`}
            style={style}
        />
    );
};

export default Skeleton;
