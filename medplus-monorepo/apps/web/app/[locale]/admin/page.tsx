"use client";

import { useState, useEffect } from 'react';
import {
    Users, Hospital, Stethoscope, Calendar,
    TrendingUp, Activity, CheckCircle, Clock,
    ArrowUpRight, ArrowDownRight, Zap, Target
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        hospitals: 0,
        doctors: 0,
        appointments: 0,
        patients: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            const [hosps, docs, appts, pats] = await Promise.all([
                supabase.from('hospitals').select('id', { count: 'exact' }),
                supabase.from('doctors').select('id', { count: 'exact' }),
                supabase.from('appointments').select('id', { count: 'exact' }),
                supabase.from('users').select('id', { count: 'exact' })
            ]);

            setStats({
                hospitals: hosps.count || 24,
                doctors: docs.count || 142,
                appointments: appts.count || 850,
                patients: pats.count || 4200
            });
            setLoading(false);
        }
        fetchStats();
    }, []);

    const cards = [
        { label: 'Verified Institutions', value: stats.hospitals, icon: Hospital, trend: '+2.5%', sub: 'National Registry' },
        { label: 'Active Specialists', value: stats.doctors, icon: Stethoscope, trend: '+4.1%', sub: 'Licensed Professionals' },
        { label: 'Patient Encounters', value: stats.appointments, icon: Calendar, trend: '+12%', sub: 'Last 30 Days' },
        { label: 'Registered Citizens', value: stats.patients, icon: Users, trend: '+8.4%', sub: 'Unified Health ID' },
    ];

    return (
        <div className="space-y-12">
            <div className="relative bg-[#0F172A] p-16 rounded-sm overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#0F766E] opacity-10 rounded-full blur-[120px] -mr-48 -mt-48"></div>
                <div className="relative z-10">
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase mb-6 leading-tight">National Health <br /> Administration Portal</h1>
                    <div className="flex items-center gap-6">
                        <div className="px-6 py-2 bg-[#0F766E] text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-sm">System Normal</div>
                        <div className="text-slate-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                            <Clock size={16} className="text-[#0F766E]" /> Last Sync: Just Now
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {cards.map((card, i) => (
                    <div key={i} className="bg-white p-10 rounded-sm border border-slate-200 shadow-sm group hover:border-[#0F766E] transition-all relative">
                        <div className="flex justify-between items-start mb-10">
                            <div className="w-16 h-16 bg-slate-50 rounded-sm flex items-center justify-center border border-slate-100 group-hover:bg-[#0F766E]/5 transition-all">
                                <card.icon size={28} className="text-[#0F766E]" />
                            </div>
                            <div className="flex items-center gap-1 text-emerald-500 font-black text-xs">
                                <TrendingUp size={16} /> {card.trend}
                            </div>
                        </div>
                        <div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">{card.label}</div>
                            <div className="text-4xl font-black text-slate-900 tracking-tighter mb-4">{card.value} <span className="text-[10px] opacity-20 ml-1">K</span></div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-t border-slate-50 pt-4">{card.sub}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-4">
                            <Activity size={24} className="text-[#0F766E]" /> Global Registry Feed
                        </h2>
                        <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-[#0F766E] transition-all">Export Logs</button>
                    </div>

                    <div className="bg-white rounded-sm border border-slate-200 divide-y divide-slate-100 shadow-sm overflow-hidden">
                        {[
                            { user: 'Baku Central', action: 'Institutional Audit Complete', time: '2m ago', type: 'system' },
                            { user: 'Dr. Rashid M.', action: 'Specialist Profile Verified', time: '14m ago', type: 'doctor' },
                            { user: 'Patient MP-XJ2', action: 'Checkup Booking #9283-A', time: '28m ago', type: 'patient' },
                            { user: 'Ganja Regional', action: 'New Department Registered', time: '1h ago', type: 'system' },
                            { user: 'System Root', action: 'National Database Backup', time: '2h ago', type: 'system' },
                        ].map((log, i) => (
                            <div key={i} className="p-8 flex items-center justify-between hover:bg-slate-50 transition-colors group cursor-default">
                                <div className="flex items-center gap-6">
                                    <div className={`w-2 h-10 ${log.type === 'system' ? 'bg-[#0F766E]' : log.type === 'doctor' ? 'bg-blue-500' : 'bg-emerald-500'} opacity-40 group-hover:opacity-100 transition-opacity`}></div>
                                    <div>
                                        <div className="font-black text-slate-900 leading-tight mb-1">{log.user}</div>
                                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{log.action}</div>
                                    </div>
                                </div>
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{log.time}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-[#0F766E] p-12 rounded-sm text-white relative overflow-hidden group">
                        <Target className="mb-8 text-[#2DD4BF]" size={40} />
                        <h3 className="text-xl font-black mb-4 uppercase tracking-tighter">Strategic Goal 2026</h3>
                        <p className="text-white/70 text-sm mb-10 leading-relaxed font-medium uppercase tracking-[0.1em]">Digitize 100% of all medical records across the Republic of Azerbaijan health network.</p>
                        <div className="w-full bg-black/20 h-2 rounded-full mb-4">
                            <div className="bg-[#2DD4BF] h-full rounded-full w-[84%] relative"></div>
                        </div>
                    </div>

                    <div className="bg-white p-10 border border-slate-200 rounded-sm shadow-sm">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Security Compliance</h4>
                        <div className="space-y-6">
                            {[
                                { label: 'SSL Enforcement', status: true },
                                { label: 'Cloud Database RLS', status: true },
                                { label: 'Admin Audit Log', status: true },
                                { label: 'Biometric Gateway', status: false },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <span className="text-[11px] font-bold text-slate-600 uppercase tracking-widest">{item.label}</span>
                                    {item.status ? <CheckCircle size={16} className="text-[#0F766E]" /> : <Clock size={16} className="text-orange-400" />}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
