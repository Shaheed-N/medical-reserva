'use client';

import { Apple, Smartphone, ShieldCheck, Lock, Fingerprint } from 'lucide-react';
import { motion } from 'framer-motion';

export function MobileAppSection() {
    return (
        <section className="bg-[#F0FBFA] py-32 border-t border-slate-100 relative overflow-hidden">
            {/* Abstract Tech Background */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute right-0 top-0 w-[800px] h-[800px] bg-gradient-to-b from-[#0F766E] to-transparent rounded-full blur-[100px] -mr-40 -mt-40"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center gap-20">

                {/* Visual Representation: Digital ID Card */}
                <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
                    <motion.div
                        initial={{ opacity: 0, rotateX: 20, z: -100 }}
                        whileInView={{ opacity: 1, rotateX: 0, z: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="relative w-full max-w-md perspective-1000"
                    >
                        {/* The ID Card */}
                        <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] border border-slate-700 aspect-[1.58] rounded-xl shadow-2xl p-8 flex flex-col relative overflow-hidden group hover:rotate-1 transition-transform duration-500">
                            {/* Hologram Effect */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

                            {/* Card Header */}
                            <div className="flex justify-between items-start mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-[#0F766E] rounded flex items-center justify-center">
                                        <ShieldCheck className="text-white" size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-display text-lg leading-none">MEDPLUS</h4>
                                        <span className="text-slate-400 text-[10px] uppercase tracking-widest">National ID</span>
                                    </div>
                                </div>
                                <Fingerprint className="text-[#2DD4BF]/50" size={40} />
                            </div>

                            {/* Card Chip & Data */}
                            <div className="mt-auto space-y-4">
                                <div className="w-12 h-8 bg-yellow-500/20 rounded border border-yellow-500/50 flex flex-col justify-center items-center gap-0.5">
                                    <div className="w-8 h-[1px] bg-yellow-500/50"></div>
                                    <div className="w-8 h-[1px] bg-yellow-500/50"></div>
                                    <div className="w-8 h-[1px] bg-yellow-500/50"></div>
                                </div>
                                <div className="font-mono text-[#2DD4BF] text-lg tracking-widest">
                                    8492 1029 4829 1029
                                </div>
                                <div className="flex justify-between items-end">
                                    <div>
                                        <div className="text-[9px] text-slate-500 uppercase tracking-widest mb-1">Citizen Name</div>
                                        <div className="text-white font-medium">A. MAMMADOV</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[9px] text-slate-500 uppercase tracking-widest mb-1">Valid Thru</div>
                                        <div className="text-white font-medium">12/28</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating Security Badge */}
                        <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-[14px] shadow-xl flex items-center gap-3 animate-bounce-slow">
                            <Lock size={20} className="text-[#0F766E]" />
                            <div>
                                <div className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Security Level</div>
                                <div className="text-sm font-bold text-[#0F172A]">Tier 4 Encrypted</div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Content Right */}
                <div className="w-full lg:w-1/2 text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[10px] bg-[#E0F2F1] border border-[#0F766E]/10 text-[#0F766E] text-[10px] font-bold uppercase tracking-widest mb-6">
                        <Lock size={12} /> Official Mobile App
                    </div>

                    <h2 className="text-4xl md:text-5xl font-display text-[#0F172A] mb-6 leading-tight">
                        Citizen Health Portal. <br />
                        <span className="text-[#0F766E]">Secure. Integrated.</span>
                    </h2>

                    <p className="text-[#475569] text-lg mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed font-light">
                        Access your official medical records, manage digital prescriptions, and verify immunization status directly from your verified mobile device. Biometrically secured.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                        <button className="bg-[#0F172A] text-white px-8 py-4 rounded-[14px] flex items-center gap-3 hover:bg-[#1E293B] shadow-lg transition-all">
                            <Apple size={24} />
                            <div className="text-left leading-none">
                                <div className="text-[9px] uppercase font-bold text-slate-400 mb-1">Download on</div>
                                <div className="font-bold text-sm">App Store</div>
                            </div>
                        </button>
                        <button className="bg-white border-2 border-slate-200 text-[#0F172A] px-8 py-4 rounded-[14px] flex items-center gap-3 hover:bg-slate-50 transition-colors">
                            <Smartphone size={24} />
                            <div className="text-left leading-none">
                                <div className="text-[9px] uppercase font-bold text-[#94A3B8] mb-1">Get it on</div>
                                <div className="font-bold text-sm">Google Play</div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .perspective-1000 {
                    perspective: 1000px;
                }
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-bounce-slow {
                    animation: bounce-slow 4s ease-in-out infinite;
                }
            `}</style>
        </section>
    );
}
