"use client";

import { useState } from 'react';
import { Search, Eye, Calendar, Phone, Mail } from 'lucide-react';

const patients = [
    { id: 1, name: 'Aysel Mammadova', phone: '+994 50 111 22 33', email: 'aysel@mail.az', dob: '1985-03-15', appointments: 12, lastVisit: '2026-01-02' },
    { id: 2, name: 'Elvin Hasanov', phone: '+994 55 222 33 44', email: 'elvin@mail.az', dob: '1990-07-22', appointments: 8, lastVisit: '2026-01-01' },
    { id: 3, name: 'Nigar Guliyeva', phone: '+994 70 333 44 55', email: 'nigar@mail.az', dob: '1978-11-08', appointments: 24, lastVisit: '2025-12-28' },
    { id: 4, name: 'Tural Ahmadov', phone: '+994 51 444 55 66', email: 'tural@mail.az', dob: '1995-05-30', appointments: 3, lastVisit: '2025-12-20' },
    { id: 5, name: 'Kamran Ismayilov', phone: '+994 77 555 66 77', email: 'kamran@mail.az', dob: '1982-09-12', appointments: 15, lastVisit: '2026-01-03' },
];

export default function PatientsPage() {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Patients</h1>
                    <p className="text-slate-500 mt-1">View and manage patient records</p>
                </div>
            </div>

            {/* Search */}
            <div className="bg-white p-4 rounded-lg border border-slate-200 flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search patients by name, phone, or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E]"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Patient</th>
                            <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Contact</th>
                            <th className="text-center px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date of Birth</th>
                            <th className="text-center px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Appointments</th>
                            <th className="text-center px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Last Visit</th>
                            <th className="text-right px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {patients.map((patient) => (
                            <tr key={patient.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-sm">
                                            {patient.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div className="font-medium text-slate-900">{patient.name}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-sm text-slate-600 mb-1">
                                        <Phone size={14} className="text-slate-400" />
                                        {patient.phone}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                        <Mail size={14} className="text-slate-400" />
                                        {patient.email}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center text-sm text-slate-600">{patient.dob}</td>
                                <td className="px-6 py-4 text-center">
                                    <span className="font-medium text-slate-900">{patient.appointments}</span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
                                        <Calendar size={14} className="text-slate-400" />
                                        {patient.lastVisit}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="p-2 text-slate-400 hover:text-[#0F766E] transition-colors">
                                        <Eye size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
