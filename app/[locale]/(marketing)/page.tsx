import { getTranslations, setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import { VideoBackground } from '@/components/ui/VideoBackground';
import { ReelsSection } from '@/components/marketing/ReelsSection';

export default async function Home({ params: paramsPromise }: { params: Promise<{ locale: string }> }) {
    const { locale } = await paramsPromise;
    setRequestLocale(locale);
    const t = await getTranslations({ locale });
    const isRu = locale === 'ru';

    // Categories data for the specialties section
    const specialties = [
        { name: isRu ? 'Кардиология' : 'Kardiologiya', icon: 'cardiology', desc: isRu ? 'Сердечно-сосудистая система' : 'Ürək və damar sistemi', count: 48, color: 'cyan' },
        { name: isRu ? 'Неврология' : 'Nevrologiya', icon: 'neurology', desc: isRu ? 'Нервная система' : 'Sinir sistemi', count: 35, color: 'blue' },
        { name: isRu ? 'Педиатрия' : 'Pediatriya', icon: 'child_care', desc: isRu ? 'Детское здоровье' : 'Uşaq sağlamlığı', count: 62, color: 'emerald' },
        { name: isRu ? 'Стоматология' : 'Stomatologiya', icon: 'dentistry', desc: isRu ? 'Здоровье зубов' : 'Diş sağlamlığı', count: 87, color: 'sky' },
        { name: isRu ? 'Дерматология' : 'Dermatologiya', icon: 'dermatology', desc: isRu ? 'Кожные заболевания' : 'Dəri xəstəlikləri', count: 41, color: 'rose' },
        { name: isRu ? 'Офтальмология' : 'Oftalmologiya', icon: 'visibility', desc: isRu ? 'Здоровье глаз' : 'Göz sağlamlığı', count: 29, color: 'indigo' },
        { name: isRu ? 'Гинекология' : 'Ginekologiya', icon: 'female', desc: isRu ? 'Женское здоровье' : 'Qadın sağlamlığı', count: 54, color: 'pink' },
        { name: isRu ? 'Ортопедия' : 'Ortopediya', icon: 'skeleton', desc: isRu ? 'Опорно-двигательный аппарат' : 'Sümük və oynaqlar', count: 31, color: 'amber' },
    ];

    // Doctors data
    const doctors = [
        {
            name: isRu ? 'Др. Рашад Маммадов' : 'Dr. Rəşad Məmmədov',
            spec: isRu ? 'Кардиолог' : 'Kardioloq',
            location: 'Bakı Medical Plaza',
            icon: 'cardiology',
            color: 'text-cyan-600',
            bgColor: 'bg-cyan-50',
            rating: 4.9,
            reviews: 127,
            experience: 15,
            img: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80'
        },
        {
            name: isRu ? 'Др. Гюнай Алиева' : 'Dr. Günay Əliyeva',
            spec: isRu ? 'Педиатр' : 'Pediatr',
            location: 'Bona Dea Hospital',
            icon: 'child_care',
            color: 'text-emerald-600',
            bgColor: 'bg-emerald-50',
            rating: 4.8,
            reviews: 89,
            experience: 12,
            img: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=400&q=80'
        },
        {
            name: isRu ? 'Др. Фуад Гулиев' : 'Dr. Fuad Quliyev',
            spec: isRu ? 'Нevropatoloq' : 'Nevropatoloq',
            location: 'Mərkəzi Klinika',
            icon: 'neurology',
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
            rating: 4.9,
            reviews: 156,
            experience: 18,
            img: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80'
        },
        {
            name: isRu ? 'Др. Нигяр Мустафаева' : 'Dr. Nigar Mustafayeva',
            spec: isRu ? 'Дерматолог' : 'Dermatoloq',
            location: 'Central Hospital',
            icon: 'dermatology',
            color: 'text-pink-600',
            bgColor: 'bg-pink-50',
            rating: 4.7,
            reviews: 203,
            experience: 10,
            img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80'
        }
    ];

    return (
        <main className="bg-white text-slate-600 font-sans antialiased overflow-x-hidden selection:bg-cyan-100 selection:text-cyan-900">
            {/* HER0 SECTION */}
            <section className="relative min-h-[90vh] flex items-center pt-24 pb-32 overflow-hidden bg-white">
                {/* Fixed Video View - matching screenshot doctor on right */}
                <div className="absolute top-0 right-0 w-1/2 h-full hidden lg:block pointer-events-none">
                    <div className="relative w-full h-full">
                        <VideoBackground
                            videoSrc="https://videos.pexels.com/video-files/8943812/8943812-hd_1920_1080_25fps.mp4"
                            overlayClassName="bg-gradient-to-l from-transparent via-white/20 to-white"
                        />
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full">
                    <div className="lg:w-3/5">
                        <h1 className="text-6xl md:text-8xl font-medium text-slate-900 leading-[1.1] tracking-tight mb-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
                            {isRu ? 'Ваше Здоровье' : 'Sizin Sağlamlığınız'} <br />
                            <span className="font-bold text-cyan-500">
                                {isRu ? 'Наш Приоритет' : 'Bizim Prioritetimiz'}
                            </span>
                        </h1>

                        <div className="border-l-2 border-slate-100 pl-6 mb-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                            <p className="text-xl text-slate-400 font-medium max-w-lg leading-relaxed">
                                {isRu
                                    ? 'Находите лучших врачей, записывайтесь на прием онлайн и управляйте своим здоровьем с комфортом.'
                                    : 'Ən yaxşı həkimləri tapın, onlayn qəbula yazılın və sağlamlığınızı rahatlıqla idarə edin.'}
                            </p>
                        </div>

                        {/* RESTORED SEARCH BAR DESIGN */}
                        <div className="max-w-4xl bg-white p-3 rounded-[3rem] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.1)] border border-slate-50 flex flex-col lg:flex-row gap-2 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                            <Link href={`/${locale}/doctors`} className="flex-1 flex items-center gap-5 px-6 py-3 hover:bg-slate-50 transition-all rounded-[2rem] group border-r border-slate-50 lg:border-r">
                                <div className="w-12 h-12 rounded-2xl bg-cyan-50 flex items-center justify-center text-cyan-500 group-hover:bg-cyan-100 transition-colors">
                                    <span className="material-symbols-outlined font-light">location_on</span>
                                </div>
                                <div className="flex flex-col text-left">
                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-0.5">{isRu ? 'Расположение' : 'ÜNVAN'}</span>
                                    <span className="text-[15px] font-bold text-slate-900">{isRu ? 'Выберите Город' : 'Şəhər Seçin'}</span>
                                </div>
                            </Link>

                            <Link href={`/${locale}/doctors`} className="flex-1 flex items-center gap-5 px-6 py-3 hover:bg-slate-50 transition-all rounded-[2rem] group border-r border-slate-50 lg:border-r">
                                <div className="w-12 h-12 rounded-2xl bg-cyan-50 flex items-center justify-center text-cyan-500 group-hover:bg-cyan-100 transition-colors">
                                    <span className="material-symbols-outlined font-light">person</span>
                                </div>
                                <div className="flex flex-col text-left">
                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-0.5">{isRu ? 'Специальность' : 'İXTİSAS'}</span>
                                    <span className="text-[15px] font-bold text-slate-900">{isRu ? 'Выберите Услугу' : 'Xidmət Seçin'}</span>
                                </div>
                            </Link>

                            <Link href={`/${locale}/doctors`} className="flex-1 flex items-center gap-5 px-6 py-3 hover:bg-slate-50 transition-all rounded-[2rem] group">
                                <div className="w-12 h-12 rounded-2xl bg-cyan-50 flex items-center justify-center text-cyan-500 group-hover:bg-cyan-100 transition-colors">
                                    <span className="material-symbols-outlined font-light">calendar_today</span>
                                </div>
                                <div className="flex flex-col text-left">
                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-0.5">{isRu ? 'Дата' : 'TARİX'}</span>
                                    <span className="text-[15px] font-bold text-slate-900">{isRu ? 'Выберите Дату' : 'Tarix Seçin'}</span>
                                </div>
                            </Link>

                            <div className="flex items-center">
                                <Link
                                    href={`/${locale}/doctors`}
                                    className="h-[60px] w-full lg:w-auto px-10 rounded-full bg-cyan-500 hover:bg-cyan-400 text-white font-black transition-all flex items-center justify-center gap-3 whitespace-nowrap active:scale-95 shadow-xl shadow-cyan-100"
                                >
                                    <span className="uppercase tracking-widest text-xs">{isRu ? 'Поиск' : 'Axtarış'}</span>
                                    <span className="material-symbols-outlined text-[20px]">search</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* REELS SECTION */}
            <ReelsSection locale={locale} />

            {/* SERVICES SECTION */}
            <section className="py-24 relative overflow-hidden bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16 max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-50 border border-cyan-100 mb-6">
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-900">{isRu ? 'Наши Услуги' : 'Xidmətlərimiz'}</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
                            {isRu ? 'Всё для вашего здоровья' : 'Sağlamlığınız üçün hər şey'}<span className="text-cyan-500">.</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                title: isRu ? 'Онлайн Запись' : 'Onlayn Qeydiyyat',
                                desc: isRu ? 'Никаких очередей.' : 'Növbə gözləmədən.',
                                icon: 'calendar_clock',
                                illustration: 'https://images.pexels.com/photos/4021775/pexels-photo-4021775.jpeg?auto=format&fit=crop&w=800&q=80'
                            },
                            {
                                title: isRu ? 'Электронная Карта' : 'Elektron Tibb Kartı',
                                desc: isRu ? 'История болезни всегда под рукой.' : 'Xəstəlik tarixçəsi telefonunuzda.',
                                icon: 'description',
                                illustration: 'https://images.pexels.com/photos/7089401/pexels-photo-7089401.jpeg?auto=format&fit=crop&w=800&q=80'
                            },
                            {
                                title: isRu ? 'Видео Прием' : 'Video Qəbul',
                                desc: isRu ? 'Консультации по видеосвязи.' : 'Video formatda konsultasiya.',
                                icon: 'videocam',
                                illustration: 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=format&fit=crop&w=800&q=80'
                            }
                        ].map((card, idx) => (
                            <div key={idx} className="group relative p-8 rounded-[2.5rem] bg-white border border-slate-100 hover:border-cyan-200 transition-all duration-500 hover:shadow-2xl flex flex-col items-center text-center">
                                <div className="w-full aspect-video mb-8 relative rounded-2xl overflow-hidden">
                                    <Image
                                        src={card.illustration}
                                        alt={card.title}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                    />
                                </div>
                                <div className="size-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center mb-6 group-hover:bg-cyan-500 transition-colors">
                                    <span className="material-symbols-outlined text-[24px]">{card.icon}</span>
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">{card.title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed mb-8">{card.desc}</p>
                                <div className="mt-auto pt-6 border-t border-slate-50 w-full flex justify-center">
                                    <div className="flex items-center gap-2 text-slate-400 group-hover:text-cyan-600 transition-colors font-black text-[10px] uppercase tracking-widest">
                                        {t('Common.learn_more')}
                                        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* DOCTORS GRID */}
            <section className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                        <div>
                            <h2 className="text-4xl font-black text-slate-900 mb-4">{isRu ? 'Ведущие Специалисты' : 'Aparıcı Mütəxəssislər'}</h2>
                            <p className="text-lg text-slate-500">{isRu ? 'Врачи, которым доверяют тысячи пациентов.' : 'Minlərlə pasiyentin güvəndiyi həkimlər.'}</p>
                        </div>
                        <Link href={`/${locale}/doctors`} className="bg-white px-8 py-4 rounded-2xl border border-slate-200 shadow-sm font-black text-[12px] uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all">
                            {t('Common.view_all')}
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {doctors.map((doc, idx) => (
                            <div key={idx} className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/50 hover:-translate-y-2 transition-all duration-500 group">
                                <div className="aspect-[4/5] relative">
                                    <Image
                                        src={doc.img}
                                        alt={doc.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                        sizes="(max-width: 768px) 100vw, 25vw"
                                    />
                                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-2xl flex items-center gap-1.5 shadow-lg">
                                        <span className="material-symbols-outlined text-amber-500 text-[18px]">star</span>
                                        <span className="font-black text-slate-900 text-sm">{doc.rating}</span>
                                    </div>
                                </div>
                                <div className="p-8">
                                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${doc.bgColor} ${doc.color} text-[10px] font-black uppercase tracking-wider mb-4`}>
                                        <span className="material-symbols-outlined text-[16px]">{doc.icon}</span>
                                        {doc.spec}
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900 mb-6 tracking-tight">{doc.name}</h3>
                                    <Link
                                        href={`/${locale}/doctors`}
                                        className="w-full h-12 rounded-xl bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest hover:bg-cyan-600 transition-colors flex items-center justify-center gap-2"
                                    >
                                        {isRu ? 'Записаться' : 'Qəbula Yazıl'}
                                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SPECIALTIES GRID */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-black text-slate-900 mb-4">{isRu ? 'Выберите специализацию' : 'İxtisas seçin'}</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {specialties.map((cat, idx) => (
                            <Link
                                key={idx}
                                href={`/${locale}/doctors?specialty=${cat.name}`}
                                className="group p-8 rounded-[2rem] border border-slate-100 hover:border-cyan-200 hover:shadow-2xl transition-all duration-500 flex flex-col items-center text-center"
                            >
                                <div className={`size-16 rounded-2xl bg-${cat.color}-50 text-${cat.color}-600 flex items-center justify-center mb-6 group-hover:bg-cyan-500 group-hover:text-white transition-all transform group-hover:rotate-6`}>
                                    <span className="material-symbols-outlined text-[32px]">{cat.icon}</span>
                                </div>
                                <h3 className="font-black text-slate-900 group-hover:text-cyan-600 transition-colors">{cat.name}</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">{cat.count} {isRu ? 'врачей' : 'həkim'}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
