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
            let query = supabase
                .from('doctors')
                .select(`
                    id,
                    title,
                    specialties,
                    bio,
                    years_of_experience,
                    consultation_fee,
                    is_accepting_patients,
                    user:users(id, full_name, avatar_url, email, phone),
                    branches:doctor_branch_assignments(
                        branch:branches(id, name, hospital:hospitals(id, name))
                    )
                `);

            if (filters?.hospitalId) {
                const { data: dba } = await supabase
                    .from('doctor_branch_assignments')
                    .select('doctor_id, branch:branches!inner(hospital_id)')
                    .eq('branch.hospital_id', filters.hospitalId);

                if (dba && dba.length > 0) {
                    const ids = dba.map(item => item.doctor_id);
                    query = query.in('id', ids);
                } else {
                    return [];
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

            if (error) {
                console.error('Fetch doctors error:', error);
                throw error;
            }

            return data || [];
        },
        staleTime: 5 * 60 * 1000,
    });
}

export function useDoctorProfile() {
    return useQuery({
        queryKey: ['doctor-profile'],
        queryFn: async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

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
                .eq('user_id', user.id)
                .single();

            if (error) throw error;
            return data;
        },
    });
}

export function useDoctor(doctorIdOrId: string) {
    return useQuery({
        queryKey: ['doctor', doctorIdOrId],
        queryFn: async () => {
            const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(doctorIdOrId);

            let query = supabase
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
                    ),
                    insurances:doctor_insurance(
                        company:insurance_companies(*)
                    ),
                    reviews:reviews(
                        id, rating, comment, created_at, patient:users(full_name, avatar_url)
                    ),
                    visit_reasons:doctor_visit_reasons(*)
                `);

            if (isUUID) {
                query = query.eq('id', doctorIdOrId);
            } else {
                query = query.eq('id', doctorIdOrId);
            }

            const { data, error } = await query.single();

            if (error) {
                console.error("Error fetching doctor:", error);
                throw error;
            }
            return data;
        },
        enabled: !!doctorIdOrId,
    });
}

export function useUpdateDoctorProfile() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (updates: any) => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const { data, error } = await supabase
                .from('doctors')
                .update(updates)
                .eq('user_id', user.id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['doctor-profile'] });
            toast.success('Profil yeniləndi');
        },
        onError: (error) => {
            console.error('Error updating doctor profile:', error);
            toast.error('Profil yenilənərkən xəta baş verdi');
        },
    });
}

export function useDoctorAvailability(doctorId: string) {
    return useQuery({
        queryKey: ['doctor-availability', doctorId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('doctor_availability')
                .select('*')
                .eq('doctor_id', doctorId);

            if (error) throw error;
            return data;
        },
        enabled: !!doctorId,
    });
}

export function useUpdateDoctorAvailability() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ doctorId, schedule }: { doctorId: string; schedule: any[] }) => {
            const { error } = await supabase
                .from('doctor_availability')
                .upsert(
                    schedule.map((s) => ({
                        doctor_id: doctorId,
                        ...s,
                    })),
                    { onConflict: 'doctor_id,day_of_week' }
                );

            if (error) throw error;
        },
        onSuccess: (_, { doctorId }) => {
            queryClient.invalidateQueries({ queryKey: ['doctor-availability', doctorId] });
            toast.success('Təqvim yeniləndi');
        },
        onError: (error) => {
            console.error('Error updating availability:', error);
            toast.error('Təqvim yenilənərkən xəta baş verdi');
        },
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

export function useHospital(hospitalIdOrSlug: string) {
    return useQuery({
        queryKey: ['hospital', hospitalIdOrSlug],
        queryFn: async () => {
            // Try to find by ID first, then by slug
            let query = supabase
                .from('hospitals')
                .select(`
                    *,
                    branches(
                        *,
                        departments(*)
                    )
                `);

            // Check if it's a UUID (ID) or a slug
            const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(hospitalIdOrSlug);

            if (isUUID) {
                query = query.eq('id', hospitalIdOrSlug);
            } else {
                query = query.eq('slug', hospitalIdOrSlug);
            }

            const { data, error } = await query.single();

            if (error) throw error;
            return data;
        },
        enabled: !!hospitalIdOrSlug,
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

export function useDoctorAppointments(doctorId: string) {
    return useQuery({
        queryKey: ['doctor-appointments', doctorId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('appointments')
                .select(`
                    *,
                    patient:users!public_appointments_patient_id_fkey(full_name, avatar_url, phone),
                    visit_reason:doctor_visit_reasons(name, name_az, name_ru),
                    branch:branches(*, hospital:hospitals(*))
                `)
                .eq('doctor_id', doctorId)
                .order('scheduled_date', { ascending: false })
                .order('start_time', { ascending: false });

            if (error) throw error;
            return data;
        },
        enabled: !!doctorId,
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
// ============================================
// APPLICATIONS HOOKS
// ============================================

export function useSubmitDoctorApplication() {
    return useMutation({
        mutationFn: async (application: any) => {
            const { data, error } = await supabase
                .from('doctor_applications')
                .insert(application);

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            toast.success('Həkim müraciəti uğurla göndərildi!');
        },
    });
}

export function useSubmitHospitalApplication() {
    return useMutation({
        mutationFn: async (application: any) => {
            console.log('[Hook] Inserting hospital application:', application);
            const { data, error, status, statusText } = await supabase
                .from('hospital_applications')
                .insert(application);

            console.log('[Hook] Supabase insert response:', { data, error, status, statusText });

            if (error) {
                console.error('[Hook] Supabase error:', error.message, error.code, error.details, error.hint);
                throw error;
            }
            return data;
        },
        onSuccess: () => {
            console.log('[Hook] Hospital application submitted successfully!');
            toast.success('Xəstəxana müraciəti uğurla göndərildi!');
        },
        onError: (error: any) => {
            console.error('[Hook] Mutation error:', error);
            toast.error(`Xəta: ${error?.message || 'Unknown'}`);
        },
    });
}

// ============================================
// INSURANCE HOOKS
// ============================================

export function useInsuranceCompanies() {
    return useQuery({
        queryKey: ['insurance-companies'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('insurance_companies')
                .select('*')
                .eq('is_active', true);

            if (error) throw error;
            return data;
        }
    });
}

export function useDoctorInsurance(doctorId: string) {
    return useQuery({
        queryKey: ['doctor-insurance', doctorId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('doctor_insurance')
                .select(`
                    *,
                    insurance:insurance_companies(*)
                `)
                .eq('doctor_id', doctorId);

            if (error) throw error;
            return data;
        },
        enabled: !!doctorId,
    });
}

export function useToggleDoctorInsurance() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ doctorId, insuranceId, action }: { doctorId: string; insuranceId: string; action: 'add' | 'remove' }) => {
            if (action === 'add') {
                const { data, error } = await supabase
                    .from('doctor_insurance')
                    .insert({ doctor_id: doctorId, insurance_id: insuranceId });
                if (error) throw error;
                return data;
            } else {
                const { error } = await supabase
                    .from('doctor_insurance')
                    .delete()
                    .eq('doctor_id', doctorId)
                    .eq('insurance_id', insuranceId);
                if (error) throw error;
                return true;
            }
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['doctor-insurance', variables.doctorId] });
        }
    });
}

// ============================================
// VISIT REASONS HOOKS
// ============================================

export function useDoctorVisitReasons(doctorId: string) {
    return useQuery({
        queryKey: ['visit-reasons', doctorId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('doctor_visit_reasons')
                .select('*')
                .eq('doctor_id', doctorId)
                .order('display_order', { ascending: true });

            if (error) throw error;
            return data;
        },
        enabled: !!doctorId,
    });
}

export function useUpsertVisitReason() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (reason: any) => {
            const { data, error } = await supabase
                .from('doctor_visit_reasons')
                .upsert(reason)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['visit-reasons', data.doctor_id] });
            toast.success('Səbəb yadda saxlanıldı');
        }
    });
}

export function useDeleteVisitReason() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, doctorId }: { id: string; doctorId: string }) => {
            const { error } = await supabase
                .from('doctor_visit_reasons')
                .delete()
                .eq('id', id);

            if (error) throw error;
            return id;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['visit-reasons', variables.doctorId] });
            toast.success('Səbəb silindi');
        }
    });
}

// ============================================
// RECEPTION & STATUS HOOKS
// ============================================

export function useUpdateAppointmentStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ appointmentId, status }: { appointmentId: string; status: string }) => {
            const { data, error } = await supabase
                .from('appointments')
                .update({ status })
                .eq('id', appointmentId)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['appointments'] });
            toast.success('Status yeniləndi');
        }
    });
}

export function useReceptionistProfile() {
    return useQuery({
        queryKey: ['receptionist-profile'],
        queryFn: async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const { data, error } = await supabase
                .from('staff_assignments')
                .select(`
                    *,
                    branch:branches(*, hospital:hospitals(*))
                `)
                .eq('user_id', user.id)
                .is('is_active', true)
                .single();

            if (error) return null; // Might not be a staff member or multiple branches
            return data;
        }
    });
}

export function useDailyAppointments(branchId: string, date: string) {
    return useQuery({
        queryKey: ['appointments', branchId, date],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('appointments')
                .select(`
                    *,
                    patient:users!public_appointments_patient_id_fkey(full_name, phone),
                    doctor:doctors(
                        user:users(full_name)
                    ),
                    reason:doctor_visit_reasons(name, name_az, name_ru)
                `)
                .eq('branch_id', branchId)
                .eq('scheduled_date', date)
                .order('start_time', { ascending: true });

            if (error) throw error;
            return data;
        },
        enabled: !!branchId && !!date,
    });
}

export function useHospitalProfile() {
    return useQuery({
        queryKey: ['hospital-profile'],
        queryFn: async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            // Try to find hospital where user is owner
            const { data: hospital, error } = await supabase
                .from('hospitals')
                .select('*, branches(*)')
                .eq('owner_id', user.id)
                .single();

            if (!error && hospital) return hospital;

            // Otherwise check user_roles
            const { data: roleData, error: roleError } = await supabase
                .from('user_roles')
                .select('hospital_id, hospital:hospitals(*, branches(*))')
                .eq('user_id', user.id)
                .not('hospital_id', 'is', null)
                .limit(1)
                .single();

            if (roleError) return null;
            return roleData.hospital;
        }
    });
}

export function useHospitalStats(hospitalId: string) {
    const today = new Date().toISOString().split('T')[0];
    return useQuery({
        queryKey: ['hospital-stats', hospitalId, today],
        queryFn: async () => {
            // Get all branch IDs for this hospital
            const { data: branches } = await supabase
                .from('branches')
                .select('id')
                .eq('hospital_id', hospitalId);

            const branchIds = branches?.map(b => b.id) || [];

            if (branchIds.length === 0) return { todayAppointments: 0 };

            const { count, error } = await supabase
                .from('appointments')
                .select('*', { count: 'exact', head: true })
                .in('branch_id', branchIds)
                .eq('scheduled_date', today);

            if (error) throw error;
            return { todayAppointments: count || 0 };
        },
        enabled: !!hospitalId,
    });
}

export function useHospitalDoctors(hospitalId: string) {
    return useQuery({
        queryKey: ['hospital-doctors', hospitalId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('doctor_branch_assignments')
                .select(`
                    doctor:doctors(
                        *,
                        user:users(full_name, avatar_url, email, phone),
                        appointments:appointments(count)
                    ),
                    branch:branches!inner(hospital_id)
                `)
                .eq('branch.hospital_id', hospitalId);

            if (error) throw error;

            const doctorsMap = new Map();
            data?.forEach((item: any) => {
                if (item.doctor) {
                    const doc = {
                        ...item.doctor,
                        appointmentCount: item.doctor.appointments?.[0]?.count || 0
                    };
                    doctorsMap.set(doc.id, doc);
                }
            });
            return Array.from(doctorsMap.values());
        },
        enabled: !!hospitalId,
    });
}

export function useHospitalApplications(hospitalId: string) {
    return useQuery({
        queryKey: ['hospital-applications', hospitalId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('doctor_applications')
                .select('*')
                .eq('hospital_id', hospitalId)
                .eq('status', 'pending');

            if (error) throw error;
            return data;
        },
        enabled: !!hospitalId,
    });
}
