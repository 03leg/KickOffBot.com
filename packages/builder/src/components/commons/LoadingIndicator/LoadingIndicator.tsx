import { CircularProgress } from '@mui/material';
import React from 'react';


export const LoadingIndicator = () => {
    return (
        <div style={{
            display: 'flex', 
            alignItems: 'center',    
            justifyContent: 'center',
        }}>
            <CircularProgress />
        </div>
    )
}
