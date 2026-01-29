"use client";

import { useState, Suspense } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { useHospitals } from '@/lib/hooks';

function HospitalsList({ searchQuery, selectedCity, locale }: {
    searchQuery: string;
    selectedCity: string;
    locale: string;
}) {
    const isRu = locale === 'ru';
    const { data: hospitals, isLoading } = useHospitals();

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-96 bg-white rounded-3xl border border-slate-100"></div>)}
            </div>
        );
    }

    const filteredHospitals = (hospitals || []).filter(h => {
        const matchesSearch = h.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            h.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCity = selectedCity === 'all' || h.branches?.some(b => b.city?.toLowerCase() === selectedCity.toLowerCase());
        return matchesSearch && matchesCity && h.is_active;
    });

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <p className="text-slate-500 font-medium">
                    {isRu ? 'Найдено' : 'Tapıldı'}{' '}
                    <span className="text-slate-900 font-bold">{filteredHospitals.length}</span>{' '}
                    {isRu ? 'клиник' : 'klinika'}
                </p>
            </div>

            {filteredHospitals.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredHospitals.map((h) => {
                        const mainBranch = h.branches?.[0];
                        const city = mainBranch?.city || 'Bakı';
                        const address = mainBranch?.address_line1 || h.name;

                        return (
                            <Link
                                key={h.id}
                                href={`/${locale}/hospitals/${h.slug || h.id}`}
                                className="group block bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:border-cyan-200 transition-all duration-500 hover:-translate-y-1"
                            >
                                {/* Image Container */}
                                <div className="h-56 overflow-hidden relative">
                                    <img
                                        src={h.cover_image_url || h.logo_url || 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=800&q=80'}
                                        alt={h.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>

                                    {/* Rating badge */}
                                    <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-white/95 backdrop-blur-sm px-2.5 py-1.5 rounded-xl shadow-lg">
                                        <span className="material-symbols-outlined text-amber-500 text-[18px]">star</span>
                                        <span className="text-sm font-black text-slate-900">4.8</span>
                                    </div>

                                    {/* Verified badge */}
                                    <div className="absolute top-4 left-4 px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-sm text-cyan-600 flex items-center gap-1.5 shadow-lg">
                                        <span className="material-symbols-outlined text-[16px]">verified</span>
                                        <span className="text-[10px] font-bold uppercase tracking-wider">
                                            {isRu ? 'Верифицировано' : 'Təsdiqləndi'}
                                        </span>
                                    </div>

                                    {/* City */}
                                    <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white">
                                        <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                            <span className="material-symbols-outlined text-[18px]">location_on</span>
                                        </div>
                                        <span className="text-sm font-bold uppercase tracking-widest">{city}</span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-cyan-600 transition-colors mb-4 line-clamp-1 italic">
                                        {h.name}
                                    </h3>

                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-start gap-3 text-sm text-slate-500">
                                            <span className="material-symbols-outlined text-cyan-600 text-[20px] shrink-0">map</span>
                                            <span className="line-clamp-2 leading-relaxed">{address}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-slate-500">
                                            <span className="material-symbols-outlined text-cyan-600 text-[20px] shrink-0">call</span>
                                            <span className="font-mono">{h.contact_phone || '+994 12 000 00 00'}</span>
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="flex items-center justify-between pt-5 border-t border-slate-50">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-cyan-600 text-[18px]">corporate_fare</span>
                                                </div>
                                                <div>
                                                    <div className="text-xs font-bold text-slate-900 leading-none">{h.branches?.length || 1}</div>
                                                    <div className="text-[10px] text-slate-400 uppercase font-bold">{isRu ? 'филиал' : 'filial'}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-cyan-600 text-[18px]">group</span>
                                                </div>
                                                <div>
                                                    <div className="text-xs font-bold text-slate-900 leading-none">-</div>
                                                    <div className="text-[10px] text-slate-400 uppercase font-bold">{isRu ? 'врач' : 'həkim'}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center group-hover:bg-cyan-600 transition-all group-hover:translate-x-1 shadow-lg">
                                            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            ) : (
                <div className="bg-white p-20 rounded-3xl text-center border border-slate-100 shadow-sm">
                    <span className="material-symbols-outlined text-slate-200 text-[80px] mb-6">domain_disabled</span>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">
                        {isRu ? 'Клиники не найдены' : 'Klinika tapılmadı'}
                    </h3>
                    <p className="text-slate-500">
                        {isRu ? 'Измените параметры поиска' : 'Axtarış parametrlərini dəyişin'}
                    </p>
                </div>
            )}
        </div>
    );
}

export default function HospitalsPublicPage() {
    const params = useParams();
    const locale = params.locale as string || 'az';
    const isRu = locale === 'ru';

    const breadcrumbItems = [
        { label: isRu ? 'Клиники' : 'Klinikalar' }
    ];

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCity, setSelectedCity] = useState('all');

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
                    <div className="max-w-3xl mb-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-50 border border-cyan-100 w-fit mb-6">
                            <span className="material-symbols-outlined text-cyan-600 text-[18px]">domain</span>
                            <span className="text-xs font-bold uppercase tracking-widest text-cyan-700">
                                {isRu ? 'Официальные медицинские учреждения' : 'Rəsmi Tibb Müəssisələri'}
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium text-slate-900 leading-[1.1] tracking-tight mb-6">
                            {isRu ? 'Найдите подходящую' : 'Sizə uyğun'} <br />
                            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-cyan-400">
                                {isRu ? 'клинику или госпиталь' : 'klinikanı tapın'}
                            </span>
                        </h1>
                        <p className="text-xl text-slate-500 max-w-xl leading-relaxed">
                            {isRu
                                ? 'Списки лучших государственных и частных клиник Азербайджана с полной информацией.'
                                : 'Azərbaycanın ən yaxşı dövlət və özəl klinikalarının tam məlumatla siyahısı.'}
                        </p>
                    </div>

                    {/* Search & Filters */}
                    <div className="max-w-4xl bg-white p-3 rounded-[2rem] border border-slate-200 shadow-xl flex flex-col md:flex-row gap-2">
                        <div className="flex-[1.5] relative">
                            <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-[22px]">search</span>
                            <input
                                type="text"
                                placeholder={isRu ? 'Название клиники или адрес...' : 'Klinika adı və ya ünvan...'}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-14 pr-4 py-4 bg-slate-50 border-0 rounded-2xl text-base focus:ring-2 focus:ring-cyan-500/20 focus:bg-white outline-none transition-all text-slate-900"
                            />
                        </div>
                        <div className="flex-1 relative">
                            <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-[22px]">location_on</span>
                            <select
                                value={selectedCity}
                                onChange={(e) => setSelectedCity(e.target.value)}
                                className="w-full pl-14 pr-10 py-4 bg-slate-50 border-0 rounded-2xl text-base focus:ring-2 focus:ring-cyan-500/20 focus:bg-white outline-none appearance-none cursor-pointer transition-all text-slate-900"
                            >
                                <option value="all">{isRu ? 'Все города' : 'Bütün Şəhərlər'}</option>
                                <option value="Bakı">Bakı</option>
                                <option value="Gəncə">Gəncə</option>
                                <option value="Sumqayıt">Sumqayıt</option>
                            </select>
                            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none">expand_more</span>
                        </div>
                        <button className="px-10 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-cyan-600 shadow-lg shadow-slate-900/10 hover:shadow-cyan-500/30 transition-all duration-300 shrink-0">
                            {isRu ? 'Найти' : 'Axtar'}
                        </button>
                    </div>
                </div>
            </section>

            {/* Results Section */}
            <section className="py-16 bg-surface-50 border-b border-slate-100 min-h-[600px]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Suspense fallback={<div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
                        {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-96 bg-white rounded-3xl border border-slate-100"></div>)}
                    </div>}>
                        <HospitalsList
                            searchQuery={searchQuery}
                            selectedCity={selectedCity}
                            locale={locale}
                        />
                    </Suspense>
                </div>
            </section>

            {/* Map Interaction Section */}
            <section className="py-20 lg:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-[3rem] p-10 md:p-20 relative overflow-hidden shadow-2xl">
                        {/* Glow Effects */}
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none"></div>

                        <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto">
                            <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-[2rem] flex items-center justify-center mb-10 border border-white/20">
                                <span className="material-symbols-outlined text-white text-[48px]">map</span>
                            </div>
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                                {isRu ? 'Интерактивная карта клиник' : 'İnteraktiv Klinikalar Xəritəsi'}
                            </h2>
                            <p className="text-slate-400 text-lg md:text-xl mb-12 leading-relaxed">
                                {isRu
                                    ? 'Найдите ближайшее медицинское учреждение в вашем районе и посмотрите маршрут.'
                                    : 'Ərazinizdəki ən yaxın tibb müəssisəsini tapın və marşrutu görün.'}
                            </p>
                            <div className="flex flex-wrap justify-center gap-4 w-full">
                                <button className="w-full sm:w-auto px-10 py-5 bg-cyan-500 text-white font-black rounded-2xl hover:bg-cyan-400 transition-all shadow-xl shadow-cyan-500/30 hover:scale-105 active:scale-95">
                                    {isRu ? 'Открыть карту' : 'Xəritəni Aç'}
                                </button>
                                <button className="w-full sm:w-auto px-10 py-5 bg-white/5 backdrop-blur text-white font-bold rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
                                    {isRu ? 'Ближайшие ко мне' : 'Mənə ən yaxın olanlar'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
