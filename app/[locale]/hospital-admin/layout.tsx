"use client";

import { use } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    UserCog,
    Clock,
    CalendarDays,
    Settings,
    LogOut,
    Building2,
    FileText,
    TrendingUp
} from 'lucide-react';

export default function HospitalAdminLayout({
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
            href: '/hospital-admin',
            icon: LayoutDashboard
        },
        {
            name: isRu ? 'Профиль Клиники' : 'Klinika Profili',
            href: '/hospital-admin/profile',
            icon: Building2
        },
        {
            name: isRu ? 'Врачи' : 'Həkimlər',
            href: '/hospital-admin/doctors',
            icon: UserCog
        },
        {
            name: isRu ? 'Аналитика' : 'Analitika',
            href: '/hospital-admin/analytics',
            icon: TrendingUp
        },
        {
            name: isRu ? 'Записи' : 'Rezervasiyalar',
            href: '/hospital-admin/appointments',
            icon: CalendarDays
        },
        {
            name: isRu ? 'Ресепшн' : 'Qəbul',
            href: '/hospital-admin/reception',
            icon: Users
        },
        {
            name: isRu ? 'Заявки' : 'Müraciətlər',
            href: '/hospital-admin/applications',
            icon: FileText
        },
        {
            name: isRu ? 'Настройки' : 'Parametrlər',
            href: '/hospital-admin/settings',
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
                        <div className="w-10 h-10 bg-purple-600 rounded flex items-center justify-center text-white">
                            <Building2 size={20} />
                        </div>
                        <div>
                            <span className="text-lg font-bold text-white block leading-none">MEDPLUS</span>
                            <span className="text-[10px] uppercase tracking-widest text-slate-500">
                                {isRu ? 'Админ Клиники' : 'Klinika Admin'}
                            </span>
                        </div>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = pathname === `/${locale}${item.href}` ||
                            (item.href !== '/hospital-admin' && pathname.startsWith(`/${locale}${item.href}`));
                        return (
                            <Link
                                key={item.name}
                                href={`/${locale}${item.href}`}
                                className={`flex items-center gap-3 px-4 py-3 rounded text-sm font-medium transition-all ${isActive
                                    ? 'bg-purple-600 text-white'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                    }`}
                            >
                                <item.icon size={20} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* User */}
                <div className="p-4 border-t border-slate-800">
                    <div className="flex items-center gap-3 px-4 py-3 rounded bg-slate-800/50">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white font-bold">
                            K
                        </div>
                        <div className="flex-1">
                            <div className="text-sm font-medium text-white">{isRu ? 'Клиника Mərkəz' : 'Klinika Mərkəz'}</div>
                            <div className="text-xs text-slate-500">{isRu ? 'Администратор' : 'Administrator'}</div>
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
