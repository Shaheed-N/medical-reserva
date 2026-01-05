"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function SignupPage() {
    const [phoneNumber, setPhoneNumber] = useState('');

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white">
            {/* Right Column - Serious Image (Order swapped) */}
            <div className="hidden lg:block relative bg-[#0F172A]">
                <img
                    className="absolute inset-0 h-full w-full object-cover opacity-50 grayscale"
                    src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=3000&q=80"
                    alt="Medical Laboratory"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A]/80 to-transparent"></div>
                <div className="absolute top-0 left-0 p-16 text-white">
                    <div className="border border-white/20 p-8 backdrop-blur-sm bg-white/5 max-w-md">
                        <h3 className="text-xl font-bold mb-4 uppercase tracking-widest">Registration Requirements</h3>
                        <ul className="space-y-4 text-sm text-gray-300">
                            <li className="flex gap-3">
                                <span className="font-bold text-white">01.</span>
                                Valid National ID or Passport
                            </li>
                            <li className="flex gap-3">
                                <span className="font-bold text-white">02.</span>
                                Verified Mobile Number
                            </li>
                            <li className="flex gap-3">
                                <span className="font-bold text-white">03.</span>
                                Current Insurance Details (Optional)
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Left Column - Form */}
            <div className="flex flex-col justify-center px-4 py-12 lg:px-24 bg-white">
                <div className="w-full max-w-md mx-auto">
                    <div className="mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                            Patient Registration
                        </h2>
                        <p className="mt-2 text-gray-500">
                            Create your secure medical profile.
                        </p>
                    </div>

                    <form action="#" className="space-y-6">
                        <div>
                            <label htmlFor="fullname" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                Full Legal Name
                            </label>
                            <input
                                id="fullname"
                                name="fullname"
                                type="text"
                                required
                                className="block w-full border border-gray-300 px-4 py-3 text-gray-900 focus:ring-0 focus:border-[#0F766E] placeholder:text-gray-400 sm:text-sm"
                                placeholder="Ex. John Doe"
                            />
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                Mobile Number
                            </label>
                            <div className="flex">
                                <span className="inline-flex items-center px-4 border border-r-0 border-gray-300 bg-gray-100 text-gray-500 text-sm font-medium">
                                    +1
                                </span>
                                <input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    required
                                    placeholder="555-000-0000"
                                    className="block w-full border border-gray-300 px-4 py-3 text-gray-900 focus:ring-0 focus:border-[#0F766E] placeholder:text-gray-400 sm:text-sm font-mono"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-100 p-4 flex gap-3 items-start">
                            <svg className="w-5 h-5 text-blue-800 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <p className="text-xs text-blue-900 leading-relaxed">
                                By registering, you consent to the storage of your medical data in compliance with National Health Data Privacy Regulations (NHDPR).
                            </p>
                        </div>

                        <button
                            type="submit"
                            className="w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold text-white bg-[#0F766E] hover:bg-[#134E4A] focus:outline-none transition-colors uppercase tracking-widest"
                        >
                            Verify & Register
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-600">
                            Already registered?{' '}
                            <Link href="/login" className="font-bold text-[#0F766E] hover:text-[#134E4A]">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
