import { NextResponse } from 'next/server';

import { createClient } from '@/lib/supabase/server';

type PreferredAsset = 'stocks' | 'forex' | 'crypto';

type ProfileResponse = {
    id: string;
    email: string;
    fullName?: string;
    riskTolerance?: 'low' | 'medium' | 'high';
    investmentHorizon?: 'short' | 'medium' | 'long';
    investmentAmount?: number;
    preferredAssets?: PreferredAsset[];
    onboardingCompleted?: boolean;
    createdAt?: string;
    updatedAt?: string;
};

function mapProfileFromDb(row: any): ProfileResponse {
    return {
        id: row.id,
        email: row.email,
        fullName: row.full_name ?? undefined,
        riskTolerance: row.risk_tolerance ?? undefined,
        investmentHorizon: row.investment_horizon ?? undefined,
        investmentAmount: row.investment_amount ?? undefined,
        preferredAssets: row.preferred_assets ?? undefined,
        onboardingCompleted: row.onboarding_completed ?? undefined,
        createdAt: row.created_at ?? undefined,
        updatedAt: row.updated_at ?? undefined,
    };
}

function isPreferredAssets(value: unknown): value is PreferredAsset[] {
    if (!Array.isArray(value)) return false;
    return value.every((v) => v === 'stocks' || v === 'forex' || v === 'crypto');
}

export async function GET() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
        return NextResponse.json({ profile: null }, { status: 200 });
    }

    return NextResponse.json({ profile: mapProfileFromDb(data) }, { status: 200 });
}

export async function PUT(request: Request) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') {
        return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const updateRow: Record<string, unknown> = {
        id: user.id,
        email: user.email,
        updated_at: new Date().toISOString(),
    };

    if (typeof (body as any).fullName === 'string') updateRow.full_name = (body as any).fullName;
    if (typeof (body as any).riskTolerance === 'string') updateRow.risk_tolerance = (body as any).riskTolerance;
    if (typeof (body as any).investmentHorizon === 'string') updateRow.investment_horizon = (body as any).investmentHorizon;
    if (typeof (body as any).investmentAmount === 'number') updateRow.investment_amount = (body as any).investmentAmount;
    if ((body as any).onboardingCompleted === true || (body as any).onboardingCompleted === false) {
        updateRow.onboarding_completed = (body as any).onboardingCompleted;
    }

    if ((body as any).preferredAssets !== undefined) {
        if (!isPreferredAssets((body as any).preferredAssets)) {
            return NextResponse.json({ error: 'preferredAssets must be an array of stocks|forex|crypto' }, { status: 400 });
        }
        updateRow.preferred_assets = (body as any).preferredAssets;
    }

    const { error } = await supabase.from('profiles').upsert(updateRow).select('*').single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    return NextResponse.json({ profile: data ? mapProfileFromDb(data) : null }, { status: 200 });
}
