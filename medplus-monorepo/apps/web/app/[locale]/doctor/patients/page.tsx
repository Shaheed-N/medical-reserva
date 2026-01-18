"use client";

import { use, useState } from 'react';
import {
    Search,
    User,
    Phone,
    Mail,
    Calendar,
    MessageSquare,
    ChevronRight,
    Users
} from 'lucide-react';
import {
    useDoctorProfile,
    useDoctorAppointments
} from '@/lib/hooks';

export default function DoctorPatientsPage({ params: paramsPromise }: { params: Promise<{ locale: string }> }) {
    const params = use(paramsPromise);
    const locale = params.locale || 'az';
    const isRu = locale === 'ru';

    const { data: profile } = useDoctorProfile();
    const { data: appointments, isLoading } = useDoctorAppointments(profile?.id || '');

    const [searchQuery, setSearchQuery] = useState('');

    // Extract unique patients from appointments
    const patientsMap = new Map();
    appointments?.forEach((apt: any) => {
        if (!apt.patient) return;
        const exists = patientsMap.get(apt.patient.id);
        if (!exists || (new Date(apt.scheduled_date) > new Date(exists.lastVisit))) {
            patientsMap.set(apt.patient.id, {
                ...apt.patient,
                lastVisit: apt.scheduled_date,
                visitCount: (exists?.visitCount || 0) + 1
            });
        } else {
            exists.visitCount += 1;
        }
    });

    const patients = Array.from(patientsMap.values()).filter(p =>
        p.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.phone?.includes(searchQuery) ||
        p.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) {
        return <div className="p-8 text-center text-slate-500">Yüklənir...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                    <Users className="text-[#0F766E]" />
                    {isRu ? 'Мои Пациенты' : 'Pasientlərim'}
                </h1>
                <p className="text-slate-500 mt-1">
                    {isRu ? 'Список всех пациентов, которые были у вас на приёме' : 'Sizin qəbulunuzda olmuş bütün pasientlərin siyahısı'}
                </p>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                    type="text"
                    placeholder={isRu ? 'Поиск пациента...' : 'Pasient axtarışı...'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10 outline-none"
                />
            </div>

            {/* Patients List */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="grid grid-cols-1 divide-y divide-slate-100">
                    {patients.map((patient) => (
                        <div key={patient.id} className="p-6 hover:bg-slate-50 transition-colors group">
                            <div className="flex items-center gap-6">
                                {/* Avatar */}
                                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                                    {patient.avatar_url ? (
                                        <img src={patient.avatar_url} alt={patient.full_name} className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={32} className="text-slate-300" />
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className="font-bold text-lg text-slate-900">{patient.full_name}</h3>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full font-medium">
                                                {patient.visitCount} {isRu ? 'визитов' : 'vizit'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                                        <div className="flex items-center gap-1.5">
                                            <Phone size={14} className="text-slate-400" />
                                            {patient.phone}
                                        </div>
                                        {patient.email && (
                                            <div className="flex items-center gap-1.5">
                                                <Mail size={14} className="text-slate-400" />
                                                {patient.email}
                                            </div>
                                        )}
                                        <div className="flex items-center gap-1.5">
                                            <Calendar size={14} className="text-slate-400" />
                                            {isRu ? 'Последний визит:' : 'Son vizit:'} {patient.lastVisit}
                                        </div>
                                    </div>
                                </div>

                                {/* Link */}
                                <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-2 text-slate-400 hover:text-[#0F766E] hover:bg-[#0F766E]/5 rounded-lg transition-all">
                                        <MessageSquare size={20} />
                                    </button>
                                    <button className="p-2 text-slate-400 hover:text-[#0F766E] hover:bg-[#0F766E]/5 rounded-lg transition-all">
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {patients.length === 0 && (
                    <div className="p-16 text-center text-slate-400">
                        <Users size={64} className="mx-auto mb-4 opacity-20" />
                        <h3 className="text-lg font-medium text-slate-600 mb-1">
                            {isRu ? 'Пациенты не найдены' : 'Pasient tapılmadı'}
                        </h3>
                        <p className="text-sm">
                            {isRu ? 'После завершения приёмов здесь появится список ваших пациентов' : 'Qəbullar tamamlandıqdan sonra burada pasientləriniz görünəcək'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
