import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-6">
                <div className="space-y-4 w-full md:w-1/3">
                    <Skeleton width="220px" height="40px" />
                    <Skeleton width="100%" height="20px" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="space-y-4">
                        <Skeleton height="250px" borderRadius="1.5rem" />
                        <div className="space-y-2">
                            <Skeleton width="80%" height="24px" />
                            <Skeleton width="60%" height="16px" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
