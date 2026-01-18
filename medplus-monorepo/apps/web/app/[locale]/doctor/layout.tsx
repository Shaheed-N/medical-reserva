"use client";

import { use } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    CalendarDays,
    Clock,
    Users,
    Star,
    Settings,
    Shield,
    LogOut,
    Bell,
    Stethoscope,
    ListChecks
} from 'lucide-react';

export default function DoctorLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const pathname = usePathname();
    const { locale } = use(params);
    const isRu = locale === 'ru';

    const navItems = [
        {
            name: isRu ? 'Панель' : 'Panel',
            href: '/doctor',
            icon: LayoutDashboard
        },
        {
            name: isRu ? 'Календарь' : 'Təqvim',
            href: '/doctor/calendar',
            icon: CalendarDays
        },
        {
            name: isRu ? 'Аналитика' : 'Analitika',
            href: '/doctor/analytics',
            icon: Star // Using Star for now, or maybe TrendingUp if I find it
        },
        {
            name: isRu ? 'Записи' : 'Rezervasiyalar',
            href: '/doctor/appointments',
            icon: Clock
        },
        {
            name: isRu ? 'Пациенты' : 'Pasientlər',
            href: '/doctor/patients',
            icon: Users
        },
        {
            name: isRu ? 'Причины визита' : 'Səbəblər',
            href: '/doctor/visit-reasons',
            icon: ListChecks
        },
        {
            name: isRu ? 'Отзывы' : 'Rəylər',
            href: '/doctor/reviews',
            icon: Star
        },
        {
            name: isRu ? 'Настройки' : 'Parametrlər',
            href: '/doctor/settings',
            icon: Settings
        },
    ];

    return (
        <div className="min-h-screen bg-[#0F172A] flex">
            {/* Sidebar */}
            <aside className="w-72 bg-[#0F172A] border-r border-slate-800 flex flex-col fixed h-full z-50">
                {/* Logo */}
                <div className="p-6 border-b border-slate-800">
                    <Link href={`/${locale}`} className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#0F766E] rounded flex items-center justify-center text-white">
                            <Stethoscope size={20} />
                        </div>
                        <div>
                            <span className="text-lg font-bold text-white block leading-none">MEDPLUS</span>
                            <span className="text-[10px] uppercase tracking-widest text-slate-500">
                                {isRu ? 'Панель Врача' : 'Həkim Paneli'}
                            </span>
                        </div>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = pathname === `/${locale}${item.href}` ||
                            (item.href !== '/doctor' && pathname.startsWith(`/${locale}${item.href}`));
                        return (
                            <Link
                                key={item.name}
                                href={`/${locale}${item.href}`}
                                className={`flex items-center gap-3 px-4 py-3 rounded text-sm font-medium transition-all ${isActive
                                    ? 'bg-[#0F766E] text-white'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                    }`}
                            >
                                <item.icon size={20} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* Notifications */}
                <div className="px-4 pb-2">
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-all relative">
                        <Bell size={20} />
                        {isRu ? 'Уведомления' : 'Bildirişlər'}
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">
                            3
                        </span>
                    </button>
                </div>

                {/* User */}
                <div className="p-4 border-t border-slate-800">
                    <div className="flex items-center gap-3 px-4 py-3 rounded bg-slate-800/50">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0F766E] to-[#134E4A] flex items-center justify-center text-white font-bold">
                            D
                        </div>
                        <div className="flex-1">
                            <div className="text-sm font-medium text-white">Dr. Ahmad</div>
                            <div className="text-xs text-slate-500">{isRu ? 'Кардиолог' : 'Kardioloq'}</div>
                        </div>
                        <button className="text-slate-400 hover:text-white transition-colors">
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 ml-72">
                <main className="p-8 bg-slate-50 min-h-screen">
                    {children}
                </main>
            </div>
        </div>
    );
}
