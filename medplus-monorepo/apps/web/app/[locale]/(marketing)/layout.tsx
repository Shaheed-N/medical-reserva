import { Header } from '@/components/layout/Header';
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
        <>
            {/* TOP BANNER */}
            <div className="bg-[#0F766E] text-white py-2.5 px-6 text-center text-[10px] font-black tracking-[0.2em] uppercase shadow-lg relative z-[60]">
                <span className="opacity-60 mr-2">Unified Health Protocol:</span> New Digital Residency IDs are now mandatory for clinical check-ins. <a href="#" className="underline ml-4 hover:text-[#2DD4BF] transition-all">Details</a>
            </div>

            <Header locale={locale} />
            <main className="flex-1">
                {children}
            </main>
            <Footer />
        </>
    );
}
