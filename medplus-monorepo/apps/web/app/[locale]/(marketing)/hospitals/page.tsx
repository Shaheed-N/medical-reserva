"use client";

import { useTranslations } from 'next-intl';
import {
    Building2,
    MapPin,
    Phone,
    Clock,
    Star,
    ArrowRight,
    Shield,
    Activity,
    Hospital,
    Filter,
    Search
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const hospitals = [
    { id: 1, name: 'Central Clinical Hospital', city: 'Baku', address: 'Heydar Aliyev Ave 152', phone: '+994 12 440 00 00', rating: 4.9, departments: 12, image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=800&q=80' },
    { id: 2, name: 'City Medical Center', city: 'Baku', address: 'Nizami St 82', phone: '+994 12 441 11 11', rating: 4.8, departments: 8, image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80' },
    { id: 3, name: 'Ganja Regional Hospital', city: 'Ganja', address: 'Shah Ismail Ave 25', phone: '+994 22 256 00 00', rating: 4.7, departments: 10, image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=800&q=80' },
    { id: 4, name: 'Pediatric Hospital No.1', city: 'Baku', address: 'Khagani St 12', phone: '+994 12 493 00 00', rating: 4.9, departments: 6, image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=800&q=80' },
];

export default function HospitalsPublicPage() {
    const params = useParams();
    const locale = params.locale as string || 'az';

    return (
        <div className="bg-slate-50 min-h-screen">
            {/* Search Header */}
            <section className="bg-[#0F172A] py-20">
                <div className="container mx-auto px-6">
                    <h1 className="text-4xl font-bold text-white mb-8 border-l-4 border-[#0F766E] pl-6">National Medical Network</h1>
                    <div className="bg-white p-6 rounded-sm shadow-xl flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input type="text" placeholder="Search hospital or location..." className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded outline-none focus:ring-2 focus:ring-[#0F766E]/20" />
                        </div>
                        <div className="flex-1 relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <select className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded outline-none bg-white">
                                <option>All Regions</option>
                                <option>Baku</option>
                                <option>Ganja</option>
                                <option>Sumqayit</option>
                            </select>
                        </div>
                        <button className="bg-[#0F766E] text-white px-10 py-3 rounded font-bold uppercase tracking-widest text-xs hover:bg-[#134E4A] transition-all">
                            Search Clinics
                        </button>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-6 py-16">
                <div className="flex items-center justify-between mb-12">
                    <h2 className="text-2xl font-bold text-slate-900">Found {hospitals.length} Institutions</h2>
                    <button className="flex items-center gap-2 text-slate-500 font-bold uppercase tracking-widest text-xs bg-white px-4 py-2 border border-slate-200 rounded">
                        <Filter size={16} /> Filters
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {hospitals.map((h) => (
                        <div key={h.id} className="bg-white rounded border border-slate-200 overflow-hidden hover:shadow-2xl transition-all group flex flex-col sm:flex-row shadow-sm">
                            <div className="sm:w-1/3 h-64 sm:h-auto overflow-hidden relative">
                                <img src={h.image} alt={h.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute top-4 left-4 bg-[#0F766E] text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest">
                                    Verified
                                </div>
                            </div>
                            <div className="sm:w-2/3 p-8 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <h2 className="text-xl font-bold text-slate-900 group-hover:text-[#0F766E] transition-colors">{h.name}</h2>
                                        <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded border border-yellow-100">
                                            <Star size={14} className="fill-yellow-400 text-yellow-400" />
                                            <span className="text-sm font-bold text-yellow-700">{h.rating}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-3 text-sm text-slate-500 mb-8">
                                        <div className="flex items-center gap-2"><MapPin size={16} className="text-[#0F766E]" /> {h.address}, {h.city}</div>
                                        <div className="flex items-center gap-2"><Phone size={16} className="text-[#0F766E]" /> {h.phone}</div>
                                        <div className="flex items-center gap-2"><Clock size={16} className="text-[#0F766E]" /> {h.departments} Departments</div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                                    <Link
                                        href={`/${locale}/hospitals/${h.id}`}
                                        className="w-full text-center py-3 bg-[#0F172A] text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded hover:bg-[#0F766E] transition-all"
                                    >
                                        View Details & Doctors
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
