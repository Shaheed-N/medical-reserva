'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Play } from 'lucide-react';

const REELS = [
    {
        id: '1',
        doctorName: 'Dr. Rəşad Məmmədov',
        specialty: 'Kardioloq',
        thumbnail: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
        videoUrl: '#',
        views: '1.2k'
    },
    {
        id: '2',
        doctorName: 'Dr. Günay Əliyeva',
        specialty: 'Pediatr',
        thumbnail: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=400&q=80',
        videoUrl: '#',
        views: '2.5k'
    },
    {
        id: '3',
        doctorName: 'Dr. Fuad Quliyev',
        specialty: 'Nevropatoloq',
        thumbnail: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80',
        videoUrl: '#',
        views: '800'
    },
    {
        id: '4',
        doctorName: 'Dr. Nigar Mustafayeva',
        specialty: 'Dermatoloq',
        thumbnail: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
        videoUrl: '#',
        views: '3.1k'
    },
    {
        id: '5',
        doctorName: 'Dr. Elvin Həsənov',
        specialty: 'Stomatoloq',
        thumbnail: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80',
        videoUrl: '#',
        views: '1.5k'
    }
];

export function ReelsSection({ locale }: { locale: string }) {
    const isRu = locale === 'ru';

    return (
        <section className="py-24 bg-white overflow-hidden relatives">
            {/* Decorative Background Elements */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-rose-50/50 rounded-full blur-[100px] opacity-60 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 flex flex-col md:flex-row justify-between items-end gap-6 relative z-10">
                <div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-50 border border-rose-100 mb-6 shadow-sm shadow-rose-100/50">
                        <div className="size-2 rounded-full bg-rose-500 animate-pulse"></div>
                        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-rose-600">
                            Instagram Reels
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                        {isRu ? 'Советы от врачей' : 'Həkimlərimizdən'} <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-purple-600">
                            {isRu ? 'в формате Reels' : 'Faydalı Məsləhətlər'}
                        </span>
                    </h2>
                </div>

                <div className="hidden md:flex gap-2">
                    <button className="size-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <button className="size-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all">
                        <span className="material-symbols-outlined">arrow_forward</span>
                    </button>
                </div>
            </div>

            <div className="relative group z-10 pl-4 sm:pl-6 lg:pl-8">
                <div className="flex gap-6 overflow-x-auto pb-12 pr-8 scrollbar-hide snap-x items-center">
                    {REELS.map((reel, idx) => (
                        <motion.div
                            key={reel.id}
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1, duration: 0.6, ease: "easeOut" }}
                            className="relative min-w-[260px] md:min-w-[300px] aspect-[9/16] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200/50 snap-center group/card cursor-pointer border-[6px] border-white ring-1 ring-slate-100"
                        >
                            <div className="absolute inset-0 bg-slate-900 transition-transform duration-700 group-hover/card:scale-110">
                                <Image
                                    src={reel.thumbnail}
                                    alt={reel.doctorName}
                                    fill
                                    className="object-cover opacity-90 group-hover/card:opacity-100 transition-opacity duration-700"
                                />
                            </div>

                            {/* Gradient Overlays */}
                            <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/80" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />

                            {/* Play Button - Premium Glassmorphism */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="group-hover/card:scale-110 transition-transform duration-500 p-4">
                                    <div className="size-16 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center shadow-lg group-hover/card:bg-white/30 transition-colors">
                                        <Play className="text-white fill-white ml-1" size={32} />
                                    </div>
                                </div>
                            </div>

                            {/* Top Stats */}
                            <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/20 backdrop-blur-sm border border-white/10 text-white text-xs font-bold">
                                <span className="material-symbols-outlined text-[14px]">visibility</span>
                                {reel.views}
                            </div>

                            {/* Bottom Info */}
                            <div className="absolute bottom-0 left-0 w-full p-6 text-white transform translate-y-2 group-hover/card:translate-y-0 transition-transform duration-500">
                                <div className="flex items-center gap-2 mb-2 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 delay-100">
                                    <div className="size-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/20">
                                        <span className="material-symbols-outlined text-[14px]">medical_services</span>
                                    </div>
                                    <span className="text-xs font-bold text-white/90 uppercase tracking-wider">{reel.specialty}</span>
                                </div>
                                <h3 className="font-bold text-xl mb-1 leading-tight">{reel.doctorName}</h3>
                                <div className="h-1 w-12 bg-rose-500 rounded-full mt-3 group-hover/card:w-full transition-all duration-700"></div>
                            </div>
                        </motion.div>
                    ))}

                    {/* View All Card */}
                    <div className="min-w-[200px] flex flex-col items-center justify-center gap-4 group/more cursor-pointer px-8">
                        <div className="size-20 rounded-full border-2 border-slate-100 flex items-center justify-center text-slate-300 group-hover/more:border-rose-500 group-hover/more:text-rose-500 transition-all duration-500 bg-white shadow-sm">
                            <span className="material-symbols-outlined text-[32px]">arrow_forward</span>
                        </div>
                        <span className="font-black text-slate-400 text-xs uppercase tracking-widest group-hover/more:text-slate-900 transition-colors">
                            {isRu ? 'Смотреть все' : 'Hamısına bax'}
                        </span>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </section>
    );
}
