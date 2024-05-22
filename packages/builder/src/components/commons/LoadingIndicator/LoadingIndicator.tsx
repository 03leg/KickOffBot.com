import { CircularProgress } from '@mui/material';
import React from 'react';

interface Props {
    size?: string | number | undefined;
}


export const LoadingIndicator = ({ size }: Props) => {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <CircularProgress size={size} />
        </div>
    )
}
