"use client";

import { useState, useEffect } from 'react';
import {
    Plus, Search, Filter, MoreVertical,
    Calendar, Clock, User, CheckCircle,
    XCircle, Loader2, CalendarDays, ExternalLink,
    ChevronRight, AlertCircle
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Appointment {
    id: string;
    patient_id: string;
    doctor_id: string;
    scheduled_date: string;
    start_time: string;
    status: string;
    notes: string;
    doctors?: { name: string };
    users?: { full_name: string }; // patient name
}

export default function AppointmentsAdminPage() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        fetchAppointments();
    }, []);

    async function fetchAppointments() {
        setLoading(true);
        // Real Supabase fetching with joins
        const { data } = await supabase
            .from('appointments')
            .select('*, doctors(name), users(full_name)')
            .order('scheduled_date', { ascending: false });

        if (data) setAppointments(data);
        setLoading(false);
    }

    async function updateStatus(id: string, status: string) {
        const { error } = await supabase
            .from('appointments')
            .update({ status })
            .eq('id', id);

        if (error) alert(error.message);
        else fetchAppointments();
    }

    const stats = {
        total: appointments.length,
        pending: appointments.filter(a => a.status === 'pending').length,
        confirmed: appointments.filter(a => a.status === 'confirmed').length,
        completed: appointments.filter(a => a.status === 'completed').length
    };

    return (
        <div className="space-y-10">
            {/* Heavy Admin Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-1.5 h-10 bg-[#0F766E]"></div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Clinical Appointments</h1>
                    </div>
                    <p className="text-slate-500 text-[11px] font-black uppercase tracking-[0.3em] opacity-60">National Patient Scheduling System</p>
                </div>

                <div className="flex gap-4">
                    <button className="px-8 py-4 bg-[#0F172A] text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-sm hover:scale-105 transition-all shadow-xl active:scale-95 flex items-center gap-3">
                        <CalendarDays size={18} /> Schedule Report
                    </button>
                </div>
            </div>

            {/* Modern Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Total Visits', value: stats.total, color: 'slate' },
                    { label: 'Pending Check', value: stats.pending, color: 'orange' },
                    { label: 'Confirmed', value: stats.confirmed, color: 'emerald' },
                    { label: 'Completed', value: stats.completed, color: 'blue' },
                ].map((s, i) => (
                    <div key={i} className="bg-white p-8 rounded-sm border border-slate-200 shadow-sm relative overflow-hidden group hover:border-[#0F766E] transition-all">
                        <div className="relative z-10">
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{s.label}</div>
                            <div className="text-4xl font-black text-slate-900 tracking-tighter">{s.value}</div>
                        </div>
                        <div className="absolute -bottom-6 -right-6 text-slate-50 group-hover:text-[#0F766E]/5 transition-colors">
                            <Calendar size={100} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters & Actions */}
            <div className="bg-white p-8 rounded-sm border border-slate-200 flex flex-wrap items-center gap-6 shadow-sm">
                <div className="flex-1 min-w-[300px] relative group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0F766E] transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search by Patient name, ID or Transaction..."
                        className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-sm outline-none focus:ring-2 focus:ring-[#0F766E]/20 text-sm font-medium"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <Filter size={18} className="text-slate-400" />
                    <div className="flex bg-slate-100 p-1 rounded-sm gap-1">
                        {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((s) => (
                            <button
                                key={s}
                                onClick={() => setFilterStatus(s)}
                                className={`px-4 py-2 text-[9px] font-black uppercase tracking-widest rounded-sm transition-all ${filterStatus === s ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Appointment Table */}
            <div className="bg-white rounded-sm border border-slate-200 overflow-hidden shadow-2xl">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-[#0F172A] text-white">
                            <th className="text-left px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em]">Patient Details</th>
                            <th className="text-left px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em]">Doctor / Specialty</th>
                            <th className="text-left px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em]">Schedule</th>
                            <th className="text-left px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em]">Status Index</th>
                            <th className="text-right px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em]">Administrative Manage</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="py-32 text-center">
                                    <Loader2 className="animate-spin text-[#0F766E] mx-auto mb-6" size={48} />
                                    <div className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Accessing Central Database...</div>
                                </td>
                            </tr>
                        ) : appointments.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="py-32 text-center">
                                    <AlertCircle className="text-slate-200 mx-auto mb-6" size={48} />
                                    <div className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">No appointment records found today.</div>
                                </td>
                            </tr>
                        ) : appointments.map((appt) => (
                            <tr key={appt.id} className="hover:bg-slate-50 transition-colors group">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-sm bg-slate-100 flex items-center justify-center font-black text-[#0F766E] border border-slate-200">
                                            {appt.users?.full_name?.split(' ').map(n => n[0]).join('') || <User size={18} />}
                                        </div>
                                        <div>
                                            <div className="font-black text-slate-900 leading-tight mb-1">{appt.users?.full_name || 'Anonymous Patient'}</div>
                                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">ID: MP-{appt.id.slice(0, 8)}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="font-black text-slate-700 leading-tight mb-1">{appt.doctors?.name || 'Unassigned'}</div>
                                    <div className="text-[10px] text-[#0F766E] font-black uppercase tracking-[0.2em]">Assigned Program</div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-3 text-xs font-black text-slate-700 mb-1">
                                        <Calendar size={14} className="text-[#0F766E]" />
                                        {appt.scheduled_date}
                                    </div>
                                    <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        <Clock size={14} />
                                        {appt.start_time} - Registry Time
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-sm text-[9px] font-black uppercase tracking-[0.2em] ${appt.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600' :
                                            appt.status === 'pending' ? 'bg-orange-50 text-orange-600' :
                                                appt.status === 'cancelled' ? 'bg-red-50 text-red-600' :
                                                    'bg-slate-100 text-slate-500'
                                        }`}>
                                        {appt.status}
                                    </span>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center justify-end gap-3 opacity-20 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => updateStatus(appt.id, 'confirmed')}
                                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-sm transition-all"
                                            title="Confirm"
                                        >
                                            <CheckCircle size={18} />
                                        </button>
                                        <button
                                            onClick={() => updateStatus(appt.id, 'cancelled')}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-sm transition-all"
                                            title="Cancel"
                                        >
                                            <XCircle size={18} />
                                        </button>
                                        <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-sm transition-all">
                                            <ChevronRight size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
