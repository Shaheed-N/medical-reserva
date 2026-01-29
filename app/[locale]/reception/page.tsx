"use client";

import { use, useState } from 'react';
import {
    Search,
    Clock,
    UserCheck,
    UserX,
    CheckCircle,
    XCircle,
    Phone,
    Calendar,
    Users,
    ArrowRight
} from 'lucide-react';
import {
    useReceptionistProfile,
    useDailyAppointments,
    useUpdateAppointmentStatus
} from '@/lib/hooks';

export default function ReceptionDashboard({ params: paramsPromise }: { params: Promise<{ locale: string }> }) {
    const params = use(paramsPromise);
    const locale = params.locale || 'az';
    const isRu = locale === 'ru';
    const todayStr = new Date().toISOString().split('T')[0];
    const [selectedDate, setSelectedDate] = useState(todayStr);
    const [searchQuery, setSearchQuery] = useState('');

    const { data: profile, isLoading: isProfileLoading } = useReceptionistProfile();
    const { data: appointments, isLoading: isAptsLoading } = useDailyAppointments(profile?.branch_id || '', selectedDate);
    const updateStatus = useUpdateAppointmentStatus();

    const handleUpdateStatus = async (id: string, status: string) => {
        await updateStatus.mutateAsync({ appointmentId: id, status });
    };

    const stats = {
        total: appointments?.length || 0,
        arrived: appointments?.filter((a: any) => a.status === 'checked_in').length || 0,
        inProgress: appointments?.filter((a: any) => a.status === 'in_progress').length || 0,
        completed: appointments?.filter((a: any) => a.status === 'completed').length || 0,
        waiting: appointments?.filter((a: any) => a.status === 'pending' || a.status === 'confirmed').length || 0,
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'pending':
            case 'confirmed': return 'bg-slate-100 text-slate-600';
            case 'checked_in': return 'bg-blue-100 text-blue-700';
            case 'in_progress': return 'bg-amber-100 text-amber-700';
            case 'completed': return 'bg-green-100 text-green-700';
            case 'no_show': return 'bg-red-100 text-red-700';
            case 'cancelled': return 'bg-red-50 text-red-500';
            default: return 'bg-slate-50 text-slate-400';
        }
    };

    const getStatusLabel = (status: string) => {
        const labels: Record<string, string> = {
            pending: isRu ? 'Ожидает' : 'Gözləyir',
            confirmed: isRu ? 'Подтверждено' : 'Təsdiqlənib',
            checked_in: isRu ? 'Прибыл' : 'Gəlib',
            in_progress: isRu ? 'На приёме' : 'Qəbulda',
            completed: isRu ? 'Завершено' : 'Tamamlanıb',
            no_show: isRu ? 'Не явился' : 'Gəlmədi',
            cancelled: isRu ? 'Отменено' : 'Ləğv edilib',
        };
        return labels[status] || status;
    };

    const filteredAppointments = appointments?.filter((apt: any) =>
        apt.patient?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.patient?.phone?.includes(searchQuery) ||
        apt.doctor?.user?.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    if (isProfileLoading || isAptsLoading) {
        return <div className="p-8 text-center text-slate-500">Yüklənir...</div>;
    }

    if (!profile) {
        return (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
                <Users size={48} className="mx-auto mb-4 text-slate-300" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">Giriş imkanı yoxdur</h3>
                <p className="text-slate-500">Siz hər hansı bir xəstəxanaya admin personalı kimi təyin edilməmisiniz.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                        {isRu ? 'Ресепшн' : 'Qəbul Paneli'}
                    </h1>
                    <p className="text-slate-500">
                        {profile.branch?.hospital?.name} - {profile.branch?.name}
                    </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <p className="font-bold text-[#0F766E]">
                        {new Date(selectedDate).toLocaleDateString(locale === 'az' ? 'az-AZ' : 'ru-RU', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </p>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-xl shadow-sm">
                        <Calendar size={16} className="text-slate-400" />
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="bg-transparent border-none outline-none text-sm font-medium text-slate-700"
                        />
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                    <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
                    <div className="text-sm text-slate-500">{isRu ? 'Всего' : 'Ümumi'}</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                    <div className="text-2xl font-bold text-blue-700">{stats.arrived}</div>
                    <div className="text-sm text-blue-600">{isRu ? 'Прибыли' : 'Gəlib'}</div>
                </div>
                <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                    <div className="text-2xl font-bold text-amber-700">{stats.inProgress}</div>
                    <div className="text-sm text-amber-600">{isRu ? 'На приёме' : 'Qəbulda'}</div>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div className="text-2xl font-bold text-slate-700">{stats.waiting}</div>
                    <div className="text-sm text-slate-600">{isRu ? 'Ожидают' : 'Gözləyir'}</div>
                </div>
                <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                    <div className="text-2xl font-bold text-green-700">{stats.completed}</div>
                    <div className="text-sm text-green-600">{isRu ? 'Завершено' : 'Tamamlanıb'}</div>
                </div>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                    type="text"
                    placeholder={isRu ? 'Поиск по имени, телефону...' : 'Ad, telefon ilə axtar...'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-xl focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10 outline-none text-lg"
                />
            </div>

            {/* Appointments List */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="p-4 bg-slate-50 border-b border-slate-200">
                    <h2 className="font-bold text-slate-900">
                        {isRu ? 'Записи на сегодня' : 'Bugünkü rezervasiyalar'}
                    </h2>
                </div>

                <div className="divide-y divide-slate-100">
                    {filteredAppointments.map((apt: any) => (
                        <div key={apt.id} className="p-4 hover:bg-slate-50 transition-colors">
                            <div className="flex items-center gap-4">
                                {/* Time */}
                                <div className="w-16 text-center">
                                    <div className="text-xl font-bold text-slate-900">
                                        {apt.start_time.substring(0, 5)}
                                    </div>
                                </div>

                                <div className="w-px h-12 bg-slate-200"></div>

                                {/* Patient Info */}
                                <div className="flex-1">
                                    <div className="font-bold text-slate-900 text-lg">{apt.patient?.full_name}</div>
                                    <div className="flex items-center gap-4 text-sm text-slate-500">
                                        <span className="flex items-center gap-1">
                                            <Phone size={14} />
                                            {apt.patient?.phone}
                                        </span>
                                        <span>• {apt.doctor?.user?.full_name}</span>
                                        <span>• {isRu ? apt.reason?.name_ru || apt.reason?.name : apt.reason?.name_az || apt.reason?.name}</span>
                                    </div>
                                </div>

                                {/* Status Badge */}
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(apt.status)}`}>
                                    {getStatusLabel(apt.status)}
                                </span>

                                {/* Actions */}
                                <div className="flex items-center gap-2">
                                    {(apt.status === 'pending' || apt.status === 'confirmed') && (
                                        <>
                                            <button
                                                onClick={() => handleUpdateStatus(apt.id, 'checked_in')}
                                                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                                            >
                                                <UserCheck size={18} />
                                                {isRu ? 'Прибыл' : 'Gəldi'}
                                            </button>
                                            <button
                                                onClick={() => handleUpdateStatus(apt.id, 'no_show')}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                title={isRu ? 'Не явился' : 'Gəlmədi'}
                                            >
                                                <UserX size={18} />
                                            </button>
                                        </>
                                    )}
                                    {apt.status === 'checked_in' && (
                                        <button
                                            onClick={() => handleUpdateStatus(apt.id, 'in_progress')}
                                            className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-medium"
                                        >
                                            <ArrowRight size={18} />
                                            {isRu ? 'Начать приём' : 'Qəbulu başla'}
                                        </button>
                                    )}
                                    {apt.status === 'in_progress' && (
                                        <button
                                            onClick={() => handleUpdateStatus(apt.id, 'completed')}
                                            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
                                        >
                                            <CheckCircle size={18} />
                                            {isRu ? 'Завершить' : 'Tamamla'}
                                        </button>
                                    )}
                                    {apt.status === 'completed' && (
                                        <span className="text-green-600 flex items-center gap-1">
                                            <CheckCircle size={18} />
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredAppointments.length === 0 && (
                    <div className="p-12 text-center text-slate-400">
                        <Users size={48} className="mx-auto mb-4 opacity-50" />
                        <p>{isRu ? 'Записи не найдены' : 'Rezervasiya tapılmadı'}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
