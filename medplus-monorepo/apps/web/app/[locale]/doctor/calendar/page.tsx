"use client";

import { use, useState, useEffect } from 'react';
import {
    CalendarDays,
    Clock,
    Save,
    AlertCircle
} from 'lucide-react';
import {
    useDoctorProfile,
    useUpdateDoctorProfile,
    useDoctorAvailability,
    useUpdateDoctorAvailability
} from '@/lib/hooks';

type DaySchedule = {
    is_enabled: boolean;
    start_time: string;
    end_time: string;
    break_start: string;
    break_end: string;
};

type WeekSchedule = {
    [key: string]: DaySchedule;
};

const DAYS = [
    { key: 'monday', az: 'Bazar ertəsi', ru: 'Понедельник' },
    { key: 'tuesday', az: 'Çərşənbə axşamı', ru: 'Вторник' },
    { key: 'wednesday', az: 'Çərşənbə', ru: 'Среда' },
    { key: 'thursday', az: 'Cümə axşamı', ru: 'Четверг' },
    { key: 'friday', az: 'Cümə', ru: 'Пятница' },
    { key: 'saturday', az: 'Şənbə', ru: 'Суббота' },
    { key: 'sunday', az: 'Bazar', ru: 'Воскресенье' },
];

const defaultDaySchedule: DaySchedule = {
    is_enabled: false,
    start_time: '09:00',
    end_time: '18:00',
    break_start: '13:00',
    break_end: '14:00',
};

