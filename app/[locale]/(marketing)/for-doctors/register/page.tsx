"use client";

import { use, useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Shield, Stethoscope, ArrowRight, ArrowLeft,
    User, Building2, FileText, CheckCircle,
    Loader2, Upload, GraduationCap, Languages,
    Phone, Mail, Clock
} from 'lucide-react';
import { useSubmitDoctorApplication } from '@/lib/hooks';

type Step = 'personal' | 'professional' | 'documents' | 'review';

interface DoctorFormData {
    // Personal
    fullName: string;
    email: string;
    phone: string;
    // Professional
    title: string;
    specialty: string;
    licenseNumber: string;
    yearsExperience: string;
    consultationFee: string;
    bio: string;
    languages: string[];
    // Hospital
    hospitalId: string;
    hospitalName: string;
    // Documents
    licenseDocument: File | null;
    idDocument: File | null;
    certificateDocument: File | null;
}

const SPECIALTIES = [
    { az: 'Kardioloq', ru: 'Кардиолог', en: 'Cardiologist' },
    { az: 'Dermatoloq', ru: 'Дерматолог', en: 'Dermatologist' },
    { az: 'Pediatr', ru: 'Педиатр', en: 'Pediatrician' },
    { az: 'Nevroloq', ru: 'Невролог', en: 'Neurologist' },
    { az: 'Ortoped', ru: 'Ортопед', en: 'Orthopedist' },
    { az: 'Ümumi Həkim', ru: 'Терапевт', en: 'General Practitioner' },
    { az: 'Göz Həkimi', ru: 'Офтальмолог', en: 'Ophthalmologist' },
    { az: 'Endokrinoloq', ru: 'Эндокринолог', en: 'Endocrinologist' },
    { az: 'Qastroenteroloq', ru: 'Гастроэнтеролог', en: 'Gastroenterologist' },
    { az: 'Uroloq', ru: 'Уролог', en: 'Urologist' },
];

const LANGUAGES_OPTIONS = [
    { code: 'az', label: 'Azərbaycanca' },
    { code: 'ru', label: 'Русский' },
    { code: 'en', label: 'English' },
    { code: 'tr', label: 'Türkçe' },
];

