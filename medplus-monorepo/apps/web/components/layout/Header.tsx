"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { locales, localeNames } from '@/i18n/config';

export function Header({ locale }: { locale: string }) {
    const t = useTranslations('Navigation');
    const tCommon = useTranslations('Common');
    const tAuth = useTranslations('Auth');

    const pathname = usePathname();
    const router = useRouter();

    const switchLocale = (newLocale: string) => {
        // Replace the locale segment in the path
        const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
        router.push(newPath);
    };

    return (
        <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-slate-200">
            <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                {/* Brand */}
                <Link href={`/${locale}`} className="flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-[#0F766E] flex items-center justify-center text-white rounded-sm shadow-sm group-hover:bg-[#115E59] transition-colors">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M12 4v16m-8-8h16" />
                        </svg>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-bold tracking-tight text-slate-900 leading-none group-hover:text-[#0F766E] transition-colors">MEDPLUS</span>
                        <span className="text-[10px] uppercase tracking-widest text-[#0F766E] font-semibold">National Health</span>
                    </div>
                </Link>

                {/* Navigation */}
                <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-600">
                    <Link href={`/${locale}/services`} className="hover:text-[#0F766E] transition-colors uppercase tracking-wide text-xs font-bold">{t('services')}</Link>
                    <Link href={`/${locale}/doctors`} className="hover:text-[#0F766E] transition-colors uppercase tracking-wide text-xs font-bold">{t('doctors')}</Link>
                    <Link href={`/${locale}/hospitals`} className="hover:text-[#0F766E] transition-colors uppercase tracking-wide text-xs font-bold">{t('hospitals')}</Link>
                    <Link href={`/${locale}/about`} className="hover:text-[#0F766E] transition-colors uppercase tracking-wide text-xs font-bold">{t('about')}</Link>
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-6">
                    {/* Language Switcher */}
                    <div className="flex items-center border border-slate-200 rounded-sm overflow-hidden">
                        {locales.map((l) => (
                            <button
                                key={l}
                                onClick={() => switchLocale(l)}
                                className={`px-3 py-1.5 text-xs font-bold ${locale === l
                                        ? 'bg-[#0F766E] text-white'
                                        : 'bg-white text-slate-600 hover:bg-slate-50'
                                    }`}
                            >
                                {localeNames[l]}
                            </button>
                        ))}
                    </div>

                    <div className="hidden md:flex items-center gap-4">
                        <Link
                            href={`/${locale}/login?role=provider`}
                            className="text-sm font-semibold text-slate-600 hover:text-[#0F766E] transition-colors"
                        >
                            {tCommon('provider_login')}
                        </Link>
                        <Link
                            href={`/${locale}/login`}
                            className="px-6 py-2.5 bg-[#0F766E] text-white text-sm font-bold rounded-sm hover:bg-[#134E4A] transition-all tracking-wide shadow-sm hover:shadow-md"
                        >
                            {tCommon('patient_portal')}
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}
