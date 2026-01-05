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
    Stethoscope,
    Users,
    Info,
    Calendar,
    CheckCircle,
    Share2
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const hospitals = {
    '1': {
        id: 1,
        name: 'Central Clinical Hospital',
        city: 'Baku',
        address: 'Heydar Aliyev Ave 152',
        phone: '+994 12 440 00 00',
        rating: 4.9,
        reviews: 1240,
        departments: 12,
        description: 'Central Clinical Hospital is the flagship medical institution providing comprehensive tertiary care services. Established in 1998, it serves as a center of excellence for cardiovascular surgery, neurosurgery, and advanced oncology.',
        features: ['24/7 Emergency', 'Advanced MRI/CT', 'Pharmacy', 'Prayer Room', 'Cafeteria'],
        images: [
            'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80'
        ],
        doctors: [
            { id: 1, name: 'Dr. Sarah Wilson', spec: 'Cardiologist', rating: 4.9, img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80' },
            { id: 2, name: 'Dr. Michael Chen', spec: 'Neurologist', rating: 4.8, img: 'https://images.unsplash.com/photo-1612349317150-b4639e53b8d1?auto=format&fit=crop&w=300&q=80' },
            { id: 4, name: 'Dr. James Wilson', spec: 'Orthopedist', rating: 4.7, img: 'https://images.unsplash.com/photo-1622253632943-49327508585c?auto=format&fit=crop&w=300&q=80' },
        ]
    }
};

export default function HospitalDetailPage() {
    const params = useParams();
    const id = params.id as string || '1';
    const locale = params.locale as string || 'az';

    const hospital = hospitals[id as keyof typeof hospitals] || hospitals['1'];

    return (
        <div className="bg-slate-50 min-h-screen">
            {/* Header Banner */}
            <div className="h-[40vh] relative bg-slate-900 overflow-hidden">
                <img src={hospital.images[0]} alt={hospital.name} className="w-full h-full object-cover opacity-50" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full p-12">
                    <div className="container mx-auto px-6">
                        <div className="bg-[#0F766E] text-white text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 inline-block mb-4 rounded-sm">
                            National Medical Provider
                        </div>
                        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">{hospital.name}</h1>
                        <div className="flex flex-wrap gap-8 text-white/80 text-sm font-medium">
                            <span className="flex items-center gap-2"><MapPin size={18} className="text-[#2DD4BF]" /> {hospital.address}, {hospital.city}</span>
                            <span className="flex items-center gap-2"><Star size={18} className="text-[#2DD4BF] fill-[#2DD4BF]" /> {hospital.rating} ({hospital.reviews} Reviews)</span>
                            <span className="flex items-center gap-2"><Phone size={18} className="text-[#2DD4BF]" /> {hospital.phone}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left: Info */}
                    <div className="lg:col-span-2 space-y-12">
                        <section className="bg-white p-8 md:p-12 rounded border border-slate-200 shadow-sm">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                <Info size={24} className="text-[#0F766E]" />
                                About Institution
                            </h2>
                            <p className="text-slate-500 text-lg leading-relaxed mb-10">
                                {hospital.description}
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {hospital.features.map((feature, i) => (
                                    <div key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                                        <CheckCircle size={18} className="text-[#0F766E]" />
                                        {feature}
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section>
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-bold text-slate-900">Medical Specialists at this Branch</h2>
                                <Link href={`/${locale}/doctors?hospital=${hospital.id}`} className="text-[#0F766E] font-bold text-sm uppercase tracking-widest flex items-center gap-2">
                                    See all 45 Doctors <ArrowRight size={16} />
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {hospital.doctors.map((doc) => (
                                    <div key={doc.id} className="bg-white p-6 rounded border border-slate-200 flex items-center gap-6 hover:shadow-md transition-shadow">
                                        <img src={doc.img} alt={doc.name} className="w-20 h-20 rounded object-cover" />
                                        <div className="flex-1">
                                            <h3 className="font-bold text-slate-900">{doc.name}</h3>
                                            <p className="text-[#0F766E] text-xs font-bold uppercase tracking-widest mb-3">{doc.spec}</p>
                                            <Link
                                                href={`/${locale}/doctors/${doc.id}`}
                                                className="px-4 py-2 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded hover:bg-[#0F766E] transition-colors"
                                            >
                                                Book Visit
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Right: Actions */}
                    <div className="space-y-6">
                        <div className="bg-[#0F172A] p-8 rounded shadow-2xl text-white sticky top-24">
                            <h3 className="text-xl font-bold mb-6">Patient Actions</h3>
                            <div className="space-y-4">
                                <button className="w-full py-4 bg-[#0F766E] hover:bg-[#134E4A] transition-all rounded font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-lg shadow-[#0F766E]/20">
                                    <Calendar size={18} /> Book General Checkup
                                </button>
                                <button className="w-full py-4 bg-white/10 hover:bg-white/20 transition-all rounded font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3">
                                    <Phone size={18} /> Call Registry
                                </button>
                                <button className="w-full py-4 bg-white/10 hover:bg-white/20 transition-all rounded font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3">
                                    <Share2 size={18} /> Share Location
                                </button>
                            </div>

                            <div className="mt-12 pt-8 border-t border-white/10">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-10 h-10 rounded bg-[#0F766E] flex items-center justify-center">
                                        <Clock size={20} className="text-[#2DD4BF]" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Opening Hours</div>
                                        <div className="text-sm font-bold">Open 24/7 (Emergency)</div>
                                    </div>
                                </div>
                                <div className="text-xs text-white/40 leading-relaxed">
                                    Standard registry hours: Mon-Fri 08:00 - 18:00
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
