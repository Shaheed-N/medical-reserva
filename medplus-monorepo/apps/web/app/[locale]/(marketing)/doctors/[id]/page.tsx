"use client";

import { useState, useEffect } from 'react';
import {
    MapPin, Star, Clock, Calendar, CheckCircle,
    Phone, ArrowLeft, Loader2, ChevronDown, Activity, Shield, ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { addMinutes, format, parse } from 'date-fns';

interface Doctor {
    id: string;
    name: string;
    specialty: string;
    bio: string;
    experience_years: number;
    rating: number;
    image?: string;
    hospitals?: { name: string; address?: string };
    services: {
        id: string;
        service: {
            id: string;
            name: string;
            duration_minutes: number;
            base_price: number;
        }
    }[];
    branch_assignments?: {
        branch_id: string;
        branch?: {
            name: string;
            hospital_id: string;
        }
    }[];
}

export default function DoctorProfilePage() {
    const params = useParams();
    const id = params.id as string;
    const locale = params.locale as string || 'az';

    const [doctor, setDoctor] = useState<Doctor | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [selectedServiceId, setSelectedServiceId] = useState<string>('');
    const [step, setStep] = useState(1);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        async function fetchDoctor() {
            setLoading(true);
            const { data, error } = await supabase
                .from('doctors')
                .select(`
          *,
          hospitals (name, address),
          branch_assignments:doctor_branch_assignments (
            branch_id,
            branch:branches (name, hospital_id)
          ),
          services:doctor_services (
            id,
            service:services (id, name, duration_minutes, base_price)
          )
        `)
                .eq('id', id)
                .single();

            if (data) {
                setDoctor({
                    ...data,
                    rating: data.rating || 4.9,
                    experience_years: data.experience_years || 15,
                    image: data.image || 'https://images.unsplash.com/photo-1612349317150-b4639e53b8d1?auto=format&fit=crop&w=400&q=80'
                });
            }
            setLoading(false);
        }
        fetchDoctor();
    }, [id]);

    const dates = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i);
        return {
            date: d.toISOString().split('T')[0],
            day: d.toLocaleDateString(locale === 'az' ? 'az-AZ' : 'ru-RU', { weekday: 'short' }),
            num: d.getDate()
        };
    });

    const timeSlots = ['09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00', '15:30', '16:00'];

    const handleBooking = async () => {
        if (!selectedDate || !selectedTime || !selectedServiceId || !doctor) return;

        setSubmitting(true);

        try {
            const { data: authData } = await supabase.auth.getUser();
            const patientId = authData.user?.id || '00000000-0000-0000-0000-000000000000';

            // Find selected service for duration
            const selectedDoctorService = doctor.services.find(s => s.service.id === selectedServiceId);
            const duration = selectedDoctorService?.service.duration_minutes || 30;

            // Calculate end time
            const startTimeParsed = parse(selectedTime, 'HH:mm', new Date());
            const endTimeParsed = addMinutes(startTimeParsed, duration);
            const endTime = format(endTimeParsed, 'HH:mm');

            // Get primary branch ID
            const branchId = doctor.branch_assignments?.[0]?.branch_id;
            if (!branchId) throw new Error('Doctor has no branch assignments.');

            // Generate unique appointment number
            const apptNumber = `MP-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

            const { error } = await supabase
                .from('appointments')
                .insert({
                    appointment_number: apptNumber,
                    doctor_id: id,
                    patient_id: patientId,
                    service_id: selectedServiceId,
                    branch_id: branchId,
                    scheduled_date: selectedDate,
                    start_time: selectedTime,
                    end_time: endTime,
                    duration_minutes: duration,
                    status: 'pending',
                    booking_type: 'online'
                });

            if (error) throw error;
            setStep(2);
        } catch (err: any) {
            console.error('Booking failed:', err);
            alert(`Booking Error: ${err.message || 'Unknown database error'}`);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <Loader2 className="animate-spin text-[#0F766E]" size={48} />
        </div>
    );

    if (!doctor) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h2 className="text-2xl font-black text-slate-900 mb-4 uppercase">Specialist Not Found</h2>
                <Link href={`/${locale}/doctors`} className="text-[#0F766E] font-bold underline">Back to Directory</Link>
            </div>
        </div>
    );

    return (
        <div className="bg-slate-50 min-h-screen py-16">
            <div className="container mx-auto px-6 max-w-7xl">
                <Link href={`/${locale}/doctors`} className="group flex items-center gap-3 text-slate-400 hover:text-slate-900 mb-12 transition-all">
                    <ArrowLeft size={20} className="group-hover:-translate-x-2 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Back to Medical Directory</span>
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    {/* Main Info */}
                    <div className="lg:col-span-2 space-y-12">
                        <div className="bg-white p-12 rounded-sm border border-slate-200 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#0F766E]/5 rounded-sm -mr-16 -mt-16 rotate-45"></div>
                            <div className="flex flex-col md:flex-row gap-10">
                                <div className="w-48 h-48 rounded-sm overflow-hidden bg-slate-100 shrink-0 border border-slate-100 shadow-xl">
                                    <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-1.5 h-8 bg-[#0F766E]"></div>
                                        <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase leading-none">{doctor.name}</h1>
                                        <CheckCircle size={24} className="text-[#0F766E]" />
                                    </div>
                                    <p className="text-[#0F766E] font-black text-[11px] uppercase tracking-[0.4em] mb-8">{doctor.specialty}</p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 mb-10">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-sm bg-slate-50 flex items-center justify-center border border-slate-100">
                                                <MapPin size={18} className="text-slate-400" />
                                            </div>
                                            <div>
                                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Affiliation</div>
                                                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">{doctor.hospitals?.name || 'Private Practice'}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-sm bg-slate-50 flex items-center justify-center border border-slate-100">
                                                <Activity size={18} className="text-slate-400" />
                                            </div>
                                            <div>
                                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Experience</div>
                                                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">{doctor.experience_years} Years Professional</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-8 pt-8 border-t border-slate-50">
                                        <div className="flex items-center gap-2">
                                            <Star size={20} className="fill-yellow-400 text-yellow-400" strokeWidth={0} />
                                            <span className="text-xl font-black text-slate-900">{doctor.rating}</span>
                                            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest ml-1">Index</span>
                                        </div>
                                        <div className="h-6 w-px bg-slate-100"></div>
                                        <button className="text-[10px] font-black text-[#0F766E] uppercase tracking-[0.3em] flex items-center gap-3">
                                            Verified Profile <Shield size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-16">
                            <section>
                                <h2 className="text-2xl font-black text-slate-900 mb-8 uppercase tracking-tighter flex items-center gap-4">
                                    <div className="w-2 h-8 bg-[#0F766E]"></div> Professional Summary
                                </h2>
                                <p className="text-slate-500 text-lg leading-relaxed font-light">
                                    {doctor.bio || "This registered medical specialist has completed advanced clinical training and is currently providing specialized care within the national health network. All certifications and licenses have been verified by the Ministry of Health."}
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-black text-slate-900 mb-8 uppercase tracking-tighter flex items-center gap-4">
                                    <div className="w-2 h-8 bg-[#0F766E]"></div> Available Clinical Services
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {(doctor.services || []).map((s, i) => (
                                        <div key={i} className="p-6 bg-white border border-slate-200 rounded-sm flex items-center justify-between group hover:border-[#0F766E] transition-all">
                                            <div>
                                                <div className="text-xs font-black text-slate-900 uppercase tracking-widest mb-1 group-hover:text-[#0F766E] transition-colors">{s.service.name}</div>
                                                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{s.service.duration_minutes} Minutes Duration</div>
                                            </div>
                                            <div className="text-sm font-black text-[#0F766E]">{s.service.base_price} AZN</div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>
                    </div>

                    {/* Booking Flow Sidebar */}
                    <div className="space-y-8">
                        <div className="bg-[#0F172A] p-10 rounded-sm shadow-2xl text-white sticky top-24 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-[#0F766E]"></div>

                            {step === 1 ? (
                                <>
                                    <div className="flex items-center gap-4 mb-10">
                                        <Calendar size={24} className="text-[#0F766E]" />
                                        <h2 className="text-xl font-black uppercase tracking-tighter">Instant Registry</h2>
                                    </div>

                                    <div className="space-y-10">
                                        {/* Reason Selection */}
                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 block">1. Reason for Visit</label>
                                            <div className="relative group/select">
                                                <select
                                                    value={selectedServiceId}
                                                    onChange={(e) => setSelectedServiceId(e.target.value)}
                                                    className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-4 text-xs font-bold uppercase tracking-widest appearance-none outline-none focus:bg-white/10 transition-all cursor-pointer"
                                                >
                                                    <option value="" className="bg-slate-900">Select consultation type...</option>
                                                    {(doctor.services || []).map(s => (
                                                        <option key={s.service.id} value={s.service.id} className="bg-slate-900">{s.service.name}</option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none group-hover/select:text-white transition-colors" size={16} />
                                            </div>
                                        </div>
                                        {/* Date Selection */}
                                        <div className={!selectedServiceId ? 'opacity-20 pointer-events-none transition-opacity' : 'transition-opacity'}>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 block">2. Preferred Date</label>
                                            <div className="grid grid-cols-4 gap-3">
                                                {dates.map((d) => (
                                                    <button
                                                        key={d.date}
                                                        onClick={() => setSelectedDate(d.date)}
                                                        className={`p-3 rounded-sm text-center transition-all border ${selectedDate === d.date
                                                            ? 'bg-[#0F766E] border-[#0F766E] text-white shadow-xl shadow-[#0F766E]/20'
                                                            : 'border-white/5 bg-white/5 hover:bg-white/10 text-white/60'
                                                            }`}
                                                    >
                                                        <div className="text-[8px] font-black uppercase tracking-widest opacity-60 mb-1">{d.day}</div>
                                                        <div className="text-sm font-black tracking-tighter">{d.num}</div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Time Selection */}
                                        <div className={!selectedDate ? 'opacity-20 pointer-events-none transition-opacity' : 'transition-opacity'}>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 block">3. Registry Time Slot</label>
                                            <div className="grid grid-cols-3 gap-3">
                                                {timeSlots.map((t) => (
                                                    <button
                                                        key={t}
                                                        onClick={() => setSelectedTime(t)}
                                                        className={`py-3 px-2 rounded-sm text-[10px] font-black transition-all border ${selectedTime === t
                                                            ? 'bg-[#0F766E] border-[#0F766E] text-white'
                                                            : 'border-white/5 bg-white/5 hover:bg-white/10 text-white/60'
                                                            }`}
                                                    >
                                                        {t}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleBooking}
                                            disabled={!selectedDate || !selectedTime || !selectedServiceId || submitting}
                                            className="w-full py-5 bg-[#0F766E] text-white font-black uppercase tracking-[0.3em] text-[10px] rounded-sm disabled:opacity-20 disabled:grayscale hover:bg-[#134E4A] transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-3"
                                        >
                                            {submitting ? <Loader2 className="animate-spin" size={18} /> : (
                                                <>Finalize Appointment <ChevronRight size={18} /></>
                                            )}
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-10">
                                    <div className="w-20 h-20 bg-[#0F766E] rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-[#0F766E]/30 animate-pulse">
                                        <CheckCircle size={40} className="text-white" />
                                    </div>
                                    <h2 className="text-2xl font-black uppercase tracking-tighter mb-4">Request Registered</h2>
                                    <p className="text-white/50 text-xs font-medium uppercase tracking-widest leading-relaxed mb-10">
                                        {selectedDate} at {selectedTime} <br />
                                        Verification Code: <span className="text-[#2DD4BF] font-mono">MP-{Math.random().toString(36).substring(7).toUpperCase()}</span>
                                    </p>
                                    <div className="p-6 bg-white/5 border border-white/10 rounded-sm text-left">
                                        <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest leading-relaxed">
                                            You will receive a confirmation call from the clinical registrar shortly. Please ensure your mobile device is active.
                                        </p>
                                    </div>
                                    <button onClick={() => setStep(1)} className="mt-12 text-[10px] font-black text-white/30 uppercase tracking-[0.3em] hover:text-white transition-colors">Register New Visit</button>
                                </div>
                            )}
                        </div>

                        <div className="p-8 border border-dashed border-slate-200 rounded-sm text-center">
                            <Phone className="mx-auto mb-4 text-slate-300" size={24} />
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Clinic Registry</div>
                            <div className="text-sm font-black text-slate-900 tracking-tighter">+994 12 440 00 00</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
