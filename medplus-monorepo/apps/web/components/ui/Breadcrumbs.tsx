"use client";

import Link from 'next/link';

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
    locale: string;
}

export function Breadcrumbs({ items, locale }: BreadcrumbsProps) {
    const isRu = locale === 'ru';

    return (
        <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 mb-6 overflow-x-auto no-scrollbar whitespace-nowrap">
            <Link
                href={`/${locale}`}
                className="hover:text-cyan-600 transition-colors flex items-center gap-1"
            >
                <span className="material-symbols-outlined text-[16px]">home</span>
                {isRu ? 'Главная' : 'Ana Səhifə'}
            </Link>

            {items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[14px] text-slate-300">chevron_right</span>
                    {item.href ? (
                        <Link
                            href={item.href}
                            className="hover:text-cyan-600 transition-colors"
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-cyan-700">{item.label}</span>
                    )}
                </div>
            ))}
        </nav>
    );
}
