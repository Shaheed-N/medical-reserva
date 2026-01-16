"use client";

import { useState, use } from 'react';
import { useTranslations } from 'next-intl';
import {
    MapPin, Star, Clock, Calendar, CheckCircle,
    Phone, ArrowLeft, Loader2, ChevronDown, Activity, Shield, ChevronRight,
    Award, Info, Heart
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useDoctor, useCreateAppointment, useAvailableSlots } from '@/lib/hooks';
import { DoctorProfileSkeleton } from '@/components/index';
import { format, parse, addMinutes } from 'date-fns';
import { az, ru } from 'date-fns/locale';

export default function DoctorProfilePage({ params: paramsPromise }: { params: Promise<{ id: string, locale: string }> }) {
    const params = use(paramsPromise);
    const id = params.id;
    const locale = params.locale || 'az';

    const t = useTranslations('Doctors');
    const tCommon = useTranslations('Common');
    const tProfile = useTranslations('Doctors.profile');

    const router = useRouter();
    const { data: doctor, isLoading, error } = useDoctor(id);
    const createAppointment = useCreateAppointment();

    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [selectedServiceId, setSelectedServiceId] = useState<string>('');
    const [selectedBranchId, setSelectedBranchId] = useState<string>('');
    const [step, setStep] = useState(1);
    const [verificationCode] = useState(() => `MP-${Math.random().toString(36).substring(7).toUpperCase()}`);

    // Fetch available slots when date and branch are selected
    const { data: availableSlots, isLoading: isLoadingSlots } = useAvailableSlots(
        id,
        selectedBranchId,
        selectedDate || ''
    );

    if (isLoading) return <DoctorProfileSkeleton />;

    if (error || !doctor) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="text-center p-12 bg-white rounded-sm shadow-xl border border-slate-200 max-w-md">
                <Info size={64} className="mx-auto text-slate-200 mb-6" />
                <h2 className="text-2xl font-bold text-slate-900 mb-4 uppercase tracking-tight">{t('no_results')}</h2>
                <Link href={`/${locale}/doctors`} className="inline-flex items-center gap-2 text-[#0F766E] font-bold hover:gap-3 transition-all">
                    <ArrowLeft size={18} /> {tCommon('back')}
                </Link>
            </div>
        </div>
    );

    const dates = Array.from({ length: 14 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i);
        return {
            date: format(d, 'yyyy-MM-dd'),
            day: format(d, 'EEE', { locale: locale === 'az' ? az : ru }),
            num: format(d, 'd'),
            isWeekend: d.getDay() === 0 || d.getDay() === 6
        };
    });

    const handleBooking = async () => {
        if (!selectedDate || !selectedTime || !selectedServiceId || !selectedBranchId) return;

        // In a real app, we'd get the patient ID from auth
        // For now using a placeholder or mock patient ID
        const patientId = '00000000-0000-0000-0000-000000000000';

        // Find service for duration
        const serviceData = doctor.services.find((s: any) => s.service.id === selectedServiceId);
        const duration = serviceData?.service.duration_minutes || 30;

        // End time calculation
        const startTimeParsed = parse(selectedTime, 'HH:mm', new Date());
        const endTimeParsed = addMinutes(startTimeParsed, duration);
        const endTime = format(endTimeParsed, 'HH:mm');

        createAppointment.mutate({
            doctor_id: id,
            service_id: selectedServiceId,
            branch_id: selectedBranchId,
            scheduled_date: selectedDate,
            start_time: selectedTime,
            end_time: endTime,
            patient_id: patientId
        }, {
            onSuccess: () => {
                setStep(2);
            }
        });
    };

    // Set primary branch on load if not selected
    if (!selectedBranchId && doctor.branches?.length > 0) {
        setSelectedBranchId(doctor.branches.find((b: any) => b.is_primary)?.branch.id || doctor.branches[0].branch.id);
    }

    return (
        <div className="bg-slate-50 min-h-screen py-8 md:py-16 pb-32 md:pb-16 font-sans">
            <div className="container mx-auto px-6 max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <Link href={`/${locale}/doctors`} className="group inline-flex items-center gap-3 text-slate-400 hover:text-[#0F766E] mb-12 transition-all">
                        <ArrowLeft size={20} className="group-hover:-translate-x-2 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">{locale === 'az' ? 'Həkim Kataloqı' : 'Каталог Врачей'}</span>
                    </Link>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 md:gap-16">
                    {/* Main Info */}
                    <div className="lg:col-span-2 space-y-12">
                        <motion.div
                            className="bg-white p-8 md:p-12 rounded-sm border border-slate-200 shadow-sm relative overflow-hidden"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#0F766E]/5 rounded-sm -mr-16 -mt-16 rotate-45"></div>

                            <div className="flex flex-col md:flex-row gap-10">
                                <div className="w-48 h-48 rounded-sm overflow-hidden bg-slate-100 shrink-0 border border-slate-100 shadow-xl group">
                                    <img
                                        src={doctor.user?.avatar_url || 'https://images.unsplash.com/photo-1612349317150-b4639e53b8d1?auto=format&fit=crop&w=400&q=80'}
                                        alt={doctor.user?.full_name}
                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                                    />
                                </div>
                                <div className="flex-1">
                                    <div className="flex flex-wrap items-center gap-4 mb-4">
                                        <div className="w-1.5 h-8 bg-[#0F766E]"></div>
                                        <h1 className="text-4xl md:text-5xl font-display text-slate-900 tracking-tight leading-none">
                                            {doctor.title} {doctor.user?.full_name}
                                        </h1>
                                        <CheckCircle size={24} className="text-[#0F766E]" />
                                    </div>

                                    <div className="flex flex-wrap gap-2 mb-8">
                                        {doctor.specialties?.map((spec: string, i: number) => (
                                            <span key={i} className="text-[#0F766E] font-bold text-[10px] uppercase tracking-[0.2em] bg-[#E0F2F1] px-3 py-1 rounded-sm">
                                                {spec}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 mb-10">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-sm bg-slate-50 flex items-center justify-center border border-slate-100">
                                                <MapPin size={18} className="text-slate-400" />
                                            </div>
                                            <div>
                                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{tProfile('affiliation')}</div>
                                                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                                    {doctor.branches?.[0]?.branch.hospital.name || 'Mərkəzi Klinik'}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-sm bg-slate-50 flex items-center justify-center border border-slate-100">
                                                <Award size={18} className="text-slate-400" />
                                            </div>
                                            <div>
                                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{tCommon('experience')}</div>
                                                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                                    {doctor.years_of_experience} {tCommon('years')} {tProfile('experience_label')}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-8 pt-8 border-t border-slate-50">
                                        <div className="flex items-center gap-2">
                                            <Star size={20} className="fill-yellow-400 text-yellow-400" strokeWidth={0} />
                                            <span className="text-xl font-bold text-slate-900">4.9</span>
                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest ml-1">{tCommon('rating')}</span>
                                        </div>
                                        <div className="h-6 w-px bg-slate-100"></div>
                                        <div className="text-[10px] font-black text-[#0F766E] uppercase tracking-[0.3em] flex items-center gap-2">
                                            <Shield size={16} /> {tCommon('verified')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <div className="space-y-16">
                            <motion.section
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="text-3xl font-display text-slate-900 mb-8 tracking-tight flex items-center gap-4">
                                    <div className="w-2 h-8 bg-[#0F766E]"></div> {tProfile('summary')}
                                </h2>
                                <p className="text-slate-500 text-lg leading-relaxed font-light">
                                    {doctor.bio || (locale === 'az'
                                        ? "Bu qeydiyyatdan keçmiş tibbi mütəxəssis yüksək səviyyəli klinik hazırlıq keçib və hazırda milli səhiyyə şəbəkəsində ixtisaslaşmış tibbi xidmət göstərir. Bütün sertifikatlar və lisenziyalar Səhiyyə Nazirliyi tərəfindən təsdiq edilmişdir."
                                        : "Этот зарегистрированный медицинский специалист прошел продвинутую клиническую подготовку и в настоящее время оказывает специализированную помощь в рамках национальной сети здравоохранения. Все сертификаты и лицензии подтверждены Министерством здравоохранения.")}
                                </p>

                                <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {doctor.qualifications?.map((qual: string, i: number) => (
                                        <div key={i} className="flex items-start gap-3 p-4 bg-slate-50 rounded border border-slate-100">
                                            <Award size={18} className="text-[#0F766E] shrink-0 mt-0.5" />
                                            <span className="text-sm text-slate-600 font-medium">{qual}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.section>

                            <motion.section
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="text-3xl font-display text-slate-900 mb-8 tracking-tight flex items-center gap-4">
                                    <div className="w-2 h-8 bg-[#0F766E]"></div> {tProfile('services')}
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {doctor.services?.map((s: any, i: number) => (
                                        <div key={s.id} className="p-6 bg-white border border-slate-200 rounded-sm flex items-center justify-between group hover:border-[#0F766E] transition-all shadow-sm">
                                            <div>
                                                <div className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-1 group-hover:text-[#0F766E] transition-colors">
                                                    {s.service.name}
                                                </div>
                                                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                                    {s.service.duration_minutes} {tProfile('duration')}
                                                </div>
                                            </div>
                                            <div className="text-base font-bold text-[#0F766E]">
                                                {s.custom_price || s.service.base_price} AZN
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.section>

                            <motion.section
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="text-3xl font-display text-slate-900 mb-8 tracking-tight flex items-center gap-4">
                                    <div className="w-2 h-8 bg-[#0F766E]"></div> {locale === 'az' ? 'Klinik Ünvanlar' : 'Клинические Адреса'}
                                </h2>
                                <div className="space-y-4">
                                    {doctor.branches?.map((b: any) => (
                                        <div
                                            key={b.branch.id}
                                            className={`p-6 rounded-sm border transition-all cursor-pointer ${selectedBranchId === b.branch.id
                                                ? 'bg-[#E0F2F1] border-[#0F766E] shadow-md'
                                                : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                                                }`}
                                            onClick={() => {
                                                setSelectedBranchId(b.branch.id);
                                                setSelectedTime(null);
                                            }}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <h4 className="font-bold text-slate-900">{b.branch.name}</h4>
                                                        {b.is_primary && (
                                                            <span className="text-[8px] bg-[#0F766E] text-white px-2 py-0.5 rounded-full font-black uppercase tracking-widest">Primary</span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                                        <MapPin size={14} />
                                                        {b.branch.address_line1}, {b.branch.city}
                                                    </div>
                                                </div>
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selectedBranchId === b.branch.id ? 'border-[#0F766E] bg-[#0F766E]' : 'border-slate-300'
                                                    }`}>
                                                    {selectedBranchId === b.branch.id && <div className="w-2 h-2 bg-white rounded-full" />}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.section>
                        </div>
                    </div>

                    {/* Booking Flow Sidebar */}
                    <aside className="space-y-8" id="booking-section">
                        <motion.div
                            className="bg-[#0F172A] p-8 md:p-10 rounded-sm shadow-2xl text-white sticky top-24 relative overflow-hidden"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-[#0F766E]"></div>

                            <AnimatePresence mode="wait">
                                {step === 1 ? (
                                    <motion.div
                                        key="step1"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                    >
                                        <div className="flex items-center gap-4 mb-10">
                                            <Calendar size={24} className="text-[#0F766E]" />
                                            <h2 className="text-xl font-bold uppercase tracking-tight">{tProfile('booking_title')}</h2>
                                        </div>

                                        <div className="space-y-10">
                                            {/* Reason Selection */}
                                            <div>
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 block">{tProfile('step1')}</label>
                                                <div className="relative group/select">
                                                    <select
                                                        value={selectedServiceId}
                                                        onChange={(e) => setSelectedServiceId(e.target.value)}
                                                        className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-4 text-xs font-bold uppercase tracking-widest appearance-none outline-none focus:bg-white/10 transition-all cursor-pointer"
                                                    >
                                                        <option value="" className="bg-slate-900">{tProfile('select_consultation')}</option>
                                                        {doctor.services?.map((s: any) => (
                                                            <option key={s.service.id} value={s.service.id} className="bg-slate-900">
                                                                {s.service.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none group-hover/select:text-white transition-colors" size={16} />
                                                </div>
                                            </div>

                                            {/* Date Selection */}
                                            <div className={!selectedServiceId ? 'opacity-20 pointer-events-none grayscale' : ''}>
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 block">{tProfile('step2')}</label>
                                                <div className="grid grid-cols-4 gap-2">
                                                    {dates.map((d) => (
                                                        <button
                                                            key={d.date}
                                                            onClick={() => {
                                                                setSelectedDate(d.date);
                                                                setSelectedTime(null);
                                                            }}
                                                            className={`py-3 px-1 rounded-sm text-center transition-all border ${selectedDate === d.date
                                                                ? 'bg-[#0F766E] border-[#0F766E] text-white shadow-[#0F766E]/20 shadow-lg'
                                                                : 'border-white/5 bg-white/5 hover:bg-white/10 text-white/60'
                                                                } ${d.isWeekend ? 'opacity-40' : ''}`}
                                                        >
                                                            <div className="text-[8px] font-black uppercase tracking-widest opacity-60 mb-0.5">{d.day}</div>
                                                            <div className="text-xs font-bold">{d.num}</div>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Time Selection */}
                                            <div className={!selectedDate || isLoadingSlots ? 'opacity-20 pointer-events-none grayscale' : ''}>
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 block">{tProfile('step3')}</label>

                                                {isLoadingSlots ? (
                                                    <div className="flex justify-center py-4">
                                                        <Loader2 className="animate-spin text-[#0F766E]" size={24} />
                                                    </div>
                                                ) : (
                                                    <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                                        {availableSlots && availableSlots.length > 0 ? (
                                                            availableSlots.map((t: string) => (
                                                                <button
                                                                    key={t}
                                                                    onClick={() => setSelectedTime(t)}
                                                                    className={`py-3 rounded-sm text-[10px] font-black transition-all border ${selectedTime === t
                                                                        ? 'bg-[#0F766E] border-[#0F766E] text-white'
                                                                        : 'border-white/5 bg-white/5 hover:bg-white/10 text-white/60'
                                                                        }`}
                                                                >
                                                                    {t}
                                                                </button>
                                                            ))
                                                        ) : (
                                                            <div className="col-span-3 text-center py-4 text-xs text-white/40 uppercase tracking-widest font-bold">
                                                                {locale === 'az' ? 'Boş vaxt yoxdur' : 'Нет свободного времени'}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            <button
                                                onClick={handleBooking}
                                                disabled={!selectedDate || !selectedTime || !selectedServiceId || createAppointment.isPending}
                                                className="w-full py-5 bg-[#0F766E] text-white font-black uppercase tracking-[0.3em] text-[10px] rounded-sm disabled:opacity-20 disabled:grayscale hover:bg-[#134E4A] transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-3 mt-8"
                                            >
                                                {createAppointment.isPending ? <Loader2 className="animate-spin" size={18} /> : (
                                                    <>{tProfile('finalize')} <ChevronRight size={18} /></>
                                                )}
                                            </button>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="step2"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-center py-10"
                                    >
                                        <div className="w-20 h-20 bg-[#0F766E] rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-[#0F766E]/30">
                                            <CheckCircle size={40} className="text-white" />
                                        </div>
                                        <h2 className="text-2xl font-bold uppercase tracking-tight mb-4">{tProfile('success_title')}</h2>
                                        <p className="text-white/60 text-xs font-medium uppercase tracking-widest leading-relaxed mb-10">
                                            {selectedDate} @ {selectedTime} <br />
                                            {tProfile('verification_code')}: <span className="text-[#2DD4BF] font-mono font-bold">{verificationCode}</span>
                                        </p>
                                        <div className="p-6 bg-white/5 border border-white/10 rounded-sm text-left">
                                            <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest leading-relaxed">
                                                {tProfile('success_desc')}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setStep(1);
                                                setSelectedDate(null);
                                                setSelectedTime(null);
                                            }}
                                            className="mt-12 text-[10px] font-black text-[#0F766E] hover:text-[#2DD4BF] uppercase tracking-[0.3em] transition-colors"
                                        >
                                            {tProfile('new_visit')}
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        <motion.div
                            className="p-8 bg-white border border-slate-200 rounded-sm text-center shadow-sm"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <Phone className="mx-auto mb-4 text-[#0F766E]" size={24} />
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{tProfile('contact_registry')}</div>
                            <div className="text-base font-bold text-slate-900 tracking-tighter">+994 12 440 00 00</div>
                        </motion.div>

                        {/* Recommendation Card */}
                        <motion.div
                            className="p-8 bg-gradient-to-br from-[#0F766E] to-[#134E4A] rounded-sm text-white relative overflow-hidden shadow-xl"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <Heart size={48} className="absolute -bottom-4 -right-4 text-white/10" />
                            <h4 className="font-bold mb-3 flex items-center gap-2">
                                <Info size={16} />
                                {locale === 'az' ? 'Təcili Yardıma ehtiyac var?' : 'Нужна Экстренная Помощь?'}
                            </h4>
                            <p className="text-white/70 text-xs leading-relaxed mb-6 font-medium">
                                {locale === 'az'
                                    ? 'Əgər vəziyyətiniz təcilidirsə, xahiş edirik dərhal 103 xidməti ilə əlaqə saxlayın.'
                                    : 'Если ваше состояние критическое, пожалуйста, немедленно свяжитесь со службой 103.'}
                            </p>
                        </motion.div>
                    </aside>
                </div>
            </div>

            {/* Mobile Sticky Booking Bar */}
            <div className="lg:hidden fixed bottom-6 left-6 right-6 z-50">
                <motion.button
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    onClick={() => {
                        const bookingEl = document.getElementById('booking-section');
                        bookingEl?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full py-5 bg-[#0F766E] text-white font-black uppercase tracking-[0.3em] text-xs rounded-full shadow-[0_20px_40px_-10px_rgba(15,118,110,0.5)] flex items-center justify-center gap-3 border border-white/10"
                >
                    <Calendar size={18} />
                    {t('instant_booking')}
                </motion.button>
            </div>
        </div>
    );
}
