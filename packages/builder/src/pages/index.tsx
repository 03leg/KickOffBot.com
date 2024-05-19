import * as React from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useEffect, useMemo } from 'react';
import { LandingPage } from './LandingPage';

export default function IndexPage() {
    const router = useRouter();
    const { data: sessionData, status } = useSession();
    const auth = useMemo(() => sessionData != null, [sessionData]);

    useEffect(() => {
        if (status !== "loading") {
            if (auth) {
                void router.push("/my-bots");
            }
        }
    }, [auth, router, status]);

    if (auth || status === "loading") {
        return null;
    }

    return (
        <LandingPage />
    );
}