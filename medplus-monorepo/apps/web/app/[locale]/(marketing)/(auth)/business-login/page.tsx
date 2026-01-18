"use client";

import { use, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Building2, Mail, Lock, ArrowRight, Loader2, Shield, Stethoscope } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';

export default function BusinessLoginPage({ params: paramsPromise }: { params: Promise<{ locale: string }> }) {
    const params = use(paramsPromise);
    const locale = params.locale || 'az';
    const router = useRouter();
    const isRu = locale === 'ru';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [loginType, setLoginType] = useState<'hospital' | 'doctor'>('hospital');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Convert username to email format for Supabase
            const loginEmail = email.includes('@') ? email : `${email}@medplus.local`;

            const { data, error } = await supabase.auth.signInWithPassword({
                email: loginEmail,
                password
            });

            if (error) {
                toast.error(isRu ? 'Неверный логин или пароль' : 'Səhv istifadəçi adı və ya şifrə');
                console.error('Login error:', error);
            } else if (data.user) {
                toast.success(isRu ? 'Вход выполнен!' : 'Uğurla daxil oldunuz!');

                // Check user role and redirect accordingly
                const role = data.user.user_metadata?.role;
                if (role === 'hospital_owner' || role === 'hospital_manager') {
                    router.push(`/${locale}/hospital-admin`);
                } else if (role === 'doctor') {
                    router.push(`/${locale}/doctor`);
                } else {
                    router.push(`/${locale}/hospital-admin`); // Default for admins
                }
            }
        } catch (error: any) {
            console.error('Login error:', error);
            toast.error(error?.message || 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white">
            {/* Left Column - Form */}
            <div className="flex flex-col justify-center px-6 py-12 lg:px-24 bg-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-64 h-64 bg-[#0F766E]/5 rounded-full blur-3xl -ml-32 -mt-32"></div>
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#2DD4BF]/5 rounded-full blur-3xl -mr-32 -mb-32"></div>

                <div className="w-full max-w-md mx-auto relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-10"
                    >
                        <Link href={`/${locale}`} className="inline-block mb-8">
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 bg-[#0F766E] rounded-sm flex items-center justify-center text-white shadow-lg shadow-[#0F766E]/20">
                                    <Shield size={20} />
                                </div>
                                <span className="font-bold text-xl tracking-tighter text-slate-900 uppercase">MedPlus</span>
                            </div>
                        </Link>

                        <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-3 uppercase">
                            {isRu ? 'Бизнес Вход' : 'Biznes Girişi'}
                        </h2>
                        <p className="text-slate-500 font-medium">
                            {isRu ? 'Для клиник и врачей' : 'Klinikalar və həkimlər üçün'}
                        </p>
                    </motion.div>

                    {/* Login Type Toggle */}
                    <div className="flex bg-slate-100 p-1 rounded-sm mb-8">
                        <button
                            type="button"
                            onClick={() => setLoginType('hospital')}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-sm text-[10px] font-black uppercase tracking-widest transition-all ${loginType === 'hospital' ? 'bg-[#0F766E] text-white shadow-lg' : 'text-slate-500'
                                }`}
                        >
                            <Building2 size={14} /> {isRu ? 'Клиника' : 'Klinika'}
                        </button>
                        <button
                            type="button"
                            onClick={() => setLoginType('doctor')}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-sm text-[10px] font-black uppercase tracking-widest transition-all ${loginType === 'doctor' ? 'bg-[#0F766E] text-white shadow-lg' : 'text-slate-500'
                                }`}
                        >
                            <Stethoscope size={14} /> {isRu ? 'Врач' : 'Həkim'}
                        </button>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                {isRu ? 'Имя пользователя' : 'İstifadəçi adı'}
                            </label>
                            <div className="relative">
                                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    required
                                    placeholder="clinic_admin"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-sm text-slate-900 focus:bg-white focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/5 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                {isRu ? 'Пароль' : 'Şifrə'}
                            </label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-sm text-slate-900 focus:bg-white focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/5 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 bg-[#0F766E] text-white font-black uppercase tracking-[0.2em] text-[11px] rounded-sm shadow-2xl shadow-[#0F766E]/20 hover:bg-[#134E4A] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    {isRu ? 'Войти' : 'Daxil ol'}
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-slate-500">
                            {isRu ? 'Нет аккаунта?' : 'Hesabınız yoxdur?'}{' '}
                            <Link href={`/${locale}/business/register`} className="font-bold text-[#0F766E] hover:underline">
                                {isRu ? 'Подать заявку' : 'Müraciət edin'}
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
            <div className="hidden lg:flex relative bg-[#0F172A] items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0F766E]/20 to-transparent"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#0F766E] opacity-10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#2DD4BF] opacity-10 rounded-full blur-[100px] -ml-32 -mb-32"></div>

                <div className="relative z-10 text-center px-16">
                    <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/20">
                        {loginType === 'hospital' ? (
                            <Building2 size={48} className="text-[#2DD4BF]" />
                        ) : (
                            <Stethoscope size={48} className="text-[#2DD4BF]" />
                        )}
                    </div>
                    <h3 className="text-3xl font-black text-white uppercase tracking-tight mb-4">
                        {loginType === 'hospital'
                            ? (isRu ? 'Панель Клиники' : 'Klinika Paneli')
                            : (isRu ? 'Панель Врача' : 'Həkim Paneli')
                        }
                    </h3>
                    <p className="text-white/60 max-w-sm mx-auto">
                        {loginType === 'hospital'
                            ? (isRu ? 'Управляйте врачами, расписанием и записями пациентов' : 'Həkimləri, cədvəli və xəstə qeydlərini idarə edin')
                            : (isRu ? 'Управляйте своим расписанием и приемами пациентов' : 'Cədvəlinizi və xəstə qəbullarınızı idarə edin')
                        }
                    </p>
                </div>
            </div>
        </div>
    );
}
