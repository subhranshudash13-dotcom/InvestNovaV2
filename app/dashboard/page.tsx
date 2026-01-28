import { createClient } from '@/lib/supabase/server';

export default async function DashboardPage() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold gradient-text mb-2">Welcome back!</h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Here's your personalized investment overview
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="glass-card p-6">
                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                        Portfolio Value
                    </h3>
                    <div className="text-3xl font-bold">$0.00</div>
                    <p className="text-sm text-risk-low mt-1">+0.00%</p>
                </div>

                <div className="glass-card p-6">
                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                        Risk Exposure
                    </h3>
                    <div className="text-3xl font-bold">Low</div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Well balanced</p>
                </div>

                <div className="glass-card p-6">
                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                        Active Recommendations
                    </h3>
                    <div className="text-3xl font-bold">0</div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Generate your first</p>
                </div>
            </div>

            <div className="glass-card p-6">
                <h2 className="text-xl font-bold mb-4">Get Started</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Complete your profile to receive personalized stock and forex recommendations.
                </p>
                <a
                    href="/dashboard/profile"
                    className="button-primary inline-block"
                >
                    Set Up Profile
                </a>
            </div>

            {/* Disclaimer */}
            <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-sm">
                <p className="text-yellow-800 dark:text-yellow-200">
                    ⚠️ <strong>Disclaimer:</strong> InvestNova provides AI-generated insights based on public data and is NOT financial advice.
                    Always consult a licensed financial advisor before making investment decisions.
                </p>
            </div>
        </div>
    );
}
