'use client';

import { useRouter } from 'next/navigation';
import AuthModal from '@/components/auth/AuthModal';

export default function LoginPage() {
    const router = useRouter();

    return (
        <AuthModal
            initialMode="signin"
            onClose={() => {
                router.push('/');
            }}
        />
    );
}
