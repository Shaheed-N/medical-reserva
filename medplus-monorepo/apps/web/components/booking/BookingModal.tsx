"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Calendar,
    Clock,
    ChevronLeft,
    ChevronRight,
    CheckCircle,
    User,
    Phone,
    FileText,
    Loader2,
    Shield
} from 'lucide-react';

type BookingStep = 'reason' | 'date' | 'time' | 'confirm' | 'success';

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    doctor: {
        id: string | number;
        name: string;
        specialty: string;
        hospital: string;
        image?: string;
    };
    locale: string;
}

const VISIT_REASONS = [
    { id: '1', nameAz: 'Ümumi yoxlama', nameRu: 'Общий осмотр' },
    { id: '2', nameAz: 'Təkrar müayinə', nameRu: 'Повторный осмотр' },
    { id: '3', nameAz: 'Konsultasiya', nameRu: 'Консультация' },
    { id: '4', nameAz: 'Analiz nəticəsi', nameRu: 'Результаты анализов' },
    { id: '5', nameAz: 'Ağrı/Simptomlar', nameRu: 'Боли/Симптомы' },
];

const generateTimeSlots = (bufferMinutes: number = 0) => {
    const slots: { time: string; available: boolean }[] = [];
    const slotDuration = 30;

    for (let hour = 9; hour < 18; hour++) {
        for (let min = 0; min < 60; min += slotDuration) {
            // Skip lunch break (13:00 - 14:00)
            if (hour === 13) continue;

            const time = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
            // Randomly mark some as unavailable for demo
            const available = Math.random() > 0.3;
            slots.push({ time, available });
        }
    }
    return slots;
};

const generateWeekDates = (startDate: Date) => {
    const dates: { date: Date; dayName: string; dayNum: number; month: string }[] = [];
    const dayNames = ['Baz', 'B.e', 'Ç.a', 'Çər', 'C.a', 'Cüm', 'Şən'];
    const monthNames = ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'İyn', 'İyl', 'Avq', 'Sen', 'Okt', 'Noy', 'Dek'];

    for (let i = 0; i < 7; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        dates.push({
            date,
            dayName: dayNames[date.getDay()],
            dayNum: date.getDate(),
            month: monthNames[date.getMonth()]
        });
    }
    return dates;
};

