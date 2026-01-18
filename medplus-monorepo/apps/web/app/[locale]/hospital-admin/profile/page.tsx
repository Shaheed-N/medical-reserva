"use client";

import { useState, useEffect, use } from 'react';
import { Building2, Save, Upload, Loader2, MapPin, Phone, Mail, Globe, Clock, Camera } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';

interface HospitalProfile {
    id: string;
    name: string;
    slug: string;
    type: string;
    description: string;
    logo_url: string;
    cover_image_url: string;
    contact_email: string;
    contact_phone: string;
    website: string;
    license_number: string;
}

export default function HospitalProfilePage({ params: paramsPromise }: { params: Promise<{ locale: string }> }) {
    const { locale } = use(paramsPromise);
    const isRu = locale === 'ru';

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState<HospitalProfile>({
        id: '',
        name: '',
        slug: '',
        type: 'clinic',
        description: '',
        logo_url: '',
        cover_image_url: '',
        contact_email: '',
        contact_phone: '',
        website: '',
        license_number: ''
    });

    useEffect(() => {
        fetchHospitalProfile();
    }, []);

    async function fetchHospitalProfile() {
        setLoading(true);
        // For now, get the first hospital - in production, get from user's hospital_id
        const { data, error } = await supabase
            .from('hospitals')
            .select('*')
            .limit(1)
            .single();

        if (data) {
            setProfile({
                id: data.id,
                name: data.name || '',
                slug: data.slug || '',
                type: data.type || 'clinic',
                description: data.description || '',
                logo_url: data.logo_url || '',
                cover_image_url: data.cover_image_url || '',
                contact_email: data.contact_email || '',
                contact_phone: data.contact_phone || '',
                website: data.website || '',
                license_number: data.license_number || ''
            });
        }
        setLoading(false);
    }

    async function handleSave() {
        setSaving(true);
        const { error } = await supabase
            .from('hospitals')
            .update({
                name: profile.name,
                type: profile.type,
                description: profile.description,
                logo_url: profile.logo_url,
                cover_image_url: profile.cover_image_url,
                contact_email: profile.contact_email,
                contact_phone: profile.contact_phone,
                website: profile.website,
                license_number: profile.license_number
            })
            .eq('id', profile.id);

        if (error) {
            toast.error(isRu ? 'Ошибка сохранения' : 'Saxlama xətası');
            console.error(error);
        } else {
            toast.success(isRu ? 'Профиль сохранен!' : 'Profil saxlanıldı!');
        }
        setSaving(false);
    }

    async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>, field: 'logo_url' | 'cover_image_url') {
        const file = e.target.files?.[0];
        if (!file) return;

        const fileExt = file.name.split('.').pop();
        const fileName = `${profile.id}_${field}_${Date.now()}.${fileExt}`;

        const { data, error } = await supabase.storage
            .from('hospital-images')
            .upload(fileName, file);

        if (error) {
            toast.error(isRu ? 'Ошибка загрузки' : 'Yükləmə xətası');
            console.error(error);
            return;
        }

        const { data: urlData } = supabase.storage
            .from('hospital-images')
            .getPublicUrl(fileName);

        setProfile(prev => ({ ...prev, [field]: urlData.publicUrl }));
        toast.success(isRu ? 'Изображение загружено!' : 'Şəkil yükləndi!');
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="animate-spin text-purple-600" size={40} />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="bg-[#0F172A] p-10 rounded-sm shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600 opacity-10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                <div className="relative z-10 flex items-center gap-4">
                    <div className="w-16 h-16 bg-purple-600 rounded-sm flex items-center justify-center">
                        <Building2 className="text-white" size={32} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-white uppercase tracking-tight">
                            {isRu ? 'Профиль Клиники' : 'Klinika Profili'}
                        </h1>
                        <p className="text-slate-400 text-sm">
                            {isRu ? 'Информация видна пациентам' : 'Bu məlumatlar xəstələrə görünür'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Cover Image */}
            <div className="bg-white rounded-sm border border-slate-200 overflow-hidden shadow-sm">
                <div className="relative h-48 bg-gradient-to-r from-purple-100 to-purple-50">
                    {profile.cover_image_url && (
                        <img src={profile.cover_image_url} alt="Cover" className="w-full h-full object-cover" />
                    )}
                    <label className="absolute bottom-4 right-4 px-4 py-2 bg-white/90 backdrop-blur rounded-sm text-[10px] font-black uppercase tracking-widest cursor-pointer hover:bg-white transition-all flex items-center gap-2 shadow-lg">
                        <Camera size={14} />
                        {isRu ? 'Изменить обложку' : 'Örtük şəklini dəyiş'}
                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'cover_image_url')} className="hidden" />
                    </label>
                </div>

                {/* Logo */}
                <div className="p-8 border-b border-slate-100">
                    <div className="flex items-start gap-6">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-sm bg-slate-100 border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
                                {profile.logo_url ? (
                                    <img src={profile.logo_url} alt="Logo" className="w-full h-full object-cover" />
                                ) : (
                                    <Building2 size={40} className="text-slate-300" />
                                )}
                            </div>
                            <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-purple-700 transition-all shadow-lg">
                                <Upload size={14} className="text-white" />
                                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'logo_url')} className="hidden" />
                            </label>
                        </div>
                        <div className="flex-1">
                            <h2 className="text-xl font-black text-slate-900">{profile.name || 'Klinika Adı'}</h2>
                            <p className="text-slate-500 text-sm">{profile.type === 'clinic' ? (isRu ? 'Частная Клиника' : 'Özəl Klinika') : profile.type}</p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="p-8 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                                {isRu ? 'Название клиники' : 'Klinika Adı'}
                            </label>
                            <input
                                type="text"
                                value={profile.name}
                                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                                {isRu ? 'Тип' : 'Növ'}
                            </label>
                            <select
                                value={profile.type}
                                onChange={(e) => setProfile({ ...profile, type: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-sm outline-none focus:border-purple-500"
                            >
                                <option value="clinic">{isRu ? 'Клиника' : 'Klinika'}</option>
                                <option value="general">{isRu ? 'Больница' : 'Xəstəxana'}</option>
                                <option value="dental">{isRu ? 'Стоматология' : 'Stomatoloji'}</option>
                                <option value="specialty">{isRu ? 'Специализированная' : 'İxtisaslaşmış'}</option>
                                <option value="diagnostic">{isRu ? 'Диагностический центр' : 'Diaqnostik Mərkəz'}</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                            {isRu ? 'Описание' : 'Təsvir'}
                        </label>
                        <textarea
                            value={profile.description}
                            onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                            rows={4}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10 resize-none"
                            placeholder={isRu ? 'Расскажите о вашей клинике...' : 'Klinikanız haqqında məlumat verin...'}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                <Mail size={12} /> {isRu ? 'Email' : 'E-poçt'}
                            </label>
                            <input
                                type="email"
                                value={profile.contact_email}
                                onChange={(e) => setProfile({ ...profile, contact_email: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-sm outline-none focus:border-purple-500"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                <Phone size={12} /> {isRu ? 'Телефон' : 'Telefon'}
                            </label>
                            <input
                                type="text"
                                value={profile.contact_phone}
                                onChange={(e) => setProfile({ ...profile, contact_phone: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-sm outline-none focus:border-purple-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                <Globe size={12} /> {isRu ? 'Сайт' : 'Veb sayt'}
                            </label>
                            <input
                                type="text"
                                value={profile.website}
                                onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                                placeholder="https://"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-sm outline-none focus:border-purple-500"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                                {isRu ? 'Номер лицензии' : 'Lisenziya Nömrəsi'}
                            </label>
                            <input
                                type="text"
                                value={profile.license_number}
                                onChange={(e) => setProfile({ ...profile, license_number: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-sm outline-none focus:border-purple-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <div className="p-8 bg-slate-50 border-t border-slate-100">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-8 py-4 bg-purple-600 text-white font-black uppercase tracking-widest text-[11px] rounded-sm hover:bg-purple-700 transition-all shadow-lg flex items-center gap-3"
                    >
                        {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        {isRu ? 'Сохранить изменения' : 'Dəyişiklikləri Saxla'}
                    </button>
                </div>
            </div>
        </div>
    );
}
