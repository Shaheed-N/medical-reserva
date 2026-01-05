import { supabase } from './supabase';
import type { Doctor, DoctorSchedule, DoctorScheduleOverride, TimeSlot } from '@/types';
import { format, addMinutes, parse, isWithinInterval, parseISO } from 'date-fns';

export const doctorService = {
    /**
     * Get doctors for a branch
     */
    getDoctorsByBranch: async (branchId: string): Promise<Doctor[]> => {
        const { data, error } = await supabase
            .from('doctor_branch_assignments')
            .select(`
        *,
        doctor:doctors (
          *,
          user:users (id, full_name, avatar_url, email)
        )
      `)
            .eq('branch_id', branchId)
            .eq('is_active', true);

        if (error) throw error;
        return data?.map((d) => d.doctor) || [];
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
          branch:branches (id, name, slug, hospital:hospitals(id, name, slug)),
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
     * Get doctor by user ID
     */
    getDoctorByUserId: async (userId: string): Promise<Doctor | null> => {
        const { data, error } = await supabase
            .from('doctors')
            .select(`
        *,
        user:users (id, full_name, avatar_url, email)
      `)
            .eq('user_id', userId)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return data;
    },

    /**
     * Search doctors by specialty or name
     */
    searchDoctors: async (query: string, branchId?: string) => {
        let queryBuilder = supabase
            .from('doctors')
            .select(`
        *,
        user:users (id, full_name, avatar_url),
        branch_assignments:doctor_branch_assignments (
          branch:branches (id, name)
        )
      `)
            .eq('is_accepting_patients', true);

        if (query) {
            queryBuilder = queryBuilder.or(`
        specialties.cs.{${query}},
        user.full_name.ilike.%${query}%
      `);
        }

        const { data, error } = await queryBuilder.limit(20);

        if (error) throw error;
        return data || [];
    },

    /**
     * Get doctor schedule
     */
    getSchedule: async (doctorId: string, branchId: string): Promise<DoctorSchedule[]> => {
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
     * Get schedule overrides for a date range
     */
    getScheduleOverrides: async (
        doctorId: string,
        branchId: string,
        startDate: string,
        endDate: string
    ): Promise<DoctorScheduleOverride[]> => {
        const { data, error } = await supabase
            .from('doctor_schedule_overrides')
            .select('*')
            .eq('doctor_id', doctorId)
            .eq('branch_id', branchId)
            .gte('override_date', startDate)
            .lte('override_date', endDate);

        if (error) throw error;
        return data || [];
    },

    /**
     * Get available time slots for a doctor on a specific date
     */
    getAvailableSlots: async (
        doctorId: string,
        branchId: string,
        date: string,
        serviceId: string
    ): Promise<TimeSlot[]> => {
        // Get service duration
        const { data: service } = await supabase
            .from('services')
            .select('duration_minutes')
            .eq('id', serviceId)
            .single();

        const slotDuration = service?.duration_minutes || 30;

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
     * Update doctor schedule
     */
    updateSchedule: async (
        doctorId: string,
        branchId: string,
        schedules: Partial<DoctorSchedule>[]
    ): Promise<DoctorSchedule[]> => {
        // Delete existing schedules
        await supabase
            .from('doctor_schedules')
            .delete()
            .eq('doctor_id', doctorId)
            .eq('branch_id', branchId);

        // Insert new schedules
        const { data, error } = await supabase
            .from('doctor_schedules')
            .insert(
                schedules.map((s) => ({
                    ...s,
                    doctor_id: doctorId,
                    branch_id: branchId,
                }))
            )
            .select();

        if (error) throw error;
        return data;
    },

    /**
     * Add schedule override (day off, special hours)
     */
    addScheduleOverride: async (
        override: Partial<DoctorScheduleOverride>
    ): Promise<DoctorScheduleOverride> => {
        const { data, error } = await supabase
            .from('doctor_schedule_overrides')
            .upsert(override, { onConflict: 'doctor_id,branch_id,override_date' })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Update doctor profile
     */
    updateDoctor: async (id: string, updates: Partial<Doctor>): Promise<Doctor> => {
        const { data, error } = await supabase
            .from('doctors')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },
};

export default doctorService;
