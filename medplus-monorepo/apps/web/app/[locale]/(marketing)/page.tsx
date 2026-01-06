"use client";

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Calendar, Activity, Users, Shield, Star } from 'lucide-react';
import { use } from 'react';

export default function Home({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = use(params);
    const t = useTranslations('Hero');
    const tCommon = useTranslations('Common');

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900">

            {/* 1. HERO SECTION - Immersive & High-End */}
            <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-[#0F172A]">
                {/* Cinematic Background Video/Image */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A] via-[#0F172A]/90 to-transparent z-10" />
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        poster="https://images.pexels.com/photos/4021775/pexels-photo-4021775.jpeg?auto=compress&cs=tinysrgb&w=1920"
                        className="w-full h-full object-cover opacity-60 animate-slow-zoom"
                    >
                        <source src="https://videos.pexels.com/video-files/4021775/4021775-uhd_2560_1440_25fps.mp4" type="video/mp4" />
                        <source src="https://videos.pexels.com/video-files/3195709/3195709-uhd_2732_1440_25fps.mp4" type="video/mp4" />
                    </video>
                </div>

                <div className="container mx-auto px-6 relative z-20 pt-20">
                    <div className="max-w-3xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >


                            <h1 className="text-5xl lg:text-7xl font-bold text-white leading-[1.1] mb-8 tracking-tight font-serif whitespace-pre-line">
                                {t('title')}
                            </h1>

                            <p className="text-xl text-slate-300 leading-relaxed max-w-xl mb-12 font-light border-l-2 border-[#0F766E] pl-6">
                                {t('subtitle')}
                            </p>

                            <div className="flex flex-col sm:flex-row gap-5">
                                <Link
                                    href={`/${locale}/login`}
                                    className="px-8 py-4 bg-[#0F766E] text-white font-bold rounded-sm hover:bg-[#134E4A] transition-all text-center flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(15,118,110,0.3)]"
                                >
                                    {tCommon('book_appointment')}
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link
                                    href={`/${locale}/hospitals`}
                                    className="px-8 py-4 bg-transparent border border-slate-600 text-white font-bold rounded-sm hover:bg-white/5 transition-all text-center backdrop-blur-sm"
                                >
                                    {t('cta_secondary')}
                                </Link>
                            </div>


                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 2. SEARCH & FILTER BAR - Floating */}
            <div className="relative z-30 -mt-16 container mx-auto px-6">
                <div className="bg-white p-6 rounded-sm shadow-2xl border border-slate-100 flex flex-col lg:flex-row gap-4">
                    <div className="flex-1 border-r border-slate-100 pr-4">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Location</label>
                        <div className="flex items-center gap-2">
                            <MapPin size={20} className="text-[#0F766E]" />
                            <input type="text" placeholder="Baku, Azerbaijan" className="w-full outline-none text-slate-800 font-medium placeholder:text-slate-300" />
                        </div>
                    </div>
                    <div className="flex-1 border-r border-slate-100 px-4">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Specialty</label>
                        <div className="flex items-center gap-2">
                            <Activity size={20} className="text-[#0F766E]" />
                            <select className="w-full outline-none text-slate-800 font-medium bg-transparent">
                                <option>Cardiology</option>
                                <option>Neurology</option>
                                <option>Pediatrics</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex-1 px-4">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Date</label>
                        <div className="flex items-center gap-2">
                            <Calendar size={20} className="text-[#0F766E]" />
                            <input type="date" className="w-full outline-none text-slate-800 font-medium bg-transparent" />
                        </div>
                    </div>
                    <button className="px-8 bg-[#0F172A] text-white font-bold rounded-sm hover:bg-slate-900 transition-colors uppercase tracking-widest text-sm">
                        {tCommon('search')}
                    </button>
                </div>
            </div>

            {/* 3. FEATURED DOCTORS - Cards */}
            <section className="py-24 bg-slate-50">
                <div className="container mx-auto px-6">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 mb-2">Top Specialists</h2>
                            <div className="w-12 h-1 bg-[#0F766E]"></div>
                        </div>
                        <Link href={`/${locale}/doctors`} className="text-[#0F766E] font-bold text-sm uppercase tracking-wide flex items-center gap-2 hover:gap-3 transition-all">
                            View All Doctors <ArrowRight size={16} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-white rounded-sm shadow-sm hover:shadow-xl transition-shadow border border-slate-100 overflow-hidden group">
                                <div className="relative h-64 bg-slate-200">
                                    <img src={`https://images.unsplash.com/photo-${i === 1 ? '1622253632943-49327508585c' : i === 2 ? '1559839734-2b71ea197ec2' : i === 3 ? '1612349317150-b4639e53b8d1' : '1537368910059-64733070013a'}?auto=format&fit=crop&w=800&q=80`} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                                    <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-sm text-xs font-bold text-slate-900 shadow-sm flex items-center gap-1">
                                        <Star size={12} className="fill-yellow-400 text-yellow-400" /> 4.9
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="text-xs text-[#0F766E] font-bold uppercase tracking-wide mb-1">Cardiology</div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-1">Dr. Alexander Bennett</h3>
                                    <div className="text-sm text-slate-500 mb-4">Senior Consultant • 15 Years Exp</div>
                                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-6">
                                        <MapPin size={14} /> Central Hospital, Baku
                                    </div>
                                    <button className="w-full py-3 border border-slate-200 text-slate-700 font-bold text-sm uppercase tracking-wide hover:bg-slate-900 hover:text-white transition-colors rounded-sm">
                                        Book Visit
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. WHY CHOOSE US - Illustration Grid */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="relative">
                            <div className="absolute -top-10 -left-10 w-32 h-32 bg-[#CCFBF1] rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                            <img
                                src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80"
                                alt="Quality Healthcare"
                                className="relative z-10 w-full rounded-sm shadow-2xl border-4 border-white"
                            />
                            <div className="absolute -bottom-6 -right-6 bg-white p-8 shadow-xl max-w-xs border-l-4 border-[#0F766E] z-20">
                                <div className="text-4xl font-bold text-[#0F766E] mb-2">15m+</div>
                                <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">Patient Records Securely Managed</div>
                            </div>
                        </div>

                        <div>
                            <span className="text-[#0F766E] font-bold uppercase tracking-widest text-sm mb-4 block">System Capabilities</span>
                            <h2 className="text-4xl font-bold text-slate-900 mb-8 leading-tight">State-of-the-Art <br />Digital Healthcare Infrastructure</h2>

                            <div className="space-y-8">
                                {[
                                    { icon: Shield, title: 'Secure Data Encryption', desc: 'Military-grade encryption for all patient records and transactions.' },
                                    { icon: Calendar, title: 'Real-time Scheduling', desc: 'Instant confirmation and synchronization with doctor calendars.' },
                                    { icon: Users, title: 'Family Health Management', desc: 'Manage appointments for your entire family from one secure account.' }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-5">
                                        <div className="w-12 h-12 bg-slate-50 rounded-sm flex items-center justify-center shrink-0 border border-slate-100">
                                            <item.icon className="text-[#0F766E]" size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                                            <p className="text-slate-500 leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. CTA - Official */}
            <section className="bg-[#0F766E] py-20 relative overflow-hidden">
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <h2 className="text-3xl font-bold text-white mb-8">Access the National Medical Network</h2>
                    <Link href={`/${locale}/signup`} className="inline-block px-10 py-4 bg-white text-[#0F766E] font-bold text-sm uppercase tracking-widest hover:bg-teal-50 transition-colors shadow-lg">
                        Register for Patient ID
                    </Link>
                </div>
            </section>
        </div>
    );
}
