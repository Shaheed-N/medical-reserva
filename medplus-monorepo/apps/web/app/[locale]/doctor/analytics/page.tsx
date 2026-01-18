"use client";

import { use } from 'react';
import {
    TrendingUp,
    Users,
    Clock,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    CheckCircle,
    XCircle,
    Activity
} from 'lucide-react';
import {
    useDoctorProfile,
    useDoctorAppointments
} from '@/lib/hooks';

export default function DoctorAnalyticsPage({ params: paramsPromise }: { params: Promise<{ locale: string }> }) {
    const params = use(paramsPromise);
    const locale = params.locale || 'az';
    const isRu = locale === 'ru';

    const { data: profile } = useDoctorProfile();
    const { data: appointments, isLoading } = useDoctorAppointments(profile?.id || '');

    const stats = {
        total: appointments?.length || 0,
        completed: appointments?.filter((a: any) => a.status === 'completed').length || 0,
        cancelled: appointments?.filter((a: any) => a.status === 'cancelled' || a.status === 'no_show').length || 0,
        pending: appointments?.filter((a: any) => a.status === 'pending' || a.status === 'confirmed').length || 0,
    };

    const completionRate = stats.total > 0 ? Math.round((stats.completed / (stats.total - stats.pending)) * 100) : 0;

    // Simulated data for charts
    const weeklyData = [
        { day: 'Mon', count: 8 },
        { day: 'Tue', count: 12 },
        { day: 'Wed', count: 15 },
        { day: 'Thu', count: 10 },
        { day: 'Fri', count: 14 },
        { day: 'Sat', count: 5 },
        { day: 'Sun', count: 0 },
    ];

    if (isLoading) {
        return <div className="p-8 text-center text-slate-500">Yüklənir...</div>;
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                    <TrendingUp className="text-[#0F766E]" />
                    {isRu ? 'Аналитика' : 'Analitika'}
                </h1>
                <p className="text-slate-500 mt-1">
                    {isRu ? 'Обслуживание и статистика вашего профиля' : 'Profilinizin performansı və statistikası'}
                </p>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600">
                            <Clock size={20} />
                        </div>
                        <span className="flex items-center text-xs font-bold text-green-500 gap-0.5">
                            <ArrowUpRight size={14} />
                            +12%
                        </span>
                    </div>
                    <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
                    <div className="text-sm text-slate-500">{isRu ? 'Всего записей' : 'Cəmi rezervasiya'}</div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                            <Activity size={20} />
                        </div>
                        <span className="flex items-center text-xs font-bold text-green-500 gap-0.5">
                            <ArrowUpRight size={14} />
                            +5%
                        </span>
                    </div>
                    <div className="text-2xl font-bold text-slate-900">{completionRate}%</div>
                    <div className="text-sm text-slate-500">{isRu ? 'Коэфф. завершения' : 'Tamamlanma faizi'}</div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                            <Users size={20} />
                        </div>
                        <span className="text-xs text-slate-400">Total</span>
                    </div>
                    <div className="text-2xl font-bold text-slate-900">{stats.completed}</div>
                    <div className="text-sm text-slate-500">{isRu ? 'Пациентов принято' : 'Qəbul edilmiş pasientlər'}</div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-600">
                            <XCircle size={20} />
                        </div>
                        <span className="flex items-center text-xs font-bold text-red-500 gap-0.5">
                            <ArrowUpRight size={14} />
                            +2%
                        </span>
                    </div>
                    <div className="text-2xl font-bold text-slate-900">{stats.cancelled}</div>
                    <div className="text-sm text-slate-500">{isRu ? 'Отмены/Неявки' : 'Ləğv/Gəlməyənlər'}</div>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Weekly Activity Chart */}
                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="font-bold text-slate-900">{isRu ? 'Активность по неделям' : 'Həftəlik aktivlik'}</h3>
                            <p className="text-sm text-slate-500">{isRu ? 'Количество записей по дням' : 'Günlər üzrə rezervasiya sayı'}</p>
                        </div>
                        <select className="bg-slate-50 border-none rounded-lg px-3 py-1.5 text-sm text-slate-600 outline-none">
                            <option>{isRu ? 'Эта неделя' : 'Bu həftə'}</option>
                            <option>{isRu ? 'Прошяя неделя' : 'Keçən həftə'}</option>
                        </select>
                    </div>

                    <div className="flex items-end justify-between h-48 gap-4 px-2">
                        {weeklyData.map((item) => (
                            <div key={item.day} className="flex-1 flex flex-col items-center gap-3 group">
                                <div
                                    className="w-full bg-slate-100 rounded-lg relative overflow-hidden group-hover:bg-slate-200 transition-colors"
                                    style={{ height: '100%' }}
                                >
                                    <div
                                        className="absolute bottom-0 left-0 right-0 bg-[#0F766E] rounded-lg transition-all duration-500"
                                        style={{ height: `${(item.count / 20) * 100}%` }}
                                    >
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                            {item.count}
                                        </div>
                                    </div>
                                </div>
                                <span className="text-xs text-slate-400 font-medium">{item.day}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Visit Distribution */}
                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-6">{isRu ? 'Распределение по причинам' : 'Səbəblər üzrə paylanma'}</h3>
                    <div className="space-y-6">
                        {[
                            { label: isRu ? 'Консультация' : 'Konsultasiya', value: 45, color: 'bg-teal-500' },
                            { label: isRu ? 'Обследование' : 'Müayinə', value: 30, color: 'bg-blue-500' },
                            { label: isRu ? 'Повторный визит' : 'Təkrar vizit', value: 15, color: 'bg-purple-500' },
                            { label: isRu ? 'Другое' : 'Digər', value: 10, color: 'bg-slate-400' },
                        ].map((item) => (
                            <div key={item.label} className="space-y-2">
                                <div className="flex justify-between text-sm font-medium">
                                    <span className="text-slate-700">{item.label}</span>
                                    <span className="text-slate-900">{item.value}%</span>
                                </div>
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${item.color} rounded-full transition-all duration-700`}
                                        style={{ width: `${item.value}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-8 pt-8 border-t border-slate-100 flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                            <span className="text-slate-500">{isRu ? 'Новые' : 'Yeni'}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                            <span className="text-slate-500">{isRu ? 'Постоянные' : 'Daimi'}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                            <span className="text-slate-500">{isRu ? 'Срочные' : 'Təcili'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
