import { Button } from '@mui/material'
import { signIn } from 'next-auth/react';
import React, { useCallback } from 'react'


export const LandingPage = () => {
    const handleGetStartedClick = useCallback(() => {
        void signIn();
    }, []);

    return (
        <div className='landing-page-container'>
            <h1 className='landing-page-main-title'>Make your <span style={{ color: '#3390ec' }}>telegram</span> bot without coding</h1>
            <div className='landing-page-buttons-container'>
                <Button variant="text" size="large" color="primary" onClick={handleGetStartedClick}>Get started</Button>
            </div>
        </div>
    )
}
