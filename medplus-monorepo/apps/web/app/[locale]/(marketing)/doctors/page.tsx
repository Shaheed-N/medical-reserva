"use client";

import { useState, useTransition, Suspense } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { useDoctors } from '@/lib/hooks';

const specialties = [
    { value: 'all', label: 'Bütün İxtisaslar' },
    { value: 'cardiology', label: 'Kardiologiya' },
    { value: 'neurology', label: 'Nevrologiya' },
    { value: 'pediatrics', label: 'Pediatriya' },
    { value: 'orthopedics', label: 'Ortopediya' },
    { value: 'dermatology', label: 'Dermatologiya' },
    { value: 'general-medicine', label: 'Ümumi praktika' },
];

function DoctorsList({ searchQuery, selectedSpecialty, hospitalFilter, locale }: {
    searchQuery: string;
    selectedSpecialty: string;
    hospitalFilter: string | null;
    locale: string;
}) {
    const isRu = locale === 'ru';
    const { data: doctors, isLoading, error } = useDoctors({
        hospitalId: hospitalFilter || undefined,
        specialty: selectedSpecialty !== 'all' ? selectedSpecialty : undefined,
        search: searchQuery || undefined
    });

    console.log('Doctors Data:', { doctors, isLoading, error, filters: { hospitalFilter, selectedSpecialty, searchQuery } });
    if (isLoading) {
        return (
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-64 bg-white rounded-3xl border border-slate-100"></div>)}
            </div>
        );
    }

    const filteredDoctors = (doctors || []).filter(doc => {
        const fullName = doc.user?.full_name || '';
        const matchesSearch = fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.specialties?.some((s: string) => s.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesSpecialty = selectedSpecialty === 'all' ||
            doc.specialties?.some((s: string) => s.toLowerCase().includes(selectedSpecialty.toLowerCase()));
        const matchesHospital = !hospitalFilter || doc.hospital_id === hospitalFilter;
        return matchesSearch && matchesSpecialty && matchesHospital && doc.is_active;
    });

    return (
        <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between">
                <p className="text-slate-500 font-medium">
                    {isRu ? 'Найдено' : 'Tapıldı'}{' '}
                    <span className="text-slate-900 font-bold">{filteredDoctors.length}</span>{' '}
                    {isRu ? 'врачей' : 'həkim'}
                </p>
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-slate-400">{isRu ? 'Сортировка:' : 'Sıralama:'}</span>
                    <select className="bg-transparent font-bold text-slate-900 border-0 focus:ring-0 cursor-pointer">
                        <option>{isRu ? 'По популярности' : 'Populyarlıq'}</option>
                        <option>{isRu ? 'По рейтингу' : 'Reytinq'}</option>
                        <option>{isRu ? 'По стажу' : 'Təcrübə'}</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {filteredDoctors.map((doc: any) => {
                    const user = Array.isArray(doc.user) ? doc.user[0] : doc.user;
                    const fullName = user?.full_name || 'Həkim';
                    const specialty = doc.specialties?.[0] || 'General';
                    const hospitalName = doc.branches?.[0]?.branch?.hospital?.name || 'Hospital';

                    return (
                        <Link
                            key={doc.id}
                            href={`/${locale}/doctors/${doc.id}`}
                            className="group relative bg-white rounded-3xl border border-slate-100 p-4 md:p-5 flex flex-col md:flex-row gap-6 hover:shadow-2xl hover:border-cyan-200 transition-all duration-500"
                        >
                            {/* Profile Photo */}
                            <div className="w-32 h-32 md:w-40 md:h-44 shrink-0 rounded-2xl overflow-hidden relative shadow-lg">
                                <img
                                    src={doc.profile_image_url || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80'}
                                    alt={fullName}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
                                <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-md">
                                    <span className="material-symbols-outlined text-amber-500 text-[14px]">star</span>
                                    <span className="text-xs font-black text-slate-900">4.8</span>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="flex-1 flex flex-col py-1">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-cyan-600 transition-colors mb-1">
                                            {fullName}
                                        </h3>
                                        <div className="flex items-center gap-2">
                                            <span className="text-cyan-600 font-bold text-sm uppercase tracking-wider">{specialty}</span>
                                            <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                                            <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold uppercase">
                                                <span className="material-symbols-outlined text-[14px]">verified</span>
                                                {isRu ? 'Верифицирован' : 'Təsdiqləndi'}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="hidden lg:flex items-center gap-4">
                                        <div className="text-right">
                                            <div className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">{isRu ? 'Стаж' : 'Təcrübə'}</div>
                                            <div className="text-sm font-black text-slate-900">{doc.years_of_experience || 5} {isRu ? 'лет' : 'il'}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-3 text-sm text-slate-500">
                                        <span className="material-symbols-outlined text-cyan-500 text-[20px]">corporate_fare</span>
                                        <span className="font-medium">{hospitalName}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <span className="material-symbols-outlined text-emerald-500 text-[20px]">calendar_today</span>
                                        <span className="text-emerald-600 font-black">{isRu ? 'Доступен для записи' : 'Qəbul üçün əlçatandır'}</span>
                                    </div>
                                </div>

                                <div className="mt-auto flex items-center justify-between">
                                    <div className="flex gap-2">
                                        <span className="px-3 py-1.5 rounded-lg bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-wider">Video Qəbul</span>
                                        <span className="px-3 py-1.5 rounded-lg bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-wider">Sığorta</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-cyan-600 font-bold text-sm uppercase group-hover:gap-4 transition-all">
                                        {isRu ? 'Профиль врача' : 'Həkimin profili'}
                                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    )
                })}
            </div>

            {filteredDoctors.length === 0 && (
                <div className="bg-white p-20 rounded-3xl text-center border border-slate-100">
                    <span className="material-symbols-outlined text-slate-200 text-[80px] mb-6">person_search</span>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">
                        {isRu ? 'Врачи не найдены' : 'Həkim tapılmadı'}
                    </h3>
                    <p className="text-slate-500">
                        {isRu ? 'Попробуйте изменить параметры поиска' : 'Axtarış parametrlərini dəyişin'}
                    </p>
                </div>
            )}
        </div>
    );
}

function DoctorsContent() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const locale = params.locale as string || 'az';
    const isRu = locale === 'ru';

    const breadcrumbItems = [
        { label: isRu ? 'Врачи' : 'Həkimlər' }
    ];

    const specialtyFilter = searchParams.get('specialty');
    const hospitalFilter = searchParams.get('hospital');

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSpecialty, setSelectedSpecialty] = useState(specialtyFilter || 'all');
    const [selectedLocation, setSelectedLocation] = useState('all');
    const [, startTransition] = useTransition();

    const handleSpecialtyChange = (value: string) => {
        setSelectedSpecialty(value);
        startTransition(() => {
            const params = new URLSearchParams(searchParams.toString());
            if (value === 'all') {
                params.delete('specialty');
            } else {
                params.set('specialty', value);
            }
            router.push(`?${params.toString()}`, { scroll: false });
        });
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <Breadcrumbs items={breadcrumbItems} locale={locale} />
            {/* Header Section */}
            <div className="max-w-3xl mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-50 border border-cyan-100 w-fit mb-6">
                    <span className="material-symbols-outlined text-cyan-600 text-[18px]">stethoscope</span>
                    <span className="text-xs font-bold uppercase tracking-widest text-cyan-700">
                        {isRu ? 'Профессиональные врачи' : 'Peşəkar Həkimlər'}
                    </span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-7xl font-medium text-slate-900 leading-[1.05] tracking-tight mb-6">
                    {isRu ? 'Найдите своего' : 'Sizin üçün'} <br />
                    <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-cyan-400">
                        {isRu ? 'идеального доктора' : 'mükəmməl həkim'}
                    </span>
                </h1>
                <p className="text-xl text-slate-500 max-w-xl leading-relaxed">
                    {isRu
                        ? 'Записывайтесь к лучшим специалистам онлайн. Быстро, просто и надежно.'
                        : 'Ən yaxşı mütəxəssislərin qəbuluna onlayn yazılın. Sürətli, asan və etibarlı.'}
                </p>
            </div>

            {/* Premium Search Bar */}
            <div className="max-w-full bg-white p-2 rounded-[2.5rem] border border-slate-100 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] flex flex-col lg:flex-row gap-0 mb-16 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
                <div className="flex-[1.5] relative group px-6 py-4 hover:bg-slate-50 transition-all lg:rounded-l-[2.5rem]">
                    <div className="flex items-center gap-5">
                        <div className="bg-cyan-50 text-cyan-600 p-3 rounded-2xl">
                            <span className="material-symbols-outlined text-[24px]">search</span>
                        </div>
                        <div className="flex-1">
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{isRu ? 'Поиск' : 'Axtarış'}</div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={isRu ? 'Имя врача...' : 'Həkim adı...'}
                                className="w-full bg-transparent border-0 p-0 text-slate-900 font-bold placeholder:text-slate-300 focus:ring-0 text-lg"
                            />
                        </div>
                    </div>
                </div>
                <div className="flex-1 relative group px-6 py-4 hover:bg-slate-50 transition-all">
                    <div className="flex items-center gap-5">
                        <div className="bg-cyan-50 text-cyan-600 p-3 rounded-2xl">
                            <span className="material-symbols-outlined text-[24px]">medical_services</span>
                        </div>
                        <div className="flex-1">
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{isRu ? 'Специальность' : 'İxtisas'}</div>
                            <select
                                value={selectedSpecialty}
                                onChange={(e) => handleSpecialtyChange(e.target.value)}
                                className="w-full bg-transparent border-0 p-0 text-slate-900 font-bold focus:ring-0 text-lg appearance-none cursor-pointer"
                            >
                                {specialties.map(spec => (
                                    <option key={spec.value} value={spec.value}>{spec.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                <div className="flex-1 relative group px-6 py-4 hover:bg-slate-50 transition-all">
                    <div className="flex items-center gap-5">
                        <div className="bg-cyan-50 text-cyan-600 p-3 rounded-2xl">
                            <span className="material-symbols-outlined text-[24px]">location_on</span>
                        </div>
                        <div className="flex-1">
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{isRu ? 'Регион' : 'Region'}</div>
                            <select
                                value={selectedLocation}
                                onChange={(e) => setSelectedLocation(e.target.value)}
                                className="w-full bg-transparent border-0 p-0 text-slate-900 font-bold focus:ring-0 text-lg appearance-none cursor-pointer"
                            >
                                <option value="all">{isRu ? 'Все регионы' : 'Bütün Bölgələr'}</option>
                                <option value="baku">Bakı</option>
                                <option value="ganja">Gəncə</option>
                                <option value="sumqayıt">Sumqayıt</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="p-3 flex items-center">
                    <button className="h-[64px] w-full lg:w-auto px-12 rounded-2xl bg-slate-900 hover:bg-cyan-600 text-white font-black shadow-xl transition-all flex items-center justify-center gap-3">
                        {isRu ? 'Найти' : 'Axtar'}
                        <span className="material-symbols-outlined">search</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-20">
                {/* Sidebar Filters */}
                <aside className="space-y-6">
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm sticky top-24">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 text-sm">
                                <span className="material-symbols-outlined text-cyan-600 text-[20px]">tune</span>
                                {isRu ? 'Фильтры' : 'Filtrlər'}
                            </h3>
                            <button className="text-xs font-bold text-cyan-600 hover:text-cyan-700">{isRu ? 'Сбросить' : 'Sıfırla'}</button>
                        </div>

                        <div className="space-y-10">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block">
                                    {isRu ? 'Доступность' : 'Mövcudluq'}
                                </label>
                                <div className="space-y-4">
                                    {[
                                        { id: 'today', label: isRu ? 'Доступен сегодня' : 'Bu gün mövcuddur' },
                                        { id: 'tomorrow', label: isRu ? 'Доступен завтра' : 'Sabah mövcuddur' },
                                        { id: 'weekend', label: isRu ? 'В выходные' : 'Həftə sonu' }
                                    ].map((opt) => (
                                        <label key={opt.id} className="flex items-center gap-3 cursor-pointer group">
                                            <input type="checkbox" className="w-5 h-5 rounded-lg border-slate-200 text-cyan-600 focus:ring-cyan-500/20 transition-all" />
                                            <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">{opt.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block">
                                    {isRu ? 'Пол врача' : 'Cins'}
                                </label>
                                <div className="space-y-4">
                                    {[
                                        { id: 'male', label: isRu ? 'Мужчина' : 'Kişi' },
                                        { id: 'female', label: isRu ? 'Женщина' : 'Qadın' }
                                    ].map((opt) => (
                                        <label key={opt.id} className="flex items-center gap-3 cursor-pointer group">
                                            <input type="checkbox" className="w-5 h-5 rounded-lg border-slate-200 text-cyan-600 focus:ring-cyan-500/20 transition-all" />
                                            <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">{opt.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block">
                                    {isRu ? 'Клиника / Госпиталь' : 'Klinika / Xəstəxana'}
                                </label>
                                <div className="space-y-4">
                                    {[
                                        { id: '1', label: 'Mərkəzi Klinik Xəstəxana' },
                                        { id: '2', label: 'Şəhər Tibb Mərkəzi' },
                                        { id: '5', label: 'Dəri Sağlamlıq Mərkəzi' }
                                    ].map((opt) => (
                                        <label key={opt.id} className="flex items-center gap-3 cursor-pointer group">
                                            <input type="checkbox" className="w-5 h-5 rounded-lg border-slate-200 text-cyan-600 focus:ring-cyan-500/20 transition-all" />
                                            <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">{opt.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block">
                                    {isRu ? 'Страхование' : 'Sığorta'}
                                </label>
                                <div className="space-y-4">
                                    {['İcbari Tibbi Sığorta', 'PASHA Sığorta', 'ATESHGAH'].map((ins) => (
                                        <label key={ins} className="flex items-center gap-3 cursor-pointer group">
                                            <input type="checkbox" className="w-5 h-5 rounded-lg border-slate-200 text-cyan-600 focus:ring-cyan-500/20 transition-all" />
                                            <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">{ins}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Banner in Sidebar */}
                        <div className="mt-12 p-6 rounded-2xl bg-cyan-600 text-white relative overflow-hidden">
                            <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 rounded-full"></div>
                            <span className="material-symbols-outlined text-[32px] mb-4">support_agent</span>
                            <h4 className="font-bold mb-2">{isRu ? 'Нужна помощь?' : 'Kömək lazımdır?'}</h4>
                            <p className="text-white/80 text-xs mb-4 leading-relaxed">
                                {isRu ? 'Наши операторы помогут вам с выбором' : 'Operatorlarımız seçimdə sizə kömək edəcək'}
                            </p>
                            <a href="tel:*0000" className="text-sm font-black underline decoration-2 underline-offset-4 hover:text-white/90">*0000</a>
                        </div>
                    </div>
                </aside>

                <div className="lg:col-span-3">
                    <DoctorsList
                        searchQuery={searchQuery}
                        selectedSpecialty={selectedSpecialty}
                        hospitalFilter={hospitalFilter}
                        locale={locale}
                    />
                </div>
            </div>
        </div>
    );
}

export default function DoctorsPage() {
    return (
        <main className="bg-white text-slate-600 font-sans antialiased overflow-x-hidden pt-12">
            {/* Background - Clean Premium */}
            <div className="fixed inset-0 z-[-1] bg-white">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1000px] bg-gradient-radial-top pointer-events-none opacity-60"></div>
            </div>

            <Suspense fallback={
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="h-64 bg-slate-50 animate-pulse rounded-[3rem] mb-12"></div>
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        <div className="h-[600px] bg-slate-50 animate-pulse rounded-3xl"></div>
                        <div className="lg:col-span-3 space-y-4">
                            {[1, 2, 3, 4].map(i => <div key={i} className="h-44 bg-slate-50 animate-pulse rounded-3xl"></div>)}
                        </div>
                    </div>
                </div>
            }>
                <DoctorsContent />
            </Suspense>
        </main>
    );
}
