import { supabase } from './supabase';
import { format } from 'date-fns';

export type AppointmentStatus =
    | 'pending'
    | 'confirmed'
    | 'checked_in'
    | 'in_progress'
    | 'completed'
    | 'cancelled'
    | 'no_show';

export interface Appointment {
    id: string;
    appointment_number: string;
    patient_id: string;
    doctor_id: string;
    service_id: string;
    branch_id: string;
    scheduled_date: string;
    start_time: string;
    end_time: string;
    duration_minutes: number;
    status: AppointmentStatus;
    booking_type: 'online' | 'phone' | 'walk_in';
    notes?: string;
    price?: number;
    currency: string;
    patient?: {
        full_name: string;
        phone: string;
        avatar_url?: string;
    };
    service?: {
        name: string;
    };
}

export const appointmentService = {
    getDoctorAppointments: async (doctorId: string, statusTab: 'active' | 'history'): Promise<Appointment[]> => {
        let query = supabase
            .from('appointments')
            .select(`
                *,
                patient:users!appointments_patient_id_fkey (id, full_name, phone, avatar_url),
                service:services (id, name)
            `)
            .eq('doctor_id', doctorId);

        if (statusTab === 'active') {
            query = query.not('status', 'in', '("completed","cancelled","no_show")');
        } else {
            query = query.in('status', ['completed', 'cancelled', 'no_show']);
        }

        const { data, error } = await query.order('scheduled_date', { ascending: statusTab === 'active' })
            .order('start_time', { ascending: statusTab === 'active' });

        if (error) throw error;
        return data || [];
    },

    getDoctorStats: async (doctorId: string) => {
        const today = format(new Date(), 'yyyy-MM-dd');

        const { count: pending } = await supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('doctor_id', doctorId).eq('status', 'pending');
        const { count: total } = await supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('doctor_id', doctorId).eq('scheduled_date', today);
        const { count: done } = await supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('doctor_id', doctorId).eq('scheduled_date', today).eq('status', 'completed');

        return {
            pending: pending || 0,
            total: total || 0,
            done: done || 0
        };
    }
};
