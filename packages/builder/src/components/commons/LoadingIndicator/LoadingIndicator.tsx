import { CircularProgress } from '@mui/material';
import React from 'react';


export const LoadingIndicator = () => {
    return (
        <div style={{
            display: 'flex', 
            position: 'fixed',
            alignItems: 'center', 
            top: 0, 
            left: 0,
            height: '100vh', 
            width: '100%', 
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.12)',
            pointerEvents: 'none',
            zIndex: 99999999999
        }}>
            <CircularProgress />
        </div>
    )
}
