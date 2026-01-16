'use client';

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export function HospitalCardSkeleton() {
    return (
        <div className="bg-white rounded border border-slate-200 overflow-hidden flex flex-col sm:flex-row shadow-sm">
            <div className="sm:w-1/3 h-64 sm:h-auto">
                <Skeleton height="100%" className="!rounded-none min-h-[200px]" />
            </div>
            <div className="sm:w-2/3 p-8 flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-start mb-4">
                        <Skeleton width={200} height={24} />
                        <Skeleton width={60} height={28} />
                    </div>
                    <div className="space-y-3 mb-8">
                        <Skeleton width={220} height={16} />
                        <Skeleton width={180} height={16} />
                        <Skeleton width={120} height={16} />
                    </div>
                </div>
                <Skeleton height={44} className="!rounded" />
            </div>
        </div>
    );
}

export function HospitalGridSkeleton({ count = 4 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {Array.from({ length: count }).map((_, i) => (
                <HospitalCardSkeleton key={i} />
            ))}
        </div>
    );
}

export function HospitalProfileSkeleton() {
    return (
        <div className="bg-slate-50 min-h-screen">
            <div className="h-[40vh] relative bg-slate-200">
                <Skeleton height="100%" />
            </div>
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-12">
                        <div className="bg-white p-12 rounded border border-slate-200 shadow-sm">
                            <Skeleton width={250} height={30} className="mb-8" />
                            <Skeleton count={4} className="mb-6" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Skeleton height={30} />
                                <Skeleton height={30} />
                                <Skeleton height={30} />
                            </div>
                        </div>
                        <div>
                            <Skeleton width={300} height={30} className="mb-8" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Skeleton height={150} />
                                <Skeleton height={150} />
                            </div>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <Skeleton height={400} />
                        <Skeleton height={100} />
                    </div>
                </div>
            </div>
        </div>
    );
}
