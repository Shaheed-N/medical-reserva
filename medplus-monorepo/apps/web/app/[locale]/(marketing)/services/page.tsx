"use client";

import { useTranslations } from 'next-intl';
import { Heart, Brain, Baby, Bone, Stethoscope, Eye, ArrowRight, Search, Activity } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const services = [
    { id: 'cardiology', name: 'Cardiology', desc: 'Comprehensive heart and cardiovascular care using advanced diagnostic tools.', icon: Heart, doctors: 45, image: 'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&fit=crop&w=400&q=80' },
    { id: 'neurology', name: 'Neurology', desc: 'Expert treatment for brain, spinal cord, and nervous system disorders.', icon: Brain, doctors: 32, image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=400&q=80' },
    { id: 'pediatrics', name: 'Pediatrics', desc: 'Specialized healthcare services for infants, children, and adolescents.', icon: Baby, doctors: 58, image: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&w=400&q=80' },
    { id: 'orthopedics', name: 'Orthopedics', desc: 'Advanced surgical and non-surgical treatment for bone and joint health.', icon: Bone, doctors: 28, image: 'https://images.unsplash.com/photo-1579389083046-e3df9c2b3325?auto=format&fit=crop&w=400&q=80' },
    { id: 'general-medicine', name: 'General Medicine', desc: 'Primary care services focused on preventive health and wellness.', icon: Stethoscope, doctors: 120, image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=400&q=80' },
    { id: 'ophthalmology', name: 'Ophthalmology', desc: 'Complete eye care from vision tests to complex specialized surgeries.', icon: Eye, doctors: 22, image: 'https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?auto=format&fit=crop&w=400&q=80' },
];

export default function ServicesPage() {
    const params = useParams();
    const locale = params.locale as string || 'az';

    return (
        <div className="bg-slate-50 min-h-screen py-16">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                    <div className="max-w-2xl">
                        <span className="text-[#0F766E] font-bold uppercase tracking-widest text-xs mb-4 block">Medical Departments</span>
                        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">World-Class Specialized <br /> Medical Services</h1>
                        <p className="text-slate-500 text-lg leading-relaxed">
                            Access the full spectrum of medical expertise. Each department is equipped with state-of-the-art technology and staffed by national specialists.
                        </p>
                    </div>

                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search for a specific service..."
                            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded text-sm focus:ring-2 focus:ring-[#0F766E]/20 outline-none shadow-sm"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((s, i) => (
                        <div key={i} className="bg-white rounded border border-slate-200 overflow-hidden hover:border-[#0F766E] hover:shadow-xl transition-all group flex flex-col">
                            <div className="h-48 overflow-hidden relative">
                                <img src={s.image} alt={s.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                                    <div className="w-12 h-12 bg-white rounded flex items-center justify-center shadow-lg">
                                        <s.icon size={24} className="text-[#0F766E]" />
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 flex-1 flex flex-col">
                                <h2 className="text-2xl font-bold text-slate-900 mb-4">{s.name}</h2>
                                <p className="text-slate-500 mb-8 flex-1 leading-relaxed">{s.desc}</p>

                                <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                                    <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                                        <Activity size={18} className="text-[#0F766E]" />
                                        {s.doctors} Specialists
                                    </div>
                                    <Link
                                        href={`/${locale}/doctors?specialty=${s.id}`}
                                        className="flex items-center gap-2 text-[#0F766E] font-bold text-sm hover:gap-3 transition-all uppercase tracking-wider"
                                    >
                                        View Doctors <ArrowRight size={18} />
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
