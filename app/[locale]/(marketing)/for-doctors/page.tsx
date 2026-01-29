"use client";

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export default function ForDoctorsPage() {
    const params = useParams();
    const locale = params.locale as string || 'az';
    const isRu = locale === 'ru';

    const breadcrumbItems = [
        { label: isRu ? 'Для врачей' : 'Həkimlər üçün' }
    ];

    const benefits = [
        {
            name: isRu ? 'Умное расписание' : 'Ağıllı Cədvəl',
            description: isRu
                ? 'Автоматизированная система записи, которая синхронизируется с вашим календарем.'
                : 'Təqviminizi avtomatlaşdıran və xəstələrin qeydiyyatını asanlaşdıran ağıllı sistem.',
            icon: 'calendar_month',
        },
        {
            name: isRu ? 'Электронные карты' : 'Elektron Kartlar',
            description: isRu
                ? 'Безопасные и соответствующие стандартам медицинские записи (EHR), доступные из любого места.'
                : 'Təhlükəsiz, beynəlxalq standartlara uyğun elektron sağlamlıq qeydləri sistemi.',
            icon: 'description',
        },
        {
            name: isRu ? 'Телемедицина 24/7' : 'Telemedisina 24/7',
            description: isRu
                ? 'Встроенные инструменты видеоконсультаций для удаленного ухода за пациентами.'
                : 'Məsafədən xəstə qayğısı üçün quraşdırılmış peşəkar video konsultasiya alətləri.',
            icon: 'videocam',
        },
    ];

    const stats = [
        { label: isRu ? 'Активных врачей' : 'Aktiv həkim', value: '2,500+' },
        { label: isRu ? 'Клиник' : 'Klinika', value: '450+' },
        { label: isRu ? 'Пункт записи' : 'Onlayn Qeydiyyat', value: '500K+' },
    ];

    return (
        <main className="bg-white text-slate-600 font-sans antialiased overflow-x-hidden pt-12">
            {/* Background - Clean Premium */}
            <div className="fixed inset-0 z-[-1] bg-white">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1000px] bg-gradient-radial-top pointer-events-none opacity-60"></div>
            </div>

            {/* Hero Section */}
            <section className="relative py-12 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <Breadcrumbs items={breadcrumbItems} locale={locale} />
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-50 border border-cyan-100 w-fit mb-8">
                                <span className="material-symbols-outlined text-cyan-600 text-[18px]">verified_user</span>
                                <span className="text-xs font-bold uppercase tracking-widest text-cyan-700">
                                    {isRu ? 'Для медицинских специалистов' : 'Tibb Mütəxəssisləri üçün'}
                                </span>
                            </div>
                            <h1 className="text-5xl lg:text-7xl font-medium text-slate-900 leading-[1.05] tracking-tight mb-8">
                                {isRu ? 'Развивайте свою практику' : 'Təcrübənizi'} <br />
                                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-cyan-400">
                                    {isRu ? 'с MedPlus' : 'MedPlus ilə böyüdün'}
                                </span>
                            </h1>
                            <p className="text-xl text-slate-500 max-w-xl leading-relaxed mb-10">
                                {isRu
                                    ? 'Присоединяйтесь к крупнейшей сети высококвалифицированных врачей. Управляйте записями и повышайте качество обслуживания.'
                                    : 'Azərbaycanın ən böyük tibb şəbəkəsinə qoşulun. Qəbulları idarə edin, növbələri azaldın və pasiyentlərə daha yaxşı xidmət göstərin.'}
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link
                                    href={`/${locale}/for-doctors/register`}
                                    className="px-10 py-5 bg-slate-900 text-white font-black rounded-2xl hover:bg-cyan-600 shadow-xl shadow-slate-900/10 hover:shadow-cyan-500/30 transition-all duration-300 flex items-center gap-3 active:scale-95"
                                >
                                    {isRu ? 'Подать заявку' : 'Müraciət Et'}
                                    <span className="material-symbols-outlined">person_add</span>
                                </Link>
                                <a
                                    href="#benefits"
                                    className="px-10 py-5 bg-white text-slate-900 font-bold rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all flex items-center gap-2"
                                >
                                    {isRu ? 'Узнать больше' : 'Daha çox məlumat'}
                                </a>
                            </div>

                            {/* Stats */}
                            <div className="mt-16 pt-10 border-t border-slate-100 flex gap-8 md:gap-16">
                                {stats.map((stat, i) => (
                                    <div key={i}>
                                        <div className="text-3xl font-black text-slate-900 mb-1">{stat.value}</div>
                                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Interactive UI Mockup */}
                        <div className="relative group perspective-1000">
                            <div className="absolute -inset-4 bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 rounded-[3rem] blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-1000"></div>
                            <div className="relative bg-white border border-slate-200 rounded-[2.5rem] shadow-2xl overflow-hidden isometric-card">
                                {/* Fake App Header */}
                                <div className="bg-slate-900 px-8 py-6 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-cyan-500 flex items-center justify-center text-white">
                                            <span className="material-symbols-outlined text-[20px]">dashboard</span>
                                        </div>
                                        <div className="text-white font-bold tracking-tight">Doctor Web Portal</div>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="w-8 h-8 rounded-full bg-white/10"></div>
                                        <div className="w-8 h-8 rounded-full bg-white/10"></div>
                                    </div>
                                </div>
                                {/* Fake App Content */}
                                <div className="p-8">
                                    <div className="h-4 bg-slate-100 rounded-full w-1/3 mb-8"></div>
                                    <div className="grid grid-cols-3 gap-4 mb-8">
                                        <div className="h-20 bg-cyan-50 rounded-2xl border border-cyan-100 p-4">
                                            <div className="w-6 h-6 rounded bg-cyan-200 mb-2"></div>
                                            <div className="h-2 bg-cyan-300 w-full rounded"></div>
                                        </div>
                                        <div className="h-20 bg-slate-50 rounded-2xl p-4">
                                            <div className="w-6 h-6 rounded bg-slate-200 mb-2"></div>
                                            <div className="h-2 bg-slate-200 w-full rounded"></div>
                                        </div>
                                        <div className="h-20 bg-slate-50 rounded-2xl p-4">
                                            <div className="w-6 h-6 rounded bg-slate-200 mb-2"></div>
                                            <div className="h-2 bg-slate-200 w-full rounded"></div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="flex items-center gap-4 p-4 border border-slate-50 rounded-2xl">
                                                <div className="w-10 h-10 rounded-full bg-slate-100"></div>
                                                <div className="flex-1 space-y-2">
                                                    <div className="h-2 bg-slate-200 w-2/3 rounded"></div>
                                                    <div className="h-2 bg-slate-100 w-1/2 rounded"></div>
                                                </div>
                                                <div className="w-20 h-8 bg-cyan-500/10 rounded-lg"></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section id="benefits" className="py-24 bg-surface-50 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-100 shadow-sm w-fit mb-6 mx-auto">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-900">
                                {isRu ? 'Преимущества' : 'Üstünlüklərimiz'}
                            </span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
                            {isRu ? 'Всё для вашей практики' : 'Həkim təcrübəniz üçün hər şey'}
                        </h2>
                        <p className="text-lg text-slate-500 leading-relaxed font-medium">
                            {isRu
                                ? 'Современные инструменты для управления медицинскими услугами и взаимодействия с пациентами.'
                                : 'Müasir tibbi idarəetmə alətləri ilə xidmət keyfiyyətini artırın və vaxtınıza qənaət edin.'}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {benefits.map((benefit) => (
                            <div key={benefit.name} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-cyan-200 transition-all duration-500 group">
                                <div className="w-16 h-16 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-8 group-hover:bg-cyan-500 group-hover:text-white transition-all transform group-hover:rotate-6 shadow-sm">
                                    <span className="material-symbols-outlined text-[32px]">{benefit.icon}</span>
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight italic">
                                    {benefit.name}
                                </h3>
                                <p className="text-slate-500 leading-relaxed mb-8">
                                    {benefit.description}
                                </p>
                                <div className="flex items-center gap-2 text-cyan-600 font-bold text-sm uppercase group-hover:gap-3 transition-all">
                                    {isRu ? 'Подробнее' : 'Ətraflı'}
                                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA App Section */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-[3rem] p-10 md:p-20 relative overflow-hidden shadow-2xl">
                        {/* Glows */}
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none"></div>

                        <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
                            <div>
                                <h2 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tight leading-tight italic">
                                    {isRu ? 'Готовы начать?' : 'Başlamağa hazırsınız?'}
                                </h2>
                                <p className="text-slate-400 text-lg md:text-xl mb-12 leading-relaxed italic">
                                    {isRu
                                        ? 'Присоединяйтесь к нам сегодня и получите доступ ко всем инструментам для ведения практики.'
                                        : 'Bu gün bizə qoşulun və müasir tibbi idarəetmə dünyasına addım atın.'}
                                </p>
                                <div className="flex flex-wrap gap-6">
                                    <Link
                                        href={`/${locale}/for-doctors/register`}
                                        className="px-10 py-5 bg-cyan-500 text-white font-black rounded-2xl hover:bg-cyan-400 shadow-xl shadow-cyan-500/30 transition-all hover:scale-105 active:scale-95 flex items-center gap-3"
                                    >
                                        {isRu ? 'Подать заявку' : 'İndi Qoşulun'}
                                        <span className="material-symbols-outlined">rocket_launch</span>
                                    </Link>
                                    <button className="px-10 py-5 bg-white/5 backdrop-blur text-white font-bold rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
                                        {isRu ? 'Связаться с отделом продаж' : 'Satış komandası ilə əlaqə'}
                                    </button>
                                </div>
                            </div>
                            <div className="hidden lg:flex justify-center relative">
                                <div className="w-80 h-80 rounded-full bg-cyan-500/20 animate-pulse absolute"></div>
                                <div className="relative z-10 w-64 h-[500px] bg-slate-800 rounded-[3rem] p-3 border border-slate-700 shadow-2xl shadow-cyan-500/10 rotate-6">
                                    <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden p-6 flex flex-col justify-center items-center text-center">
                                        <div className="w-16 h-16 rounded-full bg-cyan-500 flex items-center justify-center text-white mb-6">
                                            <span className="material-symbols-outlined text-[32px]">verified</span>
                                        </div>
                                        <div className="text-xl font-black text-slate-900 mb-2">MedPlus Pro</div>
                                        <div className="text-slate-500 text-sm mb-6">{isRu ? 'Для врачей' : 'Həkimlər üçün'}</div>
                                        <div className="w-full h-2 bg-slate-100 rounded-full mb-3"></div>
                                        <div className="w-2/3 h-2 bg-slate-100 rounded-full mb-3"></div>
                                        <div className="w-full h-2 bg-slate-100 rounded-full mb-8"></div>
                                        <div className="w-full py-4 bg-slate-900 rounded-xl"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
