'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from './supabase';
import toast from 'react-hot-toast';

// ============================================
// DOCTORS HOOKS
// ============================================

export interface Doctor {
    id: string;
    name: string;
    specialty: string;
    specialtyLabel: string;
    hospital: string;
    hospitalId: string;
    experience: number;
    rating: number;
    image: string;
    availability: string;
    isVerified: boolean;
}

export function useDoctors(filters?: {
    specialty?: string;
    hospitalId?: string;
    search?: string;
    limit?: number;
}) {
    return useQuery({
        queryKey: ['doctors', filters],
        queryFn: async () => {
            let selectStr = `
                id,
                title,
                specialties,
                bio,
                years_of_experience,
                consultation_fee,
                is_accepting_patients,
                user:users!inner(id, full_name, avatar_url),
                branches:doctor_branch_assignments(
                    branch:branches(id, name, hospital:hospitals(id, name))
                )
            `;

            let query = supabase
                .from('doctors')
                .select(selectStr)
                .eq('is_accepting_patients', true);

            if (filters?.hospitalId) {
                // To filter by hospital, we need to join doctor_branch_assignments and branches
                const { data: doctorIds } = await supabase
                    .from('doctor_branch_assignments')
                    .select('doctor_id, branch:branches!inner(hospital_id)')
                    .eq('branch.hospital_id', filters.hospitalId);

                if (doctorIds) {
                    const ids = doctorIds.map(d => d.doctor_id);
                    query = query.in('id', ids);
                }
            }

            if (filters?.specialty && filters.specialty !== 'all') {
                query = query.contains('specialties', [filters.specialty]);
            }

            if (filters?.search) {
                query = query.or(`title.ilike.%${filters.search}%,bio.ilike.%${filters.search}%`);
            }

            if (filters?.limit) {
                query = query.limit(filters.limit);
            }

            const { data, error } = await query;

            if (error) throw error;
            return data;
        },
        staleTime: 5 * 60 * 1000,
    });
}

export function useDoctor(doctorId: string) {
    return useQuery({
        queryKey: ['doctor', doctorId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('doctors')
                .select(`
                    *,
                    user:users!inner(*),
                    schedules:doctor_schedules(*),
                    services:doctor_services(
                        service:services(*)
                    ),
                    branches:doctor_branch_assignments(
                        branch:branches(*, hospital:hospitals(*))
                    )
                `)
                .eq('id', doctorId)
                .single();

            if (error) throw error;
            return data;
        },
        enabled: !!doctorId,
    });
}

// ============================================
// HOSPITALS HOOKS
// ============================================

export interface Hospital {
    id: string;
    name: string;
    city: string;
    address: string;
    phone: string;
    rating: number;
    departments: number;
    image: string;
}

export function useHospitals(filters?: {
    city?: string;
    search?: string;
    limit?: number;
}) {
    return useQuery({
        queryKey: ['hospitals', filters],
        queryFn: async () => {
            let query = supabase
                .from('hospitals')
                .select(`
                    id,
                    name,
                    slug,
                    type,
                    description,
                    logo_url,
                    cover_image_url,
                    contact_phone,
                    is_active,
                    branches(id, city, address_line1)
                `)
                .eq('is_active', true);

            if (filters?.limit) {
                query = query.limit(filters.limit);
            }

            const { data, error } = await query;

            if (error) throw error;
            return data;
        },
        staleTime: 10 * 60 * 1000, // 10 minutes
    });
}

export function useHospital(hospitalId: string) {
    return useQuery({
        queryKey: ['hospital', hospitalId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('hospitals')
                .select(`
                    *,
                    branches(
                        *,
                        departments(*)
                    )
                `)
                .eq('id', hospitalId)
                .single();

            if (error) throw error;
            return data;
        },
        enabled: !!hospitalId,
    });
}

// ============================================
// APPOINTMENTS HOOKS
// ============================================

