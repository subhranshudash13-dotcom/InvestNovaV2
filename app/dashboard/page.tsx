"use client";

import { useUser } from '@/hooks/useUser';
import { DashboardOverview } from '@/components/dashboard/DashboardOverview';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
    const { user, loading } = useUser();

    if (loading) {
        return (
            <div className="p-8 space-y-4">
                <Skeleton className="h-10 w-[250px]" />
                <Skeleton className="h-[400px] w-full" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="p-8 text-center text-muted-foreground">
                Please sign in to view your dashboard.
            </div>
        );
    }

    return <DashboardOverview user={user} />;
}
