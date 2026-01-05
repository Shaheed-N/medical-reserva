"use client";

import { use } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Building2,
    Users,
    UserCog,
    CalendarDays,
    Settings,
    Shield,
    LogOut,
    Bell,
    Search,
    Tag
} from 'lucide-react';

const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Hospitals', href: '/admin/hospitals', icon: Building2 },
    { name: 'Doctors', href: '/admin/doctors', icon: UserCog },
    { name: 'Patients', href: '/admin/patients', icon: Users },
    { name: 'Appointments', href: '/admin/appointments', icon: CalendarDays },
    { name: 'Registry Metadata', href: '/admin/metadata', icon: Tag },
    { name: 'Roles & Permissions', href: '/admin/roles', icon: Shield },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const pathname = usePathname();
    const { locale } = use(params);

    return (
        <div className="min-h-screen bg-[#0F172A] flex">
            {/* Sidebar */}
            <aside className="w-72 bg-[#0F172A] border-r border-slate-800 flex flex-col fixed h-full z-50">
                {/* Logo */}
                <div className="p-6 border-b border-slate-800">
                    <Link href={`/${locale}`} className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#0F766E] rounded flex items-center justify-center text-white">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M12 4v16m-8-8h16" />
                            </svg>
                        </div>
                        <div>
                            <span className="text-lg font-bold text-white block leading-none">MEDPLUS</span>
                            <span className="text-[10px] uppercase tracking-widest text-slate-500">Admin Panel</span>
                        </div>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = pathname === `/${locale}${item.href}` || pathname.startsWith(`/${locale}${item.href}/`);
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

                {/* User */}
                <div className="p-4 border-t border-slate-800">
                    <div className="flex items-center gap-3 px-4 py-3 rounded bg-slate-800/50">
                        <div className="w-10 h-10 rounded bg-gradient-to-br from-[#0F766E] to-[#134E4A] flex items-center justify-center text-white font-bold">
                            A
                        </div>
                        <div className="flex-1">
                            <div className="text-sm font-medium text-white">Admin User</div>
                            <div className="text-xs text-slate-500">Super Admin</div>
                        </div>
                        <button className="text-slate-400 hover:text-white transition-colors">
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 ml-72">
                {/* Page Content */}
                <main className="p-8 bg-slate-50 min-h-screen">
                    {children}
                </main>
            </div>
        </div>
    );
}
