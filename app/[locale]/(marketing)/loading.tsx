import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
    return (
        <div className="w-full bg-white">
            {/* Hero Section Skeleton */}
            <div className="relative pt-4 pb-12 lg:pt-6 lg:pb-20 overflow-hidden min-h-[600px] px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="lg:w-2/3 space-y-6 pt-10">
                    <Skeleton width="150px" height="32px" borderRadius="16px" />
                    <div className="space-y-4">
                        <Skeleton width="80%" height="80px" />
                        <Skeleton width="60%" height="80px" />
                    </div>
                    <Skeleton width="50%" height="24px" />
                </div>

                {/* Search Bar Skeleton */}
                <div className="mt-16 w-full">
                    <Skeleton height="100px" borderRadius="2.5rem" />
                </div>
            </div>

            {/* Services Section Skeleton */}
            <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="flex flex-col items-center mb-12 space-y-4 text-center">
                    <Skeleton width="100px" height="24px" borderRadius="12px" />
                    <Skeleton width="40%" height="48px" />
                    <Skeleton width="30%" height="20px" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} height="400px" borderRadius="2rem" />
                    ))}
                </div>
            </div>

            {/* Doctors Section Skeleton */}
            <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-100">
                <div className="flex justify-between items-end mb-12">
                    <div className="space-y-4 w-1/2">
                        <Skeleton width="200px" height="32px" />
                        <Skeleton width="300px" height="20px" />
                    </div>
                    <Skeleton width="120px" height="48px" borderRadius="12px" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="space-y-4">
                            <Skeleton height="350px" borderRadius="1.5rem" />
                            <div className="space-y-2">
                                <Skeleton width="80%" height="24px" />
                                <Skeleton width="60%" height="16px" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
