"use client";

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export default function ForHospitalsPage() {
    const params = useParams();
    const locale = params.locale as string || 'az';
    const isRu = locale === 'ru';

    const breadcrumbItems = [
        { label: isRu ? 'Для клиник' : 'Klinikalar üçün' }
    ];

    const benefits = [
        {
            name: isRu ? 'Управление потоком' : 'Pasiyent Axını',
            description: isRu
                ? 'Оптимизируйте загрузку отделений и уменьшите время ожидания пациентов.'
                : 'Şöbələrin yüklənməsini optimallaşdırın və pasiyentlərin gözləmə müddətini azaldın.',
            icon: 'analytics',
        },
        {
            name: isRu ? 'Цифровая экосистема' : 'Rəqəmsal Ekosistem',
            description: isRu
                ? 'Полная интеграция с государственными и частными страховыми системами.'
                : 'Dövlət və özəl sığorta sistemləri ilə tam inteqrasiya olunmuş infrastruktur.',
            icon: 'hub',
        },
        {
            name: isRu ? 'Бренд и доверие' : 'Brend və Etimad',
            description: isRu
                ? 'Повысьте узнаваемость вашей клиники среди миллионов пользователей MedPlus.'
                : 'Milyonlarla MedPlus istifadəçisi arasında klinikanızın tanınmasını və etibarını artırın.',
            icon: 'verified',
        },
    ];

    const stats = [
        { label: isRu ? 'Клиник и центров' : 'Klinika və Mərkəzlər', value: '450+' },
        { label: isRu ? 'Городов' : 'Şəhər', value: '25+' },
        { label: isRu ? 'Записей в год' : 'İllik Qeydiyyat', value: '1.2M+' },
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
                                <span className="material-symbols-outlined text-cyan-600 text-[18px]">corporate_fare</span>
                                <span className="text-xs font-bold uppercase tracking-widest text-cyan-700">
                                    {isRu ? 'Для медицинских учреждений' : 'Tibb Müəssisələri üçün'}
                                </span>
                            </div>
                            <h1 className="text-5xl lg:text-7xl font-medium text-slate-900 leading-[1.05] tracking-tight mb-8">
                                {isRu ? 'Цифровая трансформация' : 'Klinikanızın'} <br />
                                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-cyan-400">
                                    {isRu ? 'вашей клиники' : 'rəqəmsal transformasiyası'}
                                </span>
                            </h1>
                            <p className="text-xl text-slate-500 max-w-xl leading-relaxed mb-10">
                                {isRu
                                    ? 'Интегрируйте свое медицинское учреждение в крупнейшую экосистему здоровья Азербайджана. Автоматизируйте процессы и увеличивайте охват.'
                                    : 'Tibbi müəssisənizi Azərbaycanın ən böyük sağlamlıq ekosisteminə inteqrasiya edin. Prosesləri avtomatlaşdırın və xəstə məmnuniyyətini artırın.'}
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link
                                    href={`/${locale}/for-hospitals/register`}
                                    className="px-10 py-5 bg-slate-900 text-white font-black rounded-2xl hover:bg-cyan-600 shadow-xl shadow-slate-900/10 hover:shadow-cyan-500/30 transition-all duration-300 flex items-center gap-3 active:scale-95"
                                >
                                    {isRu ? 'Подключить клинику' : 'Klinikanı Qoş'}
                                    <span className="material-symbols-outlined">add_business</span>
                                </Link>
                                <a
                                    href="#benefits"
                                    className="px-10 py-5 bg-white text-slate-900 font-bold rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all flex items-center gap-2"
                                >
                                    {isRu ? 'Возможности' : 'İmkanlar'}
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
                                            <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span>
                                        </div>
                                        <div className="text-white font-bold tracking-tight">Hospital Admin Console</div>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="w-8 h-8 rounded-full bg-white/10"></div>
                                        <div className="w-8 h-8 rounded-full bg-white/10"></div>
                                    </div>
                                </div>
                                {/* Fake App Content */}
                                <div className="p-8">
                                    <div className="h-4 bg-slate-100 rounded-full w-1/3 mb-8"></div>
                                    <div className="grid grid-cols-2 gap-4 mb-8">
                                        <div className="h-28 bg-cyan-50 rounded-2xl border border-cyan-100 p-5">
                                            <div className="text-[10px] font-black text-cyan-600 uppercase mb-2">Pasiyent sayı</div>
                                            <div className="text-2xl font-black text-slate-900">1,280</div>
                                            <div className="mt-2 h-1.5 w-full bg-cyan-200 rounded-full">
                                                <div className="h-full w-2/3 bg-cyan-500 rounded-full"></div>
                                            </div>
                                        </div>
                                        <div className="h-28 bg-slate-50 rounded-2xl p-5">
                                            <div className="text-[10px] font-black text-slate-400 uppercase mb-2">Gözləyənlər</div>
                                            <div className="text-2xl font-black text-slate-900">12</div>
                                            <div className="mt-2 h-1.5 w-full bg-slate-200 rounded-full"></div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        {[1, 2].map(i => (
                                            <div key={i} className="p-4 border border-slate-50 rounded-2xl">
                                                <div className="flex justify-between mb-4">
                                                    <div className="flex gap-3">
                                                        <div className="w-10 h-10 rounded-lg bg-slate-100"></div>
                                                        <div>
                                                            <div className="h-2 bg-slate-200 w-24 rounded mb-2"></div>
                                                            <div className="h-2 bg-slate-100 w-16 rounded"></div>
                                                        </div>
                                                    </div>
                                                    <div className="w-12 h-6 bg-emerald-50 rounded"></div>
                                                </div>
                                                <div className="h-1 bg-slate-50 w-full rounded"></div>
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
                                {isRu ? 'Возможности' : 'Klinikalar üçün'}
                            </span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
                            {isRu ? 'Управляйте будущим клиники' : 'Gələcəyin xəstəxanasını idarə edin'}
                        </h2>
                        <p className="text-lg text-slate-500 leading-relaxed font-medium">
                            {isRu
                                ? 'Комплексные решения для автоматизации регистратуры, лабораторий и взаимодействия с врачами.'
                                : 'Qeydiyyat şöbəsi, laboratoriyalar və həkim koordinasiyası üçün kompleks rəqəmsal həllər.'}
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
                                    {isRu ? 'Масштабируйте клинику' : 'Klinikanı genişləndirin'}
                                </h2>
                                <p className="text-slate-400 text-lg md:text-xl mb-12 leading-relaxed italic">
                                    {isRu
                                        ? 'Присоединяйтесь к MedPlus и станьте частью крупнейшей национальной сети здравоохранения.'
                                        : 'MedPlus-a qoşulun və ölkənin ən böyük rəqəmsal səhiyyə şəbəkəsinin bir hissəsi olun.'}
                                </p>
                                <div className="flex flex-wrap gap-6">
                                    <Link
                                        href={`/${locale}/for-hospitals/register`}
                                        className="px-10 py-5 bg-cyan-500 text-white font-black rounded-2xl hover:bg-cyan-400 shadow-xl shadow-cyan-500/30 transition-all hover:scale-105 active:scale-95 flex items-center gap-3"
                                    >
                                        {isRu ? 'Начать сотрудничество' : 'Əməkdaşlığa Başla'}
                                        <span className="material-symbols-outlined">rocket_launch</span>
                                    </Link>
                                    <button className="px-10 py-5 bg-white/5 backdrop-blur text-white font-bold rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
                                        {isRu ? 'Запросить демо' : 'Demo sorğula'}
                                    </button>
                                </div>
                            </div>
                            <div className="hidden lg:flex justify-center relative">
                                <div className="w-80 h-80 rounded-full bg-cyan-500/20 animate-pulse absolute"></div>
                                <div className="relative z-10 w-full max-w-[400px] aspect-video bg-slate-800 rounded-[2rem] p-1 border border-slate-700 shadow-2xl rotate-3">
                                    <div className="w-full h-full bg-slate-900 rounded-[1.8rem] overflow-hidden flex items-center justify-center">
                                        <div className="text-cyan-500 flex flex-col items-center gap-4">
                                            <span className="material-symbols-outlined text-[64px] animate-bounce">query_stats</span>
                                            <div className="text-xs font-black uppercase tracking-widest text-white/50">MedPlus Enterprise</div>
                                        </div>
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
