import { create } from 'zustand';
import { appointmentService, Appointment } from '../services/appointments';

interface AppointmentState {
    // State
    upcomingAppointments: Appointment[];
    pastAppointments: Appointment[];
    currentAppointment: Appointment | null;
    isLoading: boolean;
    error: string | null;

    // Pagination
    pastPage: number;
    pastTotalPages: number;
    hasMorePast: boolean;

    // Actions
    setUpcomingAppointments: (appointments: Appointment[]) => void;
    setPastAppointments: (appointments: Appointment[]) => void;
    setCurrentAppointment: (appointment: Appointment | null) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;

    // Async actions
    loadUpcomingAppointments: (patientId: string) => Promise<void>;
    loadPastAppointments: (patientId: string, page?: number) => Promise<void>;
    loadAppointment: (id: string) => Promise<void>;
    bookAppointment: (data: any) => Promise<Appointment>;
    cancelAppointment: (id: string, userId: string, reason?: string) => Promise<void>;
    rescheduleAppointment: (id: string, newDate: string, newStartTime: string, newEndTime: string, userId: string) => Promise<void>;

    // Clear state
    clearAppointments: () => void;
}

export const useAppointmentStore = create<AppointmentState>((set, get) => ({
    // Initial state
    upcomingAppointments: [],
    pastAppointments: [],
    currentAppointment: null,
    isLoading: false,
    error: null,
    pastPage: 1,
    pastTotalPages: 1,
    hasMorePast: false,

    // Setters
    setUpcomingAppointments: (upcomingAppointments) => set({ upcomingAppointments }),
    setPastAppointments: (pastAppointments) => set({ pastAppointments }),
    setCurrentAppointment: (currentAppointment) => set({ currentAppointment }),
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),

    // Load upcoming appointments
    loadUpcomingAppointments: async (patientId) => {
        try {
            set({ isLoading: true, error: null });
            const appointments = await appointmentService.getUpcomingAppointments(patientId);
            set({ upcomingAppointments: appointments });
        } catch (error: any) {
            set({ error: error.message });
        } finally {
            set({ isLoading: false });
        }
    },

    // Load past appointments with pagination
    loadPastAppointments: async (patientId, page = 1) => {
        try {
            set({ isLoading: true, error: null });
            const result = await appointmentService.getPastAppointments(patientId, page);

            if (page === 1) {
                set({ pastAppointments: result.data });
            } else {
                set({ pastAppointments: [...get().pastAppointments, ...result.data] });
            }

            set({
                pastPage: result.page,
                pastTotalPages: result.total_pages,
                hasMorePast: result.page < result.total_pages,
            });
        } catch (error: any) {
            set({ error: error.message });
        } finally {
            set({ isLoading: false });
        }
    },

    // Load single appointment
    loadAppointment: async (id) => {
        try {
            set({ isLoading: true, error: null });
            const appointment = await appointmentService.getAppointment(id);
            set({ currentAppointment: appointment });
        } catch (error: any) {
            set({ error: error.message });
        } finally {
            set({ isLoading: false });
        }
    },

    // Book appointment
    bookAppointment: async (data) => {
        try {
            set({ isLoading: true, error: null });
            const appointment = await appointmentService.bookAppointment(data);

            // Add to upcoming appointments
            set({
                upcomingAppointments: [appointment, ...get().upcomingAppointments],
            });

            return appointment;
        } catch (error: any) {
            set({ error: error.message });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    // Cancel appointment
    cancelAppointment: async (id, userId, reason) => {
        try {
            set({ isLoading: true, error: null });
            await appointmentService.cancelAppointment(id, userId, reason);

            // Remove from upcoming and add to past
            const cancelled = get().upcomingAppointments.find(a => a.id === id);
            if (cancelled) {
                set({
                    upcomingAppointments: get().upcomingAppointments.filter(a => a.id !== id),
                    pastAppointments: [{ ...cancelled, status: 'cancelled' }, ...get().pastAppointments],
                });
            }

            // Update current appointment if it's the cancelled one
            if (get().currentAppointment?.id === id) {
                set({ currentAppointment: { ...get().currentAppointment!, status: 'cancelled' } });
            }
        } catch (error: any) {
            set({ error: error.message });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    // Reschedule appointment
    rescheduleAppointment: async (id, newDate, newStartTime, newEndTime, userId) => {
        try {
            set({ isLoading: true, error: null });
            const updated = await appointmentService.rescheduleAppointment(
                id, newDate, newStartTime, newEndTime, userId
            );

            // Update in upcoming appointments
            set({
                upcomingAppointments: get().upcomingAppointments.map(a =>
                    a.id === id ? updated : a
                ),
            });

            // Update current appointment if it's the rescheduled one
            if (get().currentAppointment?.id === id) {
                set({ currentAppointment: updated });
            }
        } catch (error: any) {
            set({ error: error.message });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    // Clear appointments
    clearAppointments: () => set({
        upcomingAppointments: [],
        pastAppointments: [],
        currentAppointment: null,
        pastPage: 1,
        pastTotalPages: 1,
        hasMorePast: false,
    }),
}));

export default useAppointmentStore;
