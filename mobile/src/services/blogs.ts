import { supabase } from './supabase';

export interface Blog {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    image: string;
    category: string;
    author: string;
    authorAvatar: string;
    readTime: number;
    date: string;
    featured: boolean;
    likes: number;
}

export const blogsService = {
    /**
     * Get all blogs
     */
    getBlogs: async (limit = 10): Promise<Blog[]> => {
        const { data, error } = await supabase
            .from('blogs')
            .select(`
                *,
                author:users (full_name, avatar_url)
            `)
            .eq('is_published', true)
            .order('published_at', { ascending: false })
            .limit(limit);

        if (error) {
            console.warn('Supabase blogs fetch failed, using mock data:', error);
            return MOCK_BLOGS; // Fallback to mock if table doesn't exist yet
        }

        if (!data || data.length === 0) return MOCK_BLOGS;

        return data.map((blog: any) => ({
            id: blog.id,
            title: blog.title,
            excerpt: blog.excerpt || blog.content?.substring(0, 100) + '...',
            content: blog.content,
            category: blog.category || 'Health',
            image: blog.cover_image_url || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400',
            readTime: blog.read_time_minutes || 5,
            date: new Date(blog.published_at).toLocaleDateString(),
            author: blog.author?.full_name || 'Dr. Unknown',
            authorAvatar: blog.author?.avatar_url || 'https://i.pravatar.cc/150',
            featured: blog.is_featured || false,
            likes: blog.likes_count || 0
        }));
    },

    getBlogById: async (id: string): Promise<Blog | null> => {
        const { data, error } = await supabase
            .from('blogs')
            .select(`
                *,
                author:users (full_name, avatar_url)
            `)
            .eq('id', id)
            .single();

        if (error) return null;

        return {
            id: data.id,
            title: data.title,
            excerpt: data.excerpt,
            content: data.content,
            category: data.category || 'Health',
            image: data.cover_image_url || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400',
            readTime: data.read_time_minutes || 5,
            date: new Date(data.published_at).toLocaleDateString(),
            author: data.author?.full_name || 'Dr. Unknown',
            authorAvatar: data.author?.avatar_url || 'https://i.pravatar.cc/150',
            featured: data.is_featured || false,
            likes: data.likes_count || 0
        };
    }
};

const MOCK_BLOGS: Blog[] = [
    {
        id: '1',
        title: 'The Future of Telemedicine',
        category: 'Tech',
        image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400',
        readTime: 5,
        date: new Date().toLocaleDateString(),
        content: 'Content here...',
        excerpt: 'Telemedicine is changing how we access healthcare...',
        author: 'Dr. Sarah Jensen',
        authorAvatar: 'https://i.pravatar.cc/150?u=sarah',
        featured: true,
        likes: 124
    },
    {
        id: '2',
        title: 'Understanding Mental Health',
        category: 'Wellness',
        image: 'https://images.unsplash.com/photo-1527137342181-19aab11a8ee8?w=400',
        readTime: 3,
        date: new Date().toLocaleDateString(),
        content: 'Content here...',
        excerpt: 'Mental health is just as important as physical health...',
        author: 'Dr. Michael Chen',
        authorAvatar: 'https://i.pravatar.cc/150?u=michael',
        featured: false,
        likes: 89
    },
    {
        id: '3',
        title: 'Healthy Diet Habits',
        category: 'Nutrition',
        image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400',
        readTime: 6,
        date: new Date().toLocaleDateString(),
        content: 'Content here...',
        excerpt: 'Your diet plays a crucial role in your overall wellbeing...',
        author: 'Dr. Emma Wilson',
        authorAvatar: 'https://i.pravatar.cc/150?u=emma',
        featured: false,
        likes: 245
    },
];
