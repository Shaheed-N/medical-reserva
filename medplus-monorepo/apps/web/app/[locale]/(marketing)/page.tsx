"use client";

import Link from 'next/link';
import { use } from 'react';

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
                    illustration: 'https://images.unsplash.com/photo-1666214280557-f1b5022eb634?auto=format&fit=crop&w=800&q=80'
                },
                {
                    title: isRu ? 'Электронная Карта' : 'Elektron Tibb Kartı',
                    desc: isRu ? 'История болезни, рецепты и анализы всегда под рукой в вашем телефоне.' : 'Xəstəlik tarixçəsi, reseptlər və analizlər telefonunuzda.',
                    icon: 'description',
                    illustration: 'https://images.unsplash.com/photo-1576091160550-217359f4762c?auto=format&fit=crop&w=800&q=80'
                },
                {
                    title: isRu ? 'Видео Прием' : 'Video Qəbul',
                    desc: isRu ? 'Консультации с ведущими специалистами страны по video-связи.' : 'Ölkənin aparıcı mütəxəssisləri ilə video formatda konsultasiya.',
                    icon: 'videocam',
                    illustration: 'https://images.unsplash.com/photo-1581056771107-24ca5f0322d4?auto=format&fit=crop&w=800&q=80'
                }
            ]
        },
        doctors: {
            title: isRu ? 'Ведущие Специалисты' : 'Aparıcı Mütəxəssislər',
            subtitle: isRu ? 'Врачи, которым доверяют тысячи пациентов.' : 'Minlərlə pasiyentin güvəndiyi həkimlər.',
            viewAll: isRu ? 'Все Врачи' : 'Bütün Həkimlər',
            cards: [
                {
                    name: isRu ? 'Др. Эльдар Алиев' : 'Dr. Eldar Əliyev',
                    spec: isRu ? 'Кардиолог' : 'Kardioloq',
                    desc: isRu ? 'Эксперт высшей категории' : 'Ali dərəcəli ekspert',
                    location: 'Bakı Medical Plaza',
                    icon: 'cardiology', // Material Symbol
                    color: 'text-cyan-600',
                    img: 'https://images.unsplash.com/photo-1550831107-1553da8c8464?auto=format&fit=crop&w=800&q=80'
                },
                {
                    name: isRu ? 'Др. Лейла Мамедова' : 'Dr. Leyla Məmmədova',
                    spec: isRu ? 'Педиатр' : 'Pediatr',
                    desc: isRu ? 'Забота о здоровье детей' : 'Uşaq sağlamlığı mütəxəssisi',
                    location: 'Bona Dea Hospital',
                    icon: 'child_care',
                    color: 'text-emerald-600',
                    img: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=800&q=80'
                },
                {
                    name: isRu ? 'Др. Рашад Гасанов' : 'Dr. Rəşad Həsənov',
                    spec: isRu ? 'Невропатолог' : 'Nevropatoloq',
                    desc: isRu ? 'Современные методы лечения' : 'Müasir müalicə üsulları',
                    location: 'Mərkəzi Klinika',
                    icon: 'neurology',
                    color: 'text-purple-600',
                    img: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=800&q=80'
                },
                {
                    name: isRu ? 'Др. Нигяр Гулиева' : 'Dr. Nigar Quliyeva',
                    spec: isRu ? 'Дерматолог' : 'Dermatoloq',
                    desc: isRu ? 'Эстетическая медицина' : 'Estetik tibb',
                    location: 'Grand Hospital',
                    icon: 'dermatology',
                    color: 'text-pink-600',
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
            {/* Background Grid */}
            <div className="fixed inset-0 z-[-1] bg-white">
                <div className="absolute inset-0 bg-grid-slate bg-[size:40px_40px]"></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-gradient-radial-top pointer-events-none"></div>
            </div>

            {/* HERO SECTION */}
            <section className="relative pt-4 pb-20 lg:pt-6 lg:pb-32 overflow-hidden">
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
                        <div className="flex-[1.2] relative group px-8 py-4 hover:bg-slate-50 transition-colors rounded-xl xl:rounded-l-[2.5rem] cursor-pointer">
                            <div className="flex items-center gap-5 h-full">
                                <div className="bg-cyan-50 text-cyan-600 p-3.5 rounded-2xl">
                                    <span className="material-symbols-outlined text-[24px]">location_on</span>
                                </div>
                                <div className="flex flex-col w-full">
                                    <span className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{content.search.location}</span>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[17px] font-bold text-slate-800">{content.search.locationPlaceholder}</span>
                                        <span className="material-symbols-outlined text-slate-300 text-[20px]">expand_more</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Condition Field */}
                        <div className="flex-[1.2] relative group px-8 py-4 hover:bg-slate-50 transition-colors cursor-pointer">
                            <div className="flex items-center gap-5 h-full">
                                <div className="bg-cyan-50 text-cyan-600 p-3.5 rounded-2xl">
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
                        </div>

                        {/* Insurance Field */}
                        <div className="flex-1 relative group px-8 py-4 hover:bg-slate-50 transition-colors cursor-pointer">
                            <div className="flex items-center gap-5 h-full">
                                <div className="bg-cyan-50 text-cyan-600 p-3.5 rounded-2xl">
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
                        </div>

                        {/* Date Field */}
                        <div className="flex-1 relative group px-8 py-4 hover:bg-slate-50 transition-colors cursor-pointer">
                            <div className="flex items-center gap-5 h-full">
                                <div className="bg-cyan-50 text-cyan-600 p-3.5 rounded-2xl">
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
                        </div>

                        {/* Search Button */}
                        <div className="p-3 flex items-center">
                            <button className="h-[68px] w-full xl:w-auto px-12 rounded-[2rem] bg-cyan-500 hover:bg-cyan-400 text-white font-black shadow-xl shadow-cyan-200 transition-all flex items-center justify-center gap-4 whitespace-nowrap">
                                <span className="text-lg">{content.search.button}</span>
                                <span className="material-symbols-outlined text-[24px]">north_east</span>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-12 relative overflow-hidden bg-white border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-10 max-w-2xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-cyan-50 border border-cyan-100 w-fit mb-4">
                            <div className="size-1 rounded-full bg-cyan-500 animate-pulse"></div>
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-cyan-700">{content.services.badge}</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tighter leading-tight">
                            {content.services.title}
                        </h2>
                        <p className="text-slate-500 text-base leading-relaxed font-medium px-4">
                            {content.services.subtitle}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {(content.services.cards as any[]).map((card, idx) => (
                            <div
                                key={idx}
                                className="group relative p-6 rounded-[2.5rem] bg-white border border-slate-100 hover:border-cyan-100 transition-all duration-500 hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] hover:-translate-y-1 cursor-pointer overflow-hidden flex flex-col"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-50/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                <div className="relative z-10 w-full aspect-[4/3] mb-4 flex items-center justify-center">
                                    <img
                                        src={card.illustration}
                                        alt={card.title}
                                        className="w-full h-full object-cover rounded-2xl drop-shadow-[0_20px_40px_rgba(0,0,0,0.05)] group-hover:scale-105 transition-all duration-700 ease-out"
                                    />
                                </div>

                                <div className="relative z-10 flex flex-col flex-grow">
                                    <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight group-hover:text-cyan-600 transition-colors">
                                        {card.title}
                                    </h3>
                                    <p className="text-slate-500 text-sm leading-relaxed mb-6 font-medium line-clamp-2">
                                        {card.desc}
                                    </p>

                                    <div className="mt-auto flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-slate-900 font-black text-[10px] uppercase tracking-widest group/btn overflow-hidden">
                                            <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">Ətraflı</span>
                                            <div className="size-6 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all duration-300">
                                                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                                            </div>
                                        </div>
                                        <span className="text-2xl font-black text-slate-50 group-hover:text-cyan-100/50 transition-colors select-none">
                                            0{idx + 1}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* DOCTORS GRID - PREMIUM REDESIGN */}
            <section className="py-24 bg-slate-50 relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-100/20 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-slate-200/20 rounded-full blur-[120px] pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center lg:items-end justify-between mb-20 gap-10">
                        <div className="max-w-2xl text-center lg:text-left">
                            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white shadow-sm border border-slate-200 mb-6 group cursor-default shadow-indigo-100/50">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="size-6 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-sm">
                                            <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="mini-doctor" />
                                        </div>
                                    ))}
                                </div>
                                <div className="w-px h-4 bg-slate-200 ml-1"></div>
                                <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-600">
                                    {isRu ? '50,000+ Довольных пациентов' : '50,000+ Məmnun pasiyent'}
                                </span>
                            </div>

                            <h2 className="text-5xl md:text-8xl font-black text-slate-900 mb-8 tracking-tighter leading-[0.85]">
                                {content.doctors.title}
                            </h2>
                            <p className="text-slate-500 text-xl font-medium leading-relaxed max-w-xl">
                                {content.doctors.subtitle}
                            </p>
                        </div>

                        <div className="flex flex-col items-center lg:items-end gap-6 text-center lg:text-right">
                            <div className="flex gap-12">
                                <div>
                                    <div className="text-4xl font-black text-slate-900 leading-none">1.2k+</div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">{isRu ? 'Врачей' : 'Həkim'}</div>
                                </div>
                                <div>
                                    <div className="text-4xl font-black text-slate-900 leading-none">45+</div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">{isRu ? 'Клиник' : 'Klinika'}</div>
                                </div>
                                <div>
                                    <div className="text-4xl font-black text-slate-900 leading-none">24/7</div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">{isRu ? 'Поддержка' : 'Dəstək'}</div>
                                </div>
                            </div>

                            <Link href={`/${locale}/doctors`}>
                                <button className="group relative flex items-center gap-4 px-10 py-5 rounded-[2rem] bg-slate-900 text-white font-black uppercase text-[10px] tracking-[0.3em] overflow-hidden transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)]">
                                    <span className="relative z-10">{content.doctors.viewAll}</span>
                                    <div className="relative z-10 size-6 rounded-full bg-cyan-500 flex items-center justify-center transition-all duration-500 group-hover:rotate-45 group-hover:bg-white group-hover:text-slate-900">
                                        <span className="material-symbols-outlined text-[16px] font-black">arrow_outward</span>
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                </button>
                            </Link>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {content.doctors.cards.map((doc, idx) => (
                            <div
                                key={idx}
                                className="group relative bg-white rounded-[3rem] overflow-hidden border border-slate-100 hover:border-cyan-200 transition-all duration-500 hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-2 cursor-pointer flex flex-col"
                            >
                                {/* Image Container */}
                                <div className="aspect-[4/5] overflow-hidden relative bg-slate-100">
                                    <img
                                        alt={doc.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        src={doc.img}
                                    />

                                    {/* Glass Overlay on Hover */}
                                    <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors duration-500"></div>

                                    {/* Verification Badge - Premium Style */}
                                    <div className="absolute top-4 right-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                        <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl flex items-center gap-2 shadow-2xl border border-white/20">
                                            <div className="size-5 rounded-full bg-cyan-500 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-white text-[12px] font-black">check</span>
                                            </div>
                                            <span className="text-[10px] font-black text-slate-900 uppercase tracking-wider">Təsdiqlənib</span>
                                        </div>
                                    </div>

                                    {/* Bottom Info Overlay */}
                                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white/80 to-transparent">
                                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white shadow-sm border border-slate-100 mb-3 ${doc.color} transform group-hover:-translate-y-1 transition-transform`}>
                                            <span className="material-symbols-outlined text-[16px] font-medium">{doc.icon}</span>
                                            <span className="text-[10px] font-black uppercase tracking-wider">{doc.spec}</span>
                                        </div>
                                        <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-1 group-hover:text-cyan-600 transition-colors">
                                            {doc.name}
                                        </h3>
                                        <p className="text-[11px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-widest">
                                            <span className="material-symbols-outlined text-[14px]">apartment</span>
                                            {doc.location}
                                        </p>
                                    </div>
                                </div>

                                {/* Interactive Button Area */}
                                <div className="p-6 pt-0 mt-auto bg-white">
                                    <button className="w-full py-4 rounded-[1.5rem] bg-slate-900 text-white text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-slate-200 group-hover:bg-cyan-600 group-hover:shadow-cyan-200 transition-all duration-300">
                                        {content.hero.bookButton}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-20 flex justify-center">
                        <Link href={`/${locale}/doctors`}>
                            <button className="group flex items-center gap-4 px-10 py-5 rounded-[2rem] bg-white border border-slate-200 text-slate-900 font-black uppercase text-xs tracking-[0.3em] hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-500 shadow-xl shadow-slate-200/50">
                                {content.doctors.viewAll}
                                <div className="size-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-white transition-all duration-500 group-hover:rotate-45">
                                    <span className="material-symbols-outlined text-[20px]">arrow_outward</span>
                                </div>
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* APP DOWNLOAD */}
            < section className="py-24 bg-white overflow-hidden relative" >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="bg-slate-900 rounded-[2.5rem] p-10 md:p-16 relative overflow-hidden shadow-2xl">
                        {/* Background Gradients */}
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-600/30 rounded-full blur-[100px] pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] pointer-events-none"></div>

                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <div className="relative z-10">
                                <span className="inline-block py-1 px-3 rounded-lg bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold tracking-wider uppercase mb-6 border border-cyan-500/30">
                                    {content.app.title}
                                </span>
                                <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                                    {content.app.headline}
                                </h2>
                                <p className="text-slate-400 text-lg mb-10 max-w-lg leading-relaxed">
                                    {content.app.desc}
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    <button className="bg-white text-slate-900 px-6 py-3 rounded-xl flex items-center gap-3 hover:bg-slate-100 transition-colors">
                                        <span className="material-symbols-outlined text-3xl">ad_units</span>
                                        <div className="text-left">
                                            <div className="text-[10px] uppercase font-bold text-slate-500">{content.app.apple}</div>
                                            <div className="font-bold text-sm leading-none">App Store</div>
                                        </div>
                                    </button>
                                    <button className="bg-slate-800 border border-slate-700 text-white px-6 py-3 rounded-xl flex items-center gap-3 hover:bg-slate-700 transition-colors">
                                        <span className="material-symbols-outlined text-3xl">android</span>
                                        <div className="text-left">
                                            <div className="text-[10px] uppercase font-bold text-slate-400">{content.app.google}</div>
                                            <div className="font-bold text-sm leading-none">Google Play</div>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            <div className="relative hidden lg:block perspective-1000">
                                <div className="relative z-10 transform rotate-y-[-10deg] rotate-x-[5deg] hover:rotate-0 transition-all duration-500">
                                    <img
                                        src="https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=600&q=80"
                                        alt="App Interface"
                                        className="rounded-[2rem] shadow-2xl border-8 border-slate-800 mx-auto w-72"
                                    />
                                    {/* Floating Element */}
                                    <div className="absolute top-1/2 -right-12 bg-white p-4 rounded-xl shadow-xl animate-float">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-green-100 p-2 rounded-full text-green-600">
                                                <span className="material-symbols-outlined">check_circle</span>
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-400 uppercase">Booking Confirmed</p>
                                                <p className="font-bold text-slate-900">Dr. Eldar Aliyev</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section >
        </main >
    );
}
