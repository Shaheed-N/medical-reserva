"use client";

import Link from 'next/link';

export function Footer({ locale }: { locale: string }) {
    const isRu = locale === 'ru';

    const content = {
        desc: isRu
            ? 'Единая национальная платформа цифрового здравоохранения. Забота о здоровье стала проще.'
            : 'Vahid milli rəqəmsal səhiyyə platforması. Sağlamlığınızın qayğısına qalmaq artıq daha asandır.',
        platform: {
            title: isRu ? 'Платформа' : 'Platforma',
            links: [
                { label: isRu ? 'Услуги' : 'Xidmətlər', href: `/${locale}/services` },
                { label: isRu ? 'Клиники' : 'Klinikalar', href: `/${locale}/hospitals` },
                { label: isRu ? 'Кабинет Пациента' : 'Pasiyent Kabineti', href: `/${locale}/login` },
                { label: isRu ? 'Для Врачей' : 'Həkimlər üçün', href: `/${locale}/for-doctors` },
            ]
        },
        company: {
            title: isRu ? 'Компания' : 'Şirkət',
            links: [
                { label: isRu ? 'О Нас' : 'Haqqımızda', href: '#' },
                { label: isRu ? 'Карьера' : 'Karyera', href: '#' },
                { label: isRu ? 'Контакты' : 'Əlaqə', href: '#' },
                { label: isRu ? 'Помощь' : 'Dəstək', href: '#' },
            ]
        },
        newsletter: {
            title: isRu ? 'Новости' : 'Xəbərlər',
            desc: isRu ? 'Подпишитесь на последние новости медицины.' : 'Ən son tibbi yeniliklərdən xəbərdar olun.',
            placeholder: isRu ? 'Ваш Email' : 'Email ünvanınız',
            button: '→'
        },
        copyright: isRu ? '© 2024 MedPlus. Все права защищены.' : '© 2024 MedPlus. Bütün hüquqlar qorunur.'
    };

    return (
        <footer className="bg-white border-t border-slate-200 relative">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-30"></div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="size-8 rounded bg-cyan-700 flex items-center justify-center text-white">
                                <span className="material-symbols-outlined text-lg">medical_services</span>
                            </div>
                            <span className="text-xl font-bold text-slate-900">MedPlus</span>
                        </div>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            {content.desc}
                        </p>
                        <div className="flex gap-4">
                            <a className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-cyan-600 hover:text-white transition-all" href="#">
                                <span className="material-symbols-outlined text-sm">public</span>
                            </a>
                            <a className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-cyan-600 hover:text-white transition-all" href="#">
                                <span className="material-symbols-outlined text-sm">mail</span>
                            </a>
                        </div>
                    </div>

                    {/* Platform Links */}
                    <div>
                        <h4 className="font-bold text-slate-900 mb-6 uppercase text-xs tracking-wider">{content.platform.title}</h4>
                        <ul className="space-y-4 text-slate-500 text-sm">
                            {content.platform.links.map((link, i) => (
                                <li key={i}><Link className="hover:text-cyan-600 transition-colors" href={link.href}>{link.label}</Link></li>
                            ))}
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h4 className="font-bold text-slate-900 mb-6 uppercase text-xs tracking-wider">{content.company.title}</h4>
                        <ul className="space-y-4 text-slate-500 text-sm">
                            {content.company.links.map((link, i) => (
                                <li key={i}><Link className="hover:text-cyan-600 transition-colors" href={link.href}>{link.label}</Link></li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="font-bold text-slate-900 mb-6 uppercase text-xs tracking-wider">{content.newsletter.title}</h4>
                        <p className="text-slate-500 text-sm mb-4">{content.newsletter.desc}</p>
                        <div className="relative">
                            <input
                                className="w-full bg-surface-50 border border-slate-200 rounded-lg py-3 px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-all shadow-sm outline-none"
                                placeholder={content.newsletter.placeholder}
                                type="email"
                            />
                            <button className="absolute right-2 top-1.5 bottom-1.5 px-3 bg-cyan-700 rounded text-white hover:bg-cyan-600 transition-colors flex items-center justify-center">
                                <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-slate-500 text-sm">{content.copyright}</p>
                    <div className="flex gap-6 text-sm text-slate-500">
                        <Link className="hover:text-cyan-600 transition-colors" href="#">Privacy</Link>
                        <Link className="hover:text-cyan-600 transition-colors" href="#">Terms</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
