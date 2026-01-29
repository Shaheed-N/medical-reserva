"use client";

import { use, useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shield, UserPlus, Smartphone, ArrowRight, Info, CheckCircle, FileText, Loader2 } from 'lucide-react';

export default function SignupPage({ params: paramsPromise }: { params: Promise<{ locale: string }> }) {
    const params = use(paramsPromise);
    const locale = params.locale || 'az';
    const tAuth = useTranslations('Auth');
    const tCommon = useTranslations('Common');

    const [loading, setLoading] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [fullName, setFullName] = useState('');

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate registration
        await new Promise(resolve => setTimeout(resolve, 2000));
        setLoading(false);
        // Redirect to verification
        window.location.href = `/${locale}/login`;
    };

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white selection:bg-[#0F766E]/20">
            {/* Left Column - Visual Container */}
            <div className="hidden lg:block relative bg-[#0F172A] overflow-hidden">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 h-full w-full object-cover opacity-40 grayscale"
                >
                    <source src="https://player.vimeo.com/external/440537447.sd.mp4?s=d00965e69623038622955f269a930776&profile_id=164&oauth2_token_id=57447761" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A] via-transparent to-transparent"></div>

                <div className="absolute top-0 left-0 p-16 w-full max-w-xl">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white/5 backdrop-blur-2xl border border-white/10 p-10 rounded-sm shadow-2xl"
                    >
                        <h3 className="text-2xl font-bold text-white mb-8 uppercase tracking-tighter flex items-center gap-3">
                            <FileText className="text-[#2DD4BF]" />
                            {locale === 'az' ? 'Qeydiyyat Tələbləri' : 'Требования к регистрации'}
                        </h3>
                        <div className="space-y-8">
                            {[
                                { num: '01', title: locale === 'az' ? 'Şəxsiyyət Vəsiqəsi' : 'Удостоверение личности', desc: locale === 'az' ? 'Fin kod və ya seriya nömrəsi' : 'Фин-код или номер серии' },
                                { num: '02', title: locale === 'az' ? 'Aktiv Mobil Nömrə' : 'Активный мобильный номер', desc: locale === 'az' ? 'SMS təsdiqləmə üçün' : 'Для подтверждения через SMS' },
                                { num: '03', title: locale === 'az' ? 'Tibbi Sığorta' : 'Мед. Страховка', desc: locale === 'az' ? 'İcbari və ya könüllü sığorta' : 'Обязательная или добровольная' },
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 + i * 0.1 }}
                                    className="flex gap-6"
                                >
                                    <span className="text-[#2DD4BF] font-black text-xs pt-1">{item.num}</span>
                                    <div>
                                        <h4 className="text-white font-bold text-sm mb-1 uppercase tracking-wider">{item.title}</h4>
                                        <p className="text-white/40 text-xs font-medium">{item.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Right Column - Form */}
            <div className="flex flex-col justify-center px-6 py-12 lg:px-24 bg-white relative">
                <div className="w-full max-w-md mx-auto">
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
                            {locale === 'az' ? 'Pasient Qeydiyyatı' : 'Регистрация Пациента'}
                        </h2>
                        <p className="text-slate-500 font-medium">
                            {locale === 'az' ? 'Vahid tibbi profilinizi yaradın.' : 'Создайте единый медицинский профиль.'}
                        </p>
                    </motion.div>

                    <form onSubmit={handleSignup} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="fullname" className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                                {locale === 'az' ? 'Tam Adınız' : 'Полное Имя'}
                            </label>
                            <input
                                id="fullname"
                                type="text"
                                required
                                placeholder="Ad Soyad"
                                className="w-full px-4 py-5 bg-slate-50 border border-slate-200 rounded-sm text-slate-900 focus:bg-white focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/5 outline-none transition-all placeholder:text-slate-300 font-medium"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                            />
                        </div>

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

                        <div className="bg-[#F0FDFA] border border-[#CCFBF1] p-5 rounded-sm flex gap-4 items-start">
                            <Info size={20} className="text-[#0D9488] shrink-0 mt-0.5" />
                            <p className="text-[10px] text-[#0F766E] font-bold uppercase tracking-widest leading-relaxed">
                                {locale === 'az'
                                    ? 'Qeydiyyatdan keçməklə siz tibbi məlumatlarınızın Vahid Sağlamlıq Protokoluna uyğun saxlanılmasına razılıq verirsiniz.'
                                    : 'Регистрируясь, вы соглашаетесь на хранение ваших медицинских данных в соответствии с Единым медицинским протоколом.'}
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || phoneNumber.length < 9 || fullName.length < 3}
                            className="w-full py-5 bg-[#0F766E] text-white font-bold uppercase tracking-[0.3em] text-[10px] rounded-sm shadow-2xl shadow-[#0F766E]/20 hover:bg-[#134E4A] active:scale-95 transition-all disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-3 group"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : (
                                <>
                                    {tAuth('verify')} & {tAuth('signup')}
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-12 pt-8 border-t border-slate-100">
                        <p className="text-sm text-center text-slate-500">
                            {locale === 'az' ? 'Artıq qeydiyyatdan keçmisiniz?' : 'Уже зарегистрированы?'}{' '}
                            <Link href={`/${locale}/login`} className="font-bold text-[#0F766E] hover:text-[#134E4A] underline underline-offset-4">
                                {tCommon('login')}
                            </Link>
                        </p>
                    </div>

                    <div className="mt-12 flex justify-between items-center opacity-40">
                        <CheckCircle size={16} className="text-[#0F766E]" />
                        <div className="w-full h-[1px] bg-slate-200 mx-4"></div>
                        <CheckCircle size={16} className="text-[#0F766E]" />
                        <div className="w-full h-[1px] bg-slate-200 mx-4"></div>
                        <CheckCircle size={16} className="text-slate-300" />
                    </div>
                    <div className="flex justify-between mt-2 px-1">
                        <span className="text-[8px] font-black uppercase tracking-widest text-[#0F766E]">Registry</span>
                        <span className="text-[8px] font-black uppercase tracking-widest text-[#0F766E]">Verify</span>
                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-300">Profile</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
