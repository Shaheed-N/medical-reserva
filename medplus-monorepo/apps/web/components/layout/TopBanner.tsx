'use client';

import { useTranslations } from 'next-intl';
import { Globe, ArrowRight, X, ShieldCheck, FileText } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function TopBanner() {
    const t = useTranslations('Banner');
    const params = useParams();
    const locale = params.locale as string || 'az';
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <>
            <div className="relative z-[110] bg-slate-950 text-white overflow-hidden h-9 flex items-center border-b border-white/5 font-sans">
                {/* Subtle Gradient Glow */}
                <div className="absolute inset-0 opacity-20 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent animate-pulse" />

                <div className="container mx-auto px-4 flex items-center justify-between relative z-10 text-[10px] w-full h-full">

                    {/* Left: Official Badge - Modern Style */}
                    <div className="flex items-center gap-2 shrink-0 z-20 bg-slate-950 pr-4 h-full">
                        <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10 hover:bg-white/10 transition-colors group cursor-default">
                            <div className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                                <Globe size={10} className="relative text-cyan-400 group-hover:rotate-12 transition-transform" />
                            </div>
                            <span className="font-bold text-slate-300 uppercase tracking-[0.15em] text-[9px]">
                                Official
                            </span>
                        </div>
                    </div>

                    {/* Center: Scrolling Ticker - Improved spacing and font */}
                    <div
                        className="absolute inset-0 flex items-center justify-center overflow-hidden mask-linear-fade cursor-pointer"
                        onClick={() => setIsExpanded(true)}
                    >
                        <div className="flex items-center gap-12 whitespace-nowrap animate-marquee hover:[animation-play-state:paused]">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex items-center gap-3 mx-4">
                                    <span className="font-black text-cyan-400 tracking-widest uppercase text-[9px] opacity-100 italic">
                                        {t('protocol')}
                                    </span>
                                    <span className="h-1 w-1 bg-white/20 rounded-full" />
                                    <span className="text-slate-200 font-medium tracking-wide">
                                        {t('message')}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Details Button - More Premium */}
                    <button
                        onClick={() => setIsExpanded(true)}
                        className="hidden md:flex items-center gap-2 group shrink-0 z-20 bg-slate-950 pl-6 h-full cursor-pointer hover:bg-slate-950/80 transition-all"
                    >
                        <span className="text-slate-400 font-black uppercase tracking-[0.2em] text-[8px] group-hover:text-cyan-400 transition-colors border-b border-transparent group-hover:border-cyan-400/30 pb-0.5">
                            {t('details')}
                        </span>
                        <div className="bg-cyan-500/10 p-1 rounded-md group-hover:bg-cyan-500/20 transition-colors">
                            <ArrowRight size={12} className="text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                    </button>

                    {/* Mobile Touch Target */}
                    <button
                        onClick={() => setIsExpanded(true)}
                        className="md:hidden absolute inset-0 z-30 w-full h-full opacity-0"
                        aria-label="Expand details"
                    />
                </div>

                <style jsx>{`
                    @keyframes shimmer {
                        from { background-position: 200% 0; }
                        to { background-position: -200% 0; }
                    }
                    @keyframes marquee {
                        0% { transform: translateX(0); }
                        100% { transform: translateX(-50%); }
                    }
                    .animate-shimmer {
                        animation: shimmer 8s linear infinite;
                    }
                    .animate-marquee {
                        animation: marquee 40s linear infinite;
                        will-change: transform;
                    }
                    .mask-linear-fade {
                        mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
                        -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
                    }
                `}</style>
            </div>

            {/* Expansion Modal */}
            <AnimatePresence>
                {isExpanded && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsExpanded(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150]"
                        />
                        <motion.div
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            className="fixed top-12 left-1/2 -translate-x-1/2 w-[90%] max-w-lg bg-white rounded-lg shadow-2xl z-[160] overflow-hidden border border-slate-200"
                        >
                            {/* Modal Header */}
                            <div className="bg-[#0F172A] px-6 py-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="bg-[#2DD4BF]/20 p-2 rounded-full">
                                        <ShieldCheck className="text-[#2DD4BF]" size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold text-sm tracking-wide uppercase">
                                            {t('protocol')}
                                        </h3>
                                        <p className="text-white/50 text-[10px] uppercase tracking-widest">
                                            Official Announcement
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsExpanded(false)}
                                    className="text-white/50 hover:text-white transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="p-6 md:p-8">
                                <div className="mb-6">
                                    <span className="inline-block py-1 px-3 rounded-full bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-widest mb-3 border border-red-100">
                                        Mandatory Action
                                    </span>
                                    <h4 className="text-xl md:text-2xl font-display text-slate-900 mb-4 leading-tight">
                                        {t('message')}
                                    </h4>
                                    <p className="text-slate-600 text-sm leading-relaxed">
                                        {locale === 'az'
                                            ? 'Bütün vətəndaşların diqqətinə: 2024-cü il yanvarın 1-dən etibarən bütün tibbi qeydiyyatlar və xəstəxana ziyarətləri üçün Yeni Rəqəmsal Rezidentlik ID-si tələb olunur. Zəhmət olmasa, ən qısa zamanda qeydiyyatdan keçin.'
                                            : 'Вниманию всех граждан: С 1 января 2024 года для всех медицинских регистраций и посещений больниц требуется Новый Цифровой ID Резидента. Пожалуйста, пройдите регистрацию как можно скорее.'}
                                    </p>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <a
                                        href={`/${locale}/signup`}
                                        className="w-full py-4 bg-[#0F766E] text-white text-xs font-bold uppercase tracking-widest rounded text-center hover:bg-[#134E4A] transition-colors flex items-center justify-center gap-2"
                                    >
                                        <FileText size={14} />
                                        {locale === 'az' ? 'ID üçün Müraciət Et' : 'Подать заявку на ID'}
                                    </a>
                                    <button
                                        onClick={() => setIsExpanded(false)}
                                        className="w-full py-3 bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-widest rounded border border-slate-200 hover:bg-slate-100 transition-colors"
                                    >
                                        {t('close')}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
