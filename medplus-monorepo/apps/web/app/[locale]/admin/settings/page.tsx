"use client";

import { Bell, Lock, Globe, Database } from 'lucide-react';

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
                <p className="text-slate-500 mt-1">Configure system settings</p>
            </div>

            <div className="grid gap-6">
                <div className="bg-white rounded-lg border border-slate-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Globe size={20} className="text-[#0F766E]" />
                        <h2 className="font-bold text-slate-900">General</h2>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">System Name</label>
                            <input type="text" defaultValue="MedPlus National Health" className="w-full px-4 py-2 border border-slate-200 rounded" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Default Language</label>
                            <select className="w-full px-4 py-2 border border-slate-200 rounded bg-white">
                                <option>Azerbaijani (AZ)</option>
                                <option>Russian (RU)</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-slate-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Bell size={20} className="text-[#0F766E]" />
                        <h2 className="font-bold text-slate-900">Notifications</h2>
                    </div>
                    <div className="space-y-3">
                        <label className="flex items-center gap-3">
                            <input type="checkbox" className="text-[#0F766E]" defaultChecked />
                            <span className="text-sm text-slate-700">Email notifications for new appointments</span>
                        </label>
                        <label className="flex items-center gap-3">
                            <input type="checkbox" className="text-[#0F766E]" defaultChecked />
                            <span className="text-sm text-slate-700">SMS reminders to patients</span>
                        </label>
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-slate-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Lock size={20} className="text-[#0F766E]" />
                        <h2 className="font-bold text-slate-900">Security</h2>
                    </div>
                    <div className="space-y-3">
                        <label className="flex items-center gap-3">
                            <input type="checkbox" className="text-[#0F766E]" defaultChecked />
                            <span className="text-sm text-slate-700">Require 2FA for admin users</span>
                        </label>
                        <label className="flex items-center gap-3">
                            <input type="checkbox" className="text-[#0F766E]" />
                            <span className="text-sm text-slate-700">Log all admin actions</span>
                        </label>
                    </div>
                </div>

                <button className="px-6 py-3 bg-[#0F766E] text-white rounded font-medium w-fit">Save Settings</button>
            </div>
        </div>
    );
}
