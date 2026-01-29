import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

export async function Footer({ locale }: { locale: string }) {
    const t = await getTranslations({ locale, namespace: 'Footer' });
    const isRu = locale === 'ru';

    const sections = {
        platform: {
            title: isRu ? 'Платформа' : 'Platforma',
            links: [
                { label: isRu ? 'Найти врача' : 'Həkim tap', href: `/${locale}/doctors` },
                { label: isRu ? 'Клиники' : 'Klinikalar', href: `/${locale}/hospitals` },
                { label: isRu ? 'Услуги' : 'Xidmətlər', href: `/${locale}/services` },
                { label: isRu ? 'Для врачей' : 'Həkimlər üçün', href: `/${locale}/for-doctors` },
                { label: isRu ? 'Для клиник' : 'Klinikalar üçün', href: `/${locale}/for-hospitals` },
            ]
        },
        company: {
            title: isRu ? 'Компания' : 'Şirkət',
            links: [
                { label: isRu ? 'О нас' : 'Haqqımızda', href: `/${locale}/about` },
                { label: isRu ? 'Контакты' : 'Əlaqə', href: `/${locale}/contact` },
                { label: isRu ? 'Помощь' : 'Dəstək', href: '#' },
                { label: isRu ? 'Конфиденциальность' : 'Məxfilik', href: '#' },
            ]
        }
    };

    return (
        <footer className="bg-slate-900 text-white relative overflow-hidden border-t-4 border-cyan-500">
            {/* Background Glows */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[150px]"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[150px]"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="space-y-8">
                        <Link href={`/${locale}`} className="flex items-center gap-3">
                            <div className="size-12 rounded-2xl bg-white flex items-center justify-center">
                                <span className="material-symbols-outlined text-cyan-600 text-[28px]">emergency</span>
                            </div>
                            <div>
                                <span className="text-xl font-black tracking-tight text-white uppercase">MED<span className="text-cyan-400">PLUS</span></span>
                                <div className="text-[8px] uppercase tracking-[0.3em] text-slate-400 font-bold">Official Digital Portal</div>
                            </div>
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-xs italic">
                            {t('description')}
                        </p>
                    </div>

                    {/* Platform Links */}
                    <div>
                        <h4 className="font-black text-white mb-8 uppercase text-xs tracking-widest">{sections.platform.title}</h4>
                        <ul className="space-y-4">
                            {sections.platform.links.map((link, i) => (
                                <li key={i}>
                                    <Link className="text-slate-400 hover:text-cyan-400 transition-colors text-sm font-medium flex items-center gap-2 group" href={link.href}>
                                        <span className="material-symbols-outlined text-[14px] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all font-black">arrow_forward</span>
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h4 className="font-black text-white mb-8 uppercase text-xs tracking-widest">{sections.company.title}</h4>
                        <ul className="space-y-4">
                            {sections.company.links.map((link, i) => (
                                <li key={i}>
                                    <Link className="text-slate-400 hover:text-cyan-400 transition-colors text-sm font-medium flex items-center gap-2 group" href={link.href}>
                                        <span className="material-symbols-outlined text-[14px] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all font-black">arrow_forward</span>
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="font-black text-white mb-8 uppercase text-xs tracking-widest">{isRu ? 'Контакты' : 'Əlaqə'}</h4>
                        <ul className="space-y-6 text-sm text-slate-400 font-medium">
                            <li className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
                                <span className="material-symbols-outlined text-cyan-400">phone</span>
                                <div>
                                    <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{isRu ? 'Телефон' : 'Telefon'}</div>
                                    <div className="text-white">+994 (12) 103 00 00</div>
                                </div>
                            </li>
                            <li className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
                                <span className="material-symbols-outlined text-cyan-400">alternate_email</span>
                                <div>
                                    <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Email</div>
                                    <div className="text-white">info@medplus.az</div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-12 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{t('copyright')}</p>
                    <div className="flex gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                        <Link className="hover:text-cyan-400 transition-colors" href="#">{t('privacy_policy')}</Link>
                        <Link className="hover:text-cyan-400 transition-colors" href="#">{t('terms')}</Link>
                        <Link className="hover:text-cyan-400 transition-colors" href="#">{t('accessibility')}</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