export default function DoctorCalendarPage({ params: paramsPromise }: { params: Promise<{ locale: string }> }) {
    const params = use(paramsPromise);
    const locale = params.locale || 'az';
    const isRu = locale === 'ru';

    const { data: profile, isLoading: isProfileLoading } = useDoctorProfile();
    const { data: availability, isLoading: isAvailabilityLoading } = useDoctorAvailability(profile?.id || '');
    const updateProfile = useUpdateDoctorProfile();
    const updateAvailability = useUpdateDoctorAvailability();

    const [slotH, setSlotH] = useState(0);
    const [slotM, setSlotM] = useState(30);
    const [bufferH, setBufferH] = useState(0);
    const [bufferM, setBufferM] = useState(0);
    const [schedule, setSchedule] = useState<WeekSchedule>({
        monday: { ...defaultDaySchedule },
        tuesday: { ...defaultDaySchedule },
        wednesday: { ...defaultDaySchedule },
        thursday: { ...defaultDaySchedule },
        friday: { ...defaultDaySchedule },
        saturday: { ...defaultDaySchedule },
        sunday: { ...defaultDaySchedule },
    });

    useEffect(() => {
        if (profile) {
            const sd = profile.slot_duration || 30;
            setSlotH(Math.floor(sd / 60));
            setSlotM(sd % 60);

            const bm = profile.buffer_minutes || 0;
            setBufferH(Math.floor(bm / 60));
            setBufferM(bm % 60);
        }
    }, [profile]);

    useEffect(() => {
        if (availability && availability.length > 0) {
            const newSchedule: WeekSchedule = {};
            availability.forEach((item: any) => {
                newSchedule[item.day_of_week] = {
                    is_enabled: item.is_enabled,
                    start_time: item.start_time.substring(0, 5),
                    end_time: item.end_time.substring(0, 5),
                    break_start: item.break_start?.substring(0, 5) || '13:00',
                    break_end: item.break_end?.substring(0, 5) || '14:00',
                };
            });
            setSchedule(prev => ({ ...prev, ...newSchedule }));
        }
    }, [availability]);

    const updateDaySchedule = (day: string, field: keyof DaySchedule, value: string | boolean) => {
        setSchedule(prev => ({
            ...prev,
            [day]: { ...prev[day], [field]: value }
        }));
    };

    const handleSave = async () => {
        if (!profile) return;

        // Save slot and buffer
        await updateProfile.mutateAsync({
            slot_duration: (slotH * 60) + slotM,
            buffer_minutes: (bufferH * 60) + bufferM
        });

        // Save availability
        const scheduleToSave = Object.entries(schedule).map(([day, s]) => ({
            day_of_week: day,
            ...s
        }));

        await updateAvailability.mutateAsync({
            doctorId: profile.id,
            schedule: scheduleToSave
        });
    };

    if (isProfileLoading || isAvailabilityLoading) {
        return <div className="p-8 text-center text-slate-500">Yüklənir...</div>;
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                        <CalendarDays className="text-[#0F766E]" />
                        {isRu ? 'Настройки Календаря' : 'Təqvim Parametrləri'}
                    </h1>
                    <p className="text-slate-500 mt-1">
                        {isRu ? 'Настройте рабочие дни, часы и время между записями' : 'İş günlərini, saatlarını və aravaxt təyin edin'}
                    </p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={updateProfile.isPending || updateAvailability.isPending}
                    className="flex items-center gap-2 px-6 py-3 bg-[#0F766E] text-white font-bold rounded-xl hover:bg-[#134E4A] transition-all disabled:opacity-50"
                >
                    {updateProfile.isPending || updateAvailability.isPending ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <Save size={20} />
                    )}
                    {isRu ? 'Сохранить' : 'Yadda saxla'}
                </button>
            </div>

            {/* Slot Duration & Buffer */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                            <Clock size={20} className="text-blue-600" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900">
                                {isRu ? 'Длительность приёма' : 'Qəbul müddəti'}
                            </h3>
                            <p className="text-sm text-slate-500">
                                {isRu ? 'Время одного приёма' : 'Bir qəbulun müddəti'}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <label className="text-xs text-slate-400 block mb-1">{isRu ? 'Часы' : 'Saat'}</label>
                            <input
                                type="number"
                                min="0"
                                max="23"
                                value={slotH}
                                onChange={(e) => setSlotH(parseInt(e.target.value) || 0)}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10 outline-none transition-all bg-white"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="text-xs text-slate-400 block mb-1">{isRu ? 'Минуты' : 'Dəqiqə'}</label>
                            <input
                                type="number"
                                min="0"
                                max="59"
                                value={slotM}
                                onChange={(e) => setSlotM(parseInt(e.target.value) || 0)}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10 outline-none transition-all bg-white"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                            <Clock size={20} className="text-amber-600" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900">
                                {isRu ? 'Буферное время' : 'Aravaxt (Buffer)'}
                            </h3>
                            <p className="text-sm text-slate-500">
                                {isRu ? 'Время после каждого приёма' : 'Hər qəbuldan sonra fasilə'}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <label className="text-xs text-slate-400 block mb-1">{isRu ? 'Часы' : 'Saat'}</label>
                            <input
                                type="number"
                                min="0"
                                max="23"
                                value={bufferH}
                                onChange={(e) => setBufferH(parseInt(e.target.value) || 0)}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10 outline-none transition-all bg-white"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="text-xs text-slate-400 block mb-1">{isRu ? 'Минуты' : 'Dəqiqə'}</label>
                            <input
                                type="number"
                                min="0"
                                max="59"
                                value={bufferM}
                                onChange={(e) => setBufferM(parseInt(e.target.value) || 0)}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10 outline-none transition-all bg-white"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Weekly Schedule */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h2 className="text-lg font-bold text-slate-900">
                        {isRu ? 'Расписание по дням' : 'Həftəlik qrafik'}
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                        {isRu ? 'Включите рабочие дни и укажите часы работы' : 'İş günlərini aktivləşdirin və saatları təyin edin'}
                    </p>
                </div>

                <div className="divide-y divide-slate-100">
                    {DAYS.map((day) => (
                        <div
                            key={day.key}
                            className={`p-4 transition-colors ${schedule[day.key].is_enabled ? 'bg-white' : 'bg-slate-50'}`}
                        >
                            <div className="flex items-center gap-4">
                                {/* Toggle */}
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={schedule[day.key].is_enabled}
                                        onChange={(e) => updateDaySchedule(day.key, 'is_enabled', e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#0F766E]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0F766E]"></div>
                                </label>

                                {/* Day Name */}
                                <div className="w-36">
                                    <span className={`font-medium ${schedule[day.key].is_enabled ? 'text-slate-900' : 'text-slate-400'}`}>
                                        {isRu ? day.ru : day.az}
                                    </span>
                                </div>

                                {/* Time Inputs */}
                                {schedule[day.key].is_enabled ? (
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="time"
                                                value={schedule[day.key].start_time}
                                                onChange={(e) => updateDaySchedule(day.key, 'start_time', e.target.value)}
                                                className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-[#0F766E] outline-none"
                                            />
                                            <span className="text-slate-400">-</span>
                                            <input
                                                type="time"
                                                value={schedule[day.key].end_time}
                                                onChange={(e) => updateDaySchedule(day.key, 'end_time', e.target.value)}
                                                className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-[#0F766E] outline-none"
                                            />
                                        </div>

                                        <div className="h-6 w-px bg-slate-200"></div>

                                        <div className="flex items-center gap-2 text-sm text-slate-500">
                                            <span>{isRu ? 'Обед:' : 'Nahar:'}</span>
                                            <input
                                                type="time"
                                                value={schedule[day.key].break_start}
                                                onChange={(e) => updateDaySchedule(day.key, 'break_start', e.target.value)}
                                                className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-[#0F766E] outline-none"
                                            />
                                            <span className="text-slate-400">-</span>
                                            <input
                                                type="time"
                                                value={schedule[day.key].break_end}
                                                onChange={(e) => updateDaySchedule(day.key, 'break_end', e.target.value)}
                                                className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-[#0F766E] outline-none"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <span className="text-slate-400 text-sm">
                                        {isRu ? 'Выходной' : 'İstirahət günü'}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Slot Preview */}
            <div className="bg-slate-900 rounded-2xl p-6 text-white">
                <h3 className="font-bold mb-4">{isRu ? 'Предварительный просмотр слотов (Понедельник)' : 'Slot nümunəsi (Bazar ertəsi)'}</h3>
                <div className="flex flex-wrap gap-2">
                    {schedule.monday.is_enabled && (
                        <>
                            {['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'].map((time) => (
                                <span
                                    key={time}
                                    className={`px-3 py-1 rounded text-sm ${time >= schedule.monday.break_start && time < schedule.monday.break_end
                                        ? 'bg-slate-700 text-slate-400 line-through'
                                        : 'bg-[#0F766E] text-white'
                                        }`}
                                >
                                    {time}
                                </span>
                            ))}
                        </>
                    )}
                </div>
                <p className="text-slate-400 text-sm mt-4">
                    {isRu
                        ? 'Серые слоты = время обеда'
                        : 'Boz slotlar = nahar vaxtı'
                    }
                </p>
            </div>
        </div>
    );
}
