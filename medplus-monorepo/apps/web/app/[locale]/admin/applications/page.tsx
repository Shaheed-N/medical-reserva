"use client";

import { useState, useEffect, use } from 'react';
import {
    CheckCircle, XCircle, Clock, Building2, Stethoscope,
    MoreHorizontal, Filter, Search, Loader2, Eye, Mail, Phone
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';

type ApplicationType = 'doctor' | 'hospital';

interface Application {
    id: string;
    full_name?: string; // doctor
    email?: string; // doctor
    phone?: string; // doctor
    name?: string; // hospital
    admin_email?: string; // hospital
    admin_phone?: string; // hospital
    type: string;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
    specialties?: string[]; // doctor
    city?: string; // hospital
}

export default function ApplicationsPage({ params: paramsPromise }: { params: Promise<{ locale: string }> }) {
    const { locale } = use(paramsPromise);
    const isRu = locale === 'ru';

    const [selectedType, setSelectedType] = useState<ApplicationType>('doctor');
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [credentials, setCredentials] = useState<{ username: string; password: string; name: string } | null>(null);

    useEffect(() => {
        fetchApplications();
    }, [selectedType]);

    async function fetchApplications() {
        setLoading(true);
        const table = selectedType === 'doctor' ? 'doctor_applications' : 'hospital_applications';
        console.log('[Admin] Fetching from table:', table);

        const { data, error, status, statusText } = await supabase
            .from(table)
            .select('*')
            .order('created_at', { ascending: false });

        console.log('[Admin] Supabase response:', { data, error, status, statusText });

        if (error) {
            console.error('[Admin] Supabase error:', error.message, error.code, error.details);
            toast.error(`Xəta: ${error.message}`);
        } else {
            console.log('[Admin] Applications found:', data?.length || 0);
            setApplications(data || []);
        }
        setLoading(false);
    }

    async function handleStatusUpdate(id: string, newStatus: 'approved' | 'rejected') {
        setActionLoading(id);
        const table = selectedType === 'doctor' ? 'doctor_applications' : 'hospital_applications';

        try {
            if (newStatus === 'approved') {
                const app = applications.find(a => a.id === id);
                if (!app) throw new Error('Application not found');

                if (selectedType === 'hospital') {
                    // Create actual hospital record
                    const slug = app.name!.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                    const { data: hospital, error: hospitalError } = await supabase
                        .from('hospitals')
                        .insert({
                            name: app.name,
                            slug: slug + '-' + Date.now(),
                            type: app.type || 'clinic',
                            contact_email: app.admin_email,
                            contact_phone: app.admin_phone,
                            is_active: true
                        })
                        .select()
                        .single();

                    if (hospitalError) throw hospitalError;

                    // Create default main branch
                    const { data: branch, error: branchError } = await supabase
                        .from('branches')
                        .insert({
                            hospital_id: hospital.id,
                            name: 'Ana Filial',
                            city: 'Bakı',
                            address_line1: app.address || 'Bakı, Azərbaycan',
                            is_main: true,
                            is_active: true
                        })
                        .select()
                        .single();

                    if (branchError) {
                        console.error('Failed to create main branch:', branchError);
                    }

                    // Create user credentials via API
                    const adminName = (app as any).admin_name || app.name + ' Admin';
                    const userRes = await fetch('/api/admin/create-user', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email: app.admin_email,
                            full_name: adminName,
                            role: 'hospital_owner',
                            hospital_id: hospital.id
                        })
                    });

                    const userData = await userRes.json();

                    if (!userRes.ok) {
                        console.error('User creation failed:', userData);
                        // Continue anyway, hospital was created
                    } else {
                        // Show credentials modal
                        setCredentials({
                            username: userData.username,
                            password: userData.temporary_password,
                            name: adminName
                        });
                    }

                    // Update application with approved_hospital_id
                    await supabase
                        .from('hospital_applications')
                        .update({ status: 'approved', approved_hospital_id: hospital.id })
                        .eq('id', id);

                    toast.success(`"${app.name}" xəstəxanası yaradıldı!`);
                } else {
                    // Create doctor user credentials
                    const userRes = await fetch('/api/admin/create-user', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email: app.email,
                            full_name: app.full_name,
                            role: 'doctor',
                            hospital_id: null
                        })
                    });

                    const userData = await userRes.json();

                    if (userRes.ok && userData.temporary_password) {
                        setCredentials({
                            username: userData.username,
                            password: userData.temporary_password,
                            name: app.full_name!
                        });
                    }

                    await supabase
                        .from('doctor_applications')
                        .update({ status: 'approved' })
                        .eq('id', id);
                    toast.success('Həkim müraciəti təsdiqləndi!');
                }
            } else {
                await supabase.from(table).update({ status: newStatus }).eq('id', id);
                toast.success('Müraciət rədd edildi');
            }
            fetchApplications();
        } catch (error: any) {
            console.error('Approval error:', error);
            toast.error(`Xəta: ${error?.message || 'Unknown'}`);
        } finally {
            setActionLoading(null);
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center bg-[#0F172A] p-12 rounded-sm shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#0F766E] opacity-10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                <div className="relative z-10">
                    <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">
                        {isRu ? 'Очередь заявок' : 'Müraciət Növbəsi'}
                    </h1>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">
                        {isRu ? 'Управление новыми регистрациями' : 'Yeni qeydiyyat müraciətlərinin idarə edilməsi'}
                    </p>
                </div>

                <div className="flex bg-slate-800/50 p-1 rounded-sm border border-slate-700 relative z-10">
                    <button
                        onClick={() => setSelectedType('doctor')}
                        className={`flex items-center gap-2 px-6 py-2 rounded-sm text-[10px] font-black uppercase tracking-widest transition-all ${selectedType === 'doctor' ? 'bg-[#0F766E] text-white shadow-lg' : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        <Stethoscope size={14} /> {isRu ? 'Врачи' : 'Həkimlər'}
                    </button>
                    <button
                        onClick={() => setSelectedType('hospital')}
                        className={`flex items-center gap-2 px-6 py-2 rounded-sm text-[10px] font-black uppercase tracking-widest transition-all ${selectedType === 'hospital' ? 'bg-[#0F766E] text-white shadow-lg' : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        <Building2 size={14} /> {isRu ? 'Клиники' : 'Klinikalar'}
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-sm border border-slate-200 overflow-hidden shadow-sm">
                <table className="w-full">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="text-left px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Applicant</th>
                            <th className="text-left px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Details</th>
                            <th className="text-left px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                            <th className="text-right px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr>
                                <td colSpan={4} className="px-8 py-20 text-center">
                                    <Loader2 className="animate-spin text-[#0F766E] mx-auto mb-4" size={32} />
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fetching applications...</div>
                                </td>
                            </tr>
                        ) : applications.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-8 py-20 text-center">
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest opacity-40 italic">No pending applications</div>
                                </td>
                            </tr>
                        ) : (
                            applications.map((app) => (
                                <tr key={app.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="font-bold text-slate-900 leading-tight">
                                            {selectedType === 'doctor' ? app.full_name : app.name}
                                        </div>
                                        <div className="flex items-center gap-3 mt-1 opacity-60">
                                            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                                <Mail size={12} /> {selectedType === 'doctor' ? app.email : app.admin_email}
                                            </div>
                                            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                                <Phone size={12} /> {selectedType === 'doctor' ? app.phone : app.admin_phone}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="text-[10px] font-black text-[#0F766E] uppercase tracking-widest mb-1">
                                            {selectedType === 'doctor' ? app.specialties?.join(', ') : app.city}
                                        </div>
                                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
                                            <Clock size={12} /> {new Date(app.created_at).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`inline-flex px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-sm ${app.status === 'approved' ? 'bg-emerald-50 text-emerald-600' :
                                            app.status === 'rejected' ? 'bg-red-50 text-red-600' :
                                                'bg-orange-50 text-orange-600 shadow-sm border border-orange-100'
                                            }`}>
                                            {app.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center justify-end gap-3">
                                            {app.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => handleStatusUpdate(app.id, 'approved')}
                                                        disabled={!!actionLoading}
                                                        className="px-4 py-2 bg-[#0F766E] text-white text-[9px] font-black uppercase tracking-widest rounded-sm hover:bg-[#134E4A] transition-all"
                                                    >
                                                        {actionLoading === app.id ? <Loader2 size={12} className="animate-spin" /> : 'Approve'}
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusUpdate(app.id, 'rejected')}
                                                        disabled={!!actionLoading}
                                                        className="px-4 py-2 bg-white border border-slate-200 text-red-600 text-[9px] font-black uppercase tracking-widest rounded-sm hover:bg-red-50 transition-all"
                                                    >
                                                        Reject
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Credentials Modal */}
            {credentials && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm" onClick={() => setCredentials(null)}></div>
                    <div className="bg-white w-full max-w-md rounded-lg shadow-2xl relative z-10 overflow-hidden">
                        <div className="bg-[#0F766E] p-6 text-white">
                            <div className="flex items-center gap-3 mb-2">
                                <CheckCircle size={24} />
                                <h2 className="text-lg font-black uppercase tracking-tight">Hesab Yaradıldı!</h2>
                            </div>
                            <p className="text-white/70 text-sm">Bu məlumatları xəstəxana administratoruna göndərin</p>
                        </div>
                        <div className="p-8 space-y-6">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Administrator</label>
                                <div className="font-bold text-slate-900">{credentials.name}</div>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">İstifadəçi adı (Login)</label>
                                <div className="bg-slate-100 px-4 py-3 rounded font-mono text-sm select-all">{credentials.username}</div>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Müvəqqəti Şifrə</label>
                                <div className="bg-emerald-50 border-2 border-emerald-200 px-4 py-3 rounded font-mono text-lg font-bold text-emerald-700 select-all">{credentials.password}</div>
                            </div>
                            <div className="bg-orange-50 border border-orange-200 p-4 rounded text-xs text-orange-700">
                                <strong>Qeyd:</strong> İstifadəçi ilk girişdə şifrə dəyişdirməlidir.
                            </div>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(`İstifadəçi: ${credentials.username}\nŞifrə: ${credentials.password}`);
                                    toast.success('Məlumatlar kopyalandı!');
                                }}
                                className="w-full py-4 bg-[#0F766E] text-white font-black uppercase tracking-widest text-[11px] rounded hover:bg-[#134E4A] transition-all"
                            >
                                Kopyala
                            </button>
                            <button
                                onClick={() => setCredentials(null)}
                                className="w-full py-3 text-slate-500 font-bold text-sm hover:text-slate-900 transition-all"
                            >
                                Bağla
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
