import { Header } from '@/components/layout/Header';
import { TopBanner } from '@/components/layout/TopBanner';
import { Footer } from '@/components/layout/Footer';

export default async function MarketingLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    return (
        <div className="flex flex-col min-h-screen">
            <TopBanner />
            <Header locale={locale} />
            <main className="flex-1">
                {children}
            </main>
            <Footer locale={locale} />
        </div>
    );
}
