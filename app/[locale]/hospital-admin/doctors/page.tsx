"use client";

import { use, useState } from 'react';
import Link from 'next/link';
import {
    Users,
    Search,
    Plus,
    Star,
    MoreVertical,
    Calendar,
    Clock,
    Eye,
    Edit,
    Trash2,
    CheckCircle,
    XCircle,
    Loader2,
    Copy
} from 'lucide-react';
import {
    useHospitalProfile,
    useHospitalDoctors
} from '@/lib/hooks';
import { toast } from 'react-hot-toast';
import { supabase } from '@/lib/supabase';

export default function HospitalDoctorsPage({ params: paramsPromise }: { params: Promise<{ locale: string }> }) {
    const params = use(paramsPromise);
    const locale = params.locale || 'az';
    const isRu = locale === 'ru';

    const { data: hospital, isLoading: isProfileLoading } = useHospitalProfile();
    const { data: doctors, isLoading: isDoctorsLoading, refetch } = useHospitalDoctors(hospital?.id || '');

    const [searchQuery, setSearchQuery] = useState('');
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [inviteLoading, setInviteLoading] = useState(false);
    const [inviteForm, setInviteForm] = useState({ name: '', email: '', specialty: '', phone: '' });
    const [credentials, setCredentials] = useState<{ username: string; password: string; name: string } | null>(null);

    const filteredDoctors = doctors?.filter((doc: any) =>
        doc.user?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.specialties?.some((s: string) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
        doc.user?.email?.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        setInviteLoading(true);

        try {
            // Create user credentials via API
            const userRes = await fetch('/api/admin/create-user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: inviteForm.email,
                    full_name: inviteForm.name,
                    role: 'doctor',
                    hospital_id: hospital?.id
                })
            });

            const userData = await userRes.json();

            if (!userRes.ok) {
                throw new Error(userData.error || 'Failed to create user');
            }

            // Create doctor record in database
            const { data: doctor, error: doctorError } = await supabase
                .from('doctors')
                .insert({
                    user_id: userData.user_id,
                    specialties: inviteForm.specialty ? [inviteForm.specialty] : [],
                    is_accepting_patients: true
                })
                .select()
                .single();

            if (doctorError) {
                console.error('Doctor creation error:', doctorError);
                console.error('Error details:', JSON.stringify(doctorError, null, 2));
                console.error('Error message:', doctorError.message);
                console.error('Error code:', doctorError.code);
                throw new Error(`Failed to create doctor record: ${doctorError.message || 'Unknown error'}`);
            }

            // Link doctor to hospital's main branch
            if (hospital?.branches?.[0]?.id) {
                const { error: assignmentError } = await supabase
                    .from('doctor_branch_assignments')
                    .insert({
                        doctor_id: doctor.id,
                        branch_id: hospital.branches[0].id,
                        is_primary: true,
                        is_active: true
                    });

                if (assignmentError) {
                    console.error('Branch assignment error:', assignmentError);
                    // Continue anyway, doctor was created
                }
            }

            // Show credentials modal
            setCredentials({
                username: userData.username,
                password: userData.temporary_password,
                name: inviteForm.name
            });

            toast.success(isRu ? 'Врач добавлен!' : 'Həkim əlavə edildi!');
            setIsInviteModalOpen(false);
            setInviteForm({ name: '', email: '', specialty: '', phone: '' });
            refetch();
        } catch (error: any) {
            console.error('Create doctor error:', error);
            toast.error(`Xəta: ${error?.message || 'Unknown'}`);
        } finally {
            setInviteLoading(false);
        }
    };

    if (isProfileLoading || isDoctorsLoading) {
        return <div className="p-8 text-center text-slate-500">Yüklənir...</div>;
    }

    if (!hospital) {
        return (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
                <Users size={48} className="mx-auto mb-4 text-slate-300" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">Giriş imkanı yoxdur</h3>
                <p className="text-slate-500">Siz hər hansı bir xəstəxanaya admin kimi təyin edilməmisiniz.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                        <Users className="text-purple-600" />
                        {isRu ? 'Управление Врачами' : 'Həkim İdarəetməsi'}
                    </h1>
                    <p className="text-slate-500 mt-1">
                        {isRu ? `${filteredDoctors.length} врачей в клинике` : `Klinikada ${filteredDoctors.length} həkim`}
                    </p>
                </div>
                <button
                    onClick={() => setIsInviteModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-all"
                >
                    <Plus size={20} />
                    {isRu ? 'Добавить врача' : 'Həkim əlavə et'}
                </button>
            </div>

            {/* Invite Modal */}
            {isInviteModalOpen && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-purple-50">
                            <h3 className="font-bold text-slate-900 text-lg">
                                {isRu ? 'Добавить врача' : 'Həkim əlavə et'}
                            </h3>
                            <button
                                onClick={() => setIsInviteModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <Users size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleInvite} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    {isRu ? 'ФИО врача' : 'Həkimin tam adı'}
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={inviteForm.name}
                                    onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10 outline-none"
                                    placeholder={isRu ? 'Иван Иванов' : 'Məsələn: Əli Əliyev'}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    {isRu ? 'Email адрес' : 'Email ünvanı'}
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={inviteForm.email}
                                    onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10 outline-none"
                                    placeholder="doctor@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    {isRu ? 'Специализация' : 'İxtisas'}
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={inviteForm.specialty}
                                    onChange={(e) => setInviteForm({ ...inviteForm, specialty: e.target.value })}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10 outline-none"
                                    placeholder={isRu ? 'Терапевт' : 'Məsələn: Terapevt'}
                                />
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsInviteModalOpen(false)}
                                    disabled={inviteLoading}
                                    className="flex-1 px-6 py-3 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all disabled:opacity-50"
                                >
                                    {isRu ? 'Отмена' : 'Ləğv et'}
                                </button>
                                <button
                                    type="submit"
                                    disabled={inviteLoading}
                                    className="flex-1 px-6 py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {inviteLoading ? <Loader2 className="animate-spin" size={18} /> : null}
                                    {isRu ? 'Создать' : 'Yarat'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                    type="text"
                    placeholder={isRu ? 'Поиск врачей...' : 'Həkim axtar...'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10 outline-none"
                />
            </div>

            {/* Doctors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDoctors.map((doc: any) => (
                    <div key={doc.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 font-bold text-xl overflow-hidden">
                                        {doc.user?.avatar_url ? (
                                            <img src={doc.user.avatar_url} alt={doc.user.full_name} className="w-full h-full object-cover" />
                                        ) : (
                                            doc.user?.full_name?.split(' ')[1]?.[0] || 'D'
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">{doc.user?.full_name}</h3>
                                        <p className="text-sm text-purple-600">{doc.specialties?.join(', ')}</p>
                                    </div>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${doc.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                                    }`}>
                                    {doc.is_active ? (isRu ? 'Активен' : 'Aktiv') : (isRu ? 'Неактивен' : 'Deaktiv')}
                                </span>
                            </div>

                            <div className="space-y-2 text-sm text-slate-500 mb-4">
                                <p>{doc.user?.email}</p>
                                <p>{doc.user?.phone}</p>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1">
                                        <Star size={14} className="fill-amber-400 text-amber-400" />
                                        <span className="font-bold text-slate-900">4.5</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-slate-400">
                                        <Calendar size={14} />
                                        <span>{doc.appointmentCount}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Link
                                        href={`/${locale}/hospital-admin/doctors/${doc.id}`}
                                        className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                    >
                                        <Eye size={18} />
                                    </Link>
                                    <button className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                                        <Edit size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredDoctors.length === 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                    <Users size={48} className="mx-auto text-slate-200 mb-4" />
                    <p className="text-slate-400">{isRu ? 'Врачи не найдены' : 'Həkim tapılmadı'}</p>
                </div>
            )}

            {/* Credentials Modal */}
            {credentials && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm" onClick={() => setCredentials(null)}></div>
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl relative z-10 overflow-hidden">
                        <div className="bg-purple-600 p-6 text-white">
                            <div className="flex items-center gap-3 mb-2">
                                <CheckCircle size={24} />
                                <h2 className="text-lg font-bold">{isRu ? 'Врач добавлен!' : 'Həkim Yaradıldı!'}</h2>
                            </div>
                            <p className="text-white/70 text-sm">{isRu ? 'Поделитесь этими данными с врачом' : 'Bu məlumatları həkimə göndərin'}</p>
                        </div>
                        <div className="p-8 space-y-6">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">{isRu ? 'Врач' : 'Həkim'}</label>
                                <div className="font-bold text-slate-900">{credentials.name}</div>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">{isRu ? 'Логин' : 'İstifadəçi adı'}</label>
                                <div className="bg-slate-100 px-4 py-3 rounded-xl font-mono text-sm select-all">{credentials.username}</div>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">{isRu ? 'Пароль' : 'Şifrə'}</label>
                                <div className="bg-purple-50 border-2 border-purple-200 px-4 py-3 rounded-xl font-mono text-lg font-bold text-purple-700 select-all">{credentials.password}</div>
                            </div>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(`İstifadəçi: ${credentials.username}\nŞifrə: ${credentials.password}`);
                                    toast.success(isRu ? 'Скопировано!' : 'Kopyalandı!');
                                }}
                                className="w-full py-4 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-all flex items-center justify-center gap-2"
                            >
                                <Copy size={18} />
                                {isRu ? 'Копировать' : 'Kopyala'}
                            </button>
                            <button
                                onClick={() => setCredentials(null)}
                                className="w-full py-3 text-slate-500 font-bold text-sm hover:text-slate-900 transition-all"
                            >
                                {isRu ? 'Закрыть' : 'Bağla'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
