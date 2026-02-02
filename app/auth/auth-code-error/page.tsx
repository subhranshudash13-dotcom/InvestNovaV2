import Link from 'next/link';

export default function AuthCodeErrorPage() {
    return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
            <div className="max-w-md w-full glass-card p-8 text-center">
                <h1 className="text-2xl font-bold mb-2">Authentication failed</h1>
                <p className="text-muted-foreground mb-6">
                    We couldn&apos;t complete the sign-in process. Please try again.
                </p>
                <div className="flex items-center justify-center gap-3">
                    <Link className="button-primary px-6 py-2 rounded-lg" href="/login">
                        Go to Login
                    </Link>
                    <Link className="button-secondary px-6 py-2 rounded-lg" href="/">
                        Back Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
