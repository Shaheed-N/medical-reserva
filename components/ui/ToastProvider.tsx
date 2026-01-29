'use client';

import { Toaster } from 'react-hot-toast';

export function ToastProvider() {
    return (
        <Toaster
            position="top-right"
            toastOptions={{
                duration: 4000,
                style: {
                    background: '#0F172A',
                    color: '#fff',
                    borderRadius: '2px',
                    padding: '16px 20px',
                    fontSize: '14px',
                    fontWeight: '500',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                },
                success: {
                    iconTheme: {
                        primary: '#0F766E',
                        secondary: '#fff',
                    },
                    style: {
                        borderLeft: '4px solid #0F766E',
                    },
                },
                error: {
                    iconTheme: {
                        primary: '#EF4444',
                        secondary: '#fff',
                    },
                    style: {
                        borderLeft: '4px solid #EF4444',
                    },
                },
                loading: {
                    iconTheme: {
                        primary: '#0F766E',
                        secondary: '#fff',
                    },
                },
            }}
        />
    );
}
