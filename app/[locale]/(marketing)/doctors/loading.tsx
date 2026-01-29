import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-6">
                <div className="space-y-4 w-full md:w-1/3">
                    <Skeleton width="200px" height="40px" />
                    <Skeleton width="100%" height="20px" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar Filter Skeleton */}
                <div className="lg:col-span-1 space-y-6">
                    <Skeleton height="600px" borderRadius="1.5rem" />
                </div>

                {/* Main Content Skeleton */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-100 mb-6">
                        <Skeleton width="150px" height="24px" />
                        <Skeleton width="200px" height="40px" borderRadius="10px" />
                    </div>

                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} height="200px" borderRadius="1.5rem" />
                    ))}
                </div>
            </div>
        </div>
    );
}
