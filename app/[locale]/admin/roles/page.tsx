"use client";

import { useState } from 'react';
import { Plus, Shield, Edit, Trash2 } from 'lucide-react';

const roles = [
    { id: 1, name: 'Super Admin', description: 'Full system access', users: 2 },
    { id: 2, name: 'Hospital Admin', description: 'Manage hospital settings', users: 12 },
    { id: 3, name: 'Doctor', description: 'View own appointments', users: 156 },
    { id: 4, name: 'Staff', description: 'Front desk support', users: 45 },
];

const permissions = [
    { group: 'Hospitals', perms: ['view', 'create', 'edit', 'delete'] },
    { group: 'Doctors', perms: ['view', 'create', 'edit', 'delete'] },
    { group: 'Patients', perms: ['view', 'create', 'edit', 'delete'] },
    { group: 'Appointments', perms: ['view', 'create', 'edit', 'delete'] },
];

export default function RolesPage() {
    const [selected, setSelected] = useState(1);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Roles & Permissions</h1>
                    <p className="text-slate-500 mt-1">Create and manage user roles</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#0F766E] text-white rounded text-sm font-medium">
                    <Plus size={18} /> Create Role
                </button>
            </div>

            <div className="grid grid-cols-3 gap-6">
                <div className="space-y-3">
                    {roles.map((r) => (
                        <div key={r.id} onClick={() => setSelected(r.id)} className={`p-4 rounded-lg border cursor-pointer ${selected === r.id ? 'border-[#0F766E] bg-teal-50' : 'border-slate-200 bg-white'}`}>
                            <div className="flex items-center gap-3">
                                <Shield size={20} className="text-slate-500" />
                                <div>
                                    <div className="font-bold text-slate-900">{r.name}</div>
                                    <div className="text-sm text-slate-500">{r.users} users</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="col-span-2 bg-white rounded-lg border border-slate-200 p-6">
                    <h2 className="font-bold text-slate-900 mb-4">Permissions</h2>
                    {permissions.map((g) => (
                        <div key={g.group} className="mb-4">
                            <div className="text-sm font-bold text-slate-500 mb-2">{g.group}</div>
                            <div className="grid grid-cols-4 gap-2">
                                {g.perms.map((p) => (
                                    <label key={p} className="flex items-center gap-2 p-2 bg-slate-50 rounded text-sm">
                                        <input type="checkbox" className="text-[#0F766E]" defaultChecked />
                                        {p}
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                    <button className="mt-4 px-4 py-2 bg-[#0F766E] text-white rounded text-sm font-medium">Save</button>
                </div>
            </div>
        </div>
    );
}
