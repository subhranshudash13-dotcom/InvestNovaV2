import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import React from 'react';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect('/');
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="flex">
                {/* Sidebar */}
                <aside className="w-64 bg-white dark:bg-gray-800 min-h-screen border-r border-gray-200 dark:border-gray-700">
                    <div className="p-6">
                        <h1 className="text-2xl font-bold gradient-text">InvestNova</h1>
                    </div>
                    <nav className="px-4 space-y-2">
                        <a
                            href="/dashboard"
                            className="block px-4 py-2 rounded-lg bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300 font-medium"
                        >
                            Dashboard
                        </a>
                        <a
                            href="/dashboard/recommendations"
                            className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                        >
                            Recommendations
                        </a>
                        <a
                            href="/dashboard/portfolio"
                            className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                        >
                            Portfolio Simulator
                        </a>
                        <a
                            href="/dashboard/history"
                            className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                        >
                            History
                        </a>
                        <a
                            href="/dashboard/profile"
                            className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                        >
                            Profile Settings
                        </a>
                    </nav>
                </aside>

                {/* Main content */}
                <main className="flex-1 p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
