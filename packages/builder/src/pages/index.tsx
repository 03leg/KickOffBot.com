import * as React from 'react';
import { useRouter } from 'next/router';
import { signIn, useSession } from 'next-auth/react';
import { useEffect, useMemo } from 'react';
import { Button } from '@mui/material';

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

    const handleGetStartedClick = React.useCallback(() => {
        void signIn();
    }, []);

    if (auth || status === "loading") {
        return null;
    }

    return (
        <div className='landing-page-container'>
            <h1 className='landing-page-main-title'>Make your <span style={{ color: '#3390ec' }}>telegram</span> bot without coding</h1>
            <div className='landing-page-buttons-container'>
                <Button variant="text" size="large" color="primary" onClick={handleGetStartedClick}>Get started</Button>
            </div>
        </div>
    );
}