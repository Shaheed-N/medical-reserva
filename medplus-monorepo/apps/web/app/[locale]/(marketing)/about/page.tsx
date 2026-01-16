"use client";

import { use } from 'react';
import { useTranslations } from 'next-intl';
import {
    Shield,
    Clock,
    Users,
    Award,
    Target,
    Globe,
    Zap,
    CheckCircle2,
    Calendar,
    Layers,
    Heart,
    Activity,
    Lock,
    Eye
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function AboutPage({ params: paramsPromise }: { params: Promise<{ locale: string }> }) {
    const params = use(paramsPromise);
    const locale = params.locale || 'az';
    const t = useTranslations('About');
    const tCommon = useTranslations('Common');

    return (
        <div className="bg-white min-h-screen">
            {/* Cinematic Hero */}
            <section className="relative h-[70vh] bg-[#0F172A] flex items-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=2000&q=80"
                        className="w-full h-full object-cover opacity-20 grayscale"
                        alt="Medical Center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A] via-[#0F172A]/80 to-transparent"></div>
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-[#0F766E] font-black uppercase tracking-[0.5em] text-[10px] mb-8 block bg-[#0F766E]/10 w-fit px-4 py-1.5 rounded-sm border border-[#0F766E]/20">
                            {locale === 'az' ? 'Bizim Missiyamız' : 'Наша миссия'}
                        </span>
                        <h1 className="text-5xl md:text-8xl font-bold text-white mb-10 leading-[1] tracking-tighter max-w-4xl">
                            {locale === 'az' ? 'Milli Səhiyyənin Rəqəmsal Gələcəyi' : 'Цифровое Будущее Национального Здравоохранения'}
                        </h1>
                        <p className="text-slate-400 text-xl max-w-2xl font-medium leading-relaxed opacity-80">
                            {locale === 'az'
                                ? "MedPlus Azərbaycanın səhiyyə şəbəkəsi üçün əsas rəqəmsal platformadır, 4,000-dən çox mütəxəssisi milyonlarla vətəndaşla birləşdirir."
                                : "MedPlus — основная цифровая платформа для сети здравоохранения Азербайджана, объединяющая более 4000 специалистов с миллионами граждан."}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Strategic Vision Grid */}
            <section className="py-32 md:py-48 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50 -z-10 translate-x-1/2 rounded-full blur-3xl opacity-50"></div>

                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                        <motion.div
                            className="relative"
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                        >
                            <img
                                src="https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1000&q=80"
                                alt="Lab Work"
                                className="rounded-sm shadow-2xl relative z-10 grayscale hover:grayscale-0 transition-all duration-1000"
                            />
                            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-[#0F766E]/5 -z-0 rounded-sm border border-[#0F766E]/10"></div>
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-slate-100/50 -z-0 rounded-full blur-2xl"></div>
                        </motion.div>

                        <div>
                            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-12 leading-tight tracking-tight uppercase">
                                {locale === 'az' ? 'Vahid Sağlamlıq Standartı' : 'Единый Стандарт Здравоохранения'}
                            </h2>
                            <div className="space-y-12">
                                {[
                                    {
                                        icon: Target,
                                        title: locale === 'az' ? 'Strateji Hədəf' : 'Стратегическая цель',
                                        desc: locale === 'az' ? '2027-ci ilə qədər bütün pasient qeydlərinin 100% rəqəmsallaşdırılması və qurumlar arası keçidin təmin edilməsi.' : '100% цифровизация записей пациентов к 2027 году и обеспечение их мобильности между учреждениями.'
                                    },
                                    {
                                        icon: Layers,
                                        title: locale === 'az' ? 'İnteqrasiya Olunmuş Sistem' : 'Интегрированная система',
                                        desc: locale === 'az' ? 'MedPlus Səhiyyə Nazirliyinin birbaşa nəzarəti altında fəaliyyət göstərən vahid tənzimləmə çərçivəsidir.' : 'MedPlus работает под прямым контролем Министерства здравоохранения в рамках единой нормативной базы.'
                                    },
                                    {
                                        icon: Zap,
                                        title: locale === 'az' ? 'Real Vaxt Analitikası' : 'Аналитика в реальном времени',
                                        desc: locale === 'az' ? 'Platformamız tibbi resursların bölgüsünü optimallaşdırmaq üçün milli miqyaslı sağlamlıq analitikası təqdim edir.' : 'Наша платформа предоставляет аналитику здоровья национального уровня для оптимизации распределения ресурсов.'
                                    }
                                ].map((v, i) => (
                                    <motion.div
                                        key={i}
                                        className="flex gap-8 group"
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                    >
                                        <div className="w-16 h-16 bg-white border border-slate-100 rounded-sm flex items-center justify-center shrink-0 shadow-sm group-hover:border-[#0F766E] transition-all">
                                            <v.icon size={28} className="text-[#0F766E]" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900 mb-3 uppercase tracking-tighter">{v.title}</h3>
                                            <p className="text-slate-500 leading-relaxed font-medium opacity-80">{v.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Capability Section */}
            <section className="py-32 md:py-48 bg-[#0F172A] text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center mb-32">
                        <span className="text-[#2DD4BF] font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">Platform Infrastructure</span>
                        <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tighter uppercase">{locale === 'az' ? 'Bizim İnfrastruktur' : 'Наша Инфраструктура'}</h2>
                        <div className="w-24 h-1 bg-[#0F766E] mx-auto"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { icon: Shield, title: locale === 'az' ? 'Təhlükəsiz Keçid' : 'Безопасный Шлюз', desc: locale === 'az' ? 'Bütün tibbi məlumatlar üçün hərbi şifrələmə.' : 'Военное шифрование для всех медицинских данных.' },
                            { icon: Globe, title: locale === 'az' ? 'Milli Miqyas' : 'Национальный масштаб', desc: locale === 'az' ? 'Azərbaycanın bütün bölgələrində aktivdir.' : 'Активен во всех регионах Азербайджана.' },
                            { icon: Heart, title: locale === 'az' ? 'Pasient Seçimi' : 'Выбор Пациента', desc: locale === 'az' ? 'Təsdiqlənmiş vizitlərə əsaslanan reytinq.' : 'Рейтинг на основе подтвержденных визитов.' },
                            { icon: Users, title: locale === 'az' ? 'Sosial Təsir' : 'Социальное Влияние', desc: locale === 'az' ? 'Bütün vətəndaşlar üçün bərabər əlçatanlıq.' : 'Равный доступ для всех демографических групп.' },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                className="p-12 bg-white/5 backdrop-blur-sm border border-white/10 hover:border-[#0F766E] transition-all rounded-sm text-center group cursor-default"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <div className="w-20 h-20 bg-[#0F766E]/20 rounded-sm flex items-center justify-center mx-auto mb-8 group-hover:bg-[#0F766E] transition-all">
                                    <item.icon size={36} className="text-[#2DD4BF] group-hover:text-white transition-all" />
                                </div>
                                <h3 className="text-xl font-bold mb-4 uppercase tracking-tighter">{item.title}</h3>
                                <p className="text-white/40 font-medium text-sm leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Core Values / Stats */}
            <section className="py-40 bg-slate-50">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                        {[
                            { icon: Activity, value: '4,200+', label: locale === 'az' ? 'Sertifikatlı Həkim' : 'Сертифицированных Врачей' },
                            { icon: Lock, value: '100%', label: locale === 'az' ? 'Məlumat Məxfiliyi' : 'Приватность Данных' },
                            { icon: Eye, value: '24/7', label: locale === 'az' ? 'Sistem Monitorinqi' : 'Мониторинг Системы' }
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                className="text-center"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <stat.icon className="mx-auto text-[#0F766E] mb-6" size={48} />
                                <div className="text-5xl font-bold text-slate-900 mb-2 tracking-tighter">{stat.value}</div>
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Trust Quote */}
            <section className="py-48 bg-white relative">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-100 to-transparent"></div>
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto text-center">
                        <CheckCircle2 size={80} className="text-[#0F766E] mx-auto mb-16 opacity-10" />
                        <blockquote className="text-4xl md:text-6xl font-extralight text-slate-900 italic leading-[1.2] mb-16 tracking-tight">
                            {locale === 'az'
                                ? "Rəqəmsal sağlamlıq yalnız texnologiya deyil; bu, insan ləyaqəti və səhiyyəyə effektiv çıxış hüququdur."
                                : "Цифровое здравоохранение — это не просто технологии; это человеческое достоинство и право на эффективный доступ к медицинской помощи."}
                        </blockquote>
                        <div className="flex items-center justify-center gap-4">
                            <div className="w-12 h-px bg-[#0F766E]"></div>
                            <div className="font-black uppercase tracking-[0.3em] text-[#0F766E] text-[10px]">National Health Strategic Vision 2026</div>
                            <div className="w-12 h-px bg-[#0F766E]"></div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
