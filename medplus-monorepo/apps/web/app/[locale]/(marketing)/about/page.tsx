"use client";

import { useTranslations } from 'next-intl';
import {
    Shield,
    Clock,
    Users,
    Award,
    Target,
    Globe,
    Zap,
    CheckCircle2,
    Calendar,
    Layers,
    Heart
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function AboutPage() {
    return (
        <div className="bg-white min-h-screen">
            {/* Cinematic Hero */}
            <section className="relative h-[60vh] bg-slate-950 flex items-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=2000&q=80"
                        className="w-full h-full object-cover opacity-30 grayscale"
                        alt="Medical Center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent"></div>
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-[#0F766E] font-bold uppercase tracking-[0.4em] text-xs mb-6 block">Our Institution</span>
                        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-8 border-l-8 border-[#0F766E] pl-10 leading-[1.1]">
                            Defining the Future <br /> of National Health
                        </h1>
                        <p className="text-slate-400 text-xl max-w-2xl font-light leading-relaxed">
                            MedPlus is the primary digital gateway for the Republic of Azerbaijan health network,
                            connecting over 4,000 specialists with millions of citizens.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Strategic Vision Grid */}
            <section className="py-32 relative">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                        <div className="relative">
                            <img
                                src="https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1000&q=80"
                                alt="Lab Work"
                                className="rounded-sm shadow-2xl relative z-10"
                            />
                            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-slate-100 -z-0 rounded-sm"></div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-slate-100 rounded-full -z-0"></div>
                        </div>

                        <div>
                            <h2 className="text-4xl font-bold text-slate-900 mb-10 leading-tight">National Healthcare <br /> Unified Standard</h2>
                            <div className="space-y-10">
                                {[
                                    { icon: Target, title: 'Strategic Objective', desc: 'To digitize 100% of patient records by 2027, ensuring seamless portability between all public and private institutions.' },
                                    { icon: Layers, title: 'Integrated Framework', desc: 'MedPlus operates under the direct supervision of the Ministry of Health, utilizing a unified regulatory framework.' },
                                    { icon: Zap, title: 'Real-time Analytics', desc: 'Our platform provides national-scale health analytics to optimize medical resource allocation during peak demands.' }
                                ].map((v, i) => (
                                    <div key={i} className="flex gap-6">
                                        <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-sm flex items-center justify-center shrink-0">
                                            <v.icon size={24} className="text-[#0F766E]" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900 mb-2">{v.title}</h3>
                                            <p className="text-slate-500 leading-relaxed font-light">{v.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Capability Section */}
            <section className="py-32 bg-[#0F172A] text-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-24">
                        <h2 className="text-4xl font-bold mb-6">Our Infrastructure</h2>
                        <div className="w-24 h-1 bg-[#0F766E] mx-auto"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                        {[
                            { icon: Shield, title: 'Secure Gateway', desc: 'Enterprise-grade encryption for all medical data.' },
                            { icon: Globe, title: 'National Scale', desc: 'Active in every region of Azerbaijan.' },
                            { icon: Heart, title: 'Patient Choice', desc: 'Transparent rating system based on verified visits.' },
                            { icon: Users, title: 'Social Impact', desc: 'Equitable access for all citizen demographics.' },
                        ].map((item, i) => (
                            <div key={i} className="p-10 bg-slate-900 border border-slate-800 hover:border-[#0F766E] transition-all rounded-sm text-center group">
                                <div className="w-16 h-16 bg-[#0F766E]/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-[#0F766E] transition-all">
                                    <item.icon size={32} className="text-[#0F766E] group-hover:text-white transition-all" />
                                </div>
                                <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                                <p className="text-slate-400 font-light leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Trust Quote */}
            <section className="py-40 bg-white">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto text-center">
                        <CheckCircle2 size={64} className="text-[#0F766E] mx-auto mb-10 opacity-20" />
                        <blockquote className="text-3xl md:text-5xl font-extralight text-slate-900 italic leading-tight mb-12">
                            "Digital health is not just about technology; it is about human dignity and the right to efficient healthcare access."
                        </blockquote>
                        <div className="font-bold uppercase tracking-widest text-[#0F766E]">National Health Strategic Vision 2026</div>
                    </div>
                </div>
            </section>
        </div>
    );
}
