'use client';

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export function DoctorCardSkeleton() {
    return (
        <div className="bg-white rounded-sm shadow-sm border border-slate-100 overflow-hidden">
            <Skeleton height={256} className="!rounded-none" />
            <div className="p-6">
                <Skeleton width={80} height={16} className="mb-2" />
                <Skeleton height={24} className="mb-1" />
                <Skeleton width={180} height={14} className="mb-4" />
                <Skeleton width={150} height={14} className="mb-6" />
                <Skeleton height={48} className="!rounded-sm" />
            </div>
        </div>
    );
}

export function DoctorCardGridSkeleton({ count = 4 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: count }).map((_, i) => (
                <DoctorCardSkeleton key={i} />
            ))}
        </div>
    );
}

export function DoctorListItemSkeleton() {
    return (
        <div className="bg-white p-8 rounded-sm shadow-sm border border-slate-200 flex flex-col md:flex-row gap-8">
            <Skeleton width={160} height={160} className="!rounded-sm shrink-0" />
            <div className="flex-1 py-2">
                <div className="flex gap-2 mb-2">
                    <Skeleton width={200} height={28} />
                    <Skeleton width={120} height={24} />
                </div>
                <Skeleton width={150} height={16} className="mb-6" />
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <Skeleton width={180} height={16} />
                    <Skeleton width={140} height={16} />
                    <Skeleton width={160} height={16} />
                </div>
                <div className="flex gap-4">
                    <Skeleton width={160} height={52} className="!rounded" />
                    <Skeleton width={160} height={52} className="!rounded" />
                </div>
            </div>
        </div>
    );
}

export function DoctorListSkeleton({ count = 3 }: { count?: number }) {
    return (
        <div className="space-y-6">
            {Array.from({ length: count }).map((_, i) => (
                <DoctorListItemSkeleton key={i} />
            ))}
        </div>
    );
}

export function DoctorProfileSkeleton() {
    return (
        <div className="bg-slate-50 min-h-screen py-16">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="mb-12">
                    <Skeleton width={200} height={20} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    <div className="lg:col-span-2 space-y-12">
                        <div className="bg-white p-12 rounded-sm border border-slate-200 shadow-sm">
                            <div className="flex flex-col md:flex-row gap-10">
                                <Skeleton width={192} height={192} className="!rounded-sm shrink-0" />
                                <div className="flex-1">
                                    <Skeleton width={300} height={40} className="mb-4" />
                                    <Skeleton width={150} height={20} className="mb-8" />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 mb-10">
                                        <Skeleton width={180} height={40} />
                                        <Skeleton width={180} height={40} />
                                    </div>
                                    <div className="pt-8 border-t border-slate-50 flex gap-8">
                                        <Skeleton width={100} height={30} />
                                        <Skeleton width={150} height={30} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-16">
                            <div>
                                <Skeleton width={250} height={30} className="mb-8" />
                                <Skeleton count={4} className="mb-2" />
                            </div>
                            <div>
                                <Skeleton width={250} height={30} className="mb-8" />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Skeleton height={80} />
                                    <Skeleton height={80} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <Skeleton height={500} className="!rounded-sm" />
                        <Skeleton height={100} className="!rounded-sm" />
                    </div>
                </div>
            </div>
        </div>
    );
}
