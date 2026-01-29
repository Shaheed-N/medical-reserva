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
        videoUrl: '#'
    },
    {
        id: '2',
        doctorName: 'Dr. Günay Əliyeva',
        specialty: 'Pediatr',
        thumbnail: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=400&q=80',
        videoUrl: '#'
    },
    {
        id: '3',
        doctorName: 'Dr. Fuad Quliyev',
        specialty: 'Nevropatoloq',
        thumbnail: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80',
        videoUrl: '#'
    },
    {
        id: '4',
        doctorName: 'Dr. Nigar Mustafayeva',
        specialty: 'Dermatoloq',
        thumbnail: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
        videoUrl: '#'
    },
    {
        id: '5',
        doctorName: 'Dr. Elvin Həsənov',
        specialty: 'Stomatoloq',
        thumbnail: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80',
        videoUrl: '#'
    }
];

export function ReelsSection({ locale }: { locale: string }) {
    const isRu = locale === 'ru';

    return (
        <section className="py-20 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 flex justify-between items-end">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-100 mb-4">
                        <span className="material-symbols-outlined text-rose-500 text-[18px]">movie</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-rose-600">
                            Reels
                        </span>
                    </div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight">
                        {isRu ? 'Советы от врачей' : 'Həkimlərimizdən Reels'}
                    </h2>
                </div>
            </div>

            <div className="relative group">
                <div className="flex gap-6 overflow-x-auto pb-10 px-4 sm:px-6 lg:px-8 scrollbar-hide snap-x h-[500px] items-center">
                    {REELS.map((reel, idx) => (
                        <motion.div
                            key={reel.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className="relative min-w-[240px] md:min-w-[280px] aspect-[9/16] rounded-[2rem] overflow-hidden shadow-2xl shadow-slate-200 snap-center group/card cursor-pointer"
                        >
                            <Image
                                src={reel.thumbnail}
                                alt={reel.doctorName}
                                fill
                                className="object-cover group-hover/card:scale-110 transition-transform duration-700"
                            />

                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover/card:opacity-80 transition-opacity" />

                            {/* Play Button */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-all transform scale-75 group-hover/card:scale-100">
                                <div className="size-16 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center">
                                    <Play className="text-white fill-white" size={32} />
                                </div>
                            </div>

                            {/* Info */}
                            <div className="absolute bottom-0 left-0 w-full p-6 text-white transform translate-y-2 group-hover/card:translate-y-0 transition-transform">
                                <h3 className="font-bold text-lg mb-1">{reel.doctorName}</h3>
                                <p className="text-white/70 text-sm font-medium">{reel.specialty}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Horizontal Scroll Hint */}
                <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-2 text-slate-300 group-hover:text-cyan-500 transition-colors">
                    <span className="text-[10px] font-black uppercase tracking-widest">Scroll</span>
                    <span className="material-symbols-outlined text-[24px]">arrow_forward</span>
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
