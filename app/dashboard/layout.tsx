import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background">
            <Sidebar />
            <div className="md:ml-64">
                <div className="p-6">
                    <main>{children}</main>
                </div>
            </div>
        </div>
    );
}
