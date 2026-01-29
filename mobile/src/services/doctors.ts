import { supabase } from './supabase';
import { format, addMinutes, parse } from 'date-fns';

export interface Doctor {
    id: string;
    user_id: string;
    branch_id?: string;
    title?: string;
    specialties: string[];
    qualifications: string[];
    education?: string[];
    bio?: string;
    years_of_experience?: number;
    license_number?: string;
    consultation_fee?: number;
    currency: string;
    languages: string[];
    is_accepting_patients: boolean;
    created_at: string;
    updated_at: string;
    user?: {
        id: string;
        full_name: string;
        avatar_url?: string;
        email?: string;
        phone?: string;
    };
    branch?: {
        id: string;
        name: string;
        address?: string;
        hospital?: {
            id: string;
            name: string;
        };
    };
    rating?: number;
    review_count?: number;
}

export interface Schedule {
    id: string;
    doctor_id: string;
    branch_id: string;
    day_of_week: number;
    start_time: string;
    end_time: string;
    slot_duration_minutes: number;
    is_working: boolean;
    is_active: boolean;
}

export interface TimeSlot {
    start_time: string;
    end_time: string;
    is_available: boolean;
    appointment_id?: string;
}

export interface SearchDoctorsParams {
    query?: string;
    specialty?: string;
    location?: string;
    rating?: number;
    page?: number;
    limit?: number;
}
export const doctorService = {
    /**
     * Get doctor profile (alias for getDoctor)
     */
    getDoctorProfile: async (id: string): Promise<Doctor> => {
        const { data, error } = await supabase
            .from('doctors')
            .select(`
        *,
        user:users (id, full_name, avatar_url, email, phone),
        branch_assignments:doctor_branch_assignments (
          *,
          branch:branches (id, name, slug, city, address_line1, hospital:hospitals(id, name, slug, logo_url)),
          department:departments (id, name)
        ),
        services:doctor_services (
          *,
          service:services (id, name, duration_minutes, base_price)
        )
      `)
            .eq('id', id)
            .single();

        if (error) throw error;

        // Extract branch from branch_assignments
        const branch = data?.branch_assignments?.[0]?.branch;
        return { ...data, branch, branch_id: branch?.id } as Doctor;
    },

    /**
     * Get doctor schedule
     */
    getDoctorSchedule: async (doctorId: string): Promise<Schedule[]> => {
        const { data, error } = await supabase
            .from('doctor_schedules')
            .select('*')
            .eq('doctor_id', doctorId)
            .eq('is_active', true)
            .order('day_of_week');

        if (error) throw error;
        return (data || []).map(s => ({
            ...s,
            is_working: s.is_active,
        }));
    },

    /**
     * Get doctor by user ID
     */
    getDoctorByUserId: async (userId: string): Promise<Doctor | null> => {
        const { data, error } = await supabase
            .from('doctors')
            .select(`
        *,
        user:users (id, full_name, avatar_url, email, phone)
      `)
            .eq('user_id', userId)
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null; // Not found
            throw error;
        }
        return data;
    },

    /**
     * Search doctors with filters
     */
    searchDoctors: async (params: SearchDoctorsParams) => {
        const { query, specialty, location, rating, page = 1, limit = 20 } = params;
        const offset = (page - 1) * limit;

        let queryBuilder = supabase
            .from('doctors')
            .select(`
        *,
        user:users (id, full_name, avatar_url, email, phone),
        branch_assignments:doctor_branch_assignments (
          branch:branches (id, name, city, address_line1)
        )
      `, { count: 'exact' })
            .eq('is_accepting_patients', true);

        if (specialty) {
            queryBuilder = queryBuilder.contains('specialties', [specialty]);
        }

        const { data, error, count } = await queryBuilder
            .range(offset, offset + limit - 1)
            .order('years_of_experience', { ascending: false });

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
     * Get doctor by ID
     */
    getDoctor: async (id: string): Promise<Doctor> => {
        const { data, error } = await supabase
            .from('doctors')
            .select(`
        *,
        user:users (id, full_name, avatar_url, email, phone),
        branch_assignments:doctor_branch_assignments (
          *,
          branch:branches (id, name, slug, city, address_line1, hospital:hospitals(id, name, slug, logo_url)),
          department:departments (id, name)
        ),
        services:doctor_services (
          *,
          service:services (id, name, duration_minutes, base_price)
        )
      `)
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Get doctors by branch
     */
    getDoctorsByBranch: async (branchId: string): Promise<Doctor[]> => {
        const { data, error } = await supabase
            .from('doctor_branch_assignments')
            .select(`
        *,
        doctor:doctors (
          *,
          user:users (id, full_name, avatar_url)
        )
      `)
            .eq('branch_id', branchId)
            .eq('is_active', true);

        if (error) throw error;
        return data?.map((d) => d.doctor) || [];
    },

    /**
     * Get doctor schedule
     */
    getSchedule: async (doctorId: string, branchId: string) => {
        const { data, error } = await supabase
            .from('doctor_schedules')
            .select('*')
            .eq('doctor_id', doctorId)
            .eq('branch_id', branchId)
            .eq('is_active', true)
            .order('day_of_week');

        if (error) throw error;
        return data || [];
    },

    /**
     * Get available time slots for a doctor on a specific date
     */
    getAvailableSlots: async (
        doctorId: string,
        date: string,
        branchId?: string,
        serviceId?: string
    ): Promise<TimeSlot[]> => {
        // Get service duration (default 30 minutes if no service specified)
        let slotDuration = 30;
        if (serviceId) {
            const { data: service } = await supabase
                .from('services')
                .select('duration_minutes')
                .eq('id', serviceId)
                .single();
            slotDuration = service?.duration_minutes || 30;
        }

        // Get doctor's schedule for this day
        const dayOfWeek = new Date(date).getDay();
        const { data: schedules } = await supabase
            .from('doctor_schedules')
            .select('*')
            .eq('doctor_id', doctorId)
            .eq('branch_id', branchId)
            .eq('day_of_week', dayOfWeek)
            .eq('is_active', true);

        if (!schedules || schedules.length === 0) return [];

        // Check for overrides
        const { data: overrides } = await supabase
            .from('doctor_schedule_overrides')
            .select('*')
            .eq('doctor_id', doctorId)
            .eq('branch_id', branchId)
            .eq('override_date', date);

        const override = overrides?.[0];
        if (override && !override.is_available) return [];

        // Get existing appointments
        const { data: appointments } = await supabase
            .from('appointments')
            .select('start_time, end_time, id')
            .eq('doctor_id', doctorId)
            .eq('scheduled_date', date)
            .not('status', 'in', '("cancelled","no_show")');

        const bookedSlots = appointments || [];

        // Generate available slots
        const slots: TimeSlot[] = [];

        for (const schedule of schedules) {
            const startTime = override?.start_time || schedule.start_time;
            const endTime = override?.end_time || schedule.end_time;

            let currentTime = parse(startTime, 'HH:mm:ss', new Date());
            const scheduleEnd = parse(endTime, 'HH:mm:ss', new Date());

            while (currentTime < scheduleEnd) {
                const slotEnd = addMinutes(currentTime, slotDuration);

                if (slotEnd > scheduleEnd) break;

                const slotStartStr = format(currentTime, 'HH:mm:ss');
                const slotEndStr = format(slotEnd, 'HH:mm:ss');

                // Check if slot is already booked
                const isBooked = bookedSlots.some((apt) => {
                    const aptStart = apt.start_time;
                    const aptEnd = apt.end_time;
                    return (
                        (slotStartStr >= aptStart && slotStartStr < aptEnd) ||
                        (slotEndStr > aptStart && slotEndStr <= aptEnd)
                    );
                });

                const bookedApt = bookedSlots.find((apt) => apt.start_time === slotStartStr);

                slots.push({
                    start_time: slotStartStr,
                    end_time: slotEndStr,
                    is_available: !isBooked,
                    appointment_id: bookedApt?.id,
                });

                currentTime = slotEnd;
            }
        }

        return slots;
    },

    /**
     * Get popular doctors
     */
    getPopularDoctors: async (limit = 10): Promise<Doctor[]> => {
        const { data, error } = await supabase
            .from('doctors')
            .select(`
        *,
        user:users (id, full_name, avatar_url)
      `)
            .eq('is_accepting_patients', true)
            .order('years_of_experience', { ascending: false })
            .limit(limit);

        if (error) throw error;
        return data || [];
    },

    /**
     * Get doctor reviews
     */
    getDoctorReviews: async (doctorId: string, page = 1, limit = 10) => {
        const offset = (page - 1) * limit;

        const { data, error, count } = await supabase
            .from('reviews')
            .select(`
        *,
        patient:users (id, full_name, avatar_url)
      `, { count: 'exact' })
            .eq('doctor_id', doctorId)
            .order('created_at', { ascending: false })
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
     * Submit a review
     */
    submitReview: async (
        doctorId: string,
        patientId: string,
        appointmentId: string,
        rating: number,
        comment: string
    ) => {
        const { data, error } = await supabase
            .from('reviews')
            .insert({
                doctor_id: doctorId,
                patient_id: patientId,
                appointment_id: appointmentId,
                rating,
                comment,
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    },
};

export default doctorService;
