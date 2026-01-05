"use client";

import { useState, useEffect } from 'react';
import { Plus, Search, MoreVertical, MapPin, Star, Edit, Trash2, Eye, CheckCircle, XCircle, X, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Doctor {
    id: string;
    name: string;
    specialty: string;
    hospital_id: string;
    experience_years: number;
    rating: number;
    status: string;
    verified: boolean;
    hospitals?: { name: string };
}

export default function DoctorsAdminPage() {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [hospitals, setHospitals] = useState<{ id: string, name: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [newDoctor, setNewDoctor] = useState({
        name: '',
        specialty: '',
        hospital_id: '',
        experience_years: 0,
        status: 'active',
        verified: true
    });

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        setLoading(true);
        const [docsRes, hospsRes] = await Promise.all([
            supabase.from('doctors').select('*, hospitals(name)').order('created_at', { ascending: false }),
            supabase.from('hospitals').select('id, name')
        ]);

        if (docsRes.data) setDoctors(docsRes.data);
        if (hospsRes.data) setHospitals(hospsRes.data);
        setLoading(false);
    }

    async function handleAddDoctor(e: React.FormEvent) {
        e.preventDefault();
        setSubmitting(true);
        const { error } = await supabase.from('doctors').insert([newDoctor]);
        if (error) alert(error.message);
        else {
            setIsModalOpen(false);
            setNewDoctor({ name: '', specialty: '', hospital_id: '', experience_years: 0, status: 'active', verified: true });
            fetchData();
        }
        setSubmitting(false);
    }

    async function handleDelete(id: string) {
        if (!confirm('Remove this doctor from system?')) return;
        const { error } = await supabase.from('doctors').delete().eq('id', id);
        if (error) alert(error.message);
        else fetchData();
    }

    const filteredDoctors = doctors.filter(d =>
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.specialty.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Specialist Registry</h1>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1 opacity-60">Verified Medical Professionals</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-[#0F766E] text-white rounded-sm text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#134E4A] transition-all shadow-lg active:scale-95"
                >
                    <Plus size={18} />
                    Register Specialist
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-6 rounded-sm border border-slate-200 flex items-center gap-4 shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search doctors by name or expertise..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-sm text-sm outline-none focus:ring-2 focus:ring-[#0F766E]/20"
                    />
                </div>
                <select className="px-6 py-3 border border-slate-200 rounded-sm text-[10px] font-black uppercase tracking-widest bg-white outline-none">
                    <option>All Specialties</option>
                    <option>Cardiology</option>
                    <option>Neurology</option>
                </select>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading ? (
                    <div className="col-span-full py-20 text-center">
                        <Loader2 className="animate-spin text-[#0F766E] mx-auto mb-4" size={32} />
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Loading Specialist Database...</div>
                    </div>
                ) : filteredDoctors.length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-white border border-dashed border-slate-200">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No Professionals Found</div>
                    </div>
                ) : filteredDoctors.map((doctor) => (
                    <div key={doctor.id} className="bg-white rounded-sm border border-slate-200 overflow-hidden hover:shadow-xl transition-all group flex flex-col">
                        <div className="p-8 flex-1">
                            <div className="flex items-start justify-between mb-8">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 rounded-sm bg-slate-100 flex items-center justify-center text-xl font-black text-[#0F766E] border border-slate-200 uppercase">
                                        {doctor.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-black text-slate-900 tracking-tight">{doctor.name}</h3>
                                            {doctor.verified && <CheckCircle size={16} className="text-[#0F766E]" />}
                                        </div>
                                        <p className="text-[10px] text-[#0F766E] font-black uppercase tracking-widest">{doctor.specialty}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 text-[11px] text-slate-600 font-bold uppercase tracking-wider">
                                <div className="flex items-center gap-3">
                                    <MapPin size={14} className="text-slate-300" />
                                    {doctor.hospitals?.name || 'Unassigned'}
                                </div>
                                <div className="flex items-center gap-3">
                                    <Star size={14} className="text-yellow-400 fill-yellow-400" strokeWidth={0} />
                                    {doctor.rating || 'N/A'} National Rating
                                </div>
                                <div className="flex items-center gap-3">
                                    <Clock size={14} className="text-slate-300" />
                                    {doctor.experience_years} Years Active
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-6 bg-slate-50 border-t border-slate-100">
                            <span className={`px-2 py-1 text-[9px] font-black uppercase tracking-widest rounded-sm ${doctor.status === 'active'
                                    ? 'bg-emerald-50 text-emerald-600'
                                    : 'bg-slate-200 text-slate-600'
                                }`}>
                                {doctor.status}
                            </span>
                            <div className="flex items-center gap-2">
                                <button className="p-2 text-slate-300 hover:text-blue-500 transition-all"><Edit size={16} /></button>
                                <button
                                    onClick={() => handleDelete(doctor.id)}
                                    className="p-2 text-slate-300 hover:text-red-500 transition-all"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Doctor Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    <div className="bg-white w-full max-w-lg rounded-sm shadow-2xl relative z-10 overflow-hidden">
                        <div className="bg-[#0F172A] p-6 text-white flex justify-between items-center">
                            <h2 className="text-sm font-black uppercase tracking-[0.2em]">Register Specialist</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-white/40 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleAddDoctor} className="p-10 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="col-span-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Full Name</label>
                                    <input
                                        required
                                        type="text"
                                        value={newDoctor.name}
                                        onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-sm text-sm outline-none focus:ring-2 focus:ring-[#0F766E]/20"
                                        placeholder="e.g. Dr. Rashid Mammadov"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Specialty</label>
                                    <select
                                        value={newDoctor.specialty}
                                        onChange={(e) => setNewDoctor({ ...newDoctor, specialty: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-sm text-sm outline-none bg-white"
                                        required
                                    >
                                        <option value="">Select...</option>
                                        <option value="Cardiology">Cardiology</option>
                                        <option value="Neurology">Neurology</option>
                                        <option value="Pediatrics">Pediatrics</option>
                                        <option value="Orthopedics">Orthopedics</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Assigned Hospital</label>
                                    <select
                                        value={newDoctor.hospital_id}
                                        onChange={(e) => setNewDoctor({ ...newDoctor, hospital_id: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-sm text-sm outline-none bg-white font-medium"
                                        required
                                    >
                                        <option value="">Choose Hospital...</option>
                                        {hospitals.map(h => (
                                            <option key={h.id} value={h.id}>{h.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Years of Experience</label>
                                    <input
                                        type="number"
                                        value={newDoctor.experience_years}
                                        onChange={(e) => setNewDoctor({ ...newDoctor, experience_years: parseInt(e.target.value) })}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-sm text-sm outline-none focus:ring-2 focus:ring-[#0F766E]/20"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Initial Status</label>
                                    <select
                                        value={newDoctor.status}
                                        onChange={(e) => setNewDoctor({ ...newDoctor, status: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-sm text-sm outline-none bg-white"
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>
                            <button
                                disabled={submitting}
                                className="w-full py-5 bg-[#0F766E] text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-sm hover:bg-[#134E4A] transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 mt-4"
                            >
                                {submitting ? <Loader2 className="animate-spin" size={16} /> : 'Register Professional'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
