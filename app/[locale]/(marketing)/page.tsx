"use client";

import Link from 'next/link';
import { use } from 'react';
import { Apple, Smartphone } from 'lucide-react';

export default function Home({ params: paramsPromise }: { params: Promise<{ locale: string }> }) {
    const params = use(paramsPromise);
    const locale = params.locale || 'az';
    const isRu = locale === 'ru';

    // Content Dictionary
    const content = {
        hero: {
            badge: isRu ? 'Официальная Платформа' : 'Rəsmi Platforma',
            title: isRu ? 'Ваше Здоровье —' : 'Sizin Sağlamlığınız',
            titleHighlight: isRu ? 'Наш Приоритет' : 'Bizim Prioritetimiz',
            subtitle: isRu
                ? 'Находите лучших врачей, записывайтесь на прием онлайн и управляйте своим здоровьем с комфортом. Быстро, надежно и удобно.'
                : 'Ən yaxşı həkimləri tapın, onlayn qəbula yazılın və sağlamlığınızı rahatlıqla idarə edin. Sürətli, etibarlı və rahat.',
            searchPlaceholder: isRu ? 'Врач, клиника или услуга...' : 'Həkim, klinika və ya xidmət...',
            datePlaceholder: isRu ? 'Выберите дату' : 'Tarix seçin',
            bookButton: isRu ? 'Выбрать Врача' : 'Həkimi Seç',
            floatingBadge1: isRu ? 'Проверенные Врачи' : 'Təsdiqlənmiş Həkimlər',
            floatingBadge2: isRu ? 'Онлайн Рецепты' : 'Rəqəmsal Reseptlər',
            floatingCard: {
                title: isRu ? 'Видео Консультация' : 'Video Konsultasiya',
                subtitle: isRu ? 'Не выходя из дома' : 'Evdən çıxmadan',
                status: isRu ? 'Доступно 24/7' : '24/7 Mövcuddur'
            }
        },
        services: {
            badge: isRu ? 'Наши Услуги' : 'Xidmətlərimiz',
            title: isRu ? 'Всё для вашего здоровья' : 'Sağlamlığınız üçün hər şey',
            subtitle: isRu
                ? 'Единая экосистема для заботы о вас и ваших близких.'
                : 'Siz və yaxınlarınızın qayğısına qalmaq üçün vahid ekosistem.',
            cards: [
                {
                    title: isRu ? 'Онлайн Запись' : 'Onlayn Qeydiyyat',
                    desc: isRu ? 'Никаких очередей. Записывайтесь к врачу в любое время дня и ночи.' : 'Növbə gözləmədən, istənilən vaxt həkim qəbuluna yazılın.',
                    icon: 'calendar_clock',
                    illustration: 'image1.png'
                },
                {
                    title: isRu ? 'Электронная Карта' : 'Elektron Tibb Kartı',
                    desc: isRu ? 'История болезни, рецепты и анализы всегда под рукой в вашем телефоне.' : 'Xəstəlik tarixçəsi, reseptlər və analizlər telefonunuzda.',
                    icon: 'description',
                    illustration: 'image2.png'
                },
                {
                    title: isRu ? 'Видео Прием' : 'Video Qəbul',
                    desc: isRu ? 'Консультации с ведущими специалистами страны по видеосвязи.' : 'Ölkənin aparıcı mütəxəssisləri ilə video formatda konsultasiya.',
                    icon: 'videocam',
                    illustration: 'image3.png'
                }
            ]
        },
        doctors: {
            title: isRu ? 'Ведущие Специалисты' : 'Aparıcı Mütəxəssislər',
            subtitle: isRu ? 'Врачи, которым доверяют тысячи пациентов.' : 'Minlərlə pasiyentin güvəndiyi həkimlər.',
            viewAll: isRu ? 'Все Врачи' : 'Bütün Həkimlər',
            cards: [
                {
                    name: isRu ? 'Др. Рашад Маммадов' : 'Dr. Rəşad Məmmədov',
                    spec: isRu ? 'Кардиолог' : 'Kardioloq',
                    desc: isRu ? 'Эксперт высшей категории' : 'Ali dərəcəli ekspert',
                    location: 'Bakı Medical Plaza',
                    icon: 'cardiology',
                    color: 'text-cyan-600',
                    bgColor: 'bg-cyan-50',
                    rating: 4.9,
                    reviews: 127,
                    experience: 15,
                    img: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80'
                },
                {
                    name: isRu ? 'Др. Гюнай Алиева' : 'Dr. Günay Əliyeva',
                    spec: isRu ? 'Педиатр' : 'Pediatr',
                    desc: isRu ? 'Забота о здоровье детей' : 'Uşaq sağlamlığı mütəxəssisi',
                    location: 'Bona Dea Hospital',
                    icon: 'child_care',
                    color: 'text-emerald-600',
                    bgColor: 'bg-emerald-50',
                    rating: 4.8,
                    reviews: 89,
                    experience: 12,
                    img: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=800&q=80'
                },
                {
                    name: isRu ? 'Др. Фуад Гулиев' : 'Dr. Fuad Quliyev',
                    spec: isRu ? 'Невропатолог' : 'Nevropatoloq',
                    desc: isRu ? 'Современные методы лечения' : 'Müasir müalicə üsulları',
                    location: 'Mərkəzi Klinika',
                    icon: 'neurology',
                    color: 'text-purple-600',
                    bgColor: 'bg-purple-50',
                    rating: 4.9,
                    reviews: 156,
                    experience: 18,
                    img: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=800&q=80'
                },
                {
                    name: isRu ? 'Др. Нигяр Мустафаева' : 'Dr. Nigar Mustafayeva',
                    spec: isRu ? 'Дерматолог' : 'Dermatoloq',
                    desc: isRu ? 'Эстетическая медицина' : 'Estetik tibb',
                    location: 'Central Hospital',
                    icon: 'dermatology',
                    color: 'text-pink-600',
                    bgColor: 'bg-pink-50',
                    rating: 4.7,
                    reviews: 203,
                    experience: 10,
                    img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80'
                }
            ]
        },
        search: {
            location: isRu ? 'Локация' : 'Məkan',
            locationPlaceholder: isRu ? 'Выберите Город' : 'Şəhər Seçin',
            condition: isRu ? 'Услуга' : 'Xidmət',
            conditionPlaceholder: isRu ? 'Выберите Услугу' : 'Xidmət Seçin',
            insurance: isRu ? 'Страховка' : 'Sığorta',
            insurancePlaceholder: isRu ? 'Ваш План' : 'Sığorta Planı',
            date: isRu ? 'Дата' : 'Tarix',
            datePlaceholder: isRu ? 'Выберите Дату' : 'Tarix Seçin',
            button: isRu ? 'Найти Врача' : 'Həkim Axtar'
        },
        app: {
            title: isRu ? 'Мобильное Приложение' : 'Mobil Tətbiq',
            headline: isRu ? 'Ваше Здоровье в Кармане' : 'Sağlamlığınız Cibinizdə',
            desc: isRu
                ? 'Скачайте MedPlus и получите полный контроль над своим здоровьем. Запись к врачу, результаты анализов и напоминания о приеме лекарств.'
                : 'MedPlus yükləyin və sağlamlığınıza tam nəzarət edin. Həkim qəbuluna yazı, analiz nəticələri və dərman xatırlatmaları.',
            apple: isRu ? 'Загрузить в' : 'Yüklə',
            google: isRu ? 'Доступно в' : 'Yüklə'
        }
    };

    return (
        <main className="bg-white text-slate-600 font-sans antialiased overflow-x-hidden selection:bg-cyan-100 selection:text-cyan-900">
            {/* Background - Clean Premium */}
            <div className="fixed inset-0 z-[-1] bg-white">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1000px] bg-gradient-radial-top pointer-events-none opacity-60"></div>
            </div>

            {/* HERO SECTION */}
            <section className="relative pt-4 pb-12 lg:pt-6 lg:pb-20 overflow-hidden">
                {/* 1. Background Video - Fixed Clean Right Side */}
                <div className="absolute top-0 right-0 w-full lg:w-1/2 h-full z-0 pointer-events-none opacity-90 lg:opacity-100">
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                    >
                        <source src="https://videos.pexels.com/video-files/8943812/8943812-hd_1920_1080_25fps.mp4" type="video/mp4" />
                    </video>
                    {/* Gradient to blend video with background */}
                    <div className="absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-white via-white/80 to-transparent hidden lg:block"></div>
                    {/* Bottom fade to white */}
                    {/* Bottom fade to white - Premium Smooth Blend */}
                    <div className="absolute bottom-0 left-0 w-full h-[500px] bg-gradient-to-t from-white via-white/50 to-transparent pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white via-white/90 to-transparent pointer-events-none"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col">

                        {/* 2. Text Content Block - Restricted width for readability */}
                        <div className="relative z-20 pt-4 pb-12 lg:w-2/3">
                            {/* Decorative Line */}
                            <div className="absolute -left-8 top-0 bottom-0 w-[1px] bg-gradient-to-b from-cyan-500/0 via-cyan-500/30 to-cyan-500/0 hidden lg:block"></div>

                            {/* Status Badge */}
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-50 border border-cyan-100 w-fit mb-8">
                                <span className="material-symbols-outlined text-cyan-600 text-[18px]">verified_user</span>
                                <span className="text-xs font-bold uppercase tracking-widest text-cyan-700">{content.hero.badge}</span>
                            </div>

                            <h1 className="text-5xl lg:text-8xl font-medium text-slate-900 leading-[1.05] tracking-tight mb-8">
                                {content.hero.title} <br />
                                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-cyan-400">
                                    {content.hero.titleHighlight}
                                </span>
                            </h1>

                            <p className="text-xl text-slate-600 max-w-xl leading-relaxed border-l-2 border-slate-200 pl-6">
                                {content.hero.subtitle}
                            </p>
                        </div>
                    </div>
                </div>

                {/* 3. Search Bar - Truly "Full Long" (Edge-to-Edge) */}
                <div className="w-full px-4 sm:px-6 lg:px-8 relative z-30 -mt-10">
                    <div className="max-w-full mx-auto bg-white p-2 rounded-[2.5rem] flex flex-col xl:flex-row gap-0 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)] border border-slate-100 divide-y xl:divide-y-0 xl:divide-x divide-slate-100">
                        {/* Location Field */}
                        <Link href={`/${locale}/doctors`} className="flex-[1.2] relative group px-8 py-4 hover:bg-slate-50 transition-colors rounded-xl xl:rounded-l-[2.5rem] cursor-pointer">
                            <div className="flex items-center gap-5 h-full">
                                <div className="bg-cyan-50 text-cyan-600 p-3.5 rounded-2xl group-hover:bg-cyan-100 transition-colors">
                                    <span className="material-symbols-outlined text-[24px]">location_on</span>
                                </div>
                                <div className="flex flex-col w-full text-left">
                                    <span className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{content.search.location}</span>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[17px] font-bold text-slate-800">{content.search.locationPlaceholder}</span>
                                        <span className="material-symbols-outlined text-slate-300 text-[20px]">expand_more</span>
                                    </div>
                                </div>
                            </div>
                        </Link>

                        {/* Condition Field */}
                        <Link href={`/${locale}/doctors`} className="flex-[1.2] relative group px-8 py-4 hover:bg-slate-50 transition-colors cursor-pointer">
                            <div className="flex items-center gap-5 h-full text-left">
                                <div className="bg-cyan-50 text-cyan-600 p-3.5 rounded-2xl group-hover:bg-cyan-100 transition-colors">
                                    <span className="material-symbols-outlined text-[24px]">person</span>
                                </div>
                                <div className="flex flex-col w-full">
                                    <span className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{content.search.condition}</span>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[17px] font-bold text-slate-800">{content.search.conditionPlaceholder}</span>
                                        <span className="material-symbols-outlined text-slate-300 text-[20px]">expand_more</span>
                                    </div>
                                </div>
                            </div>
                        </Link>

                        {/* Insurance Field */}
                        <Link href={`/${locale}/doctors`} className="flex-1 relative group px-8 py-4 hover:bg-slate-50 transition-colors cursor-pointer">
                            <div className="flex items-center gap-5 h-full text-left">
                                <div className="bg-cyan-50 text-cyan-600 p-3.5 rounded-2xl group-hover:bg-cyan-100 transition-colors">
                                    <span className="material-symbols-outlined text-[24px]">receipt_long</span>
                                </div>
                                <div className="flex flex-col w-full">
                                    <span className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{content.search.insurance}</span>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[17px] font-bold text-slate-800">{content.search.insurancePlaceholder}</span>
                                        <span className="material-symbols-outlined text-slate-300 text-[20px]">expand_more</span>
                                    </div>
                                </div>
                            </div>
                        </Link>

                        {/* Date Field */}
                        <Link href={`/${locale}/doctors`} className="flex-1 relative group px-8 py-4 hover:bg-slate-50 transition-colors cursor-pointer">
                            <div className="flex items-center gap-5 h-full text-left">
                                <div className="bg-cyan-50 text-cyan-600 p-3.5 rounded-2xl group-hover:bg-cyan-100 transition-colors">
                                    <span className="material-symbols-outlined text-[24px]">calendar_today</span>
                                </div>
                                <div className="flex flex-col w-full">
                                    <span className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{content.search.date}</span>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[17px] font-bold text-slate-800">{content.search.datePlaceholder}</span>
                                        <span className="material-symbols-outlined text-slate-300 text-[20px]">expand_more</span>
                                    </div>
                                </div>
                            </div>
                        </Link>

                        {/* Search Button */}
                        <div className="p-3 flex items-center relative z-50">
                            <Link
                                href={`/${locale}/doctors`}
                                className="h-[68px] w-full xl:w-auto px-12 rounded-[2rem] bg-cyan-500 hover:bg-cyan-400 text-white font-black shadow-xl shadow-cyan-200 transition-all flex items-center justify-center gap-4 whitespace-nowrap cursor-pointer active:scale-95"
                            >
                                <span className="text-lg">{content.search.button}</span>
                                <span className="material-symbols-outlined text-[24px]">search</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* SERVICES SECTION - RICH GLASSMORPHISM REDESIGN */}
            <section className="py-10 relative overflow-hidden bg-white border-t border-slate-100">
                {/* Background Grid & Glows */}
                <div className="absolute inset-x-0 top-0 h-full w-full bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30"></div>
                <div className="absolute top-20 left-1/4 w-64 h-64 bg-cyan-200/20 blur-[100px] rounded-full"></div>
                <div className="absolute top-40 right-1/4 w-64 h-64 bg-slate-200/20 blur-[100px] rounded-full"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-10 max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.04)] w-fit mb-6 mx-auto hover:scale-105 transition-transform duration-300">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-900">{content.services.badge}</span>
                        </div>

                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-6 tracking-tight leading-[1.1]">
                            {content.services.title}
                            <span className="text-cyan-500">.</span>
                        </h2>

                        <div className="flex items-center justify-center gap-2 mb-8 opacity-50">
                            <div className="h-px w-24 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
                            <div className="size-1.5 rounded-full bg-cyan-400"></div>
                            <div className="h-px w-24 bg-gradient-to-r from-cyan-400 via-cyan-400 to-transparent"></div>
                        </div>

                        <p className="text-slate-600 text-lg md:text-xl leading-relaxed font-medium px-4 max-w-2xl mx-auto">
                            {content.services.subtitle}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {(content.services.cards as any[]).map((card, idx) => (
                            <div
                                key={idx}
                                className="group relative p-5 rounded-[2rem] bg-white border border-slate-100 hover:border-cyan-200/50 transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.06)] hover:-translate-y-1 cursor-pointer overflow-hidden flex flex-col min-h-[420px]"
                            >
                                {/* Glass Card Background */}
                                <div className="absolute inset-0 bg-gradient-to-br from-white via-white/40 to-cyan-50/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="absolute inset-0 border border-white/40 rounded-[2rem] pointer-events-none"></div>

                                {/* Premium Illustration Holder */}
                                <div className="relative z-10 w-full aspect-[4/3] mb-6 rounded-2xl overflow-hidden flex items-center justify-center bg-white group-hover:bg-cyan-50/50 transition-colors duration-500">
                                    <img
                                        src={`/illustrations/${card.illustration}?v=3`}
                                        alt={card.title}
                                        className="w-[85%] h-[85%] object-contain group-hover:scale-110 transition-transform duration-700 ease-out drop-shadow-2xl"
                                    />

                                    {/* Reflection Glow */}
                                    <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-tr from-white/0 via-white/30 to-white/0 -rotate-45 group-hover:translate-x-full transition-transform duration-1000"></div>
                                </div>

                                <div className="relative z-10 flex flex-col flex-grow">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="size-8 rounded-lg bg-slate-900 text-white flex items-center justify-center group-hover:bg-cyan-500 transition-colors duration-300">
                                            <span className="material-symbols-outlined text-[18px]">{card.icon}</span>
                                        </div>
                                        <h3 className="text-lg font-black text-slate-900 tracking-tight group-hover:text-cyan-600 transition-colors">
                                            {card.title}
                                        </h3>
                                    </div>

                                    <p className="text-slate-500 text-[13px] leading-relaxed mb-6 font-medium line-clamp-2">
                                        {card.desc}
                                    </p>

                                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-50">
                                        <div className="flex items-center gap-2 group/btn">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-900 transition-colors">Ətraflı</span>
                                            <div className="size-6 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all duration-300">
                                                <span className="material-symbols-outlined text-[14px]">north_east</span>
                                            </div>
                                        </div>

                                        <span className="text-3xl font-black text-slate-50 group-hover:text-cyan-100 transition-colors select-none italic">
                                            0{idx + 1}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* DOCTORS GRID */}
            < section className="py-16 bg-surface-50 border-y border-slate-200" >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-6">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">{content.doctors.title}</h2>
                            <p className="text-slate-500 text-lg">{content.doctors.subtitle}</p>
                        </div>
                        <Link
                            href={`/${locale}/doctors`}
                            className="flex items-center gap-2 text-cyan-700 font-bold hover:text-cyan-900 transition-colors uppercase text-sm tracking-wide bg-white px-6 py-3 rounded-xl border border-slate-200 shadow-sm hover:shadow-md cursor-pointer"
                        >
                            {content.doctors.viewAll}
                            <span className="material-symbols-outlined text-lg">arrow_forward</span>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {(content.doctors.cards as any[]).map((doc, idx) => (
                            <div key={idx} className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-lg shadow-slate-100/50 hover:shadow-2xl hover:shadow-slate-200/60 hover:-translate-y-2 transition-all duration-500 group cursor-pointer">
                                {/* Image Container */}
                                <div className="aspect-[4/5] overflow-hidden relative">
                                    <img
                                        alt={doc.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                        src={doc.img}
                                    />
                                    {/* Premium Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>

                                    {/* Top Badge - Rating */}
                                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-2.5 py-1.5 rounded-xl flex items-center gap-1 shadow-lg">
                                        <span className="material-symbols-outlined text-amber-500 text-[16px]">star</span>
                                        <span className="text-sm font-black text-slate-900">{doc.rating}</span>
                                        <span className="text-[10px] text-slate-400">({doc.reviews})</span>
                                    </div>

                                    {/* Bottom Badge - Verified */}
                                    <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-lg">
                                        <span className="material-symbols-outlined text-cyan-500 text-[16px]">verified</span>
                                        <span className="text-[10px] font-bold text-slate-700">MedPlus Verified</span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    {/* Specialty Badge */}
                                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${doc.bgColor} ${doc.color} text-[10px] font-black uppercase tracking-wider mb-3`}>
                                        <span className="material-symbols-outlined text-[14px]">{doc.icon}</span>
                                        {doc.spec}
                                    </div>

                                    {/* Name */}
                                    <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight">{doc.name}</h3>

                                    {/* Stats Row */}
                                    <div className="flex items-center gap-4 mb-4 text-xs text-slate-500">
                                        <div className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[14px]">work_history</span>
                                            <span className="font-semibold">{doc.experience} {isRu ? 'лет' : 'il'}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[14px]">location_on</span>
                                            <span className="font-medium truncate">{doc.location}</span>
                                        </div>
                                    </div>

                                    {/* CTA Button */}
                                    <Link
                                        href={`/${locale}/doctors/${idx + 1}`}
                                        className="w-full py-3 rounded-xl bg-slate-900 text-white text-sm font-bold group-hover:bg-cyan-600 transition-colors duration-300 flex items-center justify-center gap-2 cursor-pointer"
                                    >
                                        {content.hero.bookButton}
                                        <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section >

            {/* SPECIALTIES SECTION - SYMMETRIC PREMIUM DESIGN */}
            <section className="py-24 relative overflow-hidden bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    {/* Header */}
                    <div className="text-center mb-16 max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-50 border border-cyan-100 w-fit mb-6 mx-auto">
                            <span className="material-symbols-outlined text-cyan-600 text-[18px]">medical_services</span>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-700">
                                {isRu ? 'Направления' : 'Tibbi İxtisaslar'}
                            </span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
                            {isRu ? 'Выберите специализацию' : 'İxtisas seçin'}
                        </h2>
                        <p className="text-lg text-slate-500 leading-relaxed font-medium">
                            {isRu ? 'Найдите нужного специалиста среди ведущих врачей Азербайджана' : 'Azərbaycanın aparıcı həkimləri arasından lazımi mütəxəssisi tapın'}
                        </p>
                    </div>

                    {/* Symmetric Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { name: isRu ? 'Кардиология' : 'Kardiologiya', icon: 'cardiology', desc: isRu ? 'Сердечно-сосудистая система' : 'Ürək və damar sistemi', count: 48, color: 'cyan' },
                            { name: isRu ? 'Неврология' : 'Nevrologiya', icon: 'neurology', desc: isRu ? 'Нервная система' : 'Sinir sistemi', count: 35, color: 'blue' },
                            { name: isRu ? 'Педиатрия' : 'Pediatriya', icon: 'child_care', desc: isRu ? 'Детское здоровье' : 'Uşaq sağlamlığı', count: 62, color: 'emerald' },
                            { name: isRu ? 'Стоматология' : 'Stomatologiya', icon: 'dentistry', desc: isRu ? 'Здоровье зубов' : 'Diş sağlamlığı', count: 87, color: 'sky' },
                            { name: isRu ? 'Дерматология' : 'Dermatologiya', icon: 'dermatology', desc: isRu ? 'Кожные заболевания' : 'Dəri xəstəlikləri', count: 41, color: 'rose' },
                            { name: isRu ? 'Офтальмология' : 'Oftalmologiya', icon: 'visibility', desc: isRu ? 'Здоровье глаз' : 'Göz sağlamlığı', count: 29, color: 'indigo' },
                            { name: isRu ? 'Гинекология' : 'Ginekologiya', icon: 'female', desc: isRu ? 'Женское здоровье' : 'Qadın sağlamlığı', count: 54, color: 'pink' },
                            { name: isRu ? 'Ортопедия' : 'Ortopediya', icon: 'skeleton', desc: isRu ? 'Опорно-двигательный аппарат' : 'Sümük və oynaqlar', count: 31, color: 'amber' },
                        ].map((cat, idx) => (
                            <Link
                                key={idx}
                                href={`/${locale}/doctors?specialty=${cat.name}`}
                                className="group relative bg-white rounded-[2rem] p-8 border border-slate-100 hover:border-cyan-200 shadow-sm hover:shadow-xl hover:shadow-cyan-500/5 transition-all duration-300 flex flex-col items-center text-center cursor-pointer"
                            >
                                <div className={`w-16 h-16 rounded-2xl bg-${cat.color}-50 text-${cat.color}-600 flex items-center justify-center mb-6 group-hover:bg-cyan-500 group-hover:text-white transition-all transform group-hover:rotate-6 group-hover:scale-110`}>
                                    <span className="material-symbols-outlined text-[32px]">{cat.icon}</span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2 tracking-tight group-hover:text-cyan-600 transition-colors">
                                    {cat.name}
                                </h3>
                                <p className="text-sm text-slate-400 mb-6 leading-relaxed font-medium">
                                    {cat.desc}
                                </p>
                                <div className="mt-auto pt-6 border-t border-slate-50 w-full flex items-center justify-between">
                                    <span className="text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-cyan-600 transition-colors">
                                        {cat.count} {isRu ? 'врачей' : 'həkim'}
                                    </span>
                                    <span className="material-symbols-outlined text-slate-300 group-hover:text-cyan-500 group-hover:translate-x-1 transition-all text-[20px]">arrow_forward</span>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* View All */}
                    <div className="text-center mt-16">
                        <Link
                            href={`/${locale}/doctors`}
                            className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-slate-900 text-white font-black hover:bg-cyan-600 shadow-xl shadow-slate-900/10 hover:shadow-cyan-500/30 transition-all active:scale-95 group"
                        >
                            <span>{isRu ? 'Все Специальности' : 'Bütün İxtisaslar'}</span>
                            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* APP DOWNLOAD - PREMIUM DARK DESIGN */}
            <section className="py-24 overflow-hidden relative border-y border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-[3rem] p-10 md:p-20 relative overflow-hidden shadow-2xl">
                        {/* Premium Glows */}
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none"></div>

                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <div className="relative z-10">
                                {/* Badge */}
                                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 backdrop-blur border border-white/20 mb-8">
                                    <div className="size-2 rounded-full bg-cyan-400 animate-pulse"></div>
                                    <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/80">MOBİL TƏTBİQ</span>
                                </div>

                                <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-8 leading-[1.05] tracking-tight">
                                    {content.app.headline}
                                </h2>

                                <p className="text-slate-400 text-lg md:text-xl mb-12 max-w-lg leading-relaxed italic">
                                    {content.app.desc}
                                </p>

                                {/* App Store Buttons */}
                                <div className="flex flex-wrap gap-4">
                                    <a href="#" className="group bg-white hover:bg-slate-50 px-8 py-5 rounded-2xl flex items-center gap-4 transition-all hover:scale-105 active:scale-95 shadow-xl">
                                        <Apple className="size-8 text-slate-900" />
                                        <div className="text-slate-900 text-left">
                                            <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider leading-none mb-1">Download on</div>
                                            <div className="font-black text-xl leading-none">App Store</div>
                                        </div>
                                    </a>
                                    <a href="#" className="group bg-white/10 backdrop-blur hover:bg-white/20 border border-white/10 px-8 py-5 rounded-2xl flex items-center gap-4 transition-all hover:scale-105 active:scale-95">
                                        <Smartphone className="size-8 text-white" />
                                        <div className="text-white text-left">
                                            <div className="text-[10px] uppercase font-bold text-white/50 tracking-wider leading-none mb-1">Get it on</div>
                                            <div className="font-black text-xl leading-none">Google Play</div>
                                        </div>
                                    </a>
                                </div>
                            </div>

                            {/* App Preview Mockup */}
                            <div className="relative hidden lg:flex justify-center">
                                {/* The Phone Mockup */}
                                <div className="relative w-80 h-[600px] bg-slate-900 rounded-[3.5rem] p-3 border border-white/10 shadow-3xl rotate-2">
                                    <div className="w-full h-full bg-white rounded-[2.8rem] overflow-hidden flex flex-col p-8">
                                        {/* Status Bar App Area */}
                                        <div className="flex justify-between items-center mb-12">
                                            <div className="size-12 rounded-2xl bg-cyan-500 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30">
                                                <span className="material-symbols-outlined text-[24px]">emergency</span>
                                            </div>
                                            <div className="size-8 rounded-full bg-slate-100 flex items-center justify-center">
                                                <div className="size-1.5 rounded-full bg-slate-300"></div>
                                            </div>
                                        </div>
                                        {/* Content Placeholder */}
                                        <div className="space-y-8">
                                            <div className="h-4 bg-slate-100 w-2/3 rounded-full"></div>
                                            <div className="h-40 bg-cyan-50/50 rounded-2xl border border-cyan-100/50"></div>
                                            <div className="space-y-3">
                                                <div className="h-3 bg-slate-50 w-full rounded-full"></div>
                                                <div className="h-3 bg-slate-50 w-5/6 rounded-full"></div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="h-24 bg-slate-50 rounded-2xl"></div>
                                                <div className="h-24 bg-slate-50 rounded-2xl"></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Success Notification Card - Floating */}
                                    <div className="absolute -left-16 top-32 w-56 bg-white/95 backdrop-blur px-5 py-4 rounded-2xl shadow-2xl animate-float border border-slate-100">
                                        <div className="flex items-center gap-4">
                                            <div className="size-11 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-sm">
                                                <span className="material-symbols-outlined text-[22px]">check_circle</span>
                                            </div>
                                            <div className="text-left leading-tight">
                                                <p className="text-[10px] font-black uppercase text-emerald-600 tracking-wider mb-0.5">Confirmed</p>
                                                <p className="font-bold text-slate-900">Booking Success</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <style jsx>{`
                    .animate-float {
                        animation: float 6s ease-in-out infinite;
                    }
                    @keyframes float {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-15px); }
                    }
                `}</style>
            </section>
        </main >
    );
}
