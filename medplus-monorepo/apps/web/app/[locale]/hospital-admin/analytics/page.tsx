"use client";

import { use } from 'react';
import {
    TrendingUp,
    Users,
    Building2,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    Star,
    Activity,
    UserCog
} from 'lucide-react';
import {
    useHospitalProfile,
    useHospitalDoctors,
    useHospitalStats
} from '@/lib/hooks';

export default function HospitalAdminAnalyticsPage({ params: paramsPromise }: { params: Promise<{ locale: string }> }) {
    const params = use(paramsPromise);
    const locale = params.locale || 'az';
    const isRu = locale === 'ru';

    const { data: hospital } = useHospitalProfile();
    const { data: doctors } = useHospitalDoctors(hospital?.id || '');
    const { data: todayStats } = useHospitalStats(hospital?.id || '');

    const stats = {
        totalDoctors: doctors?.length || 0,
        totalAppointments: doctors?.reduce((acc: number, doc: any) => acc + (doc.appointmentCount || 0), 0) || 0,
        avgRating: 4.8,
        monthlyGrowth: 15,
    };

    // Simulated branch data
    const branchData = [
        { name: 'Mərkəz Filialı', count: 120, growth: 12 },
        { name: 'Əhmədli Filialı', count: 85, growth: -3 },
        { name: 'Yasamal Filialı', count: 64, growth: 8 },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                    <TrendingUp className="text-purple-600" />
                    {isRu ? 'Аналитика Клиники' : 'Klinika Analitikası'}
                </h1>
                <p className="text-slate-500 mt-1">
                    {isRu ? 'Обзор производительности всей сети клиник' : 'Klinika şəbəkəsinin ümumi performans göstəriciləri'}
                </p>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                            <Calendar size={20} />
                        </div>
                        <span className="flex items-center text-xs font-bold text-green-500 gap-0.5">
                            <ArrowUpRight size={14} />
                            +{stats.monthlyGrowth}%
                        </span>
                    </div>
                    <div className="text-2xl font-bold text-slate-900">{stats.totalAppointments}</div>
                    <div className="text-sm text-slate-500">{isRu ? 'Всего записей' : 'Cəmi rezervasiya'}</div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                            <UserCog size={20} />
                        </div>
                        <span className="text-xs text-slate-400">Total</span>
                    </div>
                    <div className="text-2xl font-bold text-slate-900">{stats.totalDoctors}</div>
                    <div className="text-sm text-slate-500">{isRu ? 'Активных врачей' : 'Aktiv həkimlər'}</div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                            <Star size={20} />
                        </div>
                        <span className="text-xs text-slate-400">Avg</span>
                    </div>
                    <div className="text-2xl font-bold text-slate-900">{stats.avgRating}</div>
                    <div className="text-sm text-slate-500">{isRu ? 'Средний рейтинг' : 'Ortalama reytinq'}</div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                            <Building2 size={20} />
                        </div>
                        <span className="text-xs text-slate-400">Active</span>
                    </div>
                    <div className="text-2xl font-bold text-slate-900">{branchData.length}</div>
                    <div className="text-sm text-slate-500">{isRu ? 'Филиалов' : 'Filial sayı'}</div>
                </div>
            </div>

            {/* Performance Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Branch Performance */}
                <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-6">{isRu ? 'Производительность филиалов' : 'Filialların performansı'}</h3>
                    <div className="space-y-6">
                        {branchData.map((branch) => (
                            <div key={branch.name} className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 font-bold">
                                    {branch.name[0]}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between mb-1">
                                        <span className="font-bold text-slate-900">{branch.name}</span>
                                        <span className="text-sm font-bold text-slate-600">{branch.count} {isRu ? 'записей' : 'rezervasiya'}</span>
                                    </div>
                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-purple-500 rounded-full transition-all duration-700"
                                            style={{ width: `${(branch.count / 150) * 100}%` }}
                                        />
                                    </div>
                                </div>
                                <div className={`flex items-center text-xs font-bold ${branch.growth > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    {branch.growth > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                    {Math.abs(branch.growth)}%
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Doctors */}
                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-6">{isRu ? 'Лучшие врачи' : 'Top həkimlər'}</h3>
                    <div className="space-y-6">
                        {doctors?.slice(0, 5).sort((a, b) => (b.appointmentCount || 0) - (a.appointmentCount || 0)).map((doc, idx) => (
                            <div key={doc.id} className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-purple-50 rounded-full flex items-center justify-center text-xs font-bold text-purple-600">
                                    #{idx + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-bold text-slate-900 truncate">{doc.user?.full_name}</div>
                                    <div className="text-xs text-slate-500 truncate">{doc.specialties?.join(', ')}</div>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-slate-900">{doc.appointmentCount || 0}</div>
                                    <div className="text-[10px] text-slate-400 capitalize">{isRu ? 'Записей' : 'Vizit'}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-8 py-3 bg-slate-50 text-slate-600 text-sm font-bold rounded-xl hover:bg-slate-100 transition-all">
                        {isRu ? 'Весь список' : 'Bütün siyahı'}
                    </button>
                </div>
            </div>
        </div>
    );
}
