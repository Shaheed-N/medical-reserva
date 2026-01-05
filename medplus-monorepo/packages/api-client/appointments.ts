import { supabase } from './supabase';
import type {
    Appointment,
    AppointmentStatus,
    AppointmentFilterParams,
    AppointmentLog,
    AppointmentNote,
    PaginatedResponse
} from '@/types';
import { format } from 'date-fns';

export const appointmentService = {
    /**
     * Book a new appointment
     * Uses server-side locking to prevent double bookings
     */
    bookAppointment: async (data: {
        patient_id: string;
        doctor_id: string;
        service_id: string;
        branch_id: string;
        scheduled_date: string;
        start_time: string;
        end_time: string;
        duration_minutes: number;
        notes?: string;
        booking_type?: 'online' | 'phone' | 'walk_in';
        created_by?: string;
    }): Promise<Appointment> => {
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
                booking_type: data.booking_type || 'online',
            })
            .select(`
        *,
        patient:users!appointments_patient_id_fkey (id, full_name, email, phone),
        doctor:doctors (*, user:users(id, full_name)),
        service:services (id, name, duration_minutes),
        branch:branches (id, name, hospital:hospitals(id, name))
      `)
            .single();

        if (error) {
            // Check for unique constraint violation (double booking)
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
            performed_by: data.created_by || data.patient_id,
        });

        return appointment;
    },

    /**
     * Get appointments with filters
     */
    getAppointments: async (
        params: AppointmentFilterParams
    ): Promise<PaginatedResponse<Appointment>> => {
        const {
            branch_id,
            doctor_id,
            patient_id,
            status,
            date_from,
            date_to,
            page = 1,
            limit = 20
        } = params;

        const offset = (page - 1) * limit;

        let query = supabase
            .from('appointments')
            .select(`
        *,
        patient:users!appointments_patient_id_fkey (id, full_name, email, phone, avatar_url),
        doctor:doctors (id, user:users(id, full_name, avatar_url), specialties),
        service:services (id, name, duration_minutes),
        branch:branches (id, name)
      `, { count: 'exact' });

        if (branch_id) query = query.eq('branch_id', branch_id);
        if (doctor_id) query = query.eq('doctor_id', doctor_id);
        if (patient_id) query = query.eq('patient_id', patient_id);
        if (status) {
            if (Array.isArray(status)) {
                query = query.in('status', status);
            } else {
                query = query.eq('status', status);
            }
        }
        if (date_from) query = query.gte('scheduled_date', date_from);
        if (date_to) query = query.lte('scheduled_date', date_to);

        const { data, error, count } = await query
            .order('scheduled_date', { ascending: true })
            .order('start_time', { ascending: true })
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
        notes:appointment_notes (*),
        form_submissions (*, form:forms(*))
      `)
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Get today's appointments for a branch
     */
    getTodaysAppointments: async (branchId: string): Promise<Appointment[]> => {
        const today = format(new Date(), 'yyyy-MM-dd');

        const { data, error } = await supabase
            .from('appointments')
            .select(`
        *,
        patient:users!appointments_patient_id_fkey (id, full_name, phone, avatar_url),
        doctor:doctors (id, user:users(id, full_name, avatar_url)),
        service:services (id, name)
      `)
            .eq('branch_id', branchId)
            .eq('scheduled_date', today)
            .not('status', 'in', '("cancelled","no_show")')
            .order('start_time');

        if (error) throw error;
        return data || [];
    },

    /**
     * Update appointment status
     */
    updateStatus: async (
        id: string,
        status: AppointmentStatus,
        performedBy: string,
        additionalData?: Partial<Appointment>
    ): Promise<Appointment> => {
        // Get current appointment for logging
        const { data: current } = await supabase
            .from('appointments')
            .select('*')
            .eq('id', id)
            .single();

        const updates: Partial<Appointment> = {
            status,
            updated_at: new Date().toISOString(),
            ...additionalData,
        };

        // Add timestamps based on status
        if (status === 'checked_in') {
            updates.checked_in_at = new Date().toISOString();
            updates.checked_in_by = performedBy;
        } else if (status === 'completed') {
            updates.completed_at = new Date().toISOString();
        } else if (status === 'cancelled') {
            updates.cancelled_at = new Date().toISOString();
            updates.cancelled_by = performedBy;
        }

        const { data, error } = await supabase
            .from('appointments')
            .update(updates)
            .eq('id', id)
            .select(`
        *,
        patient:users!appointments_patient_id_fkey (id, full_name, email),
        doctor:doctors (id, user:users(id, full_name)),
        service:services (id, name)
      `)
            .single();

        if (error) throw error;

        // Log the status change
        await supabase.from('appointment_logs').insert({
            appointment_id: id,
            action: 'status_changed',
            previous_data: { status: current?.status },
            new_data: { status },
            performed_by: performedBy,
        });

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
        return appointmentService.updateStatus(id, 'cancelled', cancelledBy, {
            cancellation_reason: reason,
        });
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

    /**
     * Add note to appointment
     */
    addNote: async (note: Partial<AppointmentNote>): Promise<AppointmentNote> => {
        const { data, error } = await supabase
            .from('appointment_notes')
            .insert(note)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Get appointment logs
     */
    getLogs: async (appointmentId: string): Promise<AppointmentLog[]> => {
        const { data, error } = await supabase
            .from('appointment_logs')
            .select(`
        *,
        performer:users!appointment_logs_performed_by_fkey (id, full_name)
      `)
            .eq('appointment_id', appointmentId)
            .order('performed_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    /**
     * Get patient's upcoming appointments
     */
    getPatientUpcoming: async (patientId: string): Promise<Appointment[]> => {
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
            .limit(10);

        if (error) throw error;
        return data || [];
    },

    /**
     * Get patient's appointment history
     */
    getPatientHistory: async (
        patientId: string,
        page = 1,
        limit = 10
    ): Promise<PaginatedResponse<Appointment>> => {
        const offset = (page - 1) * limit;

        const { data, error, count } = await supabase
            .from('appointments')
            .select(`
        *,
        doctor:doctors (id, user:users(id, full_name, avatar_url)),
        service:services (id, name),
        branch:branches (id, name, hospital:hospitals(id, name))
      `, { count: 'exact' })
            .eq('patient_id', patientId)
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
};

export default appointmentService;
