"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
    const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');

    const handleSendOtp = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate sending OTP
        setStep('OTP');
    };

    const handleVerifyOtp = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate verification
        console.log('Verifying OTP:', otp);
    };

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white">
            {/* Left Column - Form */}
            <div className="flex flex-col justify-center px-4 py-12 lg:px-24 bg-white border-r border-gray-100">
                <div className="w-full max-w-md mx-auto">
                    <div className="mb-12">
                        <div className="w-12 h-12 bg-[#0F766E] flex items-center justify-center text-white mb-6">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M12 4v16m-8-8h16" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                            Secure Login
                        </h2>
                        <p className="mt-2 text-gray-500">
                            Access the National Health Portal
                        </p>
                    </div>

                    <div className="bg-gray-50 p-8 border border-gray-200">
                        {step === 'PHONE' ? (
                            <form onSubmit={handleSendOtp} className="space-y-6">
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
                                    <p className="mt-2 text-xs text-gray-500">
                                        A 6-digit verification code will be sent via SMS.
                                    </p>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold text-white bg-[#0F766E] hover:bg-[#134E4A] focus:outline-none transition-colors uppercase tracking-widest"
                                >
                                    Request Verification Code
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleVerifyOtp} className="space-y-6">
                                <div>
                                    <button
                                        onClick={() => setStep('PHONE')}
                                        className="text-xs text-[#0F766E] font-medium mb-4 flex items-center gap-1 hover:underline"
                                    >
                                        ← Change Number
                                    </button>
                                    <label htmlFor="otp" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                        Enter Verification Code
                                    </label>
                                    <input
                                        id="otp"
                                        name="otp"
                                        type="text"
                                        required
                                        maxLength={6}
                                        placeholder="000000"
                                        className="block w-full border border-gray-300 px-4 py-3 text-gray-900 text-center text-lg tracking-[0.5em] font-mono focus:ring-0 focus:border-[#0F766E]"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold text-white bg-[#0F766E] hover:bg-[#134E4A] focus:outline-none transition-colors uppercase tracking-widest"
                                >
                                    Verify & Access
                                </button>
                            </form>
                        )}

                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <p className="text-xs text-center text-gray-400">
                                Secure Connection • 256-bit Encryption
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-600">
                            New User?{' '}
                            <Link href="/signup" className="font-bold text-[#0F766E] hover:text-[#134E4A]">
                                Register for Access
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Column - Serious Image */}
            <div className="hidden lg:block relative bg-[#0F172A]">
                <img
                    className="absolute inset-0 h-full w-full object-cover opacity-60"
                    src="https://images.unsplash.com/photo-1551076805-e1869033e561?ixlib=rb-4.0.3&auto=format&fit=crop&w=3000&q=80"
                    alt="Medical Professional"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-16 text-white max-w-xl">
                    <div className="w-16 h-1 bg-[#0F766E] mb-6"></div>
                    <blockquote className="text-2xl font-serif leading-relaxed mb-6 text-gray-100">
                        "The goal of medicine is to prevent disease and prolong life; the ideal of medicine is to eliminate the need of a physician."
                    </blockquote>
                    <p className="text-sm font-bold tracking-widest uppercase text-gray-400">National Medical Board</p>
                </div>
            </div>
        </div>
    );
}
