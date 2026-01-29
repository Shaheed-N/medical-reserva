"use client";

import { use, useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Smartphone, ArrowRight, Lock, CheckCircle, Loader2, Sparkles } from 'lucide-react';

export default function LoginPage({ params: paramsPromise }: { params: Promise<{ locale: string }> }) {
    const params = use(paramsPromise);
    const locale = params.locale || 'az';
    const tAuth = useTranslations('Auth');
    const tCommon = useTranslations('Common');

    const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setStep('OTP');
        setLoading(false);
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate verification
        await new Promise(resolve => setTimeout(resolve, 1500));
        setLoading(false);
        // Redirect to dashboard or home
        window.location.href = `/${locale}`;
    };

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white selection:bg-[#0F766E]/20">
            {/* Left Column - Form */}
            <div className="flex flex-col justify-center px-6 py-12 lg:px-24 bg-white relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-[#0F766E]/5 rounded-full blur-3xl -ml-32 -mt-32"></div>
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#2DD4BF]/5 rounded-full blur-3xl -mr-32 -mb-32"></div>

                <div className="w-full max-w-md mx-auto relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-12"
                    >
                        <Link href={`/${locale}`} className="inline-block mb-8">
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 bg-[#0F766E] rounded-sm flex items-center justify-center text-white shadow-lg shadow-[#0F766E]/20">
                                    <Shield size={20} />
                                </div>
                                <span className="font-bold text-xl tracking-tighter text-slate-900 uppercase">MedPlus</span>
                            </div>
                        </Link>

                        <h2 className="text-4xl font-bold text-slate-900 tracking-tight mb-3">
                            {tAuth('welcome_back')}
                        </h2>
                        <p className="text-slate-500 font-medium">
                            {locale === 'az' ? 'Milli Sağlamlıq Portalına Təhlükəsiz Giriş' : 'Безопасный вход в Национальный портал здоровья'}
                        </p>
                    </motion.div>

                    <AnimatePresence mode="wait">
                        {step === 'PHONE' ? (
                            <motion.div
                                key="phone"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                            >
                                <form onSubmit={handleSendOtp} className="space-y-8">
                                    <div className="space-y-2">
                                        <label htmlFor="phone" className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                                            {tAuth('phone_label')}
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                                                <Smartphone size={18} className="text-slate-400 group-focus-within:text-[#0F766E] transition-colors" />
                                                <span className="text-sm font-bold text-slate-500">+994</span>
                                            </div>
                                            <input
                                                id="phone"
                                                type="tel"
                                                required
                                                placeholder="50 000 00 00"
                                                className="w-full pl-24 pr-4 py-5 bg-slate-50 border border-slate-200 rounded-sm text-slate-900 focus:bg-white focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/5 outline-none transition-all placeholder:text-slate-300 font-mono tracking-wider"
                                                value={phoneNumber}
                                                onChange={(e) => setPhoneNumber(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading || phoneNumber.length < 9}
                                        className="w-full py-5 bg-[#0F766E] text-white font-bold uppercase tracking-[0.3em] text-[10px] rounded-sm shadow-2xl shadow-[#0F766E]/20 hover:bg-[#134E4A] active:scale-95 transition-all disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-3 group"
                                    >
                                        {loading ? <Loader2 className="animate-spin" size={20} /> : (
                                            <>
                                                {tAuth('send_code')}
                                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </form>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="otp"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <form onSubmit={handleVerifyOtp} className="space-y-8">
                                    <button
                                        type="button"
                                        onClick={() => setStep('PHONE')}
                                        className="text-xs text-[#0F766E] font-bold uppercase tracking-widest flex items-center gap-2 mb-6 hover:translate-x-[-4px] transition-transform"
                                    >
                                        <ArrowRight size={16} className="rotate-180" /> {locale === 'az' ? 'Nömrəni Dəyiş' : 'Сменить номер'}
                                    </button>

                                    <div className="space-y-2">
                                        <label htmlFor="otp" className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                                            {tAuth('enter_code')}
                                        </label>
                                        <div className="relative group">
                                            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0F766E] transition-colors" />
                                            <input
                                                id="otp"
                                                type="text"
                                                required
                                                maxLength={6}
                                                placeholder="000 000"
                                                className="w-full pl-12 pr-4 py-5 bg-slate-50 border border-slate-200 rounded-sm text-slate-900 text-center text-2xl tracking-[0.8em] font-mono focus:bg-white focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/5 outline-none transition-all placeholder:text-slate-200"
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading || otp.length < 6}
                                        className="w-full py-5 bg-[#0F766E] text-white font-bold uppercase tracking-[0.3em] text-[10px] rounded-sm shadow-2xl shadow-[#0F766E]/20 hover:bg-[#134E4A] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                                    >
                                        {loading ? <Loader2 className="animate-spin" size={20} /> : (
                                            <>
                                                {tAuth('verify')}
                                                <CheckCircle size={18} />
                                            </>
                                        )}
                                    </button>

                                    <div className="text-center">
                                        <button type="button" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-[#0F766E] transition-colors">
                                            {tAuth('resend_code')}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="mt-12 pt-8 border-t border-slate-100">
                        <p className="text-sm text-center text-slate-500">
                            {locale === 'az' ? 'Hesabınız yoxdur?' : 'Нет аккаунта?'}{' '}
                            <Link href={`/${locale}/signup`} className="font-bold text-[#0F766E] hover:text-[#134E4A] underline underline-offset-4">
                                {tAuth('create_account')}
                            </Link>
                        </p>
                    </div>

                    <div className="mt-8 flex items-center justify-center gap-6 opacity-30">
                        <div className="flex items-center gap-1 text-[8px] font-black uppercase tracking-widest text-slate-400">
                            <Lock size={10} /> Secure SSL
                        </div>
                        <div className="flex items-center gap-1 text-[8px] font-black uppercase tracking-widest text-slate-400">
                            <Shield size={10} /> 256-bit Encrypted
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column - Visual */}
            <div className="hidden lg:block relative bg-[#0F172A] overflow-hidden">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 h-full w-full object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-1000"
                >
                    <source src="https://player.vimeo.com/external/370331493.sd.mp4?s=3307664877395cfcc3f3380bf9d5d1999a49704e&profile_id=164&oauth2_token_id=57447761" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-[#0F172A]/40"></div>

                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-full px-20">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                            className="bg-white/5 backdrop-blur-xl border border-white/10 p-12 rounded-sm relative"
                        >
                            <Sparkles className="absolute -top-6 -right-6 text-[#2DD4BF] opacity-50" size={48} />
                            <div className="w-16 h-1 bg-[#0F766E] mb-8"></div>
                            <blockquote className="text-3xl font-light leading-snug mb-8 text-white tracking-tight">
                                {locale === 'az'
                                    ? "MedPlus vasitəsilə biz Azərbaycanın səhiyyə sistemini rəqəmsal gələcəyə aparırıq."
                                    : "Через MedPlus мы ведем систему здравоохранения Азербайджана в цифровое будущее."}
                            </blockquote>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                                    <Shield className="text-[#2DD4BF]" size={24} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold tracking-widest uppercase text-white">MedPlus Global Tech</p>
                                    <p className="text-[10px] font-bold tracking-widest uppercase text-[#2DD4BF]">Verified Digital Ecosystem</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
