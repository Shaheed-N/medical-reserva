"use client";

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export default function ContactPage() {
    const params = useParams();
    const locale = params.locale as string || 'az';
    const isRu = locale === 'ru';

    const breadcrumbItems = [
        { label: isRu ? 'Контакты' : 'Əlaqə' }
    ];

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Handle form submission
        console.log('Form submitted:', formData);
        setTimeout(() => setIsSubmitting(false), 1500);
    };

    const contactInfo = [
        {
            icon: 'call',
            title: isRu ? 'Телефон' : 'Telefon',
            info: '+994 12 440 00 00',
            desc: isRu ? 'Пн-Пт, 9:00-18:00' : 'B.e-Cümə, 9:00-18:00',
        },
        {
            icon: 'mail',
            title: isRu ? 'Email' : 'Email',
            info: 'info@medplus.az',
            desc: isRu ? 'Ответим в течение 24 часов' : '24 saat ərzində cavab',
        },
        {
            icon: 'location_on',
            title: isRu ? 'Адрес' : 'Ünvan',
            info: isRu ? 'Баку, ул. Низами 123' : 'Bakı, Nizami küç. 123',
            desc: isRu ? 'Главный офис' : 'Baş ofis',
        },
        {
            icon: 'support_agent',
            title: isRu ? 'Поддержка' : 'Dəstək',
            info: isRu ? '24/7 Онлайн чат' : '24/7 Onlayn çat',
            desc: isRu ? 'Мгновенный ответ' : 'Ani cavab',
        }
    ];

    return (
        <main className="bg-white text-slate-600 font-sans antialiased overflow-x-hidden">
            {/* Background - Clean Premium */}
            <div className="fixed inset-0 z-[-1] bg-white">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1000px] bg-gradient-radial-top pointer-events-none opacity-60"></div>
            </div>

            {/* Hero Section */}
            <section className="relative pt-8 pb-12 lg:pt-12 lg:pb-16 border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Breadcrumbs items={breadcrumbItems} locale={locale} />

                    {/* Header */}
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-50 border border-cyan-100 w-fit mb-6">
                            <span className="material-symbols-outlined text-cyan-600 text-[18px]">contact_support</span>
                            <span className="text-xs font-bold uppercase tracking-widest text-cyan-700">
                                {isRu ? 'Связаться с нами' : 'Bizimlə Əlaqə'}
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium text-slate-900 leading-[1.1] tracking-tight mb-6">
                            {isRu ? 'Мы всегда готовы' : 'Həmişə hazırıq'} <br />
                            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-cyan-400">
                                {isRu ? 'вам помочь' : 'sizə kömək etməyə'}
                            </span>
                        </h1>
                        <p className="text-xl text-slate-500 max-w-xl leading-relaxed">
                            {isRu
                                ? 'Свяжитесь с нами любым удобным способом. Мы ответим в кратчайшие сроки.'
                                : 'İstənilən rahat üsulla bizimlə əlaqə saxlayın. Ən qısa zamanda cavab verəcəyik.'}
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Cards */}
            <section className="py-12 bg-surface-50 border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {contactInfo.map((item, i) => (
                            <div
                                key={i}
                                className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:border-cyan-100 transition-all duration-300 group"
                            >
                                <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-4 group-hover:bg-cyan-500 group-hover:text-white transition-colors">
                                    <span className="material-symbols-outlined text-[24px]">{item.icon}</span>
                                </div>
                                <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                                <p className="text-cyan-600 font-semibold mb-1">{item.info}</p>
                                <p className="text-sm text-slate-400">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Main Content - Form + Map */}
            <section className="py-16 lg:py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                        {/* Contact Form */}
                        <div>
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[20px]">send</span>
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900">
                                    {isRu ? 'Отправить сообщение' : 'Mesaj göndər'}
                                </h2>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            {isRu ? 'Ваше имя' : 'Adınız'} *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all text-slate-900 placeholder:text-slate-400"
                                            placeholder={isRu ? 'Введите имя' : 'Adınızı daxil edin'}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all text-slate-900 placeholder:text-slate-400"
                                            placeholder="email@example.com"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            {isRu ? 'Телефон' : 'Telefon'}
                                        </label>
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all text-slate-900 placeholder:text-slate-400"
                                            placeholder="+994 XX XXX XX XX"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            {isRu ? 'Тема' : 'Mövzu'} *
                                        </label>
                                        <select
                                            required
                                            value={formData.subject}
                                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                            className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all text-slate-900 appearance-none cursor-pointer"
                                        >
                                            <option value="">{isRu ? 'Выберите тему' : 'Mövzu seçin'}</option>
                                            <option value="general">{isRu ? 'Общий вопрос' : 'Ümumi sual'}</option>
                                            <option value="appointment">{isRu ? 'Запись на прием' : 'Qəbula yazılma'}</option>
                                            <option value="partnership">{isRu ? 'Партнерство' : 'Tərəfdaşlıq'}</option>
                                            <option value="support">{isRu ? 'Техподдержка' : 'Texniki dəstək'}</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        {isRu ? 'Сообщение' : 'Mesaj'} *
                                    </label>
                                    <textarea
                                        required
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        rows={5}
                                        className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all resize-none text-slate-900 placeholder:text-slate-400"
                                        placeholder={isRu ? 'Ваше сообщение...' : 'Mesajınız...'}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-cyan-600 shadow-lg shadow-slate-900/10 hover:shadow-cyan-500/30 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                                            {isRu ? 'Отправка...' : 'Göndərilir...'}
                                        </>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined text-[20px]">send</span>
                                            {isRu ? 'Отправить сообщение' : 'Mesaj göndər'}
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* Map + Office Info */}
                        <div className="space-y-8">
                            {/* Map */}
                            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                                <div className="p-5 border-b border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-[20px]">map</span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900">
                                                {isRu ? 'Наш офис на карте' : 'Xəritədə ofisimiz'}
                                            </h3>
                                            <p className="text-sm text-slate-400">
                                                {isRu ? 'Баку, ул. Низами 123' : 'Bakı, Nizami küç. 123'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="h-80 bg-slate-100">
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3039.4756428697897!2d49.8367!3d40.3929!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDIzJzM0LjQiTiA0OcKwNTAnMTIuMSJF!5e0!3m2!1sen!2saz!4v1234567890"
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    />
                                </div>
                            </div>

                            {/* Working Hours */}
                            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-[20px]">schedule</span>
                                    </div>
                                    <h3 className="font-bold text-slate-900">
                                        {isRu ? 'Часы работы' : 'İş saatları'}
                                    </h3>
                                </div>
                                <div className="space-y-3">
                                    {[
                                        { day: isRu ? 'Понедельник - Пятница' : 'Bazar ertəsi - Cümə', time: '09:00 - 18:00', active: true },
                                        { day: isRu ? 'Суббота' : 'Şənbə', time: '10:00 - 15:00', active: true },
                                        { day: isRu ? 'Воскресенье' : 'Bazar', time: isRu ? 'Выходной' : 'İstirahət', active: false },
                                    ].map((schedule, i) => (
                                        <div key={i} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                                            <span className="text-slate-600">{schedule.day}</span>
                                            <span className={`font-semibold ${schedule.active ? 'text-slate-900' : 'text-slate-400'}`}>
                                                {schedule.time}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Emergency CTA */}
                            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/20 rounded-full blur-3xl"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-12 h-12 rounded-xl bg-red-500 text-white flex items-center justify-center">
                                            <span className="material-symbols-outlined text-[24px]">emergency</span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white">
                                                {isRu ? 'Экстренная помощь' : 'Təcili yardım'}
                                            </h3>
                                            <p className="text-sm text-slate-400">24/7</p>
                                        </div>
                                    </div>
                                    <a
                                        href="tel:103"
                                        className="w-full py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-cyan-50 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">call</span>
                                        103 - {isRu ? 'Скорая помощь' : 'Təcili tibbi yardım'}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
