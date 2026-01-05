"use client";

import { useState } from 'react';
import { Search, MapPin, Star, Filter, Calendar, Clock, ArrowRight, User, Stethoscope, Hospital, Activity, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';

const doctors = [
    { id: 1, name: 'Dr. Sarah Wilson', spec: 'cardiology', specLabel: 'Cardiologist', hosp: 'Central Clinical Hospital', hospId: '1', exp: '15 Years', rating: 4.9, img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80', availability: 'Today' },
    { id: 2, name: 'Dr. Michael Chen', spec: 'neurology', specLabel: 'Neurologist', hosp: 'City Medical Center', hospId: '2', exp: '12 Years', rating: 4.8, img: 'https://images.unsplash.com/photo-1612349317150-b4639e53b8d1?auto=format&fit=crop&w=300&q=80', availability: 'Tomorrow' },
    { id: 3, name: 'Dr. Emily Brooks', spec: 'pediatrics', specLabel: 'Pediatrician', hosp: 'Pediatric Hospital', hospId: '4', exp: '8 Years', rating: 4.9, img: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=300&q=80', availability: 'Today' },
    { id: 4, name: 'Dr. James Wilson', spec: 'orthopedics', specLabel: 'Orthopedist', hosp: 'Central Clinical Hospital', hospId: '1', exp: '20 Years', rating: 4.7, img: 'https://images.unsplash.com/photo-1622253632943-49327508585c?auto=format&fit=crop&w=300&q=80', availability: 'Monday' },
    { id: 5, name: 'Dr. Lisa Ray', spec: 'general-medicine', specLabel: 'General Physician', hosp: 'Skin Health Center', hospId: '5', exp: '10 Years', rating: 4.9, img: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&w=300&q=80', availability: 'Today' },
];

export default function DoctorsPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const locale = params.locale as string || 'az';

    const specialtyFilter = searchParams.get('specialty');
    const hospitalFilter = searchParams.get('hospital');

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSpecialty, setSelectedSpecialty] = useState(specialtyFilter || 'all');
    const [selectedLocation, setSelectedLocation] = useState('all');

    const filteredDoctors = doctors.filter(doc => {
        const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesSpecialty = selectedSpecialty === 'all' || doc.spec === selectedSpecialty;
        const matchesHospital = !hospitalFilter || doc.hospId === hospitalFilter;
        return matchesSearch && matchesSpecialty && matchesHospital;
    });

    return (
        <div className="bg-slate-50 min-h-screen py-16">
            <div className="container mx-auto px-6">
                {/* Advanced Filter Header */}
                <div className="bg-[#0F172A] p-10 rounded-sm shadow-2xl mb-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#0F766E] opacity-10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                    <div className="relative z-10">
                        <h1 className="text-3xl font-bold text-white mb-8 border-l-4 border-[#0F766E] pl-6">Medical Directory</h1>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Doctor name or expertise..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded text-white outline-none focus:bg-white/10 focus:border-[#0F766E] transition-all"
                                />
                            </div>
                            <div className="relative">
                                <Stethoscope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <select
                                    value={selectedSpecialty}
                                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded text-slate-300 outline-none focus:bg-white/10 appearance-none cursor-pointer"
                                >
                                    <option value="all" className="bg-slate-900">All Specialties</option>
                                    <option value="cardiology" className="bg-slate-900">Cardiology</option>
                                    <option value="neurology" className="bg-slate-900">Neurology</option>
                                    <option value="pediatrics" className="bg-slate-900">Pediatrics</option>
                                    <option value="orthopedics" className="bg-slate-900">Orthopedics</option>
                                </select>
                            </div>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <select
                                    value={selectedLocation}
                                    onChange={(e) => setSelectedLocation(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded text-slate-300 outline-none focus:bg-white/10 appearance-none cursor-pointer"
                                >
                                    <option value="all" className="bg-slate-900">All Regions</option>
                                    <option value="baku" className="bg-slate-900">Baku</option>
                                    <option value="ganja" className="bg-slate-900">Ganja</option>
                                </select>
                            </div>
                            <button className="bg-[#0F766E] text-white font-bold uppercase tracking-[0.2em] text-xs rounded hover:bg-[#134E4A] transition-all shadow-lg active:scale-95">
                                Search Registry
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                    {/* Sidebar Filters */}
                    <aside className="space-y-8">
                        <div className="bg-white p-8 rounded-sm border border-slate-200 shadow-sm">
                            <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <Filter size={18} className="text-[#0F766E]" /> Refine Search
                            </h3>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 block">Availability</label>
                                    <div className="space-y-3">
                                        {['Available Today', 'Available Tomorrow', 'Weekend Hours'].map((label, i) => (
                                            <label key={i} className="flex items-center gap-3 text-sm text-slate-600 cursor-pointer group">
                                                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[#0F766E] focus:ring-[#0F766E]" />
                                                <span className="group-hover:text-[#0F766E] transition-colors">{label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 block">Doctor Gender</label>
                                    <div className="flex gap-4">
                                        <button className="flex-1 py-2 border border-slate-200 rounded text-xs font-bold hover:border-[#0F766E] hover:text-[#0F766E] transition-all">Male</button>
                                        <button className="flex-1 py-2 border border-slate-200 rounded text-xs font-bold hover:border-[#0F766E] hover:text-[#0F766E] transition-all">Female</button>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 block">Experience</label>
                                    <select className="w-full border border-slate-200 rounded p-2 text-xs bg-white outline-none">
                                        <option>Any Experience</option>
                                        <option>5+ Years</option>
                                        <option>10+ Years</option>
                                        <option>15+ Years</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#0F766E] p-8 rounded-sm text-white">
                            <Activity className="mb-4 text-[#2DD4BF]" />
                            <h4 className="font-bold mb-2">Need Help?</h4>
                            <p className="text-white/70 text-sm mb-6 leading-relaxed">Our clinical support team can help you find the right specialist for your case.</p>
                            <div className="text-xl font-mono font-bold tracking-tighter text-white underline underline-offset-4 cursor-pointer hover:text-white/80">+994 12 440 00 00</div>
                        </div>
                    </aside>

                    {/* Results List */}
                    <div className="lg:col-span-3 space-y-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="text-slate-500 text-sm font-medium">Found <span className="text-slate-900 font-bold">{filteredDoctors.length}</span> verified specialists</div>
                            <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                Sort By:
                                <select className="bg-transparent border-none text-[#0F766E] outline-none cursor-pointer">
                                    <option>Recommended</option>
                                    <option>Rating</option>
                                    <option>Experience</option>
                                </select>
                            </div>
                        </div>

                        {filteredDoctors.map((doc) => (
                            <div key={doc.id} className="bg-white p-8 rounded-sm shadow-sm border border-slate-200 flex flex-col md:flex-row gap-8 hover:border-[#0F766E] transition-all group relative overflow-hidden">
                                <div className="w-32 h-32 md:w-40 md:h-40 shrink-0 relative">
                                    <img src={doc.img} alt={doc.name} className="w-full h-full object-cover rounded-sm grayscale group-hover:grayscale-0 transition-all duration-700" />
                                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 shadow-sm">
                                        <Star size={10} className="fill-yellow-400 text-yellow-400" /> {doc.rating}
                                    </div>
                                </div>

                                <div className="flex-1 flex flex-col justify-between py-2">
                                    <div>
                                        <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                                            <h3 className="text-2xl font-bold text-slate-900 group-hover:text-[#0F766E] transition-colors">{doc.name}</h3>
                                            <span className="bg-[#E0F2F1] text-[#0F766E] text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-widest self-start">Verified Provider</span>
                                        </div>
                                        <p className="text-[#0F766E] font-bold text-sm uppercase tracking-widest mb-6 border-b border-slate-100 pb-4 flex items-center gap-2">
                                            <Stethoscope size={16} /> {doc.specLabel}
                                        </p>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-500 mb-8">
                                            <div className="flex items-center gap-3"><Hospital size={16} className="text-slate-400" /> {doc.hosp}</div>
                                            <div className="flex items-center gap-3"><Clock size={16} className="text-slate-400" /> {doc.exp} Experience</div>
                                            <div className="flex items-center gap-3"><Calendar size={16} className="text-slate-400" /> Available: <span className="text-[#0F766E] font-bold">{doc.availability}</span></div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-4">
                                        <Link
                                            href={`/${locale}/doctors/${doc.id}`}
                                            className="px-8 py-4 bg-[#0F766E] text-white text-xs font-bold uppercase tracking-[0.2em] rounded hover:bg-[#134E4A] transition-all shadow-lg active:scale-95"
                                        >
                                            Instant Booking
                                        </Link>
                                        <Link
                                            href={`/${locale}/doctors/${doc.id}`}
                                            className="px-8 py-4 bg-white border border-slate-200 text-slate-900 text-xs font-bold uppercase tracking-[0.2em] rounded hover:border-[#0F172A] hover:bg-slate-50 transition-all active:scale-95"
                                        >
                                            View Full Profile
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {filteredDoctors.length === 0 && (
                            <div className="bg-white p-20 rounded-sm border border-slate-200 text-center">
                                <Search size={64} className="mx-auto text-slate-200 mb-6" />
                                <h3 className="text-xl font-bold text-slate-900 mb-2">No Specialists Found</h3>
                                <p className="text-slate-500">Try adjusting your filters or search keywords.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
