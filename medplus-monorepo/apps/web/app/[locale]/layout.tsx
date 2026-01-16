import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { IBM_Plex_Sans } from 'next/font/google';
import { ToastProvider } from '@/components/ui/ToastProvider';
import { QueryProvider } from '@/lib/QueryProvider';
import "../globals.css";

const ibmPlexSans = IBM_Plex_Sans({
    subsets: ['latin', 'cyrillic'],
    weight: ['100', '200', '300', '400', '500', '600', '700'],
    variable: '--font-sans',
    display: 'swap',
});

export function generateStaticParams() {
    return [{ locale: 'az' }, { locale: 'ru' }];
}

export const metadata = {
    title: 'MedPlus - Milli Tibbi Rezervasiya Sistemi',
    description: 'Azərbaycanın ən yaxşı həkimləri və xəstəxanaları bir platformada. Onlayn növbə tutun, vaxtınıza qənaət edin.',
    keywords: 'həkim, xəstəxana, rezervasiya, tibb, sağlamlıq, Azərbaycan, Bakı',
    openGraph: {
        title: 'MedPlus - Milli Tibbi Rezervasiya Sistemi',
        description: 'Azərbaycanın ən yaxşı həkimləri və xəstəxanaları bir platformada.',
        type: 'website',
        locale: 'az_AZ',
    },
};

export default async function LocaleLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    setRequestLocale(locale);
    const messages = await getMessages({ locale });

    return (
        <html lang={locale} className={`${ibmPlexSans.variable}`} suppressHydrationWarning>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
                <meta name="theme-color" content="#06b6d4" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                {/* Material Symbols for the icons used in the design */}
                <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
            </head>
            <body className={`${ibmPlexSans.className} antialiased min-h-screen flex flex-col bg-white text-slate-900 font-sans`}>
                <QueryProvider>
                    <NextIntlClientProvider messages={messages} locale={locale}>
                        <ToastProvider />
                        {children}
                    </NextIntlClientProvider>
                </QueryProvider>
            </body>
        </html>
    );
}
