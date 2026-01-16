"use client";

import { useState, useTransition, Suspense } from 'react';
import { useTranslations } from 'next-intl';
import { Search, MapPin, Star, Filter, Calendar, Clock, ArrowRight, Stethoscope, Hospital, Activity, X } from 'lucide-react';
import Link from 'next/link';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { DoctorListSkeleton } from '@/components/skeletons/DoctorSkeletons';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

// Sample doctors data - would come from Supabase in production
const doctors = [
    { id: 1, name: 'Dr. Sarah Wilson', spec: 'cardiology', specLabel: 'Kardiologiya', hosp: 'Mərkəzi Klinik Xəstəxana', hospId: '1', exp: '15', rating: 4.9, img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80', availability: 'Bu gün' },
    { id: 2, name: 'Dr. Michael Chen', spec: 'neurology', specLabel: 'Nevrologiya', hosp: 'Şəhər Tibb Mərkəzi', hospId: '2', exp: '12', rating: 4.8, img: 'https://images.unsplash.com/photo-1612349317150-b4639e53b8d1?auto=format&fit=crop&w=300&q=80', availability: 'Sabah' },
    { id: 3, name: 'Dr. Emily Brooks', spec: 'pediatrics', specLabel: 'Pediatriya', hosp: 'Pediatriya Xəstəxanası', hospId: '4', exp: '8', rating: 4.9, img: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=300&q=80', availability: 'Bu gün' },
    { id: 4, name: 'Dr. James Wilson', spec: 'orthopedics', specLabel: 'Ortopediya', hosp: 'Mərkəzi Klinik Xəstəxana', hospId: '1', exp: '20', rating: 4.7, img: 'https://images.unsplash.com/photo-1622253632943-49327508585c?auto=format&fit=crop&w=300&q=80', availability: 'Bazar ertəsi' },
    { id: 5, name: 'Dr. Lisa Ray', spec: 'general-medicine', specLabel: 'Ümumi praktika', hosp: 'Dəri Sağlamlıq Mərkəzi', hospId: '5', exp: '10', rating: 4.9, img: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&w=300&q=80', availability: 'Bu gün' },
    { id: 6, name: 'Dr. Aysel Məmmədova', spec: 'dermatology', specLabel: 'Dermatologiya', hosp: 'Dəri Sağlamlıq Mərkəzi', hospId: '5', exp: '7', rating: 4.8, img: 'https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?auto=format&fit=crop&w=300&q=80', availability: 'Sabah' },
];

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
    const t = useTranslations('Doctors');
    const tCommon = useTranslations('Common');

    const filteredDoctors = doctors.filter(doc => {
        const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.specLabel.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesSpecialty = selectedSpecialty === 'all' || doc.spec === selectedSpecialty;
        const matchesHospital = !hospitalFilter || doc.hospId === hospitalFilter;
        return matchesSearch && matchesSpecialty && matchesHospital;
    });

    return (
        <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
                <div className="text-slate-500 text-sm font-medium">
                    {locale === 'az' ? 'Tapıldı' : 'Найдено'}{' '}
                    <span className="text-slate-900 font-bold">{filteredDoctors.length}</span>{' '}
                    {locale === 'az' ? 'təsdiqlənmiş mütəxəssis' : 'верифицированных специалистов'}
                </div>
                <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    {tCommon('sort_by')}:
                    <select className="bg-transparent border-none text-[#0F766E] outline-none cursor-pointer">
                        <option>{tCommon('recommended')}</option>
                        <option>{tCommon('rating')}</option>
                        <option>{tCommon('experience')}</option>
                    </select>
                </div>
            </div>

            <AnimatePresence mode="popLayout">
                <div className="space-y-6">
                    {filteredDoctors.map((doc, i) => (
                        <motion.div
                            key={doc.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ delay: i * 0.05 }}
                            className="bg-[#F0FBFA] p-8 rounded-[16px] shadow-sm flex flex-col md:flex-row gap-8 hover:shadow-lg transition-all group relative overflow-hidden"
                        >
                            <div className="w-32 h-32 md:w-40 md:h-40 shrink-0 relative">
                                <img src={doc.img} alt={doc.name} className="w-full h-full object-cover rounded-[14px] grayscale group-hover:grayscale-0 transition-all duration-700" />
                                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 shadow-sm">
                                    <Star size={10} className="fill-yellow-400 text-yellow-400" /> {doc.rating}
                                </div>
                            </div>

                            <div className="flex-1 flex flex-col justify-between py-2">
                                <div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                                        <h3 className="text-3xl font-display text-[#0F172A] group-hover:text-[#0F766E] transition-colors tracking-tight">{doc.name}</h3>
                                        <span className="bg-white text-[#0F766E] text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-widest self-start shadow-sm">
                                            {tCommon('verified')}
                                        </span>
                                    </div>
                                    <p className="text-[#0F766E] font-bold text-sm uppercase tracking-widest mb-6 border-b border-slate-200/50 pb-4 flex items-center gap-2">
                                        <Stethoscope size={16} /> {doc.specLabel}
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-[#475569] mb-8">
                                        <div className="flex items-center gap-3"><Hospital size={16} className="text-[#94A3B8]" /> {doc.hosp}</div>
                                        <div className="flex items-center gap-3"><Clock size={16} className="text-[#94A3B8]" /> {doc.exp} {tCommon('years')} {tCommon('experience')}</div>
                                        <div className="flex items-center gap-3">
                                            <Calendar size={16} className="text-[#94A3B8]" />
                                            {tCommon('available')}: <span className="text-[#22C55E] font-bold">{doc.availability}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-4">
                                    <Link href={`/${locale}/doctors/${doc.id}`}>
                                        <Button variant="primary" className="uppercase tracking-[0.2em] text-xs font-bold">
                                            {t('instant_booking')}
                                        </Button>
                                    </Link>
                                    <Link href={`/${locale}/doctors/${doc.id}`}>
                                        <Button variant="secondary" className="uppercase tracking-[0.2em] text-xs font-bold bg-white">
                                            {t('view_profile')}
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {filteredDoctors.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-[#F0FBFA] p-20 rounded-[16px] text-center"
                        >
                            <Search size={64} className="mx-auto text-slate-300 mb-6" />
                            <h3 className="text-xl font-bold text-[#0F172A] mb-2">{t('no_results')}</h3>
                            <p className="text-[#475569]">{t('refine_search')}</p>
                        </motion.div>
                    )}
                </div>
            </AnimatePresence>
        </div>
    );
}

function DoctorsContent() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const locale = params.locale as string || 'az';
    const t = useTranslations('Doctors');
    const tCommon = useTranslations('Common');

    const specialtyFilter = searchParams.get('specialty');
    const hospitalFilter = searchParams.get('hospital');

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSpecialty, setSelectedSpecialty] = useState(specialtyFilter || 'all');
    const [selectedLocation, setSelectedLocation] = useState('all');
    const [isPending, startTransition] = useTransition();

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
        <div className="container mx-auto px-6">
            {/* Search Header - Super Modern Pill Design */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12"
            >
                <div className="relative z-10">
                    <h1 className="text-3xl md:text-5xl font-display text-[#0F172A] mb-8 border-l-4 border-[#0F766E] pl-6 tracking-tight">
                        {locale === 'az' ? 'Tibbi Məlumat Bazası' : 'Медицинская база данных'}
                    </h1>

                    <div className="bg-[#F0FBFA] p-3 rounded-[28px] border border-[#CCFBF1] shadow-[0_4px_20px_-4px_rgba(15,118,110,0.05)] flex flex-col md:flex-row gap-3 items-center">
                        <div className="flex-[1.5] w-full">
                            <Input
                                icon={<Search size={20} />}
                                type="text"
                                placeholder={locale === 'az' ? 'Həkim adı və ya ixtisas...' : 'Имя врача или специальность...'}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex-1 w-full">
                            <Select
                                icon={<Stethoscope size={20} />}
                                value={selectedSpecialty}
                                onChange={(e) => handleSpecialtyChange(e.target.value)}
                            >
                                {specialties.map(spec => (
                                    <option key={spec.value} value={spec.value}>{spec.label}</option>
                                ))}
                            </Select>
                        </div>
                        <div className="flex-1 w-full">
                            <Select
                                icon={<MapPin size={20} />}
                                value={selectedLocation}
                                onChange={(e) => setSelectedLocation(e.target.value)}
                            >
                                <option value="all">{locale === 'az' ? 'Bütün Bölgələr' : 'Все регионы'}</option>
                                <option value="baku">Bakı</option>
                                <option value="ganja">Gəncə</option>
                                <option value="sumqayıt">Sumqayıt</option>
                            </Select>
                        </div>
                        <Button
                            variant="primary"
                            className="h-[60px] rounded-2xl px-10 text-xs font-bold uppercase tracking-[0.2em] shadow-lg shadow-[#4FD1D9]/30 hover:shadow-[#4FD1D9]/40 hover:-translate-y-0.5 transition-all w-full md:w-auto"
                        >
                            {tCommon('search')}
                        </Button>
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                {/* Sidebar Filters */}
                <aside className="hidden lg:block space-y-8">
                    <div className="bg-[#F0FBFA] p-8 rounded-[16px] shadow-sm">
                        <h3 className="font-bold text-[#0F172A] mb-6 flex items-center gap-2">
                            <Filter size={18} className="text-[#0F766E]" /> {tCommon('filters')}
                        </h3>

                        <div className="space-y-6">
                            <div>
                                <label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-3 block">
                                    {tCommon('available')}
                                </label>
                                <div className="space-y-3">
                                    {[
                                        locale === 'az' ? 'Bu gün mövcuddur' : 'Сегодня',
                                        locale === 'az' ? 'Sabah mövcuddur' : 'Завтра',
                                        locale === 'az' ? 'Həftə sonu' : 'Выходные'
                                    ].map((label, i) => (
                                        <label key={i} className="flex items-center gap-3 text-sm text-[#475569] cursor-pointer group">
                                            <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[#0F766E] focus:ring-[#0F766E]" />
                                            <span className="group-hover:text-[#0F766E] transition-colors">{label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-3 block">
                                    {tCommon('experience')}
                                </label>
                                <select className="w-full border border-slate-200 rounded-[12px] p-2 text-sm bg-white outline-none focus:border-[#0F766E]">
                                    <option>{locale === 'az' ? 'İstənilən' : 'Любой'}</option>
                                    <option>5+ {tCommon('years')}</option>
                                    <option>10+ {tCommon('years')}</option>
                                    <option>15+ {tCommon('years')}</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#0F766E] p-8 rounded-[16px] text-white">
                        <Activity className="mb-4 text-[#2DD4BF]" />
                        <h4 className="font-bold mb-2">{locale === 'az' ? 'Kömək lazımdır?' : 'Нужна помощь?'}</h4>
                        <p className="text-white/70 text-sm mb-6 leading-relaxed">
                            {locale === 'az'
                                ? 'Klinik dəstək komandamız sizə uyğun mütəxəssis tapmaqda kömək edə bilər.'
                                : 'Наша клиническая команда поддержки поможет найти подходящего специалиста.'}
                        </p>
                        <div className="text-xl font-mono font-bold text-white underline underline-offset-4 cursor-pointer hover:text-white/80">
                            +994 12 440 00 00
                        </div>
                    </div>
                </aside>

                <DoctorsList
                    searchQuery={searchQuery}
                    selectedSpecialty={selectedSpecialty}
                    hospitalFilter={hospitalFilter}
                    locale={locale}
                />
            </div>
        </div>
    );
}

export default function DoctorsPage() {
    return (
        <div className="bg-[#FFFFFF] min-h-screen py-8 md:py-16">
            <Suspense fallback={
                <div className="container mx-auto px-6">
                    <div className="h-64 bg-slate-100 animate-pulse rounded-sm mb-12"></div>
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                        <div className="h-96 bg-slate-100 animate-pulse rounded-sm"></div>
                        <div className="lg:col-span-3">
                            <DoctorListSkeleton count={3} />
                        </div>
                    </div>
                </div>
            }>
                <DoctorsContent />
            </Suspense>
        </div>
    );
}
