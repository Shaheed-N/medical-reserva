import { getTranslations } from 'next-intl/server';
import { Globe, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export async function TopBanner({ locale }: { locale: string }) {
    const t = await getTranslations({ locale, namespace: 'Banner' });

    return (
        <div className="relative z-[110] bg-slate-950 text-white overflow-hidden h-9 flex items-center border-b border-white/5 font-sans">
            {/* Subtle Gradient Glow */}
            <div className="absolute inset-0 opacity-20 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent animate-pulse" />

            <div className="container mx-auto px-4 flex items-center justify-between relative z-10 text-[10px] w-full h-full">

                {/* Left: Official Badge */}
                <div className="flex items-center gap-2 shrink-0 z-20 bg-slate-950 pr-4 h-full">
                    <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10 hover:bg-white/10 transition-colors group cursor-default">
                        <div className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                            <Globe size={10} className="relative text-cyan-400 group-hover:rotate-12 transition-transform" />
                        </div>
                        <span className="font-bold text-slate-300 uppercase tracking-[0.15em] text-[9px]">
                            Official
                        </span>
                    </div>
                </div>

                {/* Center: Scrolling Ticker */}
                <Link
                    href={`/${locale}/doctors`}
                    className="absolute inset-0 flex items-center justify-center overflow-hidden cursor-pointer"
                    style={{
                        maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
                        WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
                    }}
                >
                    <div className="flex items-center gap-12 whitespace-nowrap animate-marquee">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-center gap-3 mx-4">
                                <span className="font-black text-cyan-400 tracking-widest uppercase text-[9px] italic">
                                    {t('protocol')}
                                </span>
                                <span className="h-1 w-1 bg-white/20 rounded-full" />
                                <span className="text-slate-200 font-medium tracking-wide">
                                    {t('message')}
                                </span>
                            </div>
                        ))}
                    </div>
                </Link>

                {/* Right: Details Button */}
                <Link
                    href={`/${locale}/doctors`}
                    className="hidden md:flex items-center gap-2 group shrink-0 z-20 bg-slate-950 pl-6 h-full cursor-pointer hover:bg-slate-950/80 transition-all font-sans"
                >
                    <span className="text-slate-400 font-black uppercase tracking-[0.2em] text-[8px] group-hover:text-cyan-400 transition-colors border-b border-transparent group-hover:border-cyan-400/30 pb-0.5">
                        {t('details')}
                    </span>
                    <div className="bg-cyan-500/10 p-1 rounded-md group-hover:bg-cyan-500/20 transition-colors">
                        <ArrowRight size={12} className="text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                </Link>

                <Link
                    href={`/${locale}/doctors`}
                    className="md:hidden absolute inset-0 z-30 w-full h-full opacity-0"
                    aria-label="View doctors list"
                />
            </div>

            <style>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 40s linear infinite;
                }
            `}</style>
        </div>
    );
}
