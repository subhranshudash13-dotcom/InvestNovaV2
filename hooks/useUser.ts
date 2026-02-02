'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

export interface UserProfileData {
    id: string;
    email: string;
    riskTolerance?: 'low' | 'medium' | 'high';
    investmentHorizon?: 'short' | 'medium' | 'long';
    investmentAmount?: number;
    preferredAssets?: Array<'stocks' | 'forex' | 'crypto'>;
    onboardingCompleted?: boolean;
}

function mapProfileFromDb(row: any): UserProfileData {
    return {
        id: row.id,
        email: row.email,
        riskTolerance: row.risk_tolerance ?? undefined,
        investmentHorizon: row.investment_horizon ?? undefined,
        investmentAmount: row.investment_amount ?? undefined,
        preferredAssets: row.preferred_assets ?? undefined,
        onboardingCompleted: row.onboarding_completed ?? undefined,
    };
}

export function useUser() {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfileData | null>(null);
    const [loading, setLoading] = useState(true);

    const supabase = createClient();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user: currentUser } } = await supabase.auth.getUser();
            setUser(currentUser);

            if (currentUser) {
                // Fetch user profile from Supabase
                const { data } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', currentUser.id)
                    .single();

                setProfile(data ? mapProfileFromDb(data) : null);
            }

            setLoading(false);
        };

        getUser();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                setUser(session?.user ?? null);

                if (session?.user) {
                    const { data } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', session.user.id)
                        .single();

                    setProfile(data ? mapProfileFromDb(data) : null);
                } else {
                    setProfile(null);
                }
            }
        );

        return () => {
            subscription.unsubscribe();
        };
    }, [supabase]);

    const updateProfile = async (updates: Partial<UserProfileData>) => {
        if (!user) return { error: { message: 'User not logged in', name: 'AuthError', status: 401 } };

        const updateRow: Record<string, unknown> = {
            id: user.id,
        };

        if (updates.email !== undefined) updateRow.email = updates.email;
        if (updates.riskTolerance !== undefined) updateRow.risk_tolerance = updates.riskTolerance;
        if (updates.investmentHorizon !== undefined) updateRow.investment_horizon = updates.investmentHorizon;
        if (updates.investmentAmount !== undefined) updateRow.investment_amount = updates.investmentAmount;
        if (updates.preferredAssets !== undefined) updateRow.preferred_assets = updates.preferredAssets;
        if (updates.onboardingCompleted !== undefined) updateRow.onboarding_completed = updates.onboardingCompleted;

        const { error } = await supabase
            .from('profiles')
            .upsert(updateRow);

        if (!error && profile) {
            setProfile({ ...profile, ...updates });
        }

        return { error };
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setProfile(null);
    };

    return {
        user,
        profile,
        loading,
        updateProfile,
        signOut,
    };
}
