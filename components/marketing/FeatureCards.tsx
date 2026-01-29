'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Shield, FileText, Activity, ArrowRight } from 'lucide-react';

export function FeatureCards() {
    return (
        <section className="py-24 bg-[#FFFFFF]">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 border-b border-slate-100 pb-8">
                    <div className="max-w-2xl">
                        <span className="text-[#4FD1D9] font-bold uppercase tracking-widest text-xs mb-4 block">
                            National Health Standards
                        </span>
                        <h2 className="text-4xl md:text-5xl font-display text-[#0F172A] tracking-tight leading-tight">
                            Guaranteed Quality of Care.
                        </h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Card 1: Licensing */}
                    <div className="bg-[#F0FBFA] p-8 md:p-10 rounded-[16px] shadow-sm hover:shadow-lg transition-all group">
                        <div className="w-14 h-14 bg-[#0F766E] text-white flex items-center justify-center mb-8 rounded-[12px] shadow-md">
                            <Shield size={28} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-2xl font-display text-[#0F172A] mb-4 group-hover:text-[#0F766E] transition-colors">
                            State Licensed Providers
                        </h3>
                        <p className="text-[#475569] mb-8 leading-relaxed text-sm">
                            Every practitioner is verified against the National Medical Registry. We ensure strict adherence to state medical protocols.
                        </p>
                        <Link href="/doctors" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#0F172A] hover:text-[#0F766E] transition-colors rounded-[14px] px-4 py-2 hover:bg-white/50">
                            Verify License <ArrowRight size={14} />
                        </Link>
                    </div>

                    {/* Card 2: Records */}
                    <div className="bg-[#F0FBFA] p-8 md:p-10 rounded-[16px] shadow-sm hover:shadow-lg transition-all group">
                        <div className="w-14 h-14 bg-[#0F766E] text-white flex items-center justify-center mb-8 rounded-[12px] shadow-md">
                            <FileText size={28} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-2xl font-display text-[#0F172A] mb-4 group-hover:text-[#0F766E] transition-colors">
                            Unified Medical History
                        </h3>
                        <p className="text-[#475569] mb-8 leading-relaxed text-sm">
                            Your health data is centralized in a secure, government-encrypted database. Accessible only by you and authorized personnel.
                        </p>
                        <Link href="/login" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#0F172A] hover:text-[#0F766E] transition-colors rounded-[14px] px-4 py-2 hover:bg-white/50">
                            Access Records <ArrowRight size={14} />
                        </Link>
                    </div>

                    {/* Card 3: Emergency */}
                    <div className="bg-[#F0FBFA] p-8 md:p-10 rounded-[16px] shadow-sm hover:shadow-lg transition-all group">
                        <div className="w-14 h-14 bg-[#0F766E] text-white flex items-center justify-center mb-8 rounded-[12px] shadow-md">
                            <Activity size={28} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-2xl font-display text-[#0F172A] mb-4 group-hover:text-[#0F766E] transition-colors">
                            Emergency Protocols
                        </h3>
                        <p className="text-[#475569] mb-8 leading-relaxed text-sm">
                            Direct connection to national emergency services and real-time hospital capacity monitoring for critical care.
                        </p>
                        <Link href="/hospitals" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#0F172A] hover:text-[#0F766E] transition-colors rounded-[14px] px-4 py-2 hover:bg-white/50">
                            View Network <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
