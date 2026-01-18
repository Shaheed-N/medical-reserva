"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Header({ locale }: { locale: string }) {
    const isRu = locale === 'ru';
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const nav = {
        research: isRu ? 'Услуги' : 'Xidmətlər',
        technology: isRu ? 'Клиники' : 'Klinikalar',
        specialists: isRu ? 'Врачи' : 'Həkimlər',
        locations: isRu ? 'Контакты' : 'Əlaqə',
        about: isRu ? 'О нас' : 'Haqqımızda',
        portal: isRu ? 'Личный Кабинет' : 'Şəxsi Kabinet',
        login: isRu ? 'Войти' : 'Daxil ol',
        signup: isRu ? 'Qeydiyyat' : 'Qeydiyyat'
    };

    return (
        <nav className={`sticky top-0 z-[100] w-full transition-all duration-500 ${isScrolled ? 'bg-white/80 backdrop-blur-xl border-b border-slate-200/50 py-3 shadow-[0_8px_30px_rgb(0,0,0,0.04)]' : 'bg-transparent py-5'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Brand / Logo */}
                    <Link href={`/${locale}`} className="flex items-center gap-4 group">
                        <div className="relative">
                            <div className="size-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-2xl group-hover:scale-105 transition-all duration-300 relative z-10 overflow-hidden">
                                <span className="material-symbols-outlined text-[28px] relative z-20">emergency</span>
                                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-transparent"></div>
                            </div>
                            {/* Decorative glow behind logo */}
                            <div className="absolute inset-0 bg-cyan-400 blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-2xl font-black tracking-tighter text-slate-900 leading-none flex items-baseline">
                                MED<span className="text-cyan-500 -ml-0.5">PLUS</span>
                                <div className="size-1.5 rounded-full bg-cyan-400 ml-1"></div>
                            </span>
                            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 mt-1 leading-none">Official Digital Portal</span>
                        </div>
                    </Link>

                    {/* Navigation - Desktop */}
                    <div className="hidden lg:flex items-center gap-2">
                        {[
                            { name: isRu ? 'Бизнес регистрация' : 'Biznes Qeydiyyatı', href: `/${locale}/business/register` },
                            { name: nav.research, href: `/${locale}/services` },
                            { name: nav.technology, href: `/${locale}/hospitals` },
                            { name: nav.specialists, href: `/${locale}/doctors` },
                        ].map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="px-4 py-2.5 text-[12px] font-black text-slate-500 hover:text-slate-900 transition-all rounded-full hover:bg-slate-100/80 relative group uppercase tracking-[0.15em] whitespace-nowrap"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-6">
                        {/* Language Switcher */}
                        <div className="hidden sm:flex items-center gap-3 p-1 bg-slate-100 rounded-full border border-slate-200/50">
                            <Link href="/az" className={`px-3 py-1.5 rounded-full text-[11px] font-black transition-all ${!isRu ? 'bg-white shadow-sm text-cyan-600' : 'text-slate-400 hover:text-slate-600'}`}>AZ</Link>
                            <Link href="/ru" className={`px-3 py-1.5 rounded-full text-[11px] font-black transition-all ${isRu ? 'bg-white shadow-sm text-cyan-600' : 'text-slate-400 hover:text-slate-600'}`}>RU</Link>
                        </div>

                        <div className="hidden sm:flex items-center gap-4">
                            <Link href={`/${locale}/login`} className="text-[12px] font-black text-slate-900 uppercase tracking-widest hover:text-cyan-600 transition-colors">
                                {nav.login}
                            </Link>

                            <Link href={`/${locale}/signup`} className="relative group">
                                <button className="flex items-center gap-3 h-12 px-8 rounded-full bg-slate-900 text-white text-xs font-black hover:bg-slate-800 transition-all shadow-[0_10px_20px_-10px_rgba(0,0,0,0.3)] hover:shadow-[0_15px_30px_-10px_rgba(0,0,0,0.4)] hover:-translate-y-0.5 overflow-hidden group">
                                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-cyan-400 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                                    <span className="uppercase tracking-[0.1em]">{nav.signup}</span>
                                    <span className="material-symbols-outlined text-[18px] text-cyan-400 transition-transform group-hover:translate-x-1">trending_flat</span>
                                </button>
                            </Link>
                        </div>

                        <button
                            className="lg:hidden p-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 hover:bg-slate-100 transition-all shadow-sm"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            <span className="material-symbols-outlined text-[24px]">{isMobileMenuOpen ? 'close' : 'menu'}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="lg:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-2xl overflow-hidden"
                    >
                        <div className="px-6 py-8 space-y-6">
                            {[
                                { name: isRu ? 'Бизнес регистрация' : 'Biznes Qeydiyyatı', href: `/${locale}/business/register` },
                                { name: nav.research, href: `/${locale}/services` },
                                { name: nav.technology, href: `/${locale}/hospitals` },
                                { name: nav.specialists, href: `/${locale}/doctors` },
                            ].map((item) => (
                                <Link key={item.name} href={item.href} className="block text-sm font-black text-slate-900 hover:text-cyan-500 uppercase tracking-widest transition-colors">
                                    {item.name}
                                </Link>
                            ))}
                            <div className="pt-6 border-t border-slate-100 flex flex-col gap-6">
                                <div className="flex gap-4">
                                    <Link href="/az" className={`px-4 py-2 rounded-xl text-xs font-black border transition-all ${!isRu ? 'bg-cyan-50 border-cyan-100 text-cyan-600' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>AZ</Link>
                                    <Link href="/ru" className={`px-4 py-2 rounded-xl text-xs font-black border transition-all ${isRu ? 'bg-cyan-50 border-cyan-100 text-cyan-600' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>RU</Link>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <Link href={`/${locale}/login`}>
                                        <button className="w-full flex items-center justify-center gap-3 h-14 rounded-2xl bg-white border border-slate-200 text-slate-900 text-xs font-black uppercase tracking-widest">
                                            {nav.login}
                                        </button>
                                    </Link>
                                    <Link href={`/${locale}/signup`}>
                                        <button className="w-full flex items-center justify-center gap-3 h-14 rounded-2xl bg-slate-900 text-white text-xs font-black uppercase tracking-widest">
                                            {nav.signup}
                                            <span className="material-symbols-outlined text-[20px] text-cyan-400">trending_flat</span>
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
