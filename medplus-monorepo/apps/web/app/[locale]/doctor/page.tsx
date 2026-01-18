"use client";

import { use } from 'react';
import {
    CalendarDays,
    Clock,
    Users,
    TrendingUp,
    CheckCircle,
    XCircle,
    Bell
} from 'lucide-react';

export default function DoctorDashboard({ params: paramsPromise }: { params: Promise<{ locale: string }> }) {
    const params = use(paramsPromise);
    const locale = params.locale || 'az';
    const isRu = locale === 'ru';

    // Mock data
    const stats = [
        {
            label: isRu ? 'Сегодня' : 'Bu gün',
            value: '5',
            subtext: isRu ? 'записей' : 'rezervasiya',
            icon: CalendarDays,
            color: 'bg-blue-500'
        },
        {
            label: isRu ? 'Эта неделя' : 'Bu həftə',
            value: '23',
            subtext: isRu ? 'записей' : 'rezervasiya',
            icon: Clock,
            color: 'bg-purple-500'
        },
        {
            label: isRu ? 'Всего пациентов' : 'Ümumi pasient',
            value: '156',
            subtext: '',
            icon: Users,
            color: 'bg-green-500'
        },
        {
            label: isRu ? 'Рейтинг' : 'Reytinq',
            value: '4.8',
            subtext: '(124)',
            icon: TrendingUp,
            color: 'bg-amber-500'
        },
    ];

    const todayAppointments = [
        { time: '09:00', patient: 'Leyla Həsənova', reason: 'Ürək yoxlaması', status: 'confirmed' },
        { time: '10:30', patient: 'Anar Məmmədov', reason: 'Təkrar müayinə', status: 'confirmed' },
        { time: '12:00', patient: 'Günel Əliyeva', reason: 'Konsultasiya', status: 'pending' },
        { time: '14:00', patient: 'Orxan Quliyev', reason: 'Analiz nəticəsi', status: 'confirmed' },
        { time: '16:00', patient: 'Nigar Hüseynova', reason: 'İlk vizit', status: 'confirmed' },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                        {isRu ? 'Добро пожаловать, Доктор!' : 'Xoş gəldiniz, Həkim!'}
                    </h1>
                    <p className="text-slate-500 mt-1">
                        {isRu ? 'Обзор вашей практики' : 'Praktikanızın icmalı'}
                    </p>
                </div>
                <button className="relative p-3 bg-white rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
                    <Bell size={20} className="text-slate-600" />
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">
                        3
                    </span>
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                                <p className="text-3xl font-bold text-slate-900 mt-2">
                                    {stat.value}
                                    {stat.subtext && <span className="text-sm font-normal text-slate-400 ml-1">{stat.subtext}</span>}
                                </p>
                            </div>
                            <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-white`}>
                                <stat.icon size={24} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Today's Appointments */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h2 className="text-lg font-bold text-slate-900">
                        {isRu ? 'Сегодняшние записи' : 'Bugünkü rezervasiyalar'}
                    </h2>
                </div>
                <div className="divide-y divide-slate-100">
                    {todayAppointments.map((apt, index) => (
                        <div key={index} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="text-center">
                                    <div className="text-lg font-bold text-slate-900">{apt.time}</div>
                                </div>
                                <div className="w-px h-10 bg-slate-200"></div>
                                <div>
                                    <div className="font-medium text-slate-900">{apt.patient}</div>
                                    <div className="text-sm text-slate-500">{apt.reason}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                {apt.status === 'confirmed' ? (
                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                                        <CheckCircle size={14} />
                                        {isRu ? 'Подтверждено' : 'Təsdiqlənib'}
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">
                                        <Clock size={14} />
                                        {isRu ? 'Ожидает' : 'Gözləyir'}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="p-4 bg-slate-50 border-t border-slate-100">
                    <a href={`/${locale}/doctor/appointments`} className="text-sm font-medium text-[#0F766E] hover:underline">
                        {isRu ? 'Посмотреть все записи →' : 'Bütün rezervasiyalara bax →'}
                    </a>
                </div>
            </div>
        </div>
    );
}