export function useAppointments(patientId: string) {
    return useQuery({
        queryKey: ['appointments', patientId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('appointments')
                .select(`
                    *,
                    doctor:doctors(
                        *,
                        user:users(full_name, avatar_url)
                    ),
                    service:services(*),
                    branch:branches(*, hospital:hospitals(*))
                `)
                .eq('patient_id', patientId)
                .order('scheduled_date', { ascending: true });

            if (error) throw error;
            return data;
        },
        enabled: !!patientId,
    });
}

export function useCreateAppointment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (appointment: {
            doctor_id: string;
            service_id: string;
            branch_id: string;
            scheduled_date: string;
            start_time: string;
            end_time: string;
            patient_id: string;
        }) => {
            // Generate appointment number
            const appointmentNumber = `APT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

            const { data, error } = await supabase
                .from('appointments')
                .insert({
                    ...appointment,
                    appointment_number: appointmentNumber,
                    status: 'pending',
                    duration_minutes: 30,
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['appointments'] });
            toast.success('Qəbul uğurla yaradıldı!');
        },
        onError: (error) => {
            console.error('Error creating appointment:', error);
            toast.error('Qəbul yaradılarkən xəta baş verdi');
        },
    });
}

export function useCancelAppointment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ appointmentId, reason }: { appointmentId: string; reason?: string }) => {
            const { data, error } = await supabase
                .from('appointments')
                .update({
                    status: 'cancelled',
                    cancellation_reason: reason,
                    cancelled_at: new Date().toISOString(),
                })
                .eq('id', appointmentId)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['appointments'] });
            toast.success('Qəbul ləğv edildi');
        },
        onError: (error) => {
            console.error('Error cancelling appointment:', error);
            toast.error('Qəbul ləğv edilərkən xəta baş verdi');
        },
    });
}

// ============================================
// SERVICES HOOKS
// ============================================

export function useServices(departmentId?: string) {
    return useQuery({
        queryKey: ['services', departmentId],
        queryFn: async () => {
            let query = supabase
                .from('services')
                .select('*')
                .eq('is_active', true);

            if (departmentId) {
                query = query.eq('department_id', departmentId);
            }

            const { data, error } = await query;

            if (error) throw error;
            return data;
        },
        staleTime: 10 * 60 * 1000,
    });
}

// ============================================
// AVAILABLE SLOTS HOOKS
// ============================================

export function useAvailableSlots(doctorId: string, branchId: string, date: string) {
    return useQuery({
        queryKey: ['availableSlots', doctorId, branchId, date],
        queryFn: async () => {
            // Get doctor's schedule for the day
            const dayOfWeek = new Date(date).getDay();

            const { data: schedules, error: scheduleError } = await supabase
                .from('doctor_schedules')
                .select('*')
                .eq('doctor_id', doctorId)
                .eq('branch_id', branchId)
                .eq('day_of_week', dayOfWeek)
                .eq('is_active', true);

            if (scheduleError) throw scheduleError;

            // Get existing appointments for the date
            const { data: appointments, error: appointmentsError } = await supabase
                .from('appointments')
                .select('start_time, end_time')
                .eq('doctor_id', doctorId)
                .eq('scheduled_date', date)
                .neq('status', 'cancelled');

            if (appointmentsError) throw appointmentsError;

            // Calculate available slots
            const bookedTimes = new Set(appointments?.map(a => a.start_time) || []);
            const slots: string[] = [];

            schedules?.forEach(schedule => {
                const slotDuration = schedule.slot_duration_minutes;
                let currentTime = schedule.start_time;

                while (currentTime < schedule.end_time) {
                    if (!bookedTimes.has(currentTime)) {
                        slots.push(currentTime);
                    }
                    // Add slot duration to current time
                    const [hours, minutes] = currentTime.split(':').map(Number);
                    const totalMinutes = hours * 60 + minutes + slotDuration;
                    const newHours = Math.floor(totalMinutes / 60);
                    const newMinutes = totalMinutes % 60;
                    currentTime = `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
                }
            });

            return slots;
        },
        enabled: !!doctorId && !!branchId && !!date,
        staleTime: 1 * 60 * 1000, // 1 minute - slots change frequently
    });
}
