import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { TopBanner } from '@/components/layout/TopBanner';

export default async function MarketingLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    return (
        <>
            <TopBanner />
            <Header locale={locale} />
            <main className="flex-1">
                {children}
            </main>
            <Footer />
        </>
    );
}
