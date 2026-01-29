'use client';

import {
    MapPin,
    User,
    FileText,
    Calendar,
    ChevronDown,
    ArrowUpRight,
    Search
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function HeroSearch() {
    const t = useTranslations('Common');
    const [activeTab, setActiveTab] = useState<string | null>(null);

    // Click outside to close
    const searchRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setActiveTab(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleTab = (tab: string) => {
        setActiveTab(activeTab === tab ? null : tab);
    };

    const locations = ["All Regions", "Baku", "Ganja", "Sumgait", "Nakhchivan", "Lankaran"];
    const specialties = ["Search Specialists", "Cardiology", "Neurology", "Dermatology", "Pediatrics", "Orthopedics"];
    const insurance = ["Add Insurance", "Public Health", "Pasha Insurance", "Ateshgah", "Xalq Sigorta"];
    const dates = ["Today, 16 Jan", "Tomorrow, 17 Jan", "Sat, 18 Jan", "Sun, 19 Jan"];

    const [selectedLocation, setSelectedLocation] = useState(locations[0]);
    const [selectedSpecialty, setSelectedSpecialty] = useState(specialties[0]);
    const [selectedInsurance, setSelectedInsurance] = useState(insurance[0]);
    const [selectedDate, setSelectedDate] = useState(dates[0]);

    return (
        <div ref={searchRef} className="bg-white p-2 rounded-[2rem] shadow-[0_20px_60px_-10px_rgba(0,0,0,0.1)] border border-slate-100 flex flex-col md:flex-row gap-2 w-full mt-8 relative z-30">

            {/* Location */}
            <div className="flex-1 relative group bg-white">
                <div
                    onClick={() => toggleTab('location')}
                    className={`flex items-center gap-4 px-6 py-5 cursor-pointer rounded-[1.5rem] transition-all h-full border border-transparent ${activeTab === 'location' ? 'bg-slate-50 border-slate-200' : 'bg-slate-50 hover:bg-slate-100'}`}
                >
                    <div className="text-[#0F766E] shrink-0">
                        <MapPin size={22} />
                    </div>
                    <div className="flex-1 text-left min-w-0">
                        <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1 truncate">Location</span>
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-slate-900 font-bold text-sm truncate">{selectedLocation}</span>
                            <ChevronDown size={14} className={`text-slate-400 shrink-0 transition-transform ${activeTab === 'location' ? 'rotate-180' : ''}`} />
                        </div>
                    </div>
                </div>

                {/* Dropdown */}
                <AnimatePresence>
                    {activeTab === 'location' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute top-[calc(100%+8px)] left-0 w-full bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 min-w-[240px]"
                        >
                            {locations.map((item) => (
                                <div
                                    key={item}
                                    onClick={() => { setSelectedLocation(item); setActiveTab(null); }}
                                    className="px-4 py-3 hover:bg-slate-50 rounded-xl cursor-pointer text-sm font-medium text-slate-700 flex items-center gap-2"
                                >
                                    <MapPin size={14} className="text-slate-400" />
                                    {item}
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Condition */}
            <div className="flex-1 relative group bg-white">
                <div
                    onClick={() => toggleTab('specialty')}
                    className={`flex items-center gap-4 px-6 py-5 cursor-pointer rounded-[1.5rem] transition-all h-full border border-transparent ${activeTab === 'specialty' ? 'bg-slate-50 border-slate-200' : 'bg-slate-50 hover:bg-slate-100'}`}
                >
                    <div className="text-[#0F766E] shrink-0">
                        <User size={22} />
                    </div>
                    <div className="flex-1 text-left min-w-0">
                        <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1 truncate">Doctor</span>
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-slate-900 font-bold text-sm truncate">{selectedSpecialty}</span>
                            <ChevronDown size={14} className={`text-slate-400 shrink-0 transition-transform ${activeTab === 'specialty' ? 'rotate-180' : ''}`} />
                        </div>
                    </div>
                </div>

                {/* Dropdown */}
                <AnimatePresence>
                    {activeTab === 'specialty' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute top-[calc(100%+8px)] left-0 w-full bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 min-w-[240px]"
                        >
                            {specialties.map((item) => (
                                <div
                                    key={item}
                                    onClick={() => { setSelectedSpecialty(item); setActiveTab(null); }}
                                    className="px-4 py-3 hover:bg-slate-50 rounded-xl cursor-pointer text-sm font-medium text-slate-700 flex items-center gap-2"
                                >
                                    <User size={14} className="text-slate-400" />
                                    {item}
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Insurance */}
            <div className="flex-1 relative group bg-white hidden lg:block">
                <div
                    onClick={() => toggleTab('insurance')}
                    className={`flex items-center gap-4 px-6 py-5 cursor-pointer rounded-[1.5rem] transition-all h-full border border-transparent ${activeTab === 'insurance' ? 'bg-slate-50 border-slate-200' : 'bg-slate-50 hover:bg-slate-100'}`}
                >
                    <div className="text-[#0F766E] shrink-0">
                        <FileText size={22} />
                    </div>
                    <div className="flex-1 text-left min-w-0">
                        <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1 truncate">Insurance</span>
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-slate-900 font-bold text-sm truncate">{selectedInsurance}</span>
                            <ChevronDown size={14} className={`text-slate-400 shrink-0 transition-transform ${activeTab === 'insurance' ? 'rotate-180' : ''}`} />
                        </div>
                    </div>
                </div>

                {/* Dropdown */}
                <AnimatePresence>
                    {activeTab === 'insurance' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute top-[calc(100%+8px)] left-0 w-full bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 min-w-[240px]"
                        >
                            {insurance.map((item) => (
                                <div
                                    key={item}
                                    onClick={() => { setSelectedInsurance(item); setActiveTab(null); }}
                                    className="px-4 py-3 hover:bg-slate-50 rounded-xl cursor-pointer text-sm font-medium text-slate-700 flex items-center gap-2"
                                >
                                    <FileText size={14} className="text-slate-400" />
                                    {item}
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Date */}
            <div className="flex-1 relative group bg-white hidden xl:block">
                <div
                    onClick={() => toggleTab('date')}
                    className={`flex items-center gap-4 px-6 py-5 cursor-pointer rounded-[1.5rem] transition-all h-full border border-transparent ${activeTab === 'date' ? 'bg-slate-50 border-slate-200' : 'bg-slate-50 hover:bg-slate-100'}`}
                >
                    <div className="text-[#0F766E] shrink-0">
                        <Calendar size={22} />
                    </div>
                    <div className="flex-1 text-left min-w-0">
                        <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1 truncate">Date</span>
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-slate-900 font-bold text-sm truncate">{selectedDate}</span>
                            <ChevronDown size={14} className={`text-slate-400 shrink-0 transition-transform ${activeTab === 'date' ? 'rotate-180' : ''}`} />
                        </div>
                    </div>
                </div>

                {/* Dropdown */}
                <AnimatePresence>
                    {activeTab === 'date' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute top-[calc(100%+8px)] left-0 w-full bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 min-w-[240px]"
                        >
                            {dates.map((item) => (
                                <div
                                    key={item}
                                    onClick={() => { setSelectedDate(item); setActiveTab(null); }}
                                    className="px-4 py-3 hover:bg-slate-50 rounded-xl cursor-pointer text-sm font-medium text-slate-700 flex items-center gap-2"
                                >
                                    <Calendar size={14} className="text-slate-400" />
                                    {item}
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Search Button */}
            <button className="bg-[#4FD1D9] hover:bg-[#3ecbd3] text-[#0F172A] px-10 py-5 rounded-[14px] font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-[#4FD1D9]/50 shrink-0 cursor-pointer active:scale-95">
                Search
                <ArrowUpRight size={18} />
            </button>

        </div>
    )
}
