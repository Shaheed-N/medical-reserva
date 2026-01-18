"use client";

import { use, useState } from 'react';
import {
    Clock,
    Search,
    Filter,
    CheckCircle,
    XCircle,
    Calendar,
    User,
    Phone,
    MessageSquare
} from 'lucide-react';
import {
    useDoctorProfile,
    useDoctorAppointments,
    useUpdateAppointmentStatus
} from '@/lib/hooks';

export default function DoctorAppointmentsPage({ params: paramsPromise }: { params: Promise<{ locale: string }> }) {
    const params = use(paramsPromise);
    const locale = params.locale || 'az';
    const isRu = locale === 'ru';
    const todayStr = new Date().toISOString().split('T')[0];

    const { data: profile } = useDoctorProfile();
    const { data: appointments, isLoading } = useDoctorAppointments(profile?.id || '');
    const updateStatus = useUpdateAppointmentStatus();

    const [filter, setFilter] = useState<'all' | 'today' | 'date' | 'upcoming' | 'past'>('today');
    const [selectedDate, setSelectedDate] = useState(todayStr);
    const [searchQuery, setSearchQuery] = useState('');

    const handleUpdateStatus = async (id: string, status: string) => {
        await updateStatus.mutateAsync({ appointmentId: id, status });
    };

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            pending: 'bg-amber-100 text-amber-700',
            confirmed: 'bg-blue-100 text-blue-700',
            checked_in: 'bg-blue-200 text-blue-800',
            in_progress: 'bg-amber-200 text-amber-800',
            completed: 'bg-green-100 text-green-700',
            cancelled: 'bg-red-100 text-red-700',
            no_show: 'bg-slate-100 text-slate-700',
        };
        const labels: Record<string, string> = {
            pending: isRu ? 'Ожидает' : 'Gözləyir',
            confirmed: isRu ? 'Подтверждено' : 'Təsdiqlənib',
            checked_in: isRu ? 'Прибыл' : 'Gəlib',
            in_progress: isRu ? 'На приёме' : 'Qəbulda',
            completed: isRu ? 'Завершено' : 'Tamamlanıb',
            cancelled: isRu ? 'Отменено' : 'Ləğv edilib',
            no_show: isRu ? 'Не явился' : 'Gəlmədi',
        };
        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
                {labels[status]}
            </span>
        );
    };

    const filteredAppointments = appointments?.filter((apt: any) => {
        if (filter === 'today') return apt.scheduled_date === todayStr;
        if (filter === 'date') return apt.scheduled_date === selectedDate;
        if (filter === 'upcoming') return apt.scheduled_date > todayStr;
        if (filter === 'past') return apt.scheduled_date < todayStr;
        return true;
    }).filter((apt: any) =>
        apt.patient?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.patient?.phone?.includes(searchQuery)
    ) || [];

    if (isLoading) {
        return <div className="p-8 text-center text-slate-500">Yüklənir...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                        <Clock className="text-[#0F766E]" />
                        {isRu ? 'Записи' : 'Rezervasiyalar'}
                    </h1>
                    <p className="text-slate-500 mt-1">
                        {isRu ? 'Управляйте записями пациентов' : 'Pasient rezervasiyalarını idarə edin'}
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4 flex-wrap">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder={isRu ? 'Поиск по имени или номеру...' : 'Ad və ya nömrə ilə axtar...'}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10 outline-none"
                    />
                </div>

                <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
                    {[
                        { key: 'today', label: isRu ? 'Сегодня' : 'Bu gün' },
                        { key: 'date', label: isRu ? 'Дата' : 'Tarix' },
                        { key: 'upcoming', label: isRu ? 'Предстоящие' : 'Gələn' },
                        { key: 'past', label: isRu ? 'Прошедшие' : 'Keçmiş' },
                        { key: 'all', label: isRu ? 'Все' : 'Hamısı' },
                    ].map((f) => (
                        <button
                            key={f.key}
                            onClick={() => setFilter(f.key as typeof filter)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === f.key
                                ? 'bg-white text-slate-900 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                {filter === 'date' && (
                    <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
                        <Calendar size={18} className="text-slate-400" />
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="px-4 py-2 bg-white border border-slate-200 rounded-xl focus:border-[#0F766E] outline-none text-sm"
                        />
                    </div>
                )}
            </div>

            {/* Appointments Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                {isRu ? 'Время' : 'Vaxt'}
                            </th>
                            <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                {isRu ? 'Пациент' : 'Pasient'}
                            </th>
                            <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                {isRu ? 'Причина' : 'Səbəb'}
                            </th>
                            <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                {isRu ? 'Статус' : 'Status'}
                            </th>
                            <th className="text-right px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                {isRu ? 'Действия' : 'Əməliyyatlar'}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredAppointments.map((apt: any) => (
                            <tr key={apt.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <Calendar size={18} className="text-slate-400" />
                                        <div>
                                            <div className="font-bold text-slate-900">{apt.start_time.substring(0, 5)}</div>
                                            <div className="text-xs text-slate-400">{apt.scheduled_date}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center overflow-hidden">
                                            {apt.patient?.avatar_url ? (
                                                <img src={apt.patient.avatar_url} alt={apt.patient.full_name} className="w-full h-full object-cover" />
                                            ) : (
                                                <User size={18} className="text-slate-400" />
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-medium text-slate-900">{apt.patient?.full_name}</div>
                                            <div className="text-xs text-slate-400">{apt.patient?.phone}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-slate-600">
                                    {isRu ? apt.visit_reason?.name_ru || apt.visit_reason?.name : apt.visit_reason?.name_az || apt.visit_reason?.name}
                                </td>
                                <td className="px-6 py-4">
                                    {getStatusBadge(apt.status)}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-end gap-2">
                                        {apt.status === 'pending' && (
                                            <button
                                                onClick={() => handleUpdateStatus(apt.id, 'confirmed')}
                                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                title={isRu ? 'Подтвердить' : 'Təsdiqlə'}
                                            >
                                                <CheckCircle size={18} />
                                            </button>
                                        )}
                                        {apt.status !== 'completed' && apt.status !== 'cancelled' && (
                                            <button
                                                onClick={() => handleUpdateStatus(apt.id, 'cancelled')}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title={isRu ? 'Отменить' : 'Ləğv et'}
                                            >
                                                <XCircle size={18} />
                                            </button>
                                        )}
                                        <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors" title={isRu ? 'Заметки' : 'Qeydlər'}>
                                            <MessageSquare size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredAppointments.length === 0 && (
                    <div className="p-12 text-center text-slate-400">
                        <Clock size={48} className="mx-auto mb-4 opacity-50" />
                        <p>{isRu ? 'Записей не найдено' : 'Rezervasiya tapılmadı'}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
