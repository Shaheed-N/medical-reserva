"use client";

import { use, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Shield, Building2, ArrowRight, ArrowLeft,
    MapPin, Mail, Phone, Globe, FileText, CheckCircle,
    Loader2, Upload, User, Stethoscope
} from 'lucide-react';
import { useSubmitHospitalApplication } from '@/lib/hooks';

type Step = 'hospital' | 'contact' | 'admin' | 'review';

interface HospitalFormData {
    // Hospital Info
    name: string;
    type: string;
    description: string;
    address: string;
    city: string;
    licenseNumber: string;
    // Contact
    contactEmail: string;
    contactPhone: string;
    website: string;
    // Admin
    adminName: string;
    adminEmail: string;
    adminPhone: string;
}

const HOSPITAL_TYPES = [
    { value: 'clinic', az: 'Klinika', ru: 'Клиника' },
    { value: 'general', az: 'Ümumi Xəstəxana', ru: 'Общая больница' },
    { value: 'dental', az: 'Diş Klinikası', ru: 'Стоматология' },
    { value: 'specialty', az: 'İxtisaslaşmış Mərkəz', ru: 'Специализированный центр' },
    { value: 'diagnostic', az: 'Diaqnostik Mərkəz', ru: 'Диагностический центр' },
];

const CITIES = [
    'Bakı', 'Gəncə', 'Sumqayıt', 'Mingəçevir', 'Şirvan',
    'Lənkəran', 'Şəki', 'Yevlax', 'Xaçmaz', 'Quba'
];