export function BookingModal({ isOpen, onClose, doctor, locale }: BookingModalProps) {
    const isRu = locale === 'ru';
    const [step, setStep] = useState<BookingStep>('reason');
    const [selectedReason, setSelectedReason] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [weekStart, setWeekStart] = useState(new Date());
    const [loading, setLoading] = useState(false);
    const [hasInsurance, setHasInsurance] = useState(false);

    const timeSlots = generateTimeSlots();
    const weekDates = generateWeekDates(weekStart);

    const handleNextWeek = () => {
        const next = new Date(weekStart);
        next.setDate(weekStart.getDate() + 7);
        setWeekStart(next);
    };

    const handlePrevWeek = () => {
        const prev = new Date(weekStart);
        prev.setDate(weekStart.getDate() - 7);
        if (prev >= new Date()) {
            setWeekStart(prev);
        }
    };

    const handleConfirm = async () => {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        setLoading(false);
        setStep('success');
    };

    const resetAndClose = () => {
        setStep('reason');
        setSelectedReason(null);
        setSelectedDate(null);
        setSelectedTime(null);
        onClose();
    };

    const stepLabels = {
        reason: isRu ? 'Причина' : 'Səbəb',
        date: isRu ? 'Дата' : 'Tarix',
        time: isRu ? 'Время' : 'Vaxt',
        confirm: isRu ? 'Подтверждение' : 'Təsdiq',
        success: isRu ? 'Готово' : 'Hazır'
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={resetAndClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            {doctor.image && (
                                <img src={doctor.image} alt={doctor.name} className="w-12 h-12 rounded-full object-cover" />
                            )}
                            <div>
                                <h3 className="font-bold text-slate-900">{doctor.name}</h3>
                                <p className="text-sm text-slate-500">{doctor.specialty}</p>
                            </div>
                        </div>
                        <button onClick={resetAndClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                            <X size={20} className="text-slate-400" />
                        </button>
                    </div>

                    {/* Progress */}
                    {step !== 'success' && (
                        <div className="px-6 py-3 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
                            {(['reason', 'date', 'time', 'confirm'] as BookingStep[]).map((s, i) => (
                                <div key={s} className="flex items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === s ? 'bg-[#0F766E] text-white' :
                                            ['reason', 'date', 'time', 'confirm'].indexOf(step) > i ? 'bg-green-500 text-white' :
                                                'bg-slate-200 text-slate-400'
                                        }`}>
                                        {['reason', 'date', 'time', 'confirm'].indexOf(step) > i ? <CheckCircle size={16} /> : i + 1}
                                    </div>
                                    {i < 3 && <div className={`w-8 h-0.5 mx-1 ${['reason', 'date', 'time', 'confirm'].indexOf(step) > i ? 'bg-green-500' : 'bg-slate-200'}`} />}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Content */}
                    <div className="p-6 overflow-y-auto max-h-[50vh]">
                        <AnimatePresence mode="wait">
                            {step === 'reason' && (
                                <motion.div
                                    key="reason"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-4"
                                >
                                    <h4 className="font-bold text-slate-900 flex items-center gap-2">
                                        <FileText size={18} className="text-[#0F766E]" />
                                        {isRu ? 'Причина визита' : 'Vizit səbəbi'}
                                    </h4>
                                    <div className="space-y-2">
                                        {VISIT_REASONS.map((reason) => (
                                            <button
                                                key={reason.id}
                                                onClick={() => setSelectedReason(reason.id)}
                                                className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${selectedReason === reason.id
                                                        ? 'border-[#0F766E] bg-[#0F766E]/5 text-[#0F766E]'
                                                        : 'border-slate-200 hover:border-slate-300'
                                                    }`}
                                            >
                                                {isRu ? reason.nameRu : reason.nameAz}
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {step === 'date' && (
                                <motion.div
                                    key="date"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-4"
                                >
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-bold text-slate-900 flex items-center gap-2">
                                            <Calendar size={18} className="text-[#0F766E]" />
                                            {isRu ? 'Выберите дату' : 'Tarix seçin'}
                                        </h4>
                                        <div className="flex items-center gap-2">
                                            <button onClick={handlePrevWeek} className="p-2 hover:bg-slate-100 rounded-full">
                                                <ChevronLeft size={18} />
                                            </button>
                                            <button onClick={handleNextWeek} className="p-2 hover:bg-slate-100 rounded-full">
                                                <ChevronRight size={18} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-7 gap-2">
                                        {weekDates.map((d) => {
                                            const isToday = d.date.toDateString() === new Date().toDateString();
                                            const isSelected = selectedDate?.toDateString() === d.date.toDateString();
                                            const isPast = d.date < new Date(new Date().setHours(0, 0, 0, 0));

                                            return (
                                                <button
                                                    key={d.date.toISOString()}
                                                    onClick={() => !isPast && setSelectedDate(d.date)}
                                                    disabled={isPast}
                                                    className={`p-3 rounded-xl text-center transition-all ${isPast ? 'opacity-40 cursor-not-allowed' :
                                                            isSelected ? 'bg-[#0F766E] text-white' :
                                                                isToday ? 'bg-[#0F766E]/10 text-[#0F766E] border-2 border-[#0F766E]' :
                                                                    'hover:bg-slate-100'
                                                        }`}
                                                >
                                                    <div className="text-xs font-medium opacity-70">{d.dayName}</div>
                                                    <div className="text-lg font-bold">{d.dayNum}</div>
                                                    <div className="text-xs opacity-70">{d.month}</div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            )}

                            {step === 'time' && (
                                <motion.div
                                    key="time"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-4"
                                >
                                    <h4 className="font-bold text-slate-900 flex items-center gap-2">
                                        <Clock size={18} className="text-[#0F766E]" />
                                        {isRu ? 'Выберите время' : 'Vaxt seçin'}
                                    </h4>
                                    <div className="grid grid-cols-4 gap-2">
                                        {timeSlots.map((slot) => (
                                            <button
                                                key={slot.time}
                                                onClick={() => slot.available && setSelectedTime(slot.time)}
                                                disabled={!slot.available}
                                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${!slot.available ? 'bg-slate-100 text-slate-300 cursor-not-allowed line-through' :
                                                        selectedTime === slot.time ? 'bg-[#0F766E] text-white' :
                                                            'bg-slate-50 hover:bg-slate-100 text-slate-700'
                                                    }`}
                                            >
                                                {slot.time}
                                            </button>
                                        ))}
                                    </div>
                                    <p className="text-xs text-slate-400">
                                        {isRu ? 'Серые слоты уже забронированы' : 'Boz slotlar artıq tutulub'}
                                    </p>
                                </motion.div>
                            )}

                            {step === 'confirm' && (
                                <motion.div
                                    key="confirm"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-4"
                                >
                                    <h4 className="font-bold text-slate-900 flex items-center gap-2">
                                        <CheckCircle size={18} className="text-[#0F766E]" />
                                        {isRu ? 'Подтвердите запись' : 'Rezervasiyanı təsdiqləyin'}
                                    </h4>

                                    <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">{isRu ? 'Врач' : 'Həkim'}:</span>
                                            <span className="font-medium">{doctor.name}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">{isRu ? 'Клиника' : 'Klinika'}:</span>
                                            <span className="font-medium">{doctor.hospital}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">{isRu ? 'Дата' : 'Tarix'}:</span>
                                            <span className="font-medium">{selectedDate?.toLocaleDateString(locale)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">{isRu ? 'Время' : 'Vaxt'}:</span>
                                            <span className="font-medium">{selectedTime}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">{isRu ? 'Причина' : 'Səbəb'}:</span>
                                            <span className="font-medium">
                                                {isRu
                                                    ? VISIT_REASONS.find(r => r.id === selectedReason)?.nameRu
                                                    : VISIT_REASONS.find(r => r.id === selectedReason)?.nameAz
                                                }
                                            </span>
                                        </div>
                                    </div>

                                    <label className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={hasInsurance}
                                            onChange={(e) => setHasInsurance(e.target.checked)}
                                            className="w-5 h-5 rounded border-slate-300 text-[#0F766E] focus:ring-[#0F766E]"
                                        />
                                        <div className="flex items-center gap-2">
                                            <Shield size={18} className="text-blue-600" />
                                            <span className="text-sm font-medium text-blue-800">
                                                {isRu ? 'У меня есть страховка' : 'Sığortam var'}
                                            </span>
                                        </div>
                                    </label>
                                </motion.div>
                            )}

                            {step === 'success' && (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center py-8"
                                >
                                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle size={40} className="text-green-600" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-2">
                                        {isRu ? 'Запись подтверждена!' : 'Rezervasiya təsdiqləndi!'}
                                    </h3>
                                    <p className="text-slate-500 mb-6">
                                        {isRu
                                            ? 'Вы получите SMS с подтверждением.'
                                            : 'Təsdiq SMS-i alacaqsınız.'}
                                    </p>
                                    <p className="text-lg font-bold text-[#0F766E]">
                                        {selectedDate?.toLocaleDateString(locale)} - {selectedTime}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Footer */}
                    {step !== 'success' && (
                        <div className="p-6 border-t border-slate-100 flex items-center justify-between">
                            <button
                                onClick={() => {
                                    if (step === 'reason') resetAndClose();
                                    else if (step === 'date') setStep('reason');
                                    else if (step === 'time') setStep('date');
                                    else if (step === 'confirm') setStep('time');
                                }}
                                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                {step === 'reason'
                                    ? (isRu ? 'Отмена' : 'Ləğv et')
                                    : (isRu ? 'Назад' : 'Geri')
                                }
                            </button>

                            {step === 'confirm' ? (
                                <button
                                    onClick={handleConfirm}
                                    disabled={loading}
                                    className="flex items-center gap-2 px-6 py-3 bg-[#0F766E] text-white font-bold rounded-xl hover:bg-[#134E4A] transition-all disabled:opacity-50"
                                >
                                    {loading ? (
                                        <Loader2 size={18} className="animate-spin" />
                                    ) : (
                                        <>
                                            {isRu ? 'Подтвердить' : 'Təsdiqlə'}
                                            <CheckCircle size={18} />
                                        </>
                                    )}
                                </button>
                            ) : (
                                <button
                                    onClick={() => {
                                        if (step === 'reason' && selectedReason) setStep('date');
                                        else if (step === 'date' && selectedDate) setStep('time');
                                        else if (step === 'time' && selectedTime) setStep('confirm');
                                    }}
                                    disabled={
                                        (step === 'reason' && !selectedReason) ||
                                        (step === 'date' && !selectedDate) ||
                                        (step === 'time' && !selectedTime)
                                    }
                                    className="px-6 py-3 bg-[#0F766E] text-white font-bold rounded-xl hover:bg-[#134E4A] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isRu ? 'Далее' : 'Növbəti'}
                                </button>
                            )}
                        </div>
                    )}

                    {step === 'success' && (
                        <div className="p-6 border-t border-slate-100">
                            <button
                                onClick={resetAndClose}
                                className="w-full py-3 bg-[#0F766E] text-white font-bold rounded-xl hover:bg-[#134E4A] transition-all"
                            >
                                {isRu ? 'Готово' : 'Bağla'}
                            </button>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
