"use client";

import { use, useState, useEffect } from 'react';
import {
    Tag, Plus, Trash2, Edit, Save, X, Search,
    Stethoscope, Activity, FileText, ChevronRight,
    Loader2
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface MetadataItem {
    id: string;
    key: string;
    value: string;
    category: 'specialty' | 'qualification' | 'insurance' | 'language';
    created_at: string;
}

export default function MetadataAdminPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = use(params);
    const [activeTab, setActiveTab] = useState<'specialty' | 'qualification' | 'insurance' | 'language'>('specialty');
    const [items, setItems] = useState<MetadataItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [newItemValue, setNewItemValue] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState('');

    useEffect(() => {
        fetchMetadata();
    }, [activeTab]);

    async function fetchMetadata() {
        setLoading(true);
        try {
            // First, check if the table exists by trying to select from it
            const { data, error } = await supabase
                .from('system_metadata')
                .select('*')
                .eq('category', activeTab)
                .order('value', { ascending: true });

            if (error) {
                if (error.code === '42P01') { // Table doesn't exist
                    console.warn('system_metadata table not found. Using mock data for demo.');
                    // Fallback to mock data if table not yet created
                    setItems([
                        { id: '1', key: 'cardiology', value: 'Cardiology', category: 'specialty', created_at: '' },
                        { id: '2', key: 'neurology', value: 'Neurology', category: 'specialty', created_at: '' },
                        { id: '3', key: 'pediatrics', value: 'Pediatrics', category: 'specialty', created_at: '' },
                    ].filter(i => i.category === activeTab) as any);
                } else {
                    throw error;
                }
            } else {
                setItems(data || []);
            }
        } catch (err) {
            console.error('Failed to fetch metadata:', err);
        } finally {
            setLoading(false);
        }
    }

    async function handleAdd() {
        if (!newItemValue.trim()) return;
        const key = newItemValue.toLowerCase().replace(/\s+/g, '-');

        const { data, error } = await supabase
            .from('system_metadata')
            .insert({
                key,
                value: newItemValue,
                category: activeTab
            })
            .select()
            .single();

        if (error) {
            alert(error.message);
        } else {
            setItems([...items, data].sort((a, b) => a.value.localeCompare(b.value)));
            setNewItemValue('');
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Are you sure you want to delete this metadata item?')) return;

        const { error } = await supabase
            .from('system_metadata')
            .delete()
            .eq('id', id);

        if (error) alert(error.message);
        else setItems(items.filter(i => i.id !== id));
    }

    async function handleUpdate(id: string) {
        if (!editValue.trim()) return;

        const { error } = await supabase
            .from('system_metadata')
            .update({ value: editValue })
            .eq('id', id);

        if (error) alert(error.message);
        else {
            setItems(items.map(i => i.id === id ? { ...i, value: editValue } : i));
            setEditingId(null);
        }
    }

    const categories = [
        { id: 'specialty', label: 'Specialties', icon: Stethoscope },
        { id: 'qualification', label: 'Qualifications', icon: FileText },
        { id: 'insurance', label: 'Insurance Providers', icon: Activity },
        { id: 'language', label: 'Supported Languages', icon: Tag },
    ];

    const filteredItems = items.filter(i =>
        i.value.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-1.5 h-10 bg-[#0F766E]"></div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Registry Metadata</h1>
                    </div>
                    <p className="text-slate-500 text-[11px] font-black uppercase tracking-[0.3em] opacity-60">
                        System-wide Dropdown & Picker Configuration
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
                {/* Sidebar Tabs */}
                <aside className="space-y-2">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveTab(cat.id as any)}
                            className={`w-full flex items-center justify-between p-5 rounded-sm transition-all border ${activeTab === cat.id
                                ? 'bg-[#0F766E] border-[#0F766E] text-white shadow-xl translate-x-2'
                                : 'bg-white border-slate-100 text-slate-600 hover:border-slate-300'
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <cat.icon size={20} className={activeTab === cat.id ? 'text-white' : 'text-[#0F766E]'} />
                                <span className="text-xs font-black uppercase tracking-widest">{cat.label}</span>
                            </div>
                            <ChevronRight size={16} className={activeTab === cat.id ? 'opacity-100' : 'opacity-20'} />
                        </button>
                    ))}
                </aside>

                {/* Main Content Area */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Add & Search Bar */}
                    <div className="bg-white p-8 rounded-sm border border-slate-200 shadow-sm space-y-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    placeholder={`Search ${activeTab}s...`}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-sm text-sm outline-none focus:ring-2 focus:ring-[#0F766E]/20"
                                />
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder={`New ${activeTab} name...`}
                                    value={newItemValue}
                                    onChange={(e) => setNewItemValue(e.target.value)}
                                    className="px-4 py-4 bg-white border border-slate-200 rounded-sm text-sm outline-none focus:border-[#0F766E] min-w-[200px]"
                                />
                                <button
                                    onClick={handleAdd}
                                    className="bg-[#0F766E] text-white px-8 rounded-sm font-black uppercase tracking-widest text-[10px] hover:bg-[#134E4A] transition-all shadow-lg active:scale-95 flex items-center gap-2"
                                >
                                    <Plus size={18} /> Add
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Items List */}
                    <div className="bg-white rounded-sm border border-slate-200 shadow-sm overflow-hidden">
                        <div className="bg-slate-50 px-8 py-4 border-b border-slate-200 flex justify-between items-center">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Active Entries</span>
                            <span className="text-[10px] font-black text-[#0F766E] uppercase tracking-widest">{filteredItems.length} Total</span>
                        </div>

                        {loading ? (
                            <div className="p-20 text-center">
                                <Loader2 className="animate-spin text-[#0F766E] mx-auto mb-4" size={32} />
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Synchronizing Registry...</div>
                            </div>
                        ) : filteredItems.length === 0 ? (
                            <div className="p-20 text-center text-slate-400">
                                <div className="text-[10px] font-black uppercase tracking-widest">No matching entries found</div>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {filteredItems.map((item) => (
                                    <div key={item.id} className="px-8 py-6 flex items-center justify-between group hover:bg-slate-50 transition-colors">
                                        {editingId === item.id ? (
                                            <div className="flex-1 flex gap-2">
                                                <input
                                                    type="text"
                                                    value={editValue}
                                                    onChange={(e) => setEditValue(e.target.value)}
                                                    className="flex-1 px-4 py-2 border border-[#0F766E] rounded-sm text-sm outline-none"
                                                    autoFocus
                                                />
                                                <button onClick={() => handleUpdate(item.id)} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded"><Save size={18} /></button>
                                                <button onClick={() => setEditingId(null)} className="p-2 text-slate-400 hover:bg-slate-100 rounded"><X size={18} /></button>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="flex items-center gap-6">
                                                    <div className="w-2 h-2 rounded-full bg-[#0F766E] opacity-20 group-hover:opacity-100 group-hover:scale-150 transition-all"></div>
                                                    <div>
                                                        <div className="text-sm font-bold text-slate-900">{item.value}</div>
                                                        <div className="text-[9px] text-slate-400 font-black uppercase tracking-widest">KEY: {item.key}</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => {
                                                            setEditingId(item.id);
                                                            setEditValue(item.value);
                                                        }}
                                                        className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item.id)}
                                                        className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