export default function DoctorRegisterPage({
    params: paramsPromise,
    isEmbedded = false
}: {
    params: Promise<{ locale: string }>;
    isEmbedded?: boolean;
}) {
    const params = use(paramsPromise);
    const locale = params.locale || 'az';

    const [currentStep, setCurrentStep] = useState<Step>('personal');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const [formData, setFormData] = useState<DoctorFormData>({
        fullName: '',
        email: '',
        phone: '',
        title: '',
        specialty: '',
        licenseNumber: '',
        yearsExperience: '',
        consultationFee: '',
        bio: '',
        languages: ['az'],
        hospitalId: '',
        hospitalName: '',
        licenseDocument: null,
        idDocument: null,
        certificateDocument: null,
    });

    const steps: { key: Step; label: { az: string; ru: string } }[] = [
        { key: 'personal', label: { az: 'Şəxsi Məlumat', ru: 'Личные данные' } },
        { key: 'professional', label: { az: 'Peşəkar Məlumat', ru: 'Професс. данные' } },
        { key: 'documents', label: { az: 'Sənədlər', ru: 'Документы' } },
        { key: 'review', label: { az: 'Təsdiq', ru: 'Подтверждение' } },
    ];

    const currentStepIndex = steps.findIndex(s => s.key === currentStep);

    const updateField = (field: keyof DoctorFormData, value: string | string[] | File | null) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const toggleLanguage = (langCode: string) => {
        setFormData(prev => ({
            ...prev,
            languages: prev.languages.includes(langCode)
                ? prev.languages.filter(l => l !== langCode)
                : [...prev.languages, langCode]
        }));
    };

    const handleNext = () => {
        const stepOrder: Step[] = ['personal', 'professional', 'documents', 'review'];
        const currentIndex = stepOrder.indexOf(currentStep);
        if (currentIndex < stepOrder.length - 1) {
            setCurrentStep(stepOrder[currentIndex + 1]);
        }
    };

    const handleBack = () => {
        const stepOrder: Step[] = ['personal', 'professional', 'documents', 'review'];
        const currentIndex = stepOrder.indexOf(currentStep);
        if (currentIndex > 0) {
            setCurrentStep(stepOrder[currentIndex - 1]);
        }
    };

    const submitApplication = useSubmitDoctorApplication();

    const handleSubmit = async () => {
        setLoading(true);
        try {
            // Send application to Supabase
            await submitApplication.mutateAsync({
                full_name: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                title: formData.title,
                specialties: [formData.specialty],
                years_of_experience: parseInt(formData.yearsExperience) || 0,
                license_number: formData.licenseNumber,
                consultation_fee: parseFloat(formData.consultationFee) || 0,
                bio: formData.bio,
                languages: formData.languages,
                hospital_id: formData.hospitalId || null,
                status: 'pending'
            });
            setSubmitted(true);
        } catch (error) {
            console.error('Error submitting doctor application:', error);
        } finally {
            setLoading(false);
        }
    };

    const isStepValid = (step: Step): boolean => {
        switch (step) {
            case 'personal':
                return formData.fullName.length >= 3 && formData.email.includes('@') && formData.phone.length >= 9;
            case 'professional':
                return formData.specialty !== '' && formData.licenseNumber.length >= 5 && formData.yearsExperience !== '';
            case 'documents':
                return true; // Documents optional for now
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
                            ? 'Müraciətiniz yoxlanılır. Təsdiq edildikdən sonra sizinlə əlaqə saxlanılacaq.'
                            : 'Ваша заявка находится на рассмотрении. Мы свяжемся с вами после подтверждения.'}
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
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">
                        {locale === 'az' ? 'Həkim Qeydiyyatı' : 'Регистрация Врача'}
                    </h1>
                    <p className="text-slate-500">
                        {locale === 'az'
                            ? 'Peşəkar profilinizi yaradın və pasientlərlə əlaqə qurun'
                            : 'Создайте профессиональный профиль и связывайтесь с пациентами'}
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
                        {currentStep === 'personal' && (
                            <motion.div
                                key="personal"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <User className="text-[#0F766E]" />
                                    <h2 className="text-xl font-bold text-slate-900">
                                        {locale === 'az' ? 'Şəxsi Məlumatlar' : 'Личные Данные'}
                                    </h2>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-700">
                                        {locale === 'az' ? 'Tam Adınız' : 'Полное Имя'} *
                                    </label>
                                    <input
                                        type="text"
                                        placeholder={locale === 'az' ? 'Dr. Ad Soyad' : 'Др. Имя Фамилия'}
                                        value={formData.fullName}
                                        onChange={(e) => updateField('fullName', e.target.value)}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10 outline-none transition-all"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-slate-700">
                                            <Mail size={14} className="inline mr-1" />
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            placeholder="doctor@email.com"
                                            value={formData.email}
                                            onChange={(e) => updateField('email', e.target.value)}
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
                                                placeholder="50 000 00 00"
                                                value={formData.phone}
                                                onChange={(e) => updateField('phone', e.target.value)}
                                                className="w-full pl-16 pr-4 py-3 border border-slate-200 rounded-xl focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10 outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {currentStep === 'professional' && (
                            <motion.div
                                key="professional"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <GraduationCap className="text-[#0F766E]" />
                                    <h2 className="text-xl font-bold text-slate-900">
                                        {locale === 'az' ? 'Peşəkar Məlumatlar' : 'Профессиональные Данные'}
                                    </h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-slate-700">
                                            {locale === 'az' ? 'Titul' : 'Титул'}
                                        </label>
                                        <select
                                            value={formData.title}
                                            onChange={(e) => updateField('title', e.target.value)}
                                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10 outline-none transition-all bg-white"
                                        >
                                            <option value="">-- {locale === 'az' ? 'Seçin' : 'Выберите'} --</option>
                                            <option value="Dr.">Dr.</option>
                                            <option value="Prof. Dr.">Prof. Dr.</option>
                                            <option value="Dos. Dr.">Dos. Dr.</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-slate-700">
                                            {locale === 'az' ? 'İxtisas' : 'Специальность'} *
                                        </label>
                                        <select
                                            value={formData.specialty}
                                            onChange={(e) => updateField('specialty', e.target.value)}
                                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10 outline-none transition-all bg-white"
                                        >
                                            <option value="">-- {locale === 'az' ? 'Seçin' : 'Выберите'} --</option>
                                            {SPECIALTIES.map((s) => (
                                                <option key={s.en} value={s.en}>
                                                    {locale === 'az' ? s.az : locale === 'ru' ? s.ru : s.en}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-slate-700">
                                            {locale === 'az' ? 'Lisenziya Nömrəsi' : 'Номер Лицензии'} *
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="AZ-XXXXX"
                                            value={formData.licenseNumber}
                                            onChange={(e) => updateField('licenseNumber', e.target.value)}
                                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-slate-700">
                                            <Clock size={14} className="inline mr-1" />
                                            {locale === 'az' ? 'Təcrübə (İl)' : 'Опыт (лет)'} *
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="50"
                                            placeholder="10"
                                            value={formData.yearsExperience}
                                            onChange={(e) => updateField('yearsExperience', e.target.value)}
                                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-700">
                                        {locale === 'az' ? 'Konsultasiya Qiyməti (AZN)' : 'Стоимость Консультации (AZN)'}
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        placeholder="50"
                                        value={formData.consultationFee}
                                        onChange={(e) => updateField('consultationFee', e.target.value)}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10 outline-none transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-700">
                                        <Languages size={14} className="inline mr-1" />
                                        {locale === 'az' ? 'Dillər' : 'Языки'}
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {LANGUAGES_OPTIONS.map((lang) => (
                                            <button
                                                key={lang.code}
                                                type="button"
                                                onClick={() => toggleLanguage(lang.code)}
                                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${formData.languages.includes(lang.code)
                                                    ? 'bg-[#0F766E] text-white'
                                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                    }`}
                                            >
                                                {lang.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-700">
                                        {locale === 'az' ? 'Haqqınızda' : 'О Себе'}
                                    </label>
                                    <textarea
                                        rows={4}
                                        placeholder={locale === 'az' ? 'Peşəkar təcrübəniz haqqında qısa məlumat...' : 'Краткая информация о вашем опыте...'}
                                        value={formData.bio}
                                        onChange={(e) => updateField('bio', e.target.value)}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10 outline-none transition-all resize-none"
                                    />
                                </div>
                            </motion.div>
                        )}

                        {currentStep === 'documents' && (
                            <motion.div
                                key="documents"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <FileText className="text-[#0F766E]" />
                                    <h2 className="text-xl font-bold text-slate-900">
                                        {locale === 'az' ? 'Sənədlər' : 'Документы'}
                                    </h2>
                                </div>

                                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
                                    {locale === 'az'
                                        ? 'Sənədlər müraciətin təsdiqindən sonra da yüklənə bilər.'
                                        : 'Документы можно загрузить и после подачи заявки.'}
                                </div>

                                {[
                                    { key: 'licenseDocument', label: { az: 'Tibbi Lisenziya', ru: 'Мед. Лицензия' } },
                                    { key: 'idDocument', label: { az: 'Şəxsiyyət Vəsiqəsi', ru: 'Удостоверение Личности' } },
                                    { key: 'certificateDocument', label: { az: 'Diplom/Sertifikat', ru: 'Диплом/Сертификат' } },
                                ].map((doc) => (
                                    <div key={doc.key} className="space-y-2">
                                        <label className="block text-sm font-medium text-slate-700">
                                            {doc.label[locale as 'az' | 'ru'] || doc.label.az}
                                        </label>
                                        <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-[#0F766E] transition-colors cursor-pointer">
                                            <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                                            <p className="text-sm text-slate-500">
                                                {locale === 'az' ? 'Yükləmək üçün klikləyin' : 'Нажмите для загрузки'}
                                            </p>
                                            <p className="text-xs text-slate-400 mt-1">PDF, JPG, PNG (max 5MB)</p>
                                        </div>
                                    </div>
                                ))}
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
                                            <User size={16} />
                                            {locale === 'az' ? 'Şəxsi Məlumat' : 'Личные Данные'}
                                        </h3>
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <div className="text-slate-500">{locale === 'az' ? 'Ad' : 'Имя'}:</div>
                                            <div className="font-medium">{formData.fullName || '-'}</div>
                                            <div className="text-slate-500">Email:</div>
                                            <div className="font-medium">{formData.email || '-'}</div>
                                            <div className="text-slate-500">{locale === 'az' ? 'Telefon' : 'Телефон'}:</div>
                                            <div className="font-medium">+994 {formData.phone || '-'}</div>
                                        </div>
                                    </div>

                                    <div className="bg-slate-50 rounded-xl p-4">
                                        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                                            <GraduationCap size={16} />
                                            {locale === 'az' ? 'Peşəkar Məlumat' : 'Професс. Данные'}
                                        </h3>
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <div className="text-slate-500">{locale === 'az' ? 'İxtisas' : 'Специальность'}:</div>
                                            <div className="font-medium">{formData.specialty || '-'}</div>
                                            <div className="text-slate-500">{locale === 'az' ? 'Lisenziya' : 'Лицензия'}:</div>
                                            <div className="font-medium">{formData.licenseNumber || '-'}</div>
                                            <div className="text-slate-500">{locale === 'az' ? 'Təcrübə' : 'Опыт'}:</div>
                                            <div className="font-medium">{formData.yearsExperience ? `${formData.yearsExperience} ${locale === 'az' ? 'il' : 'лет'}` : '-'}</div>
                                            <div className="text-slate-500">{locale === 'az' ? 'Qiymət' : 'Цена'}:</div>
                                            <div className="font-medium">{formData.consultationFee ? `${formData.consultationFee} AZN` : '-'}</div>
                                        </div>
                                    </div>

                                    <div className="bg-[#0F766E]/5 border border-[#0F766E]/20 rounded-xl p-4">
                                        <p className="text-sm text-[#0F766E]">
                                            {locale === 'az'
                                                ? 'Müraciətiniz yoxlanılacaq və 1-3 gün ərzində sizinlə əlaqə saxlanılacaq.'
                                                : 'Ваша заявка будет рассмотрена, и мы свяжемся с вами в течение 1-3 дней.'}
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
                            disabled={currentStep === 'personal'}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${currentStep === 'personal'
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
