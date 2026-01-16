"use client";

import { useState, Suspense } from 'react';
import { useTranslations } from 'next-intl';
import { Building2, MapPin, Phone, Clock, Star, ArrowRight, Filter, Search, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { HospitalGridSkeleton } from '@/components/skeletons/HospitalSkeletons';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

const hospitals = [
    { id: 1, name: 'Mərkəzi Klinik Xəstəxana', city: 'Bakı', address: 'Heydər Əliyev prospekti 152', phone: '+994 12 440 00 00', rating: 4.9, departments: 12, image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=800&q=80' },
    { id: 2, name: 'Şəhər Tibb Mərkəzi', city: 'Bakı', address: 'Nizami küç. 82', phone: '+994 12 441 11 11', rating: 4.8, departments: 8, image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80' },
    { id: 3, name: 'Gəncə Regional Xəstəxanası', city: 'Gəncə', address: 'Şah İsmayıl prospekti 25', phone: '+994 22 256 00 00', rating: 4.7, departments: 10, image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=800&q=80' },
    { id: 4, name: 'Pediatriya Xəstəxanası №1', city: 'Bakı', address: 'Xaqani küç. 12', phone: '+994 12 493 00 00', rating: 4.9, departments: 6, image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=800&q=80' },
    { id: 5, name: 'Sumqayıt Şəhər Xəstəxanası', city: 'Sumqayıt', address: 'Neftçilər prospekti 45', phone: '+994 18 643 00 00', rating: 4.6, departments: 9, image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80' },
    { id: 6, name: 'Onkoloji Mərkəz', city: 'Bakı', address: 'H.Cavid prospekti 76', phone: '+994 12 538 00 00', rating: 4.9, departments: 5, image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80' },
];

function HospitalsList({ searchQuery, selectedCity, locale }: {
    searchQuery: string;
    selectedCity: string;
    locale: string;
}) {
    const t = useTranslations('Hospitals');
    const tCommon = useTranslations('Common');

    const filteredHospitals = hospitals.filter(h => {
        const matchesSearch = h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            h.address.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCity = selectedCity === 'all' || h.city.toLowerCase() === selectedCity;
        return matchesSearch && matchesCity;
    });

    return (
        <>
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-[#0F172A]">
                    {locale === 'az' ? 'Tapıldı' : 'Найдено'} {filteredHospitals.length}{' '}
                    {locale === 'az' ? 'müəssisə' : 'учреждений'}
                </h2>
                <Button variant="outline" className="lg:hidden h-[40px] text-xs">
                    <Filter size={16} className="mr-2" /> {tCommon('filters')}
                </Button>
            </div>

            <AnimatePresence mode="popLayout">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {filteredHospitals.map((h, i) => (
                        <motion.div
                            key={h.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: i * 0.05 }}
                            className="bg-[#F0FBFA] rounded-[16px] shadow-sm overflow-hidden hover:shadow-lg transition-all group flex flex-col sm:flex-row"
                        >
                            <div className="sm:w-2/5 h-64 sm:h-auto overflow-hidden relative">
                                <img
                                    src={h.image}
                                    alt={h.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute top-4 left-4 bg-[#0F766E] text-white text-[10px] font-bold px-3 py-1.5 uppercase tracking-widest rounded-sm">
                                    {tCommon('verified')}
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div className="sm:w-3/5 p-6 md:p-8 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <h2 className="text-2xl font-display text-[#0F172A] group-hover:text-[#0F766E] transition-colors pr-4 tracking-tight">
                                            {h.name}
                                        </h2>
                                        <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded border border-yellow-100 shrink-0">
                                            <Star size={14} className="fill-yellow-400 text-yellow-400" />
                                            <span className="text-sm font-bold text-yellow-700">{h.rating}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-3 text-sm text-[#475569] mb-6">
                                        <div className="flex items-center gap-2">
                                            <MapPin size={16} className="text-[#0F766E] shrink-0" />
                                            <span>{h.address}, {h.city}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Phone size={16} className="text-[#0F766E] shrink-0" />
                                            <span className="font-mono">{h.phone}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Building2 size={16} className="text-[#0F766E] shrink-0" />
                                            <span>{h.departments} {t('departments')}</span>
                                        </div>
                                    </div>
                                </div>

                                <Link href={`/${locale}/hospitals/${h.id}`}>
                                    <Button variant="primary" className="w-full uppercase tracking-[0.2em] text-[10px] font-bold">
                                        {t('view_details')}
                                        <ChevronRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </AnimatePresence>

            {filteredHospitals.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-[#F0FBFA] p-20 rounded-[16px] text-center col-span-2"
                >
                    <Building2 size={64} className="mx-auto text-slate-300 mb-6" />
                    <h3 className="text-xl font-bold text-[#0F172A] mb-2">
                        {locale === 'az' ? 'Xəstəxana tapılmadı' : 'Клиники не найдены'}
                    </h3>
                    <p className="text-[#475569]">
                        {locale === 'az' ? 'Axtarış parametrlərini dəyişin' : 'Измените параметры поиска'}
                    </p>
                </motion.div>
            )}
        </>
    );
}

export default function HospitalsPublicPage() {
    const params = useParams();
    const locale = params.locale as string || 'az';
    const t = useTranslations('Hospitals');
    const tCommon = useTranslations('Common');

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCity, setSelectedCity] = useState('all');

    return (
        <div className="bg-[#FFFFFF] min-h-screen">
            {/* Hero Search Section - Light/Card Theme */}
            <section className="bg-[#FFFFFF] py-16 md:py-20 relative overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-[#0F766E]/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#2DD4BF]/5 rounded-full blur-3xl" />
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-3xl md:text-5xl font-display text-[#0F172A] mb-4 border-l-4 border-[#0F766E] pl-6 tracking-tight">
                            {t('title')}
                        </h1>
                        <p className="text-[#475569] text-lg mb-10 max-w-2xl">
                            {t('subtitle')}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-[#F0FBFA] p-3 rounded-[28px] border border-[#CCFBF1] shadow-[0_4px_20px_-4px_rgba(15,118,110,0.05)] flex flex-col md:flex-row gap-3 items-center"
                    >
                        <div className="flex-[2] w-full">
                            <Input
                                icon={<Search size={20} />}
                                type="text"
                                placeholder={t('search_placeholder')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex-1 w-full">
                            <Select
                                icon={<MapPin size={20} />}
                                value={selectedCity}
                                onChange={(e) => setSelectedCity(e.target.value)}
                            >
                                <option value="all">{t('all_regions')}</option>
                                <option value="bakı">Bakı</option>
                                <option value="gəncə">Gəncə</option>
                                <option value="sumqayıt">Sumqayıt</option>
                            </Select>
                        </div>
                        <Button
                            variant="primary"
                            className="h-[60px] rounded-2xl px-10 text-xs font-bold uppercase tracking-widest shadow-lg shadow-[#4FD1D9]/30 hover:shadow-[#4FD1D9]/40 hover:-translate-y-0.5 transition-all w-full md:w-auto"
                        >
                            {tCommon('search')}
                        </Button>
                    </motion.div>
                </div>
            </section>

            {/* Results Section */}
            <div className="container mx-auto px-6 py-12 md:py-16">
                <Suspense fallback={<HospitalGridSkeleton count={4} />}>
                    <HospitalsList
                        searchQuery={searchQuery}
                        selectedCity={selectedCity}
                        locale={locale}
                    />
                </Suspense>
            </div>

            {/* Map CTA Section */}
            <section className="py-16 bg-white border-t border-slate-100">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-[#0F766E] rounded-[16px] p-10 md:p-16 text-center relative overflow-hidden"
                    >
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl" />
                        </div>
                        <div className="relative z-10">
                            <MapPin size={48} className="mx-auto mb-6 text-[#2DD4BF]" />
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                                {locale === 'az' ? 'Sizə ən yaxın xəstəxananı tapın' : 'Найдите ближайшую клинику'}
                            </h2>
                            <p className="text-white/70 mb-8 max-w-xl mx-auto">
                                {locale === 'az'
                                    ? 'İnteraktiv xəritə ilə sizə ən yaxın tibb müəssisələrini kəşf edin'
                                    : 'Откройте ближайшие медицинские учреждения с помощью интерактивной карты'}
                            </p>
                            <Button variant="secondary" className="bg-white border-white text-[#0F766E] hover:bg-white/90">
                                {locale === 'az' ? 'Xəritəni Aç' : 'Открыть карту'}
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
