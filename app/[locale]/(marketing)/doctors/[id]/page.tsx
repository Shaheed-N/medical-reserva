"use client";

import { useState, use, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import {
    MapPin, Star, CheckCircle,
    Info, Shield, ChevronRight,
    ThumbsUp, Clock, CalendarCheck,
    Calendar, ChevronDown, Building2,
    ArrowLeft, Loader2
} from 'lucide-react';
import Link from 'next/link';
import { useDoctor, useCreateAppointment, useAvailableSlots } from '@/lib/hooks';
import { DoctorProfileSkeleton } from '@/components/index';
import { format, parse, addMinutes } from 'date-fns';
import { az, ru } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';

export default function DoctorProfilePage({ params: paramsPromise }: { params: Promise<{ id: string, locale: string }> }) {
    const params = use(paramsPromise);
    const id = params.id;
    const locale = params.locale || 'az';

    const t = useTranslations('Doctors');
    const tCommon = useTranslations('Common');
    const tProfile = useTranslations('Doctors.profile');

    const { data: doctor, isLoading, error } = useDoctor(id);
    const createAppointment = useCreateAppointment();

    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [selectedServiceId, setSelectedServiceId] = useState<string>('');
    const [selectedBranchId, setSelectedBranchId] = useState<string>('');
    const [step, setStep] = useState(1);
    const [verificationCode] = useState(() => `MP-${Math.random().toString(36).substring(7).toUpperCase()}`);

    // Zocdoc-style Tab State
    const [activeTab, setActiveTab] = useState<'about' | 'reviews' | 'locations' | 'insurance'>('about');

    const { data: availableSlots, isLoading: isLoadingSlots } = useAvailableSlots(
        id,
        selectedBranchId,
        selectedDate || ''
    );

    // Initial branch and service selection
    useEffect(() => {
        if (doctor) {
            if (!selectedBranchId && doctor.branches?.length > 0) {
                const primaryBranch = doctor.branches.find((b: any) => b.is_primary)?.branch?.id || doctor.branches[0]?.branch?.id;
                if (primaryBranch) setSelectedBranchId(primaryBranch);
            }
            if (!selectedServiceId && doctor.services?.length > 0) {
                setSelectedServiceId(doctor.services[0]?.service?.id || '');
            }
        }
    }, [doctor, selectedBranchId, selectedServiceId]);

    if (isLoading) return <DoctorProfileSkeleton />;

    if (error || !doctor) return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-cyan-50/30 to-white">
            <div className="text-center p-12 bg-white rounded-2xl shadow-xl border border-slate-100 max-w-md">
                <Info size={64} className="mx-auto text-slate-200 mb-6" />
                <h2 className="text-2xl font-bold text-slate-900 mb-4">{t('no_results')}</h2>
                <Link href={`/${locale}/doctors`} className="inline-flex items-center gap-2 text-cyan-600 font-bold hover:gap-3 transition-all">
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

        const patientId = '00000000-0000-0000-0000-000000000000';
        const serviceData = doctor.services.find((s: any) => s.service.id === selectedServiceId);
        const duration = serviceData?.service.duration_minutes || 30;

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

    // Derived Data
    const primaryBranch = doctor.branches?.find((b: any) => b.is_primary)?.branch || doctor.branches?.[0]?.branch;
    const hospitalName = primaryBranch?.hospital?.name || 'Hospital';
    const totalReviews = doctor.reviews?.length || 0;
    const averageRating = totalReviews > 0
        ? (doctor.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / totalReviews).toFixed(2)
        : 'New';

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            {/* HERObanner - Zocdoc Style */}
            <div className="bg-white border-b border-slate-200">
                <div className="container mx-auto px-4 py-8 md:py-12">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        {/* Avatar */}
                        <div className="relative shrink-0">
                            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-xl">
                                <img
                                    src={doctor.user?.avatar_url || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80'}
                                    alt={doctor.user?.full_name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute bottom-0 right-0 bg-cyan-500 text-white p-2 rounded-full shadow-lg border-2 border-white">
                                <Shield size={16} fill="currentColor" />
                            </div>
                        </div>

                        {/* Info Block */}
                        <div className="flex-1 space-y-4">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">
                                    Dr. {doctor.user?.full_name}
                                </h1>
                                <p className="text-lg text-slate-500 font-medium mb-1">
                                    {doctor.specialties?.[0] || 'Specialist'}
                                </p>
                                <p className="text-slate-400 text-sm flex items-center gap-2">
                                    <MapPin size={16} />
                                    {primaryBranch?.address_line1}, {primaryBranch?.city}
                                </p>
                            </div>

                            {/* Ratings Badge */}
                            <div className="flex flex-wrap items-center gap-6">
                                <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                                    <div className="flex text-amber-400">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <Star key={s} size={16} fill="currentColor" className={s <= Number(averageRating) ? '' : 'text-slate-200'} />
                                        ))}
                                    </div>
                                    <span className="font-bold text-slate-900">{averageRating}</span>
                                    <span className="text-slate-400 text-sm">({totalReviews} reviews)</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg">
                                    <CheckCircle size={16} />
                                    Verified License
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions (Desktop) */}
                        <div className="hidden md:block min-w-[300px] bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                            <h3 className="font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Easy Booking</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500">Video Visit</span>
                                    <span className="font-bold text-emerald-600">Available</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500">New Patients</span>
                                    <span className="font-bold text-emerald-600">Accepted</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500">Wait Time</span>
                                    <span className="font-bold text-slate-900">~15 mins</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="container mx-auto px-4 mt-8">
                    <div className="flex gap-8 overflow-x-auto scrollbar-hide border-b border-slate-200">
                        {['about', 'reviews', 'locations', 'insurance'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={`pb-4 px-2 text-sm font-bold uppercase tracking-wider whitespace-nowrap transition-colors border-b-2 ${activeTab === tab
                                        ? 'border-cyan-600 text-cyan-600'
                                        : 'border-transparent text-slate-400 hover:text-slate-600'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="container mx-auto px-4 py-8 md:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* LEFT COLUMN (2/3) */}
                    <div className="lg:col-span-2 space-y-12">

                        {/* HIGHLIGHTS */}
                        <section>
                            <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                                <Star className="text-amber-400" fill="currentColor" /> Highlights
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-3">
                                    <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center">
                                        <ThumbsUp size={20} />
                                    </div>
                                    <span className="font-bold text-slate-900">Highly Recommended</span>
                                    <p className="text-xs text-slate-500">98% of patients recommend this doctor.</p>
                                </div>
                                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-3">
                                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                                        <Clock size={20} />
                                    </div>
                                    <span className="font-bold text-slate-900">Excellent Wait Time</span>
                                    <p className="text-xs text-slate-500">Average wait time is under 10 minutes.</p>
                                </div>
                                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-3">
                                    <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
                                        <CalendarCheck size={20} />
                                    </div>
                                    <span className="font-bold text-slate-900">Easy Scheduling</span>
                                    <p className="text-xs text-slate-500">Appointments available this week.</p>
                                </div>
                            </div>
                        </section>

                        {/* ABOUT */}
                        <section id="about">
                            <h2 className="text-xl font-black text-slate-900 mb-4">About Dr. {doctor.user?.full_name}</h2>
                            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-slate-600 leading-relaxed text-lg">
                                {doctor.bio || `Dr. ${doctor.user?.full_name} is a dedicated ${doctor.specialties?.[0]} with over ${doctor.years_of_experience || 5} years of experience. We provide comprehensive care focusing on patient comfort and long-term health outcomes.`}
                            </div>
                        </section>

                        {/* SERVICES & CONDITIONS */}
                        <section>
                            <h2 className="text-xl font-black text-slate-900 mb-4">Areas of Expertise</h2>
                            <div className="flex flex-wrap gap-2">
                                {doctor.services?.map((s: any) => (
                                    <span key={s.id} className="px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg text-sm">
                                        {s.service?.name}
                                    </span>
                                ))}
                                {!doctor.services?.length && (
                                    <p className="text-slate-400 italic">General Consultation</p>
                                )}
                            </div>
                        </section>

                        {/* REVIEWS */}
                        <section id="reviews">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-black text-slate-900">Patient Reviews</h2>
                                <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-full">
                                    Trusted & Verified
                                </span>
                            </div>

                            <div className="space-y-4">
                                {doctor.reviews?.length > 0 ? doctor.reviews.map((review: any) => (
                                    <div key={review.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm">
                                                    {review.patient?.full_name?.[0] || 'A'}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-900">{review.patient?.full_name || 'Anonymous'}</div>
                                                    <div className="text-xs text-slate-400">Verified Patient</div>
                                                </div>
                                            </div>
                                            <div className="flex text-amber-400 text-sm">
                                                {[...Array(review.rating)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                                            </div>
                                        </div>
                                        <p className="text-slate-600 italic">"{review.comment}"</p>
                                        <div className="mt-4 text-xs text-slate-400 font-bold uppercase tracking-wider">
                                            {new Date(review.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center p-12 bg-white rounded-2xl border border-slate-100 border-dashed">
                                        <p className="text-slate-400">No reviews yet.</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* RIGHT COLUMN (1/3) - STICKY BOOKING */}
                    <div className="relative">
                        <div className="sticky top-24 space-y-6">

                            {/* Booking Widget */}
                            <div className="bg-white rounded-[2rem] p-6 shadow-xl shadow-cyan-900/5 border border-slate-100 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-cyan-400 to-teal-400"></div>
                                <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                                    <Calendar className="text-cyan-600" />
                                    {tProfile('book_appointment')}
                                </h3>

                                {/* Branch Selection */}
                                {doctor.branches?.length > 1 && (
                                    <div className="mb-6">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Choose Branch</label>
                                        <div className="relative">
                                            <select
                                                className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                                                value={selectedBranchId}
                                                onChange={(e) => setSelectedBranchId(e.target.value)}
                                            >
                                                {doctor.branches.map((b: any) => (
                                                    <option key={b.branch.id} value={b.branch.id}>{b.branch.name} - {b.branch.city}</option>
                                                ))}
                                            </select>
                                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                                        </div>
                                    </div>
                                )}

                                {/* Date Selection */}
                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest">{format(new Date(), 'MMMM yyyy')}</label>
                                        <div className="flex gap-2">
                                            <button className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center hover:bg-cyan-50 text-slate-400 hover:text-cyan-600 transition-colors">
                                                <ChevronDown className="rotate-90" size={16} />
                                            </button>
                                            <button className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center hover:bg-cyan-50 text-slate-400 hover:text-cyan-600 transition-colors">
                                                <ChevronRight size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-2 px-2">
                                        {dates.map((date) => (
                                            <button
                                                key={date.date}
                                                onClick={() => setSelectedDate(date.date)}
                                                className={`flex flex-col items-center min-w-[4.5rem] p-3 rounded-2xl border-2 transition-all ${selectedDate === date.date
                                                        ? 'bg-slate-900 border-slate-900 text-white shadow-lg transform scale-105'
                                                        : 'bg-white border-slate-100 text-slate-400 hover:border-cyan-200 hover:bg-cyan-50'
                                                    }`}
                                            >
                                                <span className="text-[10px] uppercase font-bold tracking-wider mb-1 opacity-80">{date.day}</span>
                                                <span className="text-xl font-black">{date.num}</span>
                                                {date.isWeekend && <div className="w-1 h-1 rounded-full bg-current mt-1 opacity-50"></div>}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Time Selection */}
                                <div className="mb-8">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 block">Available Time</label>

                                    {isLoadingSlots ? (
                                        <div className="flex justify-center py-8">
                                            <Loader2 className="animate-spin text-cyan-500" />
                                        </div>
                                    ) : availableSlots && availableSlots.length > 0 ? (
                                        <div className="grid grid-cols-3 gap-3">
                                            {availableSlots.map((time: string) => (
                                                <button
                                                    key={time}
                                                    onClick={() => setSelectedTime(time)}
                                                    className={`py-2 rounded-xl text-sm font-bold border-2 transition-all ${selectedTime === time
                                                            ? 'bg-cyan-500 border-cyan-500 text-white shadow-md'
                                                            : 'bg-white border-slate-100 text-slate-600 hover:border-cyan-200 hover:text-cyan-600'
                                                        }`}
                                                >
                                                    {time}
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                            <Clock className="mx-auto text-slate-300 mb-2" />
                                            <p className="text-sm font-bold text-slate-400">No slots available</p>
                                        </div>
                                    )}
                                </div>

                                {/* Action Button */}
                                <button
                                    onClick={handleBooking}
                                    disabled={!selectedDate || !selectedTime}
                                    className="w-full py-4 rounded-2xl bg-slate-900 text-white font-black uppercase tracking-widest hover:bg-cyan-600 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none shadow-xl flex items-center justify-center gap-3 group"
                                >
                                    Confirm Booking
                                    <ChevronRight className="group-hover:translate-x-1 transition-transform" size={18} />
                                </button>
                            </div>

                            {/* Location Card */}
                            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-lg">
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="w-12 h-12 bg-cyan-50 rounded-xl flex items-center justify-center text-cyan-600 shrink-0">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-slate-900">{hospitalName}</h3>
                                        <p className="text-sm text-slate-500 mt-1">
                                            {primaryBranch?.address_line1}, {primaryBranch?.city}
                                        </p>
                                        <a href="#" className="text-xs font-bold text-cyan-600 mt-2 block hover:underline">
                                            Get Directions
                                        </a>
                                    </div>
                                </div>
                                <div className="h-40 bg-slate-100 rounded-xl mb-6 overflow-hidden relative">
                                    <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-xs font-bold uppercase tracking-widest">
                                        Map Preview
                                    </div>
                                </div>
                            </div>

                            {/* Insurances */}
                            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                                <h3 className="font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Accepted Insurance</h3>
                                <div className="space-y-2">
                                    {doctor.insurances?.map((ins: any) => (
                                        <div key={ins.company.id} className="flex items-center gap-3 text-sm text-slate-600">
                                            <CheckCircle size={14} className="text-emerald-500" />
                                            {ins.company.name}
                                        </div>
                                    ))}
                                    {!doctor.insurances?.length && (
                                        <p className="text-sm text-slate-400">Please contact the clinic to verify insurance coverage.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
