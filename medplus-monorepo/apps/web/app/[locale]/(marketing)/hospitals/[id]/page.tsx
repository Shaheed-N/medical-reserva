"use client";

import { use, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
    Building2,
    MapPin,
    Phone,
    Clock,
    Star,
    ArrowRight,
    Shield,
    Stethoscope,
    Users,
    Info,
    Calendar,
    CheckCircle,
    Share2,
    ChevronRight,
    Search
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useHospital, useDoctors } from '@/lib/hooks';
import { HospitalProfileSkeleton, DoctorCardSkeleton } from '@/components/index';

export default function HospitalDetailPage({ params: paramsPromise }: { params: Promise<{ id: string, locale: string }> }) {
    const params = use(paramsPromise);
    const id = params.id;
    const locale = params.locale || 'az';

    const t = useTranslations('Hospitals');
    const tCommon = useTranslations('Common');
    const tDoctors = useTranslations('Doctors');

    const { data: hospital, isLoading, error } = useHospital(id);
    const { data: doctors, isLoading: isLoadingDoctors } = useDoctors({ hospitalId: id });

    if (isLoading) return <HospitalProfileSkeleton />;

    if (error || !hospital) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="text-center p-12 bg-white rounded-sm shadow-xl border border-slate-200 max-w-md">
                <Building2 size={64} className="mx-auto text-slate-200 mb-6" />
                <h2 className="text-2xl font-bold text-slate-900 mb-4 uppercase tracking-tight">Müəssisə tapılmadı</h2>
                <Link href={`/${locale}/hospitals`} className="inline-flex items-center gap-2 text-[#0F766E] font-bold hover:gap-3 transition-all">
                    <ArrowRight size={18} className="rotate-180" /> {tCommon('back')}
                </Link>
            </div>
        </div>
    );

    return (
        <div className="bg-slate-50 min-h-screen pb-20">
            {/* Header Banner */}
            <div className="h-[45vh] md:h-[55vh] relative bg-[#0F172A] overflow-hidden">
                <img
                    src={hospital.cover_image_url || 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=80'}
                    alt={hospital.name}
                    className="w-full h-full object-cover opacity-60 scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/40 to-transparent"></div>

                <div className="absolute bottom-0 left-0 w-full p-10 md:p-20">
                    <div className="container mx-auto px-6">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="bg-[#0F766E] text-white text-[10px] font-black uppercase tracking-[0.3em] px-4 py-1.5 rounded-sm">
                                    {locale === 'az' ? 'Dövlət/Özəl Akkreditə Olunmuş' : 'Государственная/Частная Клиника'}
                                </div>
                                <div className="bg-white/10 backdrop-blur-md text-white/80 text-[10px] font-black uppercase tracking-[0.3em] px-4 py-1.5 rounded-sm flex items-center gap-2">
                                    <Shield size={12} className="text-[#2DD4BF]" /> {tCommon('verified')}
                                </div>
                            </div>

                            <h1 className="text-4xl md:text-7xl font-bold text-white mb-8 leading-tight tracking-tight max-w-4xl">
                                {hospital.name}
                            </h1>

                            <div className="flex flex-wrap gap-8 text-white/90 text-sm font-bold tracking-wide uppercase">
                                <span className="flex items-center gap-2">
                                    <MapPin size={20} className="text-[#2DD4BF]" />
                                    {hospital.branches?.[0]?.address_line1}, {hospital.branches?.[0]?.city}
                                </span>
                                <span className="flex items-center gap-2">
                                    <Star size={20} className="text-[#2DD4BF] fill-[#2DD4BF]" />
                                    4.9 (1,240 {locale === 'az' ? 'Rəy' : 'Отзыва'})
                                </span>
                                <span className="flex items-center gap-2">
                                    <Phone size={20} className="text-[#2DD4BF]" />
                                    {hospital.contact_phone || '+994 12 440 00 00'}
                                </span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 -mt-10 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 md:gap-16">
                    {/* Left: Info */}
                    <div className="lg:col-span-2 space-y-12 md:space-y-16">
                        {/* Summary Section */}
                        <motion.section
                            className="bg-white p-8 md:p-12 rounded-sm border border-slate-200 shadow-xl"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-4">
                                <Info size={24} className="text-[#0F766E]" />
                                {locale === 'az' ? 'Müəssisə Haqqında' : 'Об учреждении'}
                            </h2>
                            <p className="text-slate-500 text-lg leading-relaxed mb-12 font-light">
                                {hospital.description || (locale === 'az'
                                    ? "Bu tibb müəssisəsi yüksək keyfiyyətli səhiyyə xidmətləri göstərmək üçün ən müasir texnologiyalar və peşəkar kadrlarla təchiz edilmişdir. Biz pasientlərimizin sağlamlığını və rahatlığını hər şeydən üstün tuturuq."
                                    : "Данное медицинское учреждение оснащено самыми современными технологиями и профессиональными кадрами для оказания высококачественных медицинских услуг. Мы ставим здоровье и комфорт наших пациентов превыше всего.")}
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {[
                                    { label: locale === 'az' ? 'Təcili Yardım' : 'Скорая Помощь', desc: '24/7 Aktiv', icon: Clock },
                                    { label: locale === 'az' ? 'Diaqnostika' : 'Диагностика', desc: 'MRT, KT, Rentgen', icon: Stethoscope },
                                    { label: locale === 'az' ? 'Laboratoriya' : 'Лаборатория', desc: 'Sürətli Analiz', icon: Users },
                                    { label: locale === 'az' ? 'Aptek' : 'Аптека', desc: 'Klinik daxilində', icon: Shield },
                                    { label: locale === 'az' ? 'Dayanacaq' : 'Парковка', desc: 'Ödənişsiz', icon: MapPin },
                                    { label: locale === 'az' ? 'Qidalanma' : 'Питание', desc: 'Kafeteriya', icon: Info },
                                ].map((feature, i) => (
                                    <div key={i} className="flex flex-col gap-2 p-4 rounded-sm hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                        <feature.icon size={24} className="text-[#0F766E] mb-2" />
                                        <div className="text-sm font-bold text-slate-900 uppercase tracking-widest">{feature.label}</div>
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{feature.desc}</div>
                                    </div>
                                ))}
                            </div>
                        </motion.section>

                        {/* Specialists Section */}
                        <section>
                            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
                                <div>
                                    <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">
                                        {locale === 'az' ? 'Bu müəssisənin mütəxəssisləri' : 'Специалисты этого учреждения'}
                                    </h2>
                                    <p className="text-slate-500 font-medium">{locale === 'az' ? 'Qəbul üçün həkiminizi seçin' : 'Выберите врача для записи'}</p>
                                </div>
                                <div className="relative w-full md:w-64">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input
                                        type="text"
                                        placeholder={locale === 'az' ? 'Həkim axtar...' : 'Искать врача...'}
                                        className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-sm text-sm focus:ring-2 focus:ring-[#0F766E]/20 outline-none"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {isLoadingDoctors ? (
                                    Array.from({ length: 4 }).map((_, i) => (
                                        <DoctorCardSkeleton key={i} />
                                    ))
                                ) : doctors && doctors.length > 0 ? (
                                    doctors.map((doc: any, i: number) => (
                                        <motion.div
                                            key={doc.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: i * 0.1 }}
                                            className="bg-white p-6 rounded-sm border border-slate-200 flex items-center gap-6 hover:shadow-xl transition-all group shadow-sm"
                                        >
                                            <div className="w-24 h-24 rounded-sm overflow-hidden bg-slate-50 shrink-0 grayscale group-hover:grayscale-0 transition-all duration-500">
                                                <img
                                                    src={doc.user?.avatar_url || 'https://images.unsplash.com/photo-1612349317150-b4639e53b8d1?auto=format&fit=crop&w=300&q=80'}
                                                    alt={doc.user?.full_name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-slate-900 group-hover:text-[#0F766E] transition-colors truncate">
                                                    {doc.title} {doc.user?.full_name}
                                                </h3>
                                                <div className="flex flex-wrap gap-1 mb-3">
                                                    {doc.specialties?.slice(0, 2).map((s: string, j: number) => (
                                                        <span key={j} className="text-[#0F766E] text-[8px] font-black uppercase tracking-widest">
                                                            {s}
                                                        </span>
                                                    ))}
                                                </div>
                                                <Link
                                                    href={`/${locale}/doctors/${doc.id}`}
                                                    className="inline-flex items-center gap-2 px-6 py-2 bg-[#0F172A] text-white text-[10px] font-bold uppercase tracking-widest rounded-sm hover:bg-[#0F766E] transition-all"
                                                >
                                                    {tDoctors('book_now')} <ChevronRight size={12} />
                                                </Link>
                                            </div>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="col-span-2 py-12 text-center bg-white rounded-sm border border-slate-100">
                                        <Users size={48} className="mx-auto text-slate-200 mb-4" />
                                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Həkim tapılmadı</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Right: Actions */}
                    <aside className="space-y-8">
                        <motion.div
                            className="bg-[#0F172A] p-10 rounded-sm shadow-2xl text-white sticky top-24 overflow-hidden"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-[#2DD4BF]"></div>

                            <h3 className="text-xl font-bold mb-8 uppercase tracking-tight">Klinik Qeydiyyat</h3>
                            <div className="space-y-4">
                                <button className="w-full py-5 bg-[#0F766E] hover:bg-[#134E4A] transition-all rounded-sm font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 shadow-lg shadow-[#0F766E]/20 active:scale-95 group">
                                    <Calendar size={18} className="group-hover:scale-110 transition-transform" /> {locale === 'az' ? 'Ümumi Müayinə Al' : 'Общее Обследование'}
                                </button>
                                <button className="w-full py-5 bg-white/5 hover:bg-white/10 border border-white/10 transition-all rounded-sm font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 active:scale-95">
                                    <Phone size={18} /> {tCommon('phone')}
                                </button>
                                <button className="w-full py-5 bg-white/5 hover:bg-white/10 border border-white/10 transition-all rounded-sm font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 active:scale-95">
                                    <Share2 size={18} /> {locale === 'az' ? 'Ünvanı Paylaş' : 'Поделиться'}
                                </button>
                            </div>

                            <div className="mt-12 pt-10 border-t border-white/5">
                                <div className="flex items-center gap-5 mb-6">
                                    <div className="w-12 h-12 rounded-sm bg-[#0F766E] flex items-center justify-center shrink-0">
                                        <Clock size={24} className="text-[#2DD4BF]" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-1">
                                            {locale === 'az' ? 'İş Saatları' : 'Часы Работы'}
                                        </div>
                                        <div className="text-sm font-bold">24/7 {locale === 'az' ? 'Təcili Yardım' : 'Экстренная Помощь'}</div>
                                    </div>
                                </div>
                                <div className="text-[10px] text-white/30 font-bold uppercase tracking-widest leading-relaxed">
                                    {locale === 'az'
                                        ? 'Standart qeydiyyat saatları: Bazar ertəsi - Cümə 08:00 - 18:00'
                                        : 'Стандартные часы регистрации: Пн-Пт 08:00 - 18:00'}
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            className="p-8 border border-dashed border-slate-200 rounded-sm text-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <Stethoscope className="mx-auto mb-4 text-slate-300" size={32} />
                            <h4 className="font-bold text-slate-900 mb-2">{locale === 'az' ? 'Tibbi Sığorta' : 'Мед. Страхование'}</h4>
                            <p className="text-xs text-slate-500 font-medium leading-relaxed">
                                {locale === 'az'
                                    ? 'Bu müəssisə bütün əsas beynəlxalq və yerli tibbi sığorta kartlarını qəbul edir.'
                                    : 'Это учреждение принимает все основные международные и местные страховые карты.'}
                            </p>
                        </motion.div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
