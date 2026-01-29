"use client";

import { use } from 'react';
import { useTranslations } from 'next-intl';
import {
    Building2,
    MapPin,
    Phone,
    Clock,
    Star,
    ArrowLeft,
    Shield,
    Stethoscope,
    Users,
    Info,
    Calendar,
    Share2,
    ChevronRight,
    Search
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-cyan-50/30 to-white">
            <div className="text-center p-12 bg-white rounded-2xl shadow-xl border border-slate-100 max-w-md">
                <Building2 size={64} className="mx-auto text-slate-200 mb-6" />
                <h2 className="text-2xl font-bold text-slate-900 mb-4">{locale === 'az' ? 'Klinika tapılmadı' : 'Клиника не найдена'}</h2>
                <Link href={`/${locale}/hospitals`} className="inline-flex items-center gap-2 text-cyan-600 font-bold hover:gap-3 transition-all">
                    <ArrowLeft size={18} /> {tCommon('back')}
                </Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-white via-cyan-50/30 to-white pb-20">
            {/* Floating Decorative Elements */}
            <div className="absolute top-20 right-[10%] w-32 h-32 rounded-full bg-gradient-to-br from-cyan-400 to-teal-400 opacity-20 blur-2xl"></div>
            <div className="absolute bottom-40 left-[5%] w-48 h-48 rounded-full bg-gradient-to-br from-teal-300 to-emerald-300 opacity-15 blur-3xl"></div>
            <div className="absolute top-32 left-[15%] w-4 h-4 rounded-full bg-gradient-to-br from-cyan-400 to-teal-500 shadow-lg shadow-cyan-400/50"></div>

            {/* Hero Banner */}
            <div className="h-[40vh] md:h-[50vh] relative overflow-hidden">
                <img
                    src={hospital.cover_image_url || 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=80'}
                    alt={hospital.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>

                <div className="absolute bottom-0 left-0 w-full p-8 md:p-16">
                    <div className="container mx-auto px-6">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <Link href={`/${locale}/hospitals`} className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-all text-sm">
                                <ArrowLeft size={18} /> {locale === 'az' ? 'Klinikalara qayıt' : 'Назад к клиникам'}
                            </Link>

                            <div className="flex items-center gap-3 mb-5">
                                <div className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 text-white text-xs font-bold shadow-lg">
                                    {locale === 'az' ? 'Akkreditə Olunmuş' : 'Аккредитовано'}
                                </div>
                                <div className="px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm text-white/90 text-xs font-bold flex items-center gap-1.5">
                                    <Shield size={12} className="text-cyan-400" /> {tCommon('verified')}
                                </div>
                            </div>

                            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight max-w-3xl">
                                {hospital.name}
                            </h1>

                            <div className="flex flex-wrap gap-6 text-white/90 text-sm">
                                <span className="flex items-center gap-2">
                                    <MapPin size={18} className="text-cyan-400" />
                                    {hospital.branches?.[0]?.address_line1}, {hospital.branches?.[0]?.city}
                                </span>
                                <span className="flex items-center gap-2">
                                    <Star size={18} className="text-yellow-400 fill-yellow-400" />
                                    4.9 (1,240 {locale === 'az' ? 'rəy' : 'отзывов'})
                                </span>
                                <span className="flex items-center gap-2">
                                    <Phone size={18} className="text-cyan-400" />
                                    {hospital.contact_phone || '+994 12 440 00 00'}
                                </span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 -mt-6 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                    {/* Left: Info */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* About Section */}
                        <motion.section
                            className="bg-white p-8 rounded-2xl border border-slate-100 shadow-xl"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                <Info size={20} className="text-cyan-600" />
                                {locale === 'az' ? 'Klinika Haqqında' : 'О клинике'}
                            </h2>
                            <p className="text-slate-500 leading-relaxed mb-8">
                                {hospital.description || (locale === 'az'
                                    ? "Bu tibb müəssisəsi yüksək keyfiyyətli səhiyyə xidmətləri göstərmək üçün ən müasir texnologiyalar və peşəkar kadrlarla təchiz edilmişdir."
                                    : "Данное медицинское учреждение оснащено самыми современными технологиями для оказания высококачественных медицинских услуг.")}
                            </p>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {[
                                    { label: locale === 'az' ? 'Təcili Yardım' : 'Скорая Помощь', desc: '24/7', icon: Clock, color: 'from-red-500 to-rose-600' },
                                    { label: locale === 'az' ? 'Diaqnostika' : 'Диагностика', desc: 'MRT, CT', icon: Stethoscope, color: 'from-violet-500 to-purple-600' },
                                    { label: locale === 'az' ? 'Laboratoriya' : 'Лаборатория', desc: locale === 'az' ? 'Sürətli' : 'Быстро', icon: Users, color: 'from-emerald-500 to-teal-600' },
                                    { label: locale === 'az' ? 'Aptek' : 'Аптека', desc: locale === 'az' ? 'Daxili' : 'Внутр.', icon: Shield, color: 'from-cyan-500 to-blue-600' },
                                    { label: locale === 'az' ? 'Dayanacaq' : 'Парковка', desc: locale === 'az' ? 'Pulsuz' : 'Бесплатно', icon: MapPin, color: 'from-orange-500 to-amber-600' },
                                    { label: locale === 'az' ? 'Qidalanma' : 'Питание', desc: locale === 'az' ? 'Kafeteriya' : 'Кафетерий', icon: Info, color: 'from-pink-500 to-rose-600' },
                                ].map((feature, i) => (
                                    <div key={i} className="group p-4 bg-slate-50 hover:bg-white rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-lg transition-all cursor-pointer">
                                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-3 shadow-lg`}>
                                            <feature.icon size={18} className="text-white" />
                                        </div>
                                        <div className="text-sm font-bold text-slate-900 group-hover:text-cyan-700 transition-colors">{feature.label}</div>
                                        <div className="text-xs text-slate-400">{feature.desc}</div>
                                    </div>
                                ))}
                            </div>
                        </motion.section>

                        {/* Specialists Section */}
                        <section>
                            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900 mb-2">
                                        {locale === 'az' ? 'Mütəxəssislər' : 'Специалисты'}
                                    </h2>
                                    <p className="text-slate-500">{locale === 'az' ? 'Qəbul üçün həkim seçin' : 'Выберите врача для записи'}</p>
                                </div>
                                <div className="relative w-full md:w-64">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder={locale === 'az' ? 'Həkim axtar...' : 'Поиск врача...'}
                                        className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                                        >
                                            <Link
                                                href={`/${locale}/doctors/${doc.id}`}
                                                className="group block bg-white p-5 rounded-2xl border border-slate-100 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0 group-hover:scale-105 transition-transform">
                                                        <img
                                                            src={doc.user?.avatar_url || 'https://images.unsplash.com/photo-1612349317150-b4639e53b8d1?auto=format&fit=crop&w=300&q=80'}
                                                            alt={doc.user?.full_name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-bold text-slate-900 group-hover:text-cyan-600 transition-colors truncate">
                                                            {doc.title} {doc.user?.full_name}
                                                        </h3>
                                                        <div className="flex flex-wrap gap-1.5 mb-2">
                                                            {doc.specialties?.slice(0, 2).map((s: string, j: number) => (
                                                                <span key={j} className="text-cyan-700 text-xs font-semibold bg-cyan-50 px-2 py-0.5 rounded-full">
                                                                    {s}
                                                                </span>
                                                            ))}
                                                        </div>
                                                        <div className="flex items-center gap-1 text-sm">
                                                            <Star size={14} className="fill-yellow-400 text-yellow-400" />
                                                            <span className="font-semibold text-slate-700">4.9</span>
                                                        </div>
                                                    </div>
                                                    <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-gradient-to-r group-hover:from-cyan-500 group-hover:to-teal-500 flex items-center justify-center transition-all shrink-0">
                                                        <ChevronRight size={18} className="text-slate-400 group-hover:text-white transition-colors" />
                                                    </div>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="col-span-2 py-12 text-center bg-white rounded-2xl border border-slate-100 shadow-lg">
                                        <Users size={48} className="mx-auto text-slate-200 mb-4" />
                                        <p className="text-slate-400 font-medium">{locale === 'az' ? 'Həkim tapılmadı' : 'Врачей не найдено'}</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Right: Actions */}
                    <aside className="space-y-6">
                        <motion.div
                            className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 rounded-2xl shadow-2xl text-white sticky top-24 overflow-hidden"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-teal-500/10 rounded-full blur-2xl"></div>

                            <div className="relative z-10">
                                <h3 className="text-lg font-bold mb-6">{locale === 'az' ? 'Qeydiyyat' : 'Запись'}</h3>
                                <div className="space-y-3">
                                    <button className="w-full py-4 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 transition-all rounded-xl font-bold text-sm flex items-center justify-center gap-3 shadow-lg shadow-cyan-500/30 active:scale-95">
                                        <Calendar size={18} /> {locale === 'az' ? 'Qəbulə Yazıl' : 'Записаться'}
                                    </button>
                                    <button className="w-full py-4 bg-white/10 hover:bg-white/20 border border-white/10 transition-all rounded-xl font-semibold text-sm flex items-center justify-center gap-3 active:scale-95">
                                        <Phone size={18} /> {locale === 'az' ? 'Zəng Et' : 'Позвонить'}
                                    </button>
                                    <button className="w-full py-4 bg-white/10 hover:bg-white/20 border border-white/10 transition-all rounded-xl font-semibold text-sm flex items-center justify-center gap-3 active:scale-95">
                                        <Share2 size={18} /> {locale === 'az' ? 'Paylaş' : 'Поделиться'}
                                    </button>
                                </div>

                                <div className="mt-8 pt-6 border-t border-white/10">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 flex items-center justify-center">
                                            <Clock size={22} className="text-white" />
                                        </div>
                                        <div>
                                            <div className="text-xs text-white/50 font-medium mb-0.5">
                                                {locale === 'az' ? 'İş Saatları' : 'Часы работы'}
                                            </div>
                                            <div className="text-sm font-bold">24/7 {locale === 'az' ? 'Təcili Yardım' : 'Скорая'}</div>
                                        </div>
                                    </div>
                                    <div className="text-xs text-white/40 leading-relaxed">
                                        {locale === 'az'
                                            ? 'Standart qeydiyyat: B.e - Cümə 08:00 - 18:00'
                                            : 'Регистрация: Пн-Пт 08:00 - 18:00'}
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Insurance Card */}
                        <motion.div
                            className="p-6 bg-white border border-slate-100 rounded-2xl text-center shadow-lg"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 flex items-center justify-center mx-auto mb-4">
                                <Stethoscope size={22} className="text-white" />
                            </div>
                            <h4 className="font-bold text-slate-900 mb-2">{locale === 'az' ? 'Sığorta Qəbulu' : 'Страхование'}</h4>
                            <p className="text-sm text-slate-500 leading-relaxed">
                                {locale === 'az'
                                    ? 'Bütün əsas sığorta kartlarını qəbul edirik.'
                                    : 'Принимаем все основные страховые карты.'}
                            </p>
                        </motion.div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
