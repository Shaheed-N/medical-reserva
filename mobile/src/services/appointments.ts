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
    cancellation_reason?: string;
    cancelled_by?: string;
    cancelled_at?: string;
    checked_in_at?: string;
    completed_at?: string;
    price?: number;
    currency: string;
    is_paid: boolean;
    created_at: string;
    updated_at: string;
    // Joined fields
    patient?: any;
    doctor?: any;
    service?: any;
    branch?: any;
}

export interface BookAppointmentData {
    patient_id: string;
    doctor_id: string;
    service_id: string;
    branch_id: string;
    scheduled_date: string;
    start_time: string;
    end_time: string;
    duration_minutes: number;
    notes?: string;
}

export const appointmentService = {
    /**
     * Book a new appointment
     */
    bookAppointment: async (data: BookAppointmentData): Promise<Appointment> => {
        // Generate appointment number
        const year = new Date().getFullYear();
        const { count } = await supabase
            .from('appointments')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', `${year}-01-01`);

        const appointmentNumber = `MEDPLUS-${year}-${String((count || 0) + 1).padStart(5, '0')}`;

        const { data: appointment, error } = await supabase
            .from('appointments')
            .insert({
                ...data,
                appointment_number: appointmentNumber,
                status: 'pending',
                booking_type: 'online',
                currency: 'AZN',
            })
            .select(`
        *,
        patient:users!appointments_patient_id_fkey (id, full_name, phone),
        doctor:doctors (*, user:users(id, full_name, avatar_url)),
        service:services (id, name, duration_minutes),
        branch:branches (id, name, hospital:hospitals(id, name, logo_url))
      `)
            .single();

        if (error) {
            if (error.code === '23505') {
                throw new Error('This time slot is no longer available. Please select another time.');
            }
            throw error;
        }

        // Log the creation
        await supabase.from('appointment_logs').insert({
            appointment_id: appointment.id,
            action: 'created',
            new_data: appointment,
            performed_by: data.patient_id,
        });

        return appointment;
    },

    /**
     * Get patient's upcoming appointments
     */
    getUpcomingAppointments: async (patientId: string): Promise<Appointment[]> => {
        const today = format(new Date(), 'yyyy-MM-dd');

        const { data, error } = await supabase
            .from('appointments')
            .select(`
        *,
        doctor:doctors (id, user:users(id, full_name, avatar_url), specialties),
        service:services (id, name),
        branch:branches (id, name, address_line1, city, hospital:hospitals(id, name, logo_url))
      `)
            .eq('patient_id', patientId)
            .gte('scheduled_date', today)
            .not('status', 'in', '("cancelled","no_show","completed")')
            .order('scheduled_date')
            .order('start_time')
            .limit(20);

        if (error) throw error;
        return data || [];
    },

    /**
     * Get patient's past appointments
     */
    getPastAppointments: async (
        patientId: string,
        page = 1,
        limit = 10
    ) => {
        const offset = (page - 1) * limit;

        const { data, error, count } = await supabase
            .from('appointments')
            .select(`
        *,
        doctor:doctors (id, user:users(id, full_name, avatar_url), specialties),
        service:services (id, name),
        branch:branches (id, name, hospital:hospitals(id, name))
      `, { count: 'exact' })
            .eq('patient_id', patientId)
            .in('status', ['completed', 'cancelled', 'no_show'])
            .order('scheduled_date', { ascending: false })
            .range(offset, offset + limit - 1);

        if (error) throw error;

        return {
            data: data || [],
            count: count || 0,
            page,
            limit,
            total_pages: Math.ceil((count || 0) / limit),
        };
    },

    /**
     * Get single appointment by ID
     */
    getAppointment: async (id: string): Promise<Appointment> => {
        const { data, error } = await supabase
            .from('appointments')
            .select(`
        *,
        patient:users!appointments_patient_id_fkey (*),
        doctor:doctors (*, user:users(*)),
        service:services (*),
        branch:branches (*, hospital:hospitals(*)),
        notes:appointment_notes (*)
      `)
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Cancel appointment
     */
    cancelAppointment: async (
        id: string,
        cancelledBy: string,
        reason?: string
    ): Promise<Appointment> => {
        // Get current appointment for logging
        const { data: current } = await supabase
            .from('appointments')
            .select('*')
            .eq('id', id)
            .single();

        const { data, error } = await supabase
            .from('appointments')
            .update({
                status: 'cancelled',
                cancellation_reason: reason,
                cancelled_by: cancelledBy,
                cancelled_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        // Log the cancellation
        await supabase.from('appointment_logs').insert({
            appointment_id: id,
            action: 'cancelled',
            previous_data: { status: current?.status },
            new_data: { status: 'cancelled', reason },
            performed_by: cancelledBy,
        });

        return data;
    },

    /**
     * Reschedule appointment
     */
    rescheduleAppointment: async (
        id: string,
        newDate: string,
        newStartTime: string,
        newEndTime: string,
        performedBy: string
    ): Promise<Appointment> => {
        // Get current appointment
        const { data: current } = await supabase
            .from('appointments')
            .select('*')
            .eq('id', id)
            .single();

        const { data, error } = await supabase
            .from('appointments')
            .update({
                scheduled_date: newDate,
                start_time: newStartTime,
                end_time: newEndTime,
                status: 'pending',
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            if (error.code === '23505') {
                throw new Error('The new time slot is not available.');
            }
            throw error;
        }

        // Log the reschedule
        await supabase.from('appointment_logs').insert({
            appointment_id: id,
            action: 'rescheduled',
            previous_data: {
                scheduled_date: current?.scheduled_date,
                start_time: current?.start_time,
            },
            new_data: {
                scheduled_date: newDate,
                start_time: newStartTime,
            },
            performed_by: performedBy,
        });

        return data;
    },

    // ========== PROVIDER SIDE ==========

    /**
     * Get today's appointments for a doctor
     */
    getDoctorTodaysAppointments: async (doctorId: string): Promise<Appointment[]> => {
        const today = format(new Date(), 'yyyy-MM-dd');

        const { data, error } = await supabase
            .from('appointments')
            .select(`
        *,
        patient:users!appointments_patient_id_fkey (id, full_name, phone, avatar_url),
        service:services (id, name)
      `)
            .eq('doctor_id', doctorId)
            .eq('scheduled_date', today)
            .not('status', 'in', '("cancelled","no_show")')
            .order('start_time');

        if (error) throw error;
        return data || [];
    },

    /**
     * Get upcoming appointments for a doctor
     */
    getDoctorUpcomingAppointments: async (doctorId: string, limit = 20): Promise<Appointment[]> => {
        const today = format(new Date(), 'yyyy-MM-dd');

        const { data, error } = await supabase
            .from('appointments')
            .select(`
        *,
        patient:users!appointments_patient_id_fkey (id, full_name, phone, avatar_url),
        service:services (id, name)
      `)
            .eq('doctor_id', doctorId)
            .gte('scheduled_date', today)
            .not('status', 'in', '("cancelled","no_show","completed")')
            .order('scheduled_date')
            .order('start_time')
            .limit(limit);

        if (error) throw error;
        return data || [];
    },

    /**
     * Get pending appointment requests for a doctor
     */
    getPendingRequests: async (doctorId: string): Promise<Appointment[]> => {
        const { data, error } = await supabase
            .from('appointments')
            .select(`
        *,
        patient:users!appointments_patient_id_fkey (id, full_name, phone, avatar_url),
        service:services (id, name)
      `)
            .eq('doctor_id', doctorId)
            .eq('status', 'pending')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    /**
     * Accept appointment request
     */
    acceptAppointment: async (id: string, doctorId: string): Promise<Appointment> => {
        const { data, error } = await supabase
            .from('appointments')
            .update({
                status: 'confirmed',
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        // Log the action
        await supabase.from('appointment_logs').insert({
            appointment_id: id,
            action: 'confirmed',
            new_data: { status: 'confirmed' },
            performed_by: doctorId,
        });

        return data;
    },

    /**
     * Reject appointment request
     */
    rejectAppointment: async (id: string, doctorId: string, reason?: string): Promise<Appointment> => {
        const { data, error } = await supabase
            .from('appointments')
            .update({
                status: 'cancelled',
                cancellation_reason: reason || 'Rejected by doctor',
                cancelled_by: doctorId,
                cancelled_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        // Log the action
        await supabase.from('appointment_logs').insert({
            appointment_id: id,
            action: 'rejected',
            new_data: { status: 'cancelled', reason },
            performed_by: doctorId,
        });

        return data;
    },

    /**
     * Mark appointment as completed
     */
    completeAppointment: async (id: string, doctorId: string): Promise<Appointment> => {
        const { data, error } = await supabase
            .from('appointments')
            .update({
                status: 'completed',
                completed_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        // Log the action
        await supabase.from('appointment_logs').insert({
            appointment_id: id,
            action: 'completed',
            new_data: { status: 'completed' },
            performed_by: doctorId,
        });

        return data;
    },

    /**
     * Get doctor's appointment statistics
     */
    getDoctorStats: async (doctorId: string) => {
        const today = format(new Date(), 'yyyy-MM-dd');

        // Total appointments
        const { count: totalAppointments } = await supabase
            .from('appointments')
            .select('*', { count: 'exact', head: true })
            .eq('doctor_id', doctorId);

        // Today's appointments
        const { count: todayAppointments } = await supabase
            .from('appointments')
            .select('*', { count: 'exact', head: true })
            .eq('doctor_id', doctorId)
            .eq('scheduled_date', today)
            .not('status', 'in', '("cancelled","no_show")');

        // Completed today
        const { count: completedToday } = await supabase
            .from('appointments')
            .select('*', { count: 'exact', head: true })
            .eq('doctor_id', doctorId)
            .eq('scheduled_date', today)
            .eq('status', 'completed');

        // Pending requests
        const { count: pendingRequests } = await supabase
            .from('appointments')
            .select('*', { count: 'exact', head: true })
            .eq('doctor_id', doctorId)
            .eq('status', 'pending');

        // Unique patients
        const { data: uniquePatients } = await supabase
            .from('appointments')
            .select('patient_id')
            .eq('doctor_id', doctorId);

        const uniquePatientCount = new Set(uniquePatients?.map(a => a.patient_id)).size;

        return {
            totalAppointments: totalAppointments || 0,
            todayAppointments: todayAppointments || 0,
            completedToday: completedToday || 0,
            pendingRequests: pendingRequests || 0,
            totalPatients: uniquePatientCount,
        };
    },
};

export default appointmentService;
