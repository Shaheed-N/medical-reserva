"use client";

import { useTranslations } from 'next-intl';
import { Heart, Brain, Baby, Bone, Stethoscope, Eye, ArrowRight, Search, Activity, Syringe, TestTube, Scan, Clipboard, Shield } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function ServicesPage() {
    const params = useParams();
    const locale = params.locale as string || 'az';
    const t = useTranslations('Services');
    const tCommon = useTranslations('Common');

    const [searchQuery, setSearchQuery] = useState('');

    const services = [
        {
            id: 'cardiology',
            name: locale === 'az' ? 'Kardiologiya' : 'Кардиология',
            desc: locale === 'az'
                ? 'Müasir diaqnostik vasitələrdən istifadə edərək ürək və damar sistemi üçün hərtərəfli qayğı.'
                : 'Комплексная помощь сердечно-сосудистой системе с использованием современных диагностических средств.',
            icon: Heart,
            doctors: 45,
            color: 'bg-red-50 text-red-600',
            image: 'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&fit=crop&w=400&q=80'
        },
        {
            id: 'neurology',
            name: locale === 'az' ? 'Nevrologiya' : 'Неврология',
            desc: locale === 'az'
                ? 'Beyin, onurğa beyni və sinir sistemi pozuntularının ekspert müalicəsi.'
                : 'Экспертное лечение заболеваний головного, спинного мозга и нервной системы.',
            icon: Brain,
            doctors: 32,
            color: 'bg-purple-50 text-purple-600',
            image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=400&q=80'
        },
        {
            id: 'pediatrics',
            name: locale === 'az' ? 'Pediatriya' : 'Педиатрия',
            desc: locale === 'az'
                ? 'Körpələr, uşaqlar və yeniyetmələr üçün xüsusi səhiyyə xidmətləri.'
                : 'Специализированные медицинские услуги для младенцев, детей и подростков.',
            icon: Baby,
            doctors: 58,
            color: 'bg-pink-50 text-pink-600',
            image: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&w=400&q=80'
        },
        {
            id: 'orthopedics',
            name: locale === 'az' ? 'Ortopediya' : 'Ортопедия',
            desc: locale === 'az'
                ? 'Sümük və oynaq sağlamlığı üçün qabaqcıl cərrahi və qeyri-cərrahi müalicə.'
                : 'Современное хирургическое и консервативное лечение костей и суставов.',
            icon: Bone,
            doctors: 28,
            color: 'bg-orange-50 text-orange-600',
            image: 'https://images.unsplash.com/photo-1579389083046-e3df9c2b3325?auto=format&fit=crop&w=400&q=80'
        },
        {
            id: 'general-medicine',
            name: locale === 'az' ? 'Ümumi Praktika' : 'Общая практика',
            desc: locale === 'az'
                ? 'Profilaktik sağlamlıq və sağlamlığa yönəlmiş ilkin tibbi yardım xidmətləri.'
                : 'Первичная медицинская помощь, ориентированная на профилактику и здоровье.',
            icon: Stethoscope,
            doctors: 120,
            color: 'bg-teal-50 text-teal-600',
            image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=400&q=80'
        },
        {
            id: 'ophthalmology',
            name: locale === 'az' ? 'Oftalmologiya' : 'Офтальмология',
            desc: locale === 'az'
                ? 'Göz testlərindən mürəkkəb ixtisaslaşdırılmış əməliyyatlara qədər tam göz qayğısı.'
                : 'Полный уход за глазами от проверки зрения до сложных специализированных операций.',
            icon: Eye,
            doctors: 22,
            color: 'bg-blue-50 text-blue-600',
            image: 'https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?auto=format&fit=crop&w=400&q=80'
        },
        {
            id: 'vaccination',
            name: locale === 'az' ? 'Vaksinasiya' : 'Вакцинация',
            desc: locale === 'az'
                ? 'Yetkinlər və uşaqlar üçün bütün məcburi və tövsiyə olunan vaksinlər.'
                : 'Все обязательные и рекомендуемые вакцины для взрослых и детей.',
            icon: Syringe,
            doctors: 35,
            color: 'bg-green-50 text-green-600',
            image: 'https://images.unsplash.com/photo-1615631648086-325025c9e51e?auto=format&fit=crop&w=400&q=80'
        },
        {
            id: 'laboratory',
            name: locale === 'az' ? 'Laboratoriya' : 'Лаборатория',
            desc: locale === 'az'
                ? 'Hərtərəfli qan testləri, genetik analizlər və digər diaqnostik testlər.'
                : 'Комплексные анализы крови, генетические тесты и другая диагностика.',
            icon: TestTube,
            doctors: 18,
            color: 'bg-cyan-50 text-cyan-600',
            image: 'https://images.unsplash.com/photo-1579165466741-7f35e4755660?auto=format&fit=crop&w=400&q=80'
        },
        {
            id: 'imaging',
            name: locale === 'az' ? 'Görüntüləmə' : 'Визуализация',
            desc: locale === 'az'
                ? 'Rentgen, MRT, CT və USM daxil olmaqla müasir tibbi görüntüləmə.'
                : 'Современная медицинская визуализация, включая рентген, МРТ, КТ и УЗИ.',
            icon: Scan,
            doctors: 25,
            color: 'bg-indigo-50 text-indigo-600',
            image: 'https://images.unsplash.com/photo-1516069677018-378515003a27?auto=format&fit=crop&w=400&q=80'
        },
    ];

    const filteredServices = services.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.desc.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="bg-slate-50 min-h-screen py-16">
            <div className="container mx-auto px-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8"
                >
                    <div className="max-w-2xl">
                        <span className="text-[#0F766E] font-bold uppercase tracking-widest text-xs mb-4 block">
                            {locale === 'az' ? 'Tibbi Şöbələr' : 'Медицинские отделения'}
                        </span>
                        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                            {t('title')}
                        </h1>
                        <p className="text-slate-500 text-lg leading-relaxed">
                            {t('subtitle')}
                        </p>
                    </div>

                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder={locale === 'az' ? 'Xidmət axtarın...' : 'Поиск услуги...'}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded text-sm focus:ring-2 focus:ring-[#0F766E]/20 outline-none shadow-sm"
                        />
                    </div>
                </motion.div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredServices.map((s, i) => (
                        <motion.div
                            key={s.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="bg-white rounded-sm border border-slate-200 overflow-hidden hover:border-[#0F766E] hover:shadow-xl transition-all group flex flex-col"
                        >
                            <div className="h-48 overflow-hidden relative">
                                <img src={s.image} alt={s.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                                    <div className={`w-14 h-14 ${s.color} rounded-sm flex items-center justify-center shadow-lg`}>
                                        <s.icon size={28} />
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 flex-1 flex flex-col">
                                <h2 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-[#0F766E] transition-colors">{s.name}</h2>
                                <p className="text-slate-500 mb-8 flex-1 leading-relaxed">{s.desc}</p>

                                <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                                    <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                                        <Activity size={18} className="text-[#0F766E]" />
                                        {s.doctors} {locale === 'az' ? 'Mütəxəssis' : 'Специалистов'}
                                    </div>
                                    <Link
                                        href={`/${locale}/doctors?specialty=${s.id}`}
                                        className="flex items-center gap-2 text-[#0F766E] font-bold text-sm hover:gap-3 transition-all uppercase tracking-wider"
                                    >
                                        {locale === 'az' ? 'Həkimlər' : 'Врачи'} <ArrowRight size={18} />
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {filteredServices.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-white p-20 rounded-sm border border-slate-200 text-center"
                    >
                        <Search size={64} className="mx-auto text-slate-200 mb-6" />
                        <h3 className="text-xl font-bold text-slate-900 mb-2">
                            {locale === 'az' ? 'Xidmət tapılmadı' : 'Услуга не найдена'}
                        </h3>
                        <p className="text-slate-500">
                            {locale === 'az' ? 'Axtarış sorğusunu dəyişin' : 'Измените поисковый запрос'}
                        </p>
                    </motion.div>
                )}

                {/* Insurance CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-20 bg-[#0F172A] rounded-sm p-10 md:p-16 flex flex-col md:flex-row items-center gap-10"
                >
                    <div className="w-20 h-20 bg-[#0F766E] rounded-full flex items-center justify-center shrink-0">
                        <Shield size={40} className="text-white" />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <h3 className="text-2xl font-bold text-white mb-3">
                            {locale === 'az' ? 'Sığorta ilə Ödəniş' : 'Оплата по страховке'}
                        </h3>
                        <p className="text-slate-400 leading-relaxed">
                            {locale === 'az'
                                ? 'Bütün əsas sığorta şirkətləri ilə işləyirik. Sizin sığortanızın məbləğini yoxlamaq üçün bizimlə əlaqə saxlayın.'
                                : 'Мы работаем со всеми основными страховыми компаниями. Свяжитесь с нами, чтобы проверить покрытие вашей страховки.'}
                        </p>
                    </div>
                    <button className="px-8 py-4 bg-white text-[#0F172A] font-bold uppercase tracking-widest text-sm rounded-sm hover:bg-slate-100 transition-all shadow-lg shrink-0">
                        {locale === 'az' ? 'Ətraflı Məlumat' : 'Подробнее'}
                    </button>
                </motion.div>
            </div>
        </div>
    );
}
