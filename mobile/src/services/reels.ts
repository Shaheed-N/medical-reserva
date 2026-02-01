import { supabase } from './supabase';

export interface Reel {
    id: string;
    title: string;
    videoUrl: string;
    thumbnailUrl: string; // mapped from thumbnail_url
    views: string; // formatted views_count
    authorName: string;
    authorAvatar: string;
    description?: string;
    doctorSpecialty?: string;
    likes: number;
    comments: number;
    shares: number;
    isLiked: boolean;
    isFollowing: boolean;
    tags: string[];
}

export const reelsService = {
    /**
     * Get all reels
     */
    getReels: async (limit = 10): Promise<Reel[]> => {
        const { data, error } = await supabase
            .from('reels')
            .select(`
                *,
                author:users (full_name, avatar_url)
            `)
            .eq('is_active', true)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) {
            console.warn('Supabase reels fetch failed, using mock data:', error);
            return MOCK_REELS;
        }

        if (!data || data.length === 0) return MOCK_REELS;

        return data.map((reel: any) => ({
            id: reel.id,
            title: reel.title,
            videoUrl: reel.video_url || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            thumbnailUrl: reel.thumbnail_url || 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400',
            views: formatViews(reel.views_count || 0),
            authorName: reel.author?.full_name || 'Dr. Unknown',
            authorAvatar: reel.author?.avatar_url || 'https://i.pravatar.cc/150',
            description: reel.description || 'No description',
            doctorSpecialty: 'Specialist',
            likes: reel.likes_count || 120,
            comments: 45,
            shares: 12,
            isLiked: false,
            isFollowing: false,
            tags: ['Health', 'Medical']
        }));
    }
};

const formatViews = (views: number): string => {
    if (views >= 1000000) return (views / 1000000).toFixed(1) + 'M';
    if (views >= 1000) return (views / 1000).toFixed(1) + 'k';
    return views.toString();
};

const MOCK_REELS: Reel[] = [
    {
        id: '1',
        title: '5 Signs of Heart Disease You Shouldn\'t Ignore',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400',
        views: '12.4k',
        authorName: 'Dr. Sarah Jensen',
        authorAvatar: 'https://i.pravatar.cc/150?u=sarah',
        description: 'Learn about the early warning signs that could save your life. #HeartHealth #CardioTips',
        doctorSpecialty: 'Cardiologist',
        likes: 12400,
        comments: 847,
        shares: 234,
        isLiked: false,
        isFollowing: false,
        tags: ['HeartHealth', 'Prevention', 'HealthTips']
    },
    {
        id: '2',
        title: 'The Truth About Sugar and Your Brain',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400',
        views: '8.9k',
        authorName: 'Dr. Michael Chen',
        authorAvatar: 'https://i.pravatar.cc/150?u=michael',
        description: 'How sugar affects your mental health and cognitive function. #BrainHealth #Nutrition',
        doctorSpecialty: 'Neurologist',
        likes: 8900,
        comments: 562,
        shares: 189,
        isLiked: true,
        isFollowing: true,
        tags: ['BrainHealth', 'Nutrition', 'MentalHealth']
    },
    {
        id: '3',
        title: 'Morning Stretches for Back Pain Relief',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400',
        views: '15.2k',
        authorName: 'Dr. Emma Wilson',
        authorAvatar: 'https://i.pravatar.cc/150?u=emma',
        description: '5-minute routine to start your day pain-free. #BackPain #Physiotherapy',
        doctorSpecialty: 'Orthopedist',
        likes: 15200,
        comments: 1203,
        shares: 567,
        isLiked: false,
        isFollowing: false,
        tags: ['BackPain', 'Exercise', 'Wellness']
    }
];
