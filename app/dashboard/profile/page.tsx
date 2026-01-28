'use client';

import { useState } from 'react';
import { useUser } from '@/hooks/useUser';

export default function ProfilePage() {
    const { user, profile, updateProfile } = useUser();
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    const [riskTolerance, setRiskTolerance] = useState(profile?.riskTolerance || 'medium');
    const [investmentHorizon, setInvestmentHorizon] = useState(profile?.investmentHorizon || 'medium');
    const [investmentAmount, setInvestmentAmount] = useState(profile?.investmentAmount || 10000);
    const [preferredAssets, setPreferredAssets] = useState(profile?.preferredAssets || 'both');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');

        const { error } = await updateProfile({
            riskTolerance,
            investmentHorizon,
            investmentAmount,
            preferredAssets,
        });

        if (error) {
            setMessage('Error saving profile. Please try again.');
        } else {
            setMessage('Profile saved successfully!');
        }

        setSaving(false);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold gradient-text mb-8">Profile Settings</h1>

            <div className="glass-card p-8 max-w-2xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-3">Risk Tolerance</label>
                        <div className="grid grid-cols-3 gap-3">
                            {(['low', 'medium', 'high'] as const).map((level) => (
                                <button
                                    key={level}
                                    type="button"
                                    onClick={() => setRiskTolerance(level)}
                                    className={`p-4 rounded-lg border-2 transition ${riskTolerance === level
                                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                                            : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
                                        }`}
                                >
                                    <div className="font-semibold capitalize">{level}</div>
                                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                        {level === 'low' && 'Conservative'}
                                        {level === 'medium' && 'Balanced'}
                                        {level === 'high' && 'Aggressive'}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-3">Investment Horizon</label>
                        <div className="grid grid-cols-3 gap-3">
                            {(['short', 'medium', 'long'] as const).map((horizon) => (
                                <button
                                    key={horizon}
                                    type="button"
                                    onClick={() => setInvestmentHorizon(horizon)}
                                    className={`p-4 rounded-lg border-2 transition ${investmentHorizon === horizon
                                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                                            : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
                                        }`}
                                >
                                    <div className="font-semibold capitalize">{horizon}-term</div>
                                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                        {horizon === 'short' && 'Days to weeks'}
                                        {horizon === 'medium' && 'Weeks to months'}
                                        {horizon === 'long' && 'Months+'}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Investment Amount ($)</label>
                        <input
                            type="number"
                            value={investmentAmount}
                            onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                            min="100"
                            step="100"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-3">Preferred Assets</label>
                        <div className="grid grid-cols-3 gap-3">
                            {(['stocks', 'forex', 'both'] as const).map((asset) => (
                                <button
                                    key={asset}
                                    type="button"
                                    onClick={() => setPreferredAssets(asset)}
                                    className={`p-4 rounded-lg border-2 transition ${preferredAssets === asset
                                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                                            : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
                                        }`}
                                >
                                    <div className="font-semibold capitalize">{asset}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        className="button-primary w-full"
                    >
                        {saving ? 'Saving...' : 'Save Profile'}
                    </button>
                </form>

                {message && (
                    <div className={`mt-4 p-3 rounded-lg ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'} text-sm`}>
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
}
