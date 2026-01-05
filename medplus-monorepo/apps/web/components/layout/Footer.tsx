import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-[#0F172A] text-white pt-20 pb-10 border-t border-[#1E293B]">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand - Serious */}
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-[#0F766E] rounded-sm flex items-center justify-center text-white">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M12 4v16m-8-8h16" />
                                </svg>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-bold tracking-tight text-white leading-none">MEDPLUS</span>
                                <span className="text-[10px] uppercase tracking-widest text-[#2DD4BF] font-semibold">National Health</span>
                            </div>
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed mb-8 font-light">
                            Official National Unified Healthcare Reservation System. Providing equitable, efficient, and secure medical access for all citizens.
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Twitter, Linkedin].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-sm bg-[#1E293B] flex items-center justify-center text-slate-400 hover:bg-[#0F766E] hover:text-white transition-all border border-slate-700">
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links - Official */}
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-widest text-[#2DD4BF] mb-8">Services</h3>
                        <ul className="space-y-4 text-sm text-slate-300">
                            <li><Link href="#" className="hover:text-[#2DD4BF] transition-colors flex items-center gap-2"><div className="w-1 h-1 bg-[#2DD4BF] rounded-full"></div>Find a Doctor</Link></li>
                            <li><Link href="#" className="hover:text-[#2DD4BF] transition-colors flex items-center gap-2"><div className="w-1 h-1 bg-[#2DD4BF] rounded-full"></div>Emergency Care</Link></li>
                            <li><Link href="#" className="hover:text-[#2DD4BF] transition-colors flex items-center gap-2"><div className="w-1 h-1 bg-[#2DD4BF] rounded-full"></div>Lab Results</Link></li>
                            <li><Link href="#" className="hover:text-[#2DD4BF] transition-colors flex items-center gap-2"><div className="w-1 h-1 bg-[#2DD4BF] rounded-full"></div>Vaccination</Link></li>
                            <li><Link href="#" className="hover:text-[#2DD4BF] transition-colors flex items-center gap-2"><div className="w-1 h-1 bg-[#2DD4BF] rounded-full"></div>Insurance</Link></li>
                        </ul>
                    </div>

                    {/* Legal / Institutional */}
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-widest text-[#2DD4BF] mb-8">Institution</h3>
                        <ul className="space-y-4 text-sm text-slate-300">
                            <li><Link href="#" className="hover:text-[#2DD4BF] transition-colors">Ministry of Health</Link></li>
                            <li><Link href="#" className="hover:text-[#2DD4BF] transition-colors">Medical Board</Link></li>
                            <li><Link href="#" className="hover:text-[#2DD4BF] transition-colors">Careers</Link></li>
                            <li><Link href="#" className="hover:text-[#2DD4BF] transition-colors">Data Privacy</Link></li>
                            <li><Link href="#" className="hover:text-[#2DD4BF] transition-colors">Report Issue</Link></li>
                        </ul>
                    </div>

                    {/* Contact - Azerbaijan */}
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-widest text-[#2DD4BF] mb-8">Contact Center</h3>
                        <ul className="space-y-6 text-sm text-slate-300">
                            <li className="flex items-start gap-4">
                                <MapPin size={20} className="text-[#0F766E] shrink-0 mt-0.5" />
                                <span>Heydar Aliyev Avenue 152,<br />Baku, Azerbaijan, AZ1029</span>
                            </li>
                            <li className="flex items-center gap-4">
                                <Phone size={20} className="text-[#0F766E] shrink-0" />
                                <span className="font-mono tracking-wider">+994 (12) 440-00-00</span>
                            </li>
                            <li className="flex items-center gap-4">
                                <Mail size={20} className="text-[#0F766E] shrink-0" />
                                <span>support@medplus.az</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-[#1E293B] pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500 font-mono">
                    <p>© 2026 MedPlus National System. All rights reserved.</p>
                    <div className="flex gap-8">
                        <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
                        <Link href="#" className="hover:text-white transition-colors">Accessibility</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
