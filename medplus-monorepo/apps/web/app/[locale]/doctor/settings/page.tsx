"use client";

import { use, useState } from 'react';
import {
    Settings,
    Shield,
    Bell,
    CreditCard,
    Check
} from 'lucide-react';
import {
    useDoctorProfile,
    useUpdateDoctorProfile,
    useInsuranceCompanies,
    useDoctorInsurance,
    useToggleDoctorInsurance
} from '@/lib/hooks';

export default function DoctorSettingsPage({ params: paramsPromise }: { params: Promise<{ locale: string }> }) {
    const params = use(paramsPromise);
    const locale = params.locale || 'az';
    const isRu = locale === 'ru';

    const { data: profile, isLoading: isProfileLoading } = useDoctorProfile();
    const { data: insurances, isLoading: isInsuranceLoading } = useInsuranceCompanies();
    const { data: acceptedInsurances } = useDoctorInsurance(profile?.id);
    const toggleInsurance = useToggleDoctorInsurance();
    const updateProfile = useUpdateDoctorProfile();

    const [localSettings, setLocalSettings] = useState({
        email_notifications: true,
        sms_notifications: true,
        push_notifications: false,
        auto_confirm: false,
        allow_walk_in: true,
    });

    // Initialize local settings from profile if they exist there
    useState(() => {
        if (profile) {
            setLocalSettings({
                email_notifications: profile.email_notifications ?? true,
                sms_notifications: profile.sms_notifications ?? true,
                push_notifications: profile.push_notifications ?? false,
                auto_confirm: profile.auto_confirm ?? false,
                allow_walk_in: profile.allow_walk_in ?? true,
            });
        }
    });

    const handleToggleInsurance = async (insuranceId: string) => {
        if (!profile) return;
        const isAccepted = acceptedInsurances?.some((ai: any) => ai.insurance_id === insuranceId);
        await toggleInsurance.mutateAsync({
            doctorId: profile.id,
            insuranceId,
            action: isAccepted ? 'remove' : 'add'
        });
    };

    const handleUpdateSetting = async (key: string, value: boolean) => {
        setLocalSettings(prev => ({ ...prev, [key]: value }));
        if (profile) {
            await updateProfile.mutateAsync({ [key]: value });
        }
    };

    if (isProfileLoading || isInsuranceLoading) {
        return <div className="p-8 text-center text-slate-500">Yüklənir...</div>;
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                        <Settings className="text-[#0F766E]" />
                        {isRu ? 'Настройки' : 'Parametrlər'}
                    </h1>
                    <p className="text-slate-500 mt-1">
                        {isRu ? 'Управляйте профилем и настройками' : 'Profil və parametrləri idarə edin'}
                    </p>
                </div>
            </div>

            {/* Insurance Accepted */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                        <Shield size={20} className="text-blue-600" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900">
                            {isRu ? 'Принимаемые страховки' : 'Qəbul edilən sığortalar'}
                        </h3>
                        <p className="text-sm text-slate-500">
                            {isRu ? 'Выберите страховые компании, которые вы принимаете' : 'Qəbul etdiyiniz sığorta şirkətlərini seçin'}
                        </p>
                    </div>
                </div>

                <div className="space-y-3">
                    {insurances?.map((ins: any) => {
                        const isAccepted = acceptedInsurances?.some((ai: any) => ai.insurance_id === ins.id);
                        return (
                            <div
                                key={ins.id}
                                className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${isAccepted
                                    ? 'border-[#0F766E] bg-[#0F766E]/5'
                                    : 'border-slate-200 hover:border-slate-300'
                                    }`}
                                onClick={() => handleToggleInsurance(ins.id)}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${isAccepted
                                        ? 'bg-[#0F766E] border-[#0F766E]'
                                        : 'border-slate-300'
                                        }`}>
                                        {isAccepted && (
                                            <Check size={14} className="text-white" />
                                        )}
                                    </div>
                                    <div>
                                        <div className="font-medium text-slate-900">{ins.name}</div>
                                        <div className="text-sm text-slate-500">{ins.type === 'icbari' ? (isRu ? 'Обязательное' : 'İcbari') : (isRu ? 'Частное' : 'Özəl')}</div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                        <Bell size={20} className="text-amber-600" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900">
                            {isRu ? 'Уведомления' : 'Bildirişlər'}
                        </h3>
                        <p className="text-sm text-slate-500">
                            {isRu ? 'Как вы хотите получать уведомления' : 'Bildirişləri necə almaq istəyirsiniz'}
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    {[
                        { key: 'email_notifications', label: isRu ? 'Email уведомления' : 'Email bildirişləri', desc: isRu ? 'Получать уведомления на email' : 'Emailə bildiriş göndərilsin' },
                        { key: 'sms_notifications', label: isRu ? 'SMS уведомления' : 'SMS bildirişləri', desc: isRu ? 'Получать SMS о новых записях' : 'Yeni rezervasiya olduqda SMS göndərilsin' },
                        { key: 'push_notifications', label: isRu ? 'Push уведомления' : 'Push bildirişləri', desc: isRu ? 'Уведомления в браузере' : 'Brauzerdə bildiriş' },
                    ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                            <div>
                                <div className="font-medium text-slate-900">{item.label}</div>
                                <div className="text-sm text-slate-500">{item.desc}</div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={(localSettings as any)[item.key]}
                                    onChange={(e) => handleUpdateSetting(item.key, e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#0F766E]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0F766E]"></div>
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Booking Settings */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                        <CreditCard size={20} className="text-green-600" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900">
                            {isRu ? 'Настройки записи' : 'Rezervasiya parametrləri'}
                        </h3>
                        <p className="text-sm text-slate-500">
                            {isRu ? 'Настройки бронирования' : 'Onlayn rezervasiya parametrləri'}
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                        <div>
                            <div className="font-medium text-slate-900">
                                {isRu ? 'Автоподтверждение записей' : 'Rezervasiyaları avtotəsdiqlə'}
                            </div>
                            <div className="text-sm text-slate-500">
                                {isRu ? 'Записи будут автоматически подтверждаться' : 'Rezervasiyalar avtomatik təsdiqlənəcək'}
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={localSettings.auto_confirm}
                                onChange={(e) => handleUpdateSetting('auto_confirm', e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#0F766E]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0F766E]"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                        <div>
                            <div className="font-medium text-slate-900">
                                {isRu ? 'Разрешить walk-in' : 'Walk-in icazə ver'}
                            </div>
                            <div className="text-sm text-slate-500">
                                {isRu ? 'Принимать пациентов без записи' : 'Rezervasiyasız pasientləri qəbul et'}
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={localSettings.allow_walk_in}
                                onChange={(e) => handleUpdateSetting('allow_walk_in', e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#0F766E]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0F766E]"></div>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}
