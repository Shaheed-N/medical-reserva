"use client";

import { useState, useEffect } from 'react';
import { Plus, Search, Filter, MoreVertical, MapPin, Phone, Users, Edit, Trash2, Eye, X, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Hospital {
    id: string;
    name: string;
    city: string;
    address: string;
    phone: string;
    total_doctors?: number;
    total_departments?: number;
    status: string;
}

export default function HospitalsPage() {
    const [hospitals, setHospitals] = useState<Hospital[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Form State
    const [newHospital, setNewHospital] = useState({
        name: '',
        city: 'Baku',
        address: '',
        phone: '',
        status: 'active'
    });

    useEffect(() => {
        fetchHospitals();
    }, []);

    async function fetchHospitals() {
        setLoading(true);
        const { data, error } = await supabase
            .from('hospitals')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) setHospitals(data);
        setLoading(false);
    }

    async function handleAddHospital(e: React.FormEvent) {
        e.preventDefault();
        setSubmitting(true);

        const { data, error } = await supabase
            .from('hospitals')
            .insert([newHospital])
            .select();

        if (error) {
            alert(error.message);
        } else {
            setIsModalOpen(false);
            setNewHospital({ name: '', city: 'Baku', address: '', phone: '', status: 'active' });
            fetchHospitals();
        }
        setSubmitting(false);
    }

    async function handleDelete(id: string) {
        if (!confirm('Are you sure you want to delete this hospital?')) return;

        const { error } = await supabase
            .from('hospitals')
            .delete()
            .eq('id', id);

        if (error) alert(error.message);
        else fetchHospitals();
    }

    const filteredHospitals = hospitals.filter(h =>
        h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.city.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Hospital Registry</h1>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1 opacity-60">National Medical Infrastructure</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-[#0F766E] text-white rounded-sm text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#134E4A] transition-all shadow-lg active:scale-95"
                >
                    <Plus size={18} />
                    Register Institution
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-6 rounded-sm border border-slate-200 flex items-center gap-4 shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search hospitals by name or region..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-sm text-sm outline-none focus:ring-2 focus:ring-[#0F766E]/20"
                    />
                </div>
                <select className="px-6 py-3 border border-slate-200 rounded-sm text-[10px] font-black uppercase tracking-widest bg-white outline-none">
                    <option>All Regions</option>
                    <option>Baku</option>
                    <option>Ganja</option>
                    <option>Sumqayit</option>
                </select>
            </div>

            {/* Table */}
            <div className="bg-white rounded-sm border border-slate-200 overflow-hidden shadow-sm">
                <table className="w-full">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="text-left px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Institution</th>
                            <th className="text-left px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Location</th>
                            <th className="text-left px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Registration Status</th>
                            <th className="text-right px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Manage</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr>
                                <td colSpan={4} className="px-8 py-20 text-center">
                                    <Loader2 className="animate-spin text-[#0F766E] mx-auto mb-4" size={32} />
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Accessing Registry...</div>
                                </td>
                            </tr>
                        ) : filteredHospitals.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-8 py-20 text-center">
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">No Records Found</div>
                                    <button onClick={() => setIsModalOpen(true)} className="text-[#0F766E] font-black text-[10px] uppercase tracking-widest hover:underline">Add First Record</button>
                                </td>
                            </tr>
                        ) : filteredHospitals.map((hospital) => (
                            <tr key={hospital.id} className="hover:bg-slate-50 transition-colors group">
                                <td className="px-8 py-5">
                                    <div className="font-bold text-slate-900 group-hover:text-[#0F766E] transition-colors">{hospital.name}</div>
                                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-2 mt-1">
                                        <Phone size={12} /> {hospital.phone || 'N/A'}
                                    </div>
                                </td>
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                                        <MapPin size={14} className="text-[#0F766E]" />
                                        {hospital.city}
                                    </div>
                                    <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-1">{hospital.address}</div>
                                </td>
                                <td className="px-8 py-5">
                                    <span className={`inline-flex px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-sm ${hospital.status === 'active'
                                            ? 'bg-emerald-50 text-emerald-600'
                                            : 'bg-slate-100 text-slate-500'
                                        }`}>
                                        {hospital.status}
                                    </span>
                                </td>
                                <td className="px-8 py-5">
                                    <div className="flex items-center justify-end gap-2">
                                        <button className="p-2 text-slate-300 hover:text-blue-500 transition-colors">
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(hospital.id)}
                                            className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Hospital Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    <div className="bg-white w-full max-w-md rounded-sm shadow-2xl relative z-10 overflow-hidden">
                        <div className="bg-[#0F172A] p-6 text-white flex justify-between items-center">
                            <h2 className="text-sm font-black uppercase tracking-[0.2em]">Register New Institution</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-white/40 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleAddHospital} className="p-8 space-y-6">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Hospital Name</label>
                                <input
                                    required
                                    type="text"
                                    value={newHospital.name}
                                    onChange={(e) => setNewHospital({ ...newHospital, name: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-sm text-sm outline-none focus:ring-2 focus:ring-[#0F766E]/20"
                                    placeholder="e.g. City Central Medical"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Region/City</label>
                                    <select
                                        value={newHospital.city}
                                        onChange={(e) => setNewHospital({ ...newHospital, city: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-sm text-sm outline-none bg-white"
                                    >
                                        <option>Baku</option>
                                        <option>Ganja</option>
                                        <option>Sumqayit</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Phone Line</label>
                                    <input
                                        type="text"
                                        value={newHospital.phone}
                                        onChange={(e) => setNewHospital({ ...newHospital, phone: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-sm text-sm outline-none focus:ring-2 focus:ring-[#0F766E]/20"
                                        placeholder="+994..."
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Full Address</label>
                                <textarea
                                    value={newHospital.address}
                                    onChange={(e) => setNewHospital({ ...newHospital, address: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-sm text-sm outline-none focus:ring-2 focus:ring-[#0F766E]/20 h-24 resize-none"
                                    placeholder="Physical location details..."
                                ></textarea>
                            </div>
                            <button
                                disabled={submitting}
                                className="w-full py-4 bg-[#0F766E] text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-sm hover:bg-[#134E4A] transition-all shadow-xl shadow-[#0F766E]/10 active:scale-95 flex items-center justify-center gap-3 mt-4"
                            >
                                {submitting ? <Loader2 className="animate-spin" size={16} /> : 'Complete Registration'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
