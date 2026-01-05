import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { Plus_Jakarta_Sans } from 'next/font/google';
import "../globals.css";

const plusJakarta = Plus_Jakarta_Sans({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700', '800'],
    variable: '--font-sans',
    display: 'swap',
});

export function generateStaticParams() {
    return [{ locale: 'az' }, { locale: 'ru' }];
}

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
        <html lang={locale} className={plusJakarta.variable}>
            <body className={`${plusJakarta.className} antialiased min-h-screen flex flex-col bg-white text-slate-900`}>
                <NextIntlClientProvider messages={messages} locale={locale}>
                    {children}
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
