"use client";

import { use, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Shield, Stethoscope, Building2, ChevronRight
} from 'lucide-react';
import DoctorRegisterPage from '../../for-doctors/register/page';
import HospitalRegisterPage from '../../for-hospitals/register/page';

export default function BusinessRegisterPage({ params: paramsPromise }: { params: Promise<{ locale: string }> }) {
    const params = use(paramsPromise);
    const locale = params.locale || 'az';
    const isRu = locale === 'ru';

    const [type, setType] = useState<'doctor' | 'hospital'>('doctor');

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Unified Header */}
            <div className="bg-white border-b border-slate-200 py-6 sticky top-0 z-[110]">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <Link href={`/${locale}`} className="flex items-center gap-2 group">
                                <div className="size-10 rounded-xl bg-slate-900 flex items-center justify-center text-white group-hover:bg-cyan-600 transition-colors">
                                    <Shield size={20} />
                                </div>
                                <span className="text-xl font-black tracking-tight text-slate-900">MEDPLUS</span>
                            </Link>
                            <div className="h-6 w-px bg-slate-200 hidden md:block" />
                            <div className="text-sm font-black text-slate-400 uppercase tracking-widest hidden md:block">
                                {isRu ? 'Бизнес регистрация' : 'Biznes Qeydiyyatı'}
                            </div>
                        </div>

                        {/* Professional Toggle Switch */}
                        <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center shadow-inner border border-slate-200/50">
                            <button
                                onClick={() => setType('doctor')}
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black transition-all ${type === 'doctor'
                                        ? 'bg-white text-cyan-600 shadow-lg ring-1 ring-slate-200'
                                        : 'text-slate-500 hover:text-slate-900'
                                    }`}
                            >
                                <Stethoscope size={16} />
                                {isRu ? 'Я врач' : 'Mən həkiməm'}
                            </button>
                            <button
                                onClick={() => setType('hospital')}
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black transition-all ${type === 'hospital'
                                        ? 'bg-white text-cyan-600 shadow-lg ring-1 ring-slate-200'
                                        : 'text-slate-500 hover:text-slate-900'
                                    }`}
                            >
                                <Building2 size={16} />
                                {isRu ? 'Я клиника' : 'Mən klinikayam'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Dynamic Content */}
            <div className="flex-1">
                {type === 'doctor' ? (
                    <DoctorRegisterPage params={paramsPromise} isEmbedded={true} />
                ) : (
                    <HospitalRegisterPage params={paramsPromise} isEmbedded={true} />
                )}
            </div>
        </div>
    );
}
