import { supabase } from './supabase';

export interface Clinic {
    id: string;
    name: string;
    description?: string;
    address: string;
    city: string;
    image: string; // mapped from image_url
    rating: number; // mapped from rating
    reviews: number; // mapped from review_count
    distance: string; // Calculated or mock for now
    latitude?: number;
    longitude?: number;
    open: boolean; // Derived from operating_hours
    type: string; // Derived from hospital type or branch metadata
    phone?: string;
    website?: string;
    gallery?: string[];
    services?: string[];
    about?: string;
    doctors?: any[];
}

export const clinicsService = {
    /**
     * Get all clinics (branches)
     */
    getClinics: async (limit = 20): Promise<Clinic[]> => {
        const { data, error } = await supabase
            .from('branches')
            .select(`
                *,
                hospital:hospitals (id, name, type, logo_url)
            `)
            .eq('is_active', true)
            .limit(limit);

        if (error) throw error;

        // Map to UI model
        return (data || []).map((branch: any) => ({
            id: branch.id,
            name: branch.name,
            description: branch.hospital?.name,
            address: branch.address_line1,
            city: branch.city,
            image: branch.image_url || branch.hospital?.logo_url || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400',
            rating: branch.rating || 4.5,
            reviews: branch.review_count || 0,
            distance: '1.2 km', // Mock distance for now, would need Geolocation logic
            latitude: branch.latitude,
            longitude: branch.longitude,
            open: true, // Need logic to check operating_hours vs current time
            type: branch.hospital?.type || 'General Clinic'
        }));
    },

    /**
     * Get clinic details
     */
    getClinicById: async (id: string): Promise<Clinic | null> => {
        const { data, error } = await supabase
            .from('branches')
            .select(`
                *,
                hospital:hospitals (id, name, type, logo_url, description)
            `)
            .eq('id', id)
            .single();

        if (error) return null;

        // Fetch doctors for this branch
        const { data: doctorsData } = await supabase
            .from('doctor_branch_assignments')
            .select(`
                doctor:doctors (
                    id, 
                    rating, 
                    user:users (full_name, avatar_url),
                    specialties
                )
            `)
            .eq('branch_id', id)
            .limit(5);

        const doctors = doctorsData?.map((d: any) => ({
            id: d.doctor.id,
            name: d.doctor.user.full_name,
            specialty: d.doctor.specialties?.[0] || 'Specialist',
            image: d.doctor.user.avatar_url,
            rating: d.doctor.rating || 5.0
        })) || [];

        return {
            id: data.id,
            name: data.name,
            description: data.hospital?.description,
            about: data.hospital?.description || 'Leading medical facility providing comprehensive healthcare services.',
            address: data.address_line1,
            city: data.city,
            image: data.image_url || data.hospital?.logo_url || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400',
            rating: data.rating || 4.5,
            reviews: data.review_count || 0,
            distance: '2.5 km',
            latitude: data.latitude,
            longitude: data.longitude,
            open: true,
            type: data.hospital?.type || 'Clinic',
            phone: data.phone || data.hospital?.contact_phone || '+994 12 345 67 89',
            website: data.hospital?.website || 'https://medplus.az',
            gallery: [
                data.image_url || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=500',
                'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=500',
                'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=500'
            ],
            services: ['Emergency', 'Cardiology', 'Neurology', 'Pediatrics', 'Oncology', 'Dental'],
            doctors: doctors.length > 0 ? doctors : [
                { id: '1', name: 'Dr. Sarah Jensen', specialty: 'Cardiologist', image: 'https://i.pravatar.cc/150?u=sarah', rating: 4.9 },
                { id: '2', name: 'Dr. Michael Chen', specialty: 'Neurologist', image: 'https://i.pravatar.cc/150?u=michael', rating: 4.8 },
            ]
        };
    },

    /**
     * Get popular/nearby clinics
     */
    getNearbyClinics: async (): Promise<Clinic[]> => {
        // In a real app, pass user lat/long to RPC function
        return clinicsService.getClinics(5);
    }
};
