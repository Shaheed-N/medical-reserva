import Link from 'next/link';

export default function ForDoctorsPage() {
    return (
        <div className="bg-white">
            {/* Hero Section */}
            <div className="relative isolate overflow-hidden bg-gradient-to-b from-indigo-100/20">
                <div className="mx-auto max-w-7xl pb-24 pt-10 sm:pb-32 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-40">
                    <div className="px-6 lg:px-0 lg:pt-4">
                        <div className="mx-auto max-w-2xl">
                            <div className="max-w-lg">
                                <div className="mt-24 sm:mt-32 lg:mt-16">
                                    <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10 mb-6">
                                        For Healthcare Providers
                                    </span>
                                </div>
                                <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                                    Grow your practice with MedPlus
                                </h1>
                                <p className="mt-6 text-lg leading-8 text-gray-600">
                                    Join the largest network of top-rated healthcare providers. Manage appointments, reduce no-shows, and deliver better patient care.
                                </p>
                                <div className="mt-10 flex items-center gap-x-6">
                                    <Link
                                        href="/signup?role=doctor"
                                        className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    >
                                        Apply Now
                                    </Link>
                                    <a href="#benefits" className="text-sm font-semibold leading-6 text-gray-900">
                                        Learn more <span aria-hidden="true">→</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-20 sm:mt-24 md:mx-auto md:max-w-2xl lg:mx-0 lg:mt-0 lg:w-screen">
                        <div className="absolute inset-y-0 right-1/2 -z-10 -mr-10 w-[200%] skew-x-[-30deg] bg-white shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 md:-mr-20 lg:-mr-36" aria-hidden="true" />
                        <div className="shadow-lg md:rounded-3xl">
                            <div className="bg-indigo-500 [clip-path:inset(0)] md:[clip-path:inset(0_round_theme(borderRadius.3xl))]">
                                <div className="absolute -inset-y-px left-1/2 -z-10 ml-10 w-[200%] skew-x-[-30deg] bg-indigo-100 opacity-20 ring-1 ring-inset ring-white md:ml-20 lg:ml-36" aria-hidden="true" />
                                <div className="relative px-6 pt-8 sm:pt-16 md:pl-16 md:pr-0">
                                    <div className="mx-auto max-w-2xl md:mx-0 md:max-w-none">
                                        <div className="w-screen overflow-hidden rounded-tl-xl bg-gray-900">
                                            <div className="flex bg-gray-800/40 ring-1 ring-white/5">
                                                <div className="-mb-px flex text-sm font-medium leading-6 text-gray-400">
                                                    <div className="border-b border-r border-b-white/20 border-r-white/10 bg-white/5 px-4 py-2 text-white">Dashboard.tsx</div>
                                                    <div className="border-r border-gray-600/10 px-4 py-2">Patients.tsx</div>
                                                </div>
                                            </div>
                                            <div className="px-6 pb-14 pt-6 text-white text-sm font-mono">
                                                {/* Fake Code Mockup */}
                                                <div>
                                                    <span className="text-pink-400">const</span> <span className="text-blue-300">appointments</span> = <span className="text-yellow-300">useAppointments</span>();
                                                </div>
                                                <div className="mt-2">
                                                    <span className="text-pink-400">return</span> (
                                                </div>
                                                <div className="pl-4 text-green-300">
                                                    &lt;Dashboard data={'{appointments}'} /&gt;
                                                </div>
                                                <div>);</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/10 md:rounded-3xl" aria-hidden="true" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Benefits Section */}
            <div id="benefits" className="py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl lg:text-center">
                        <h2 className="text-base font-semibold leading-7 text-indigo-600">Why MedPlus?</h2>
                        <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                            Everything you need to run your practice
                        </p>
                    </div>
                    <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                        <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                            {[
                                {
                                    name: 'Smart Scheduling',
                                    description: 'Automated booking system that syncs with your calendar and prevents double-booking.',
                                    icon: '📅',
                                },
                                {
                                    name: 'Patient Records',
                                    description: 'Secure, compliant electronic health records (EHR) accessible from anywhere.',
                                    icon: '📋',
                                },
                                {
                                    name: 'Telemedicine Ready',
                                    description: 'Built-in video consultation tools for remote patient care.',
                                    icon: '🎥',
                                },
                            ].map((feature) => (
                                <div key={feature.name} className="flex flex-col">
                                    <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                                        <span className="text-2xl">{feature.icon}</span>
                                        {feature.name}
                                    </dt>
                                    <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                                        <p className="flex-auto">{feature.description}</p>
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    );
}
