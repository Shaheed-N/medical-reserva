"use client";

import { use, useState } from 'react';
import {
    ListChecks,
    Plus,
    Trash2,
    GripVertical,
    Save,
    AlertCircle,
    Edit2
} from 'lucide-react';
import {
    useDoctorProfile,
    useDoctorVisitReasons,
    useUpsertVisitReason,
    useDeleteVisitReason
} from '@/lib/hooks';

export default function VisitReasonsPage({ params: paramsPromise }: { params: Promise<{ locale: string }> }) {
    const params = use(paramsPromise);
    const locale = params.locale || 'az';
    const isRu = locale === 'ru';

    const { data: profile } = useDoctorProfile();
    const { data: fetchReasons, isLoading } = useDoctorVisitReasons(profile?.id);
    const upsertReason = useUpsertVisitReason();
    const deleteReasonMutation = useDeleteVisitReason();

    const [newReason, setNewReason] = useState({ nameAz: '', nameRu: '' });

    const reasons = fetchReasons || [];

    const addReason = async () => {
        if (!newReason.nameAz.trim() || !profile) return;

        await upsertReason.mutateAsync({
            doctor_id: profile.id,
            name: newReason.nameAz,
            name_az: newReason.nameAz,
            name_ru: newReason.nameRu || newReason.nameAz,
            is_active: true,
            display_order: reasons.length
        });
        setNewReason({ nameAz: '', nameRu: '' });
    };

    const toggleReason = async (reason: any) => {
        await upsertReason.mutateAsync({
            ...reason,
            is_active: !reason.is_active
        });
    };

    const deleteReason = async (id: string) => {
        if (confirm(isRu ? 'Удалить?' : 'Silinsin?')) {
            await deleteReasonMutation.mutateAsync({ id, doctorId: profile!.id });
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                        <ListChecks className="text-[#0F766E]" />
                        {isRu ? 'Причины Визита' : 'Vizit Səbəbləri'}
                    </h1>
                    <p className="text-slate-500 mt-1">
                        {isRu ? 'Создайте список причин для записи пациентов' : 'Pasientlər üçün rezervasiya səbəbləri siyahısı yaradın'}
                    </p>
                </div>
            </div>

            {/* Add New Reason */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-4">
                    {isRu ? 'Добавить новую причину' : 'Yeni səbəb əlavə et'}
                </h3>
                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="block text-sm text-slate-500 mb-1">
                            {isRu ? 'На азербайджанском' : 'Azərbaycanca'} *
                        </label>
                        <input
                            type="text"
                            placeholder={isRu ? 'Например: Срочный осмотр' : 'Məsələn: Təcili yoxlama'}
                            value={newReason.nameAz}
                            onChange={(e) => setNewReason({ ...newReason, nameAz: e.target.value })}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10 outline-none"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm text-slate-500 mb-1">
                            {isRu ? 'На русском' : 'Rusca'}
                        </label>
                        <input
                            type="text"
                            placeholder={isRu ? 'Например: Срочный осмотр' : 'Məsələn: Срочный осмотр'}
                            value={newReason.nameRu}
                            onChange={(e) => setNewReason({ ...newReason, nameRu: e.target.value })}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10 outline-none"
                        />
                    </div>
                    <button
                        onClick={addReason}
                        disabled={!newReason.nameAz.trim()}
                        className="self-end px-6 py-3 bg-[#0F766E] text-white rounded-xl hover:bg-[#134E4A] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        <Plus size={20} />
                        {isRu ? 'Добавить' : 'Əlavə et'}
                    </button>
                </div>
            </div>

            {/* Reasons List */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h3 className="font-bold text-slate-900">
                        {isRu ? 'Ваши причины визита' : 'Sizin vizit səbəbləriniz'}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                        {isRu ? 'Пациенты выберут одну из этих причин при записи' : 'Pasientlər rezervasiya zamanı bu səbəblərdən birini seçəcək'}
                    </p>
                </div>

                <div className="divide-y divide-slate-100">
                    {reasons.map((reason: any, index: number) => (
                        <div
                            key={reason.id}
                            className={`p-4 flex items-center gap-4 transition-colors ${reason.is_active ? 'bg-white' : 'bg-slate-50'}`}
                        >
                            <GripVertical className="text-slate-300 cursor-grab" size={20} />

                            <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm font-medium text-slate-500">
                                {index + 1}
                            </span>

                            <div className="flex-1">
                                <div className={`font-medium ${reason.is_active ? 'text-slate-900' : 'text-slate-400'}`}>
                                    {isRu ? reason.name_ru : reason.name_az}
                                </div>
                                <div className="text-sm text-slate-400">
                                    {isRu ? reason.name_az : reason.name_ru}
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={reason.is_active}
                                        onChange={() => toggleReason(reason)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#0F766E]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0F766E]"></div>
                                </label>

                                <button
                                    onClick={() => deleteReason(reason.id)}
                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {reasons.length === 0 && (
                    <div className="p-12 text-center text-slate-400">
                        <ListChecks size={48} className="mx-auto mb-4 opacity-50" />
                        <p>{isRu ? 'Нет причин визита' : 'Vizit səbəbi yoxdur'}</p>
                    </div>
                )}
            </div>
        </div >
    );
}
