import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
    return (
        <div className="w-full bg-white">
            {/* Hero Section Skeleton */}
            <div className="relative pt-24 pb-32 overflow-hidden min-h-[600px] px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="lg:w-3/5 space-y-10">
                    <div className="space-y-4">
                        <Skeleton width="80%" height="80px" />
                        <Skeleton width="60%" height="80px" />
                    </div>
                    <div className="pl-6 border-l-2 border-slate-100">
                        <Skeleton width="50%" height="24px" />
                        <Skeleton width="40%" height="24px" className="mt-2" />
                    </div>

                    {/* Search Bar Skeleton - centered pill style */}
                    <div className="mt-16 w-full max-w-4xl">
                        <Skeleton height="84px" borderRadius="3rem" />
                    </div>
                </div>

                {/* Right side video placeholder */}
                <div className="absolute top-0 right-0 w-1/2 h-full hidden lg:block opacity-20">
                    <Skeleton width="100%" height="100%" />
                </div>
            </div>

            {/* Reels Section Skeleton */}
            <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="space-y-4 mb-12">
                    <Skeleton width="100px" height="24px" borderRadius="12px" />
                    <Skeleton width="300px" height="48px" />
                </div>
                <div className="flex gap-6 overflow-hidden">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Skeleton key={i} className="min-w-[280px] aspect-[9/16]" borderRadius="2rem" />
                    ))}
                </div>
            </div>

            {/* Services Section Skeleton */}
            <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-50">
                <div className="flex flex-col items-center mb-16 space-y-4 text-center">
                    <Skeleton width="120px" height="24px" borderRadius="12px" />
                    <Skeleton width="40%" height="64px" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="space-y-6">
                            <Skeleton height="250px" borderRadius="2rem" />
                            <Skeleton width="80%" height="32px" className="mx-auto" />
                            <Skeleton width="60%" height="20px" className="mx-auto" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
