"use client";

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export default function ServicesPage() {
    const params = useParams();
    const locale = params.locale as string || 'az';
    const t = useTranslations('Services');
    const isRu = locale === 'ru';

    const breadcrumbItems = [
        { label: isRu ? 'Услуги' : 'Xidmətlər' }
    ];

    const [searchQuery, setSearchQuery] = useState('');

    const services = [
        {
            id: 'cardiology',
            name: isRu ? 'Кардиология' : 'Kardiologiya',
            desc: isRu
                ? 'Комплексная помощь сердечно-сосудистой системе с использованием современных диагностических средств.'
                : 'Müasir diaqnostik vasitələrdən istifadə edərək ürək və damar sistemi üçün hərtərəfli qayğı.',
            icon: 'cardiology',
            doctors: 45,
            featured: true
        },
        {
            id: 'neurology',
            name: isRu ? 'Неврология' : 'Nevrologiya',
            desc: isRu
                ? 'Экспертное лечение заболеваний головного, спинного мозга и нервной системы.'
                : 'Beyin, onurğa beyni və sinir sistemi pozuntularının ekspert müalicəsi.',
            icon: 'neurology',
            doctors: 32
        },
        {
            id: 'pediatrics',
            name: isRu ? 'Педиатрия' : 'Pediatriya',
            desc: isRu
                ? 'Специализированные медицинские услуги для младенцев, детей и подростков.'
                : 'Körpələr, uşaqlar və yeniyetmələr üçün xüsusi səhiyyə xidmətləri.',
            icon: 'child_care',
            doctors: 58
        },
        {
            id: 'orthopedics',
            name: isRu ? 'Ортопедия' : 'Ortopediya',
            desc: isRu
                ? 'Современное хирургическое и консервативное лечение костей и суставов.'
                : 'Sümük və oynaq sağlamlığı üçün qabaqcıl cərrahi və qeyri-cərrahi müalicə.',
            icon: 'skeleton',
            doctors: 28
        },
        {
            id: 'general-medicine',
            name: isRu ? 'Общая практика' : 'Ümumi Praktika',
            desc: isRu
                ? 'Первичная медицинская помощь, ориентированная на профилактику и здоровье.'
                : 'Profilaktik sağlamlıq və sağlamlığa yönəlmiş ilkin tibbi yardım xidmətləri.',
            icon: 'stethoscope',
            doctors: 120
        },
        {
            id: 'ophthalmology',
            name: isRu ? 'Офтальмология' : 'Oftalmologiya',
            desc: isRu
                ? 'Полный уход за глазами от проверки зрения до сложных специализированных операций.'
                : 'Göz testlərindən mürəkkəb ixtisaslaşdırılmış əməliyyatlara qədər tam göz qayğısı.',
            icon: 'visibility',
            doctors: 22
        },
        {
            id: 'vaccination',
            name: isRu ? 'Вакцинация' : 'Vaksinasiya',
            desc: isRu
                ? 'Все обязательные и рекомендуемые вакцины для взрослых и детей.'
                : 'Yetkinlər və uşaqlar üçün bütün məcburi və tövsiyə olunan vaksinlər.',
            icon: 'syringe',
            doctors: 35
        },
        {
            id: 'laboratory',
            name: isRu ? 'Лаборатория' : 'Laboratoriya',
            desc: isRu
                ? 'Комплексные анализы крови, генетические тесты и другая диагностика.'
                : 'Hərtərəfli qan testləri, genetik analizlər və digər diaqnostik testlər.',
            icon: 'biotech',
            doctors: 18
        },
        {
            id: 'imaging',
            name: isRu ? 'Визуализация' : 'Görüntüləmə',
            desc: isRu
                ? 'Современная медицинская визуализация, включая рентген, МРТ, КТ и УЗИ.'
                : 'Rentgen, MRT, CT və USM daxil olmaqla müasir tibbi görüntüləmə.',
            icon: 'radiology',
            doctors: 25
        },
        {
            id: 'dermatology',
            name: isRu ? 'Дерматология' : 'Dermatologiya',
            desc: isRu
                ? 'Диагностика и лечение заболеваний кожи, волос и ногтей.'
                : 'Dəri, saç və dırnaq xəstəliklərinin diaqnostikası və müalicəsi.',
            icon: 'dermatology',
            doctors: 31
        },
        {
            id: 'gynecology',
            name: isRu ? 'Гинекология' : 'Ginekologiya',
            desc: isRu
                ? 'Комплексные услуги для женского здоровья на всех этапах жизни.'
                : 'Həyatın bütün mərhələlərində qadın sağlamlığı üçün hərtərəfli xidmətlər.',
            icon: 'female',
            doctors: 42
        },
        {
            id: 'endocrinology',
            name: isRu ? 'Эндокринология' : 'Endokrinologiya',
            desc: isRu
                ? 'Лечение гормональных нарушений, диабета и заболеваний щитовидной железы.'
                : 'Hormonal pozğunluqların, diabetin və qalxanabənzər vəzi xəstəliklərinin müalicəsi.',
            icon: 'metabolism',
            doctors: 19
        },
    ];

    const filteredServices = services.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.desc.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const featuredService = filteredServices.find(s => s.featured);
    const regularServices = filteredServices.filter(s => !s.featured);

    return (
        <main className="bg-white text-slate-600 font-sans antialiased overflow-x-hidden">
            {/* Background - Clean Premium */}
            <div className="fixed inset-0 z-[-1] bg-white">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1000px] bg-gradient-radial-top pointer-events-none opacity-60"></div>
            </div>

            {/* Hero Section */}
            <section className="relative pt-8 pb-12 lg:pt-12 lg:pb-16 border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Breadcrumbs items={breadcrumbItems} locale={locale} />

                    {/* Header */}
                    <div className="max-w-3xl mb-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-50 border border-cyan-100 w-fit mb-6">
                            <span className="material-symbols-outlined text-cyan-600 text-[18px]">medical_services</span>
                            <span className="text-xs font-bold uppercase tracking-widest text-cyan-700">
                                {isRu ? 'Медицинские услуги' : 'Tibbi Xidmətlər'}
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium text-slate-900 leading-[1.1] tracking-tight mb-6">
                            {t('title')}
                        </h1>
                        <p className="text-xl text-slate-500 max-w-xl leading-relaxed">
                            {t('subtitle')}
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="max-w-2xl">
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-[22px]">search</span>
                            <input
                                type="text"
                                placeholder={isRu ? 'Поиск услуги...' : 'Xidmət axtarın...'}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-2xl text-base focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none shadow-sm transition-all text-slate-900 placeholder:text-slate-400"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-12 lg:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {filteredServices.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Featured Card */}
                            {featuredService && (
                                <Link
                                    href={`/${locale}/doctors?specialty=${featuredService.id}`}
                                    className="group md:col-span-2 lg:col-span-1 lg:row-span-2 relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 overflow-hidden cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-500"
                                >
                                    {/* Decorative elements */}
                                    <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl"></div>
                                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl"></div>

                                    <div className="relative z-10 h-full flex flex-col justify-between min-h-[320px]">
                                        <div>
                                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold mb-5">
                                                <span className="material-symbols-outlined text-[14px]">local_fire_department</span>
                                                {isRu ? 'Топ направление' : 'Top İxtisas'}
                                            </div>
                                            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                                <span className="material-symbols-outlined text-white text-[36px]">{featuredService.icon}</span>
                                            </div>
                                            <h3 className="text-3xl font-bold text-white mb-3">{featuredService.name}</h3>
                                            <p className="text-slate-400 text-base leading-relaxed">{featuredService.desc}</p>
                                        </div>

                                        <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
                                            <div className="flex items-center gap-3">
                                                <div className="flex -space-x-2">
                                                    <div className="w-8 h-8 rounded-full bg-white/30 border-2 border-white/50"></div>
                                                    <div className="w-8 h-8 rounded-full bg-white/20 border-2 border-white/50"></div>
                                                    <div className="w-8 h-8 rounded-full bg-white/10 border-2 border-white/50 flex items-center justify-center text-white text-xs font-bold">+</div>
                                                </div>
                                                <span className="text-white font-semibold">{featuredService.doctors} {isRu ? 'врачей' : 'həkim'}</span>
                                            </div>
                                            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center group-hover:translate-x-1 transition-transform shadow-lg">
                                                <span className="material-symbols-outlined text-slate-900 text-[24px]">arrow_forward</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            )}

                            {/* Regular Cards */}
                            {regularServices.map((s) => (
                                <Link
                                    key={s.id}
                                    href={`/${locale}/doctors?specialty=${s.id}`}
                                    className="group bg-white rounded-2xl p-6 border border-slate-100 hover:border-cyan-200 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1 flex flex-col"
                                >
                                    {/* Icon */}
                                    <div className="w-14 h-14 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-5 group-hover:bg-cyan-500 group-hover:text-white transition-colors">
                                        <span className="material-symbols-outlined text-[28px]">{s.icon}</span>
                                    </div>

                                    {/* Title */}
                                    <h2 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-cyan-600 transition-colors">{s.name}</h2>

                                    {/* Description */}
                                    <p className="text-sm text-slate-500 mb-5 flex-1 leading-relaxed line-clamp-2">{s.desc}</p>

                                    {/* Bottom row */}
                                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-cyan-600 text-[16px]">person</span>
                                            <span className="text-cyan-600 font-semibold text-sm">{s.doctors} {isRu ? 'Специалистов' : 'Mütəxəssis'}</span>
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-cyan-500 flex items-center justify-center transition-all group-hover:translate-x-1">
                                            <span className="material-symbols-outlined text-slate-400 group-hover:text-white text-[16px] transition-colors">arrow_forward</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white p-16 rounded-2xl border border-slate-100 text-center">
                            <span className="material-symbols-outlined text-slate-200 text-[64px] mb-6">search_off</span>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">
                                {isRu ? 'Услуга не найдена' : 'Xidmət tapılmadı'}
                            </h3>
                            <p className="text-slate-500">
                                {isRu ? 'Измените поисковый запрос' : 'Axtarış sorğusunu dəyişin'}
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* Insurance CTA */}
            <section className="py-12 lg:py-16 bg-surface-50 border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-10 md:p-14 relative overflow-hidden">
                        {/* Decorative elements */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl"></div>

                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                            <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-white text-[40px]">verified_user</span>
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                                    {isRu ? 'Оплата по страховке' : 'Sığorta ilə Ödəniş'}
                                </h3>
                                <p className="text-slate-400 leading-relaxed max-w-xl">
                                    {isRu
                                        ? 'Мы работаем со всеми основными страховыми компаниями. Свяжитесь с нами, чтобы проверить покрытие вашей страховки.'
                                        : 'Bütün əsas sığorta şirkətləri ilə işləyirik. Sizin sığortanızın məbləğini yoxlamaq üçün bizimlə əlaqə saxlayın.'}
                                </p>
                            </div>
                            <Link
                                href={`/${locale}/contact`}
                                className="px-8 py-4 bg-white text-slate-900 font-bold rounded-xl hover:bg-cyan-50 transition-all shadow-lg hover:shadow-xl shrink-0 flex items-center gap-2"
                            >
                                {isRu ? 'Подробнее' : 'Ətraflı Məlumat'}
                                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Help */}
            <section className="py-12 lg:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
                            {isRu ? 'Нужна помощь в выборе?' : 'Seçimdə köməyə ehtiyacınız var?'}
                        </h2>
                        <p className="text-slate-500 max-w-xl mx-auto">
                            {isRu
                                ? 'Наши консультанты помогут подобрать оптимальную услугу для вашей ситуации'
                                : 'Konsultantlarımız vəziyyətiniz üçün optimal xidməti seçməyə kömək edəcəklər'}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                icon: 'call',
                                title: isRu ? 'Позвоните нам' : 'Bizə zəng edin',
                                desc: '+994 12 440 00 00',
                                action: isRu ? 'Позвонить' : 'Zəng et',
                                href: 'tel:+994124400000'
                            },
                            {
                                icon: 'chat',
                                title: isRu ? 'Онлайн чат' : 'Onlayn çat',
                                desc: isRu ? 'Отвечаем за минуту' : 'Bir dəqiqə ərzində cavab',
                                action: isRu ? 'Начать чат' : 'Çata başla',
                                href: '#'
                            },
                            {
                                icon: 'mail',
                                title: isRu ? 'Напишите нам' : 'Bizə yazın',
                                desc: 'info@medplus.az',
                                action: isRu ? 'Написать' : 'Yaz',
                                href: `/${locale}/contact`
                            }
                        ].map((item, i) => (
                            <Link
                                key={i}
                                href={item.href}
                                className="group bg-white p-6 rounded-2xl border border-slate-100 hover:border-cyan-200 shadow-sm hover:shadow-lg transition-all text-center"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center mx-auto mb-4 group-hover:bg-cyan-500 group-hover:text-white transition-colors">
                                    <span className="material-symbols-outlined text-[28px]">{item.icon}</span>
                                </div>
                                <h3 className="font-bold text-slate-900 mb-1">{item.title}</h3>
                                <p className="text-sm text-slate-500 mb-4">{item.desc}</p>
                                <span className="inline-flex items-center gap-1 text-cyan-600 font-semibold text-sm group-hover:gap-2 transition-all">
                                    {item.action}
                                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
