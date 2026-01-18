"use client";

import { use } from 'react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import Link from 'next/link';

export default function AboutPage({ params: paramsPromise }: { params: Promise<{ locale: string }> }) {
    const params = use(paramsPromise);
    const locale = params.locale || 'az';
    const isRu = locale === 'ru';

    const breadcrumbItems = [
        { label: isRu ? 'О нас' : 'Haqqımızda' }
    ];

    return (
        <main className="bg-white text-slate-600 font-sans antialiased overflow-x-hidden pt-12">
            {/* Background - Clean Premium */}
            <div className="fixed inset-0 z-[-1] bg-white">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1000px] bg-gradient-radial-top pointer-events-none opacity-60"></div>
            </div>

            {/* Cinematic Hero */}
            <section className="relative min-h-[70vh] flex items-center overflow-hidden border-b border-slate-100 pb-20 pt-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <Breadcrumbs items={breadcrumbItems} locale={locale} />
                    <div className="max-w-4xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-50 border border-cyan-100 w-fit mb-8">
                            <span className="material-symbols-outlined text-cyan-600 text-[18px]">verified_user</span>
                            <span className="text-xs font-bold uppercase tracking-widest text-cyan-700">
                                {isRu ? 'Наша миссия' : 'Bizim Missiyamız'}
                            </span>
                        </div>
                        <h1 className="text-5xl md:text-8xl font-medium text-slate-900 leading-[1.0] tracking-tight mb-10">
                            {isRu ? 'Цифровое Будущее' : 'Milli Səhiyyənin'} <br />
                            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-cyan-400">
                                {isRu ? 'Здравоохранения' : 'Rəqəmsal Gələcəyi'}
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl text-slate-500 max-w-2xl leading-relaxed font-medium border-l-4 border-cyan-500 pl-8">
                            {isRu
                                ? "MedPlus — основная цифровая платформа для сети здравоохранения Азербайджана, объединяющая более 4500 специалистов с миллионами граждан."
                                : "MedPlus Azərbaycanın səhiyyə şəbəkəsi üçün əsas rəqəmsal platformadır, 4,500-dən çox mütəxəssisi milyonlarla vətəndaşla birləşdirir."}
                        </p>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-cyan-100/30 rounded-full blur-[120px] -z-10"></div>
            </section>

            {/* Strategy Section */}
            <section className="py-24 lg:py-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-gradient-to-tr from-cyan-500/10 to-transparent rounded-[3rem] blur-2xl"></div>
                            <img
                                src="https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1000&q=80"
                                alt="Medical Tech"
                                className="relative z-10 rounded-[2.5rem] shadow-2xl grayscale hover:grayscale-0 transition-all duration-1000 group-hover:scale-[1.02]"
                            />
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-cyan-500/5 rounded-full blur-3xl"></div>
                        </div>

                        <div>
                            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-12 tracking-tight italic">
                                {isRu ? 'Единый Стандарт Здоровья' : 'Vahid Sağlamlıq Standartı'}
                            </h2>
                            <div className="space-y-10">
                                {[
                                    {
                                        icon: 'target',
                                        title: isRu ? 'Стратегическая цель' : 'Strateji Hədəf',
                                        desc: isRu ? '100% цифровизация записей пациентов к 2027 году и обеспечение их мобильности между учреждениями.' : '2027-ci ilə qədər bütün pasient qeydlərinin 100% rəqəmsallaşdırılması və qurumlar arası keçidin təmin edilməsi.'
                                    },
                                    {
                                        icon: 'integration_instructions',
                                        title: isRu ? 'Интегрированная система' : 'İnteqrasiya Olunmuş Sistem',
                                        desc: isRu ? 'MedPlus работает под прямым контролем Министерства здравоохранения в рамках единой нормативной базы.' : 'MedPlus Səhiyyə Nazirliyinin birbaşa nəzarəti altında fəaliyyət göstərən vahid tənzimləmə çərçivəsidir.'
                                    },
                                    {
                                        icon: 'analytics',
                                        title: isRu ? 'Аналитика в реальном времени' : 'Real Vaxt Analitikası',
                                        desc: isRu ? 'Наша платформа предоставляет аналитику здоровья национального уровня для оптимизации распределения ресурсов.' : 'Platformamız tibbi resursların bölgüsünü optimallaşdırmaq üçün milli miqyaslı sağlamlıq analitikası təqdim edir.'
                                    }
                                ].map((step, idx) => (
                                    <div key={idx} className="flex gap-6 group">
                                        <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover:bg-cyan-500 group-hover:text-white transition-all duration-300 shadow-sm">
                                            <span className="material-symbols-outlined text-[32px]">{step.icon}</span>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900 mb-2 uppercase tracking-tight">{step.title}</h3>
                                            <p className="text-slate-500 leading-relaxed font-medium">{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Infrastructure Grid */}
            <section className="py-24 lg:py-32 bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[150px]"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[120px]"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400">Platform Infrastructure</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tight italic">{isRu ? 'Наша Инфраструктура' : 'Bizim İnfrastruktur'}</h2>
                        <div className="w-20 h-1 bg-cyan-500 mx-auto rounded-full"></div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { icon: 'shield_lock', title: isRu ? 'Безопасность' : 'Təhlükəsizlik', desc: isRu ? 'Военное шифрование для всех медицинских данных.' : 'Bütün tibbi məlumatlar üçün hərbi səviyyədə şifrələmə.' },
                            { icon: 'language', title: isRu ? 'Масштаб' : 'Qlobal Miqyas', desc: isRu ? 'Активен во всех регионах Азербайджана.' : 'Azərbaycanın bütün bölgələrində real vaxt rejimində aktivdir.' },
                            { icon: 'volunteer_activism', title: isRu ? 'Доверие' : 'Pasiyent Güvəni', desc: isRu ? 'Рейтинг на основе подтвержденных визитов.' : 'Təsdiqlənmiş vizitlərə əsaslanan real həkim reytinqi.' },
                            { icon: 'groups', title: isRu ? 'Доступность' : 'Bərabər Çıxış', desc: isRu ? 'Равный доступ для всех социальных групп.' : 'Bütün vətəndaşlar üçün bərabər rəqəmsal səhiyyə çıxışı.' },
                        ].map((item, i) => (
                            <div key={i} className="p-10 bg-white/5 backdrop-blur-sm border border-white/10 hover:border-cyan-500/50 transition-all rounded-[2rem] text-center group">
                                <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:bg-cyan-500 transition-all">
                                    <span className="material-symbols-outlined text-[36px] text-cyan-400 group-hover:text-white">{item.icon}</span>
                                </div>
                                <h3 className="text-xl font-bold mb-4 italic">{item.title}</h3>
                                <p className="text-slate-400 font-medium text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-24 lg:py-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-16">
                        {[
                            { icon: 'medical_information', value: '4,500+', label: isRu ? 'Сертифицированных Врачей' : 'Sertifikatlı Həkim' },
                            { icon: 'lock_person', value: '100%', label: isRu ? 'Приватность Данных' : 'Məlumat Məxfiliyi' },
                            { icon: 'monitoring', value: '24/7', label: isRu ? 'Мониторинг Системы' : 'Sistem Monitorinqi' }
                        ].map((stat, i) => (
                            <div key={i} className="text-center group">
                                <div className="w-16 h-16 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-[36px]">{stat.icon}</span>
                                </div>
                                <div className="text-5xl lg:text-6xl font-black text-slate-900 mb-2 tracking-tighter">{stat.value}</div>
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Quote */}
            <section className="py-32 lg:py-48 bg-white border-t border-slate-50 relative">
                <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                    <span className="material-symbols-outlined text-cyan-100 text-[100px] absolute -top-10 left-1/2 -translate-x-1/2 -z-10">format_quote</span>
                    <blockquote className="text-3xl md:text-5xl font-light text-slate-900 italic leading-tight mb-16 tracking-tight">
                        {isRu
                            ? "Цифровое здравоохранение — это не просто технологии; это человеческое достоинство и право на эффективный доступ к медицинской помощи."
                            : "Rəqəmsal sağlamlıq yalnız texnologiya deyil; bu, insan ləyaqəti və səhiyyəyə effektiv çıxış hüququdur."}
                    </blockquote>
                    <div className="flex items-center justify-center gap-6">
                        <div className="h-px w-12 bg-cyan-500"></div>
                        <div className="font-black uppercase tracking-[0.2em] text-cyan-600 text-[10px]">National Health Strategic Vision 2026</div>
                        <div className="h-px w-12 bg-cyan-500"></div>
                    </div>
                </div>
            </section>
        </main>
    );
}