export default function HospitalRegisterPage({
    params: paramsPromise,
    isEmbedded = false
}: {
    params: Promise<{ locale: string }>;
    isEmbedded?: boolean;
}) {
    const params = use(paramsPromise);
    const locale = params.locale || 'az';

    const [currentStep, setCurrentStep] = useState<Step>('hospital');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const [formData, setFormData] = useState<HospitalFormData>({
        name: '',
        type: '',
        description: '',
        address: '',
        city: '',
        licenseNumber: '',
        contactEmail: '',
        contactPhone: '',
        website: '',
        adminName: '',
        adminEmail: '',
        adminPhone: '',
    });

    const steps: { key: Step; label: { az: string; ru: string } }[] = [
        { key: 'hospital', label: { az: 'Xəstəxana', ru: 'Больница' } },
        { key: 'contact', label: { az: 'Əlaqə', ru: 'Контакты' } },
        { key: 'admin', label: { az: 'Admin', ru: 'Админ' } },
        { key: 'review', label: { az: 'Təsdiq', ru: 'Подтверждение' } },
    ];

    const currentStepIndex = steps.findIndex(s => s.key === currentStep);

    const updateField = (field: keyof HospitalFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleNext = () => {
        const stepOrder: Step[] = ['hospital', 'contact', 'admin', 'review'];
        const currentIndex = stepOrder.indexOf(currentStep);
        if (currentIndex < stepOrder.length - 1) {
            setCurrentStep(stepOrder[currentIndex + 1]);
        }
    };

    const handleBack = () => {
        const stepOrder: Step[] = ['hospital', 'contact', 'admin', 'review'];
        const currentIndex = stepOrder.indexOf(currentStep);
        if (currentIndex > 0) {
            setCurrentStep(stepOrder[currentIndex - 1]);
        }
    };

    const submitApplication = useSubmitHospitalApplication();

    const handleSubmit = async () => {
        setLoading(true);
        const payload = {
            name: formData.name,
            type: formData.type,
            description: formData.description,
            address: formData.address,
            city: formData.city,
            license_number: formData.licenseNumber,
            contact_email: formData.contactEmail,
            contact_phone: formData.contactPhone,
            website: formData.website,
            admin_name: formData.adminName,
            admin_email: formData.adminEmail,
            admin_phone: formData.adminPhone,
            status: 'pending'
        };
        console.log('[HospitalRegister] Submitting application:', payload);

        try {
            const result = await submitApplication.mutateAsync(payload);
            console.log('[HospitalRegister] Submission successful:', result);
            setSubmitted(true);
        } catch (error: any) {
            console.error('[HospitalRegister] Submission error:', error);
            console.error('[HospitalRegister] Error details:', error?.message, error?.code, error?.details);
            alert(`Müraciət göndərilə bilmədi: ${error?.message || 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };

    const isStepValid = (step: Step): boolean => {
        switch (step) {
            case 'hospital':
                return formData.name.length >= 3 && formData.type !== '' && formData.city !== '';
            case 'contact':
                return formData.contactEmail.includes('@') && formData.contactPhone.length >= 9;
            case 'admin':
                return formData.adminName.length >= 3 && formData.adminEmail.includes('@');
            case 'review':
                return true;
            default:
                return false;
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-lg text-center"
                >
                    <div className="w-20 h-20 bg-[#0F766E]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-[#0F766E]" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-4">
                        {locale === 'az' ? 'Müraciətiniz Qəbul Edildi!' : 'Заявка Принята!'}
                    </h1>
                    <p className="text-slate-600 mb-8">
                        {locale === 'az'
                            ? 'Müraciətiniz yoxlanılır. Təsdiq edildikdən sonra admin hesabı yaradılacaq və sizinlə əlaqə saxlanılacaq.'
                            : 'Ваша заявка рассматривается. После одобрения будет создан админ-аккаунт и мы свяжемся с вами.'}
                    </p>
                    <Link
                        href={`/${locale}`}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#0F766E] text-white font-bold rounded-lg hover:bg-[#134E4A] transition-colors"
                    >
                        {locale === 'az' ? 'Ana Səhifəyə Qayıt' : 'На Главную'}
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            {!isEmbedded && (
                <div className="border-b border-slate-100">
                    <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                        <Link href={`/${locale}`} className="flex items-center gap-2">
                            <div className="w-9 h-9 bg-[#0F766E] rounded-lg flex items-center justify-center text-white">
                                <Shield size={18} />
                            </div>
                            <span className="font-bold text-lg text-slate-900">MedPlus</span>
                        </Link>
                        <Link href={`/${locale}/login`} className="text-sm font-medium text-[#0F766E] hover:underline">
                            {locale === 'az' ? 'Daxil ol' : 'Войти'}
                        </Link>
                    </div>
                </div>
            )}

            <div className="max-w-3xl mx-auto px-6 py-12">
                {/* Title */}
                <div className="text-center mb-10">
                    <div className="flex justify-center gap-4 mb-6">
                        <Link
                            href={`/${locale}/for-doctors/register`}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl text-sm font-bold hover:bg-slate-50 transition-all"
                        >
                            <Stethoscope size={18} />
                            {locale === 'az' ? 'Həkim Qeydiyyatı' : 'Регистрация Врача'}
                        </Link>
                        <Link
                            href={`/${locale}/for-hospitals/register`}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-[#0F766E] text-white rounded-2xl text-sm font-bold shadow-lg shadow-teal-700/20"
                        >
                            <Building2 size={18} />
                            {locale === 'az' ? 'Klinika Qeydiyyatı' : 'Регистрация Клиники'}
                        </Link>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">
                        {locale === 'az' ? 'MedPlus-a Qoşulun' : 'Присоединяйтесь к MedPlus'}
                    </h1>
                    <p className="text-slate-500">
                        {locale === 'az'
                            ? 'Klinika və ya xəstəxananızı platformamıza əlavə edin'
                            : 'Добавьте вашу клинику или больницу на нашу платформу'}
                    </p>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-center gap-2 mb-12">
                    {steps.map((step, index) => (
                        <div key={step.key} className="flex items-center">
                            <button
                                onClick={() => index <= currentStepIndex && setCurrentStep(step.key)}
                                disabled={index > currentStepIndex}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${step.key === currentStep
                                    ? 'bg-[#0F766E] text-white'
                                    : index < currentStepIndex
                                        ? 'bg-[#0F766E]/20 text-[#0F766E] cursor-pointer'
                                        : 'bg-slate-100 text-slate-400'
                                    }`}
                            >
                                <span className="w-5 h-5 rounded-full bg-current/20 flex items-center justify-center text-xs">
                                    {index + 1}
                                </span>
                                <span className="hidden sm:inline">{step.label[locale as 'az' | 'ru'] || step.label.az}</span>
                            </button>
                            {index < steps.length - 1 && (
                                <div className={`w-8 h-0.5 mx-1 ${index < currentStepIndex ? 'bg-[#0F766E]' : 'bg-slate-200'}`} />
                            )}
                        </div>
                    ))}
                </div>

                {/* Form Content */}
                <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
                    <AnimatePresence mode="wait">
                        {currentStep === 'hospital' && (
                            <motion.div
                                key="hospital"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <Building2 className="text-[#0F766E]" />
                                    <h2 className="text-xl font-bold text-slate-900">
                                        {locale === 'az' ? 'Xəstəxana Məlumatları' : 'Данные Клиники'}
                                    </h2>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-700">
                                        {locale === 'az' ? 'Xəstəxana / Klinika Adı' : 'Название Клиники'} *
                                    </label>
                                    <input
                                        type="text"
                                        placeholder={locale === 'az' ? 'MedPlus Klinikası' : 'Клиника MedPlus'}
                                        value={formData.name}
                                        onChange={(e) => updateField('name', e.target.value)}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10 outline-none transition-all"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-slate-700">
                                            {locale === 'az' ? 'Növ' : 'Тип'} *
                                        </label>
                                        <select
                                            value={formData.type}
                                            onChange={(e) => updateField('type', e.target.value)}
                                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10 outline-none transition-all bg-white"
                                        >
                                            <option value="">-- {locale === 'az' ? 'Seçin' : 'Выберите'} --</option>
                                            {HOSPITAL_TYPES.map((t) => (
                                                <option key={t.value} value={t.value}>
                                                    {locale === 'az' ? t.az : t.ru}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-slate-700">
                                            <MapPin size={14} className="inline mr-1" />
                                            {locale === 'az' ? 'Şəhər' : 'Город'} *
                                        </label>
                                        <select
                                            value={formData.city}
                                            onChange={(e) => updateField('city', e.target.value)}
                                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10 outline-none transition-all bg-white"
                                        >
                                            <option value="">-- {locale === 'az' ? 'Seçin' : 'Выберите'} --</option>
                                            {CITIES.map((c) => (
                                                <option key={c} value={c}>{c}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-700">
                                        {locale === 'az' ? 'Ünvan' : 'Адрес'}
                                    </label>
                                    <input
                                        type="text"
                                        placeholder={locale === 'az' ? '28 May küçəsi, 15' : 'ул. 28 Мая, 15'}
                                        value={formData.address}
                                        onChange={(e) => updateField('address', e.target.value)}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10 outline-none transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-700">
                                        {locale === 'az' ? 'Lisenziya Nömrəsi' : 'Номер Лицензии'}
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="MED-XXXXX"
                                        value={formData.licenseNumber}
                                        onChange={(e) => updateField('licenseNumber', e.target.value)}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10 outline-none transition-all"
                                    />
                                </div>
                            </motion.div>
                        )}

                        {currentStep === 'contact' && (
                            <motion.div
                                key="contact"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <Phone className="text-[#0F766E]" />
                                    <h2 className="text-xl font-bold text-slate-900">
                                        {locale === 'az' ? 'Əlaqə Məlumatları' : 'Контактные Данные'}
                                    </h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-slate-700">
                                            <Mail size={14} className="inline mr-1" />
                                            {locale === 'az' ? 'Email' : 'Email'} *
                                        </label>
                                        <input
                                            type="email"
                                            placeholder="info@clinic.az"
                                            value={formData.contactEmail}
                                            onChange={(e) => updateField('contactEmail', e.target.value)}
                                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-slate-700">
                                            <Phone size={14} className="inline mr-1" />
                                            {locale === 'az' ? 'Telefon' : 'Телефон'} *
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">+994</span>
                                            <input
                                                type="tel"
                                                placeholder="12 000 00 00"
                                                value={formData.contactPhone}
                                                onChange={(e) => updateField('contactPhone', e.target.value)}
                                                className="w-full pl-16 pr-4 py-3 border border-slate-200 rounded-xl focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10 outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-700">
                                        <Globe size={14} className="inline mr-1" />
                                        {locale === 'az' ? 'Veb-sayt' : 'Веб-сайт'}
                                    </label>
                                    <input
                                        type="url"
                                        placeholder="https://www.clinic.az"
                                        value={formData.website}
                                        onChange={(e) => updateField('website', e.target.value)}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10 outline-none transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-700">
                                        {locale === 'az' ? 'Haqqınızda' : 'О Клинике'}
                                    </label>
                                    <textarea
                                        rows={4}
                                        placeholder={locale === 'az' ? 'Klinika haqqında qısa məlumat...' : 'Краткая информация о клинике...'}
                                        value={formData.description}
                                        onChange={(e) => updateField('description', e.target.value)}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10 outline-none transition-all resize-none"
                                    />
                                </div>
                            </motion.div>
                        )}

                        {currentStep === 'admin' && (
                            <motion.div
                                key="admin"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <User className="text-[#0F766E]" />
                                    <h2 className="text-xl font-bold text-slate-900">
                                        {locale === 'az' ? 'Admin Hesabı' : 'Аккаунт Админа'}
                                    </h2>
                                </div>

                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
                                    {locale === 'az'
                                        ? 'Müraciət təsdiqləndikdən sonra bu şəxsə admin hesabı yaradılacaq.'
                                        : 'После одобрения заявки будет создан админ-аккаунт для этого лица.'}
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-700">
                                        {locale === 'az' ? 'Admin Tam Adı' : 'Полное имя Админа'} *
                                    </label>
                                    <input
                                        type="text"
                                        placeholder={locale === 'az' ? 'Ad Soyad' : 'Имя Фамилия'}
                                        value={formData.adminName}
                                        onChange={(e) => updateField('adminName', e.target.value)}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10 outline-none transition-all"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-slate-700">
                                            <Mail size={14} className="inline mr-1" />
                                            {locale === 'az' ? 'Admin Email' : 'Email Админа'} *
                                        </label>
                                        <input
                                            type="email"
                                            placeholder="admin@clinic.az"
                                            value={formData.adminEmail}
                                            onChange={(e) => updateField('adminEmail', e.target.value)}
                                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-slate-700">
                                            <Phone size={14} className="inline mr-1" />
                                            {locale === 'az' ? 'Admin Telefon' : 'Телефон Админа'}
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">+994</span>
                                            <input
                                                type="tel"
                                                placeholder="50 000 00 00"
                                                value={formData.adminPhone}
                                                onChange={(e) => updateField('adminPhone', e.target.value)}
                                                className="w-full pl-16 pr-4 py-3 border border-slate-200 rounded-xl focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10 outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {currentStep === 'review' && (
                            <motion.div
                                key="review"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <CheckCircle className="text-[#0F766E]" />
                                    <h2 className="text-xl font-bold text-slate-900">
                                        {locale === 'az' ? 'Məlumatları Yoxlayın' : 'Проверьте Данные'}
                                    </h2>
                                </div>

                                <div className="space-y-4">
                                    <div className="bg-slate-50 rounded-xl p-4">
                                        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                                            <Building2 size={16} />
                                            {locale === 'az' ? 'Xəstəxana' : 'Клиника'}
                                        </h3>
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <div className="text-slate-500">{locale === 'az' ? 'Ad' : 'Название'}:</div>
                                            <div className="font-medium">{formData.name || '-'}</div>
                                            <div className="text-slate-500">{locale === 'az' ? 'Şəhər' : 'Город'}:</div>
                                            <div className="font-medium">{formData.city || '-'}</div>
                                        </div>
                                    </div>

                                    <div className="bg-slate-50 rounded-xl p-4">
                                        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                                            <Phone size={16} />
                                            {locale === 'az' ? 'Əlaqə' : 'Контакты'}
                                        </h3>
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <div className="text-slate-500">Email:</div>
                                            <div className="font-medium">{formData.contactEmail || '-'}</div>
                                            <div className="text-slate-500">{locale === 'az' ? 'Telefon' : 'Телефон'}:</div>
                                            <div className="font-medium">+994 {formData.contactPhone || '-'}</div>
                                        </div>
                                    </div>

                                    <div className="bg-slate-50 rounded-xl p-4">
                                        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                                            <User size={16} />
                                            Admin
                                        </h3>
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <div className="text-slate-500">{locale === 'az' ? 'Ad' : 'Имя'}:</div>
                                            <div className="font-medium">{formData.adminName || '-'}</div>
                                            <div className="text-slate-500">Email:</div>
                                            <div className="font-medium">{formData.adminEmail || '-'}</div>
                                        </div>
                                    </div>

                                    <div className="bg-[#0F766E]/5 border border-[#0F766E]/20 rounded-xl p-4">
                                        <p className="text-sm text-[#0F766E]">
                                            {locale === 'az'
                                                ? 'Müraciətiniz yoxlanılacaq və 1-3 gün ərzində nəticə barədə məlumat veriləcək.'
                                                : 'Заявка будет рассмотрена и вы получите ответ в течение 1-3 дней.'}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={handleBack}
                            disabled={currentStep === 'hospital'}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${currentStep === 'hospital'
                                ? 'text-slate-300 cursor-not-allowed'
                                : 'text-slate-600 hover:bg-slate-100'
                                }`}
                        >
                            <ArrowLeft size={18} />
                            {locale === 'az' ? 'Geri' : 'Назад'}
                        </button>

                        {currentStep === 'review' ? (
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={loading}
                                className="flex items-center gap-2 px-6 py-3 bg-[#0F766E] text-white font-bold rounded-lg hover:bg-[#134E4A] transition-all disabled:opacity-50"
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin" size={18} />
                                ) : (
                                    <>
                                        {locale === 'az' ? 'Müraciəti Göndər' : 'Отправить Заявку'}
                                        <CheckCircle size={18} />
                                    </>
                                )}
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleNext}
                                disabled={!isStepValid(currentStep)}
                                className="flex items-center gap-2 px-6 py-3 bg-[#0F766E] text-white font-bold rounded-lg hover:bg-[#134E4A] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {locale === 'az' ? 'Növbəti' : 'Далее'}
                                <ArrowRight size={18} />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
