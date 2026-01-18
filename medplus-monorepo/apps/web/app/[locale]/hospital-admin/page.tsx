"use client";

import { use } from 'react';
import Link from 'next/link';
import {
    Users,
    CalendarDays,
    TrendingUp,
    Clock,
    UserPlus,
    Star,
    ArrowRight
} from 'lucide-react';
import {
    useHospitalProfile,
    useHospitalDoctors,
    useHospitalApplications,
    useHospitalStats
} from '@/lib/hooks';

export default function HospitalAdminDashboard({ params: paramsPromise }: { params: Promise<{ locale: string }> }) {
    const params = use(paramsPromise);
    const locale = params.locale || 'az';
    const isRu = locale === 'ru';

    const { data: hospital, isLoading: isProfileLoading } = useHospitalProfile();
    const { data: doctors, isLoading: isDoctorsLoading } = useHospitalDoctors(hospital?.id || '');
    const { data: applications, isLoading: isAppsLoading } = useHospitalApplications(hospital?.id || '');
    const { data: statsData, isLoading: isStatsLoading } = useHospitalStats(hospital?.id || '');

    const stats = [
        {
            label: isRu ? 'Врачей' : 'Həkim',
            value: doctors?.length?.toString() || '0',
            icon: Users,
            color: 'bg-purple-500'
        },
        {
            label: isRu ? 'Записей сегодня' : 'Bugünkü rezervasiya',
            value: statsData?.todayAppointments?.toString() || '0',
            icon: CalendarDays,
            color: 'bg-blue-500'
        },
        {
            label: isRu ? 'Заявки' : 'Müraciətlər',
            value: applications?.length?.toString() || '0',
            icon: UserPlus,
            color: 'bg-green-500'
        },
        {
            label: isRu ? 'Рейтинг' : 'Reytinq',
            value: '4.8',
            icon: Star,
            color: 'bg-amber-500'
        },
    ];

    if (isProfileLoading || isDoctorsLoading || isAppsLoading || isStatsLoading) {
        return <div className="p-8 text-center text-slate-500">Yüklənir...</div>;
    }

    if (!hospital) {
        return (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
                <Users size={48} className="mx-auto mb-4 text-slate-300" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">Giriş imkanı yoxdur</h3>
                <p className="text-slate-500">Siz hər hansı bir xəstəxanaya admin kimi təyin edilməmisiniz.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900">
                    {isRu ? 'Панель Управления' : 'İdarəetmə Paneli'}
                </h1>
                <p className="text-slate-500 mt-1">
                    {isRu ? `Обзор клиники ${hospital.name}` : `${hospital.name} icmalı`}
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                                <p className="text-3xl font-bold text-slate-900 mt-2">{stat.value}</p>
                            </div>
                            <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-white`}>
                                <stat.icon size={24} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Doctors List */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                        <h2 className="font-bold text-slate-900">{isRu ? 'Врачи клиники' : 'Klinika həkimləri'}</h2>
                        <Link href={`/${locale}/hospital-admin/doctors`} className="text-purple-600 text-sm font-medium hover:underline flex items-center gap-1">
                            {isRu ? 'Все' : 'Hamısı'} <ArrowRight size={14} />
                        </Link>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {doctors?.slice(0, 5).map((doc: any, index: number) => (
                            <div key={index} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold overflow-hidden">
                                        {doc.user?.avatar_url ? (
                                            <img src={doc.user.avatar_url} alt={doc.user.full_name} className="w-full h-full object-cover" />
                                        ) : (
                                            doc.user?.full_name?.split(' ')[1]?.[0] || 'D'
                                        )}
                                    </div>
                                    <div>
                                        <div className="font-medium text-slate-900">{doc.user?.full_name}</div>
                                        <div className="text-sm text-slate-500">{doc.specialties?.join(', ')}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-1 text-amber-500">
                                        <Star size={14} className="fill-current" />
                                        <span className="font-bold text-slate-900">4.5</span>
                                    </div>
                                    <div className="text-xs text-slate-400">{doc.appointmentCount} {isRu ? 'записей' : 'rezervasiya'}</div>
                                </div>
                            </div>
                        ))}
                        {(doctors?.length || 0) === 0 && (
                            <div className="p-8 text-center text-slate-400">
                                {isRu ? 'Врачи не найдены' : 'Həkim tapılmadı'}
                            </div>
                        )}
                    </div>
                </div>

                {/* Pending Applications */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                        <h2 className="font-bold text-slate-900 flex items-center gap-2">
                            <UserPlus size={18} className="text-purple-600" />
                            {isRu ? 'Заявки от врачей' : 'Həkim müraciətləri'}
                        </h2>
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">
                            {applications?.length || 0}
                        </span>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {applications?.map((app: any, index: number) => (
                            <div key={index} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                <div>
                                    <div className="font-medium text-slate-900">{app.title} {app.user?.full_name}</div>
                                    <div className="text-sm text-slate-500">{app.specialties?.join(', ')}</div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="text-xs text-slate-400">{new Date(app.created_at).toLocaleDateString()}</div>
                                    <Link
                                        href={`/${locale}/hospital-admin/applications/${app.id}`}
                                        className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
                                    >
                                        {isRu ? 'Просмотр' : 'Bax'}
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                    {(applications?.length || 0) === 0 && (
                        <div className="p-8 text-center text-slate-400">
                            {isRu ? 'Нет новых заявок' : 'Yeni müraciət yoxdur'}
                        </div>
                    )}
                </div>
            </div>

            {/* Today's Schedule Overview */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="font-bold text-slate-900 flex items-center gap-2">
                        <Clock size={18} className="text-purple-600" />
                        {isRu ? 'Расписание на сегодня' : 'Bugünkü qrafik'}
                    </h2>
                    <Link href={`/${locale}/hospital-admin/appointments`} className="text-purple-600 text-sm font-medium hover:underline flex items-center gap-1">
                        {isRu ? 'Подробнее' : 'Ətraflı'} <ArrowRight size={14} />
                    </Link>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        {doctors?.slice(0, 4).map((doc: any, index: number) => (
                            <div key={index} className="bg-slate-50 p-4 rounded-xl">
                                <div className="font-medium text-slate-900 text-sm mb-2">{doc.user?.full_name}</div>
                                <div className="flex items-center gap-2">
                                    <CalendarDays size={14} className="text-slate-400" />
                                    <span className="text-sm text-slate-600">{doc.appointmentCount} {isRu ? 'записей' : 'rezervasiya'}</span>
                                </div>
                            </div>
                        ))}
                        {(doctors?.length || 0) === 0 && (
                            <div className="col-span-4 p-8 text-center text-slate-400">
                                {isRu ? 'Нет расписания' : 'Qrafik yoxdur'}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
