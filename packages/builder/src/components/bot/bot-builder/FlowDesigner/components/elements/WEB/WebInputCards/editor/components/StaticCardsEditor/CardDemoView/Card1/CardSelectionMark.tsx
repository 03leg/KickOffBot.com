import { Box } from '@mui/material'
import React from 'react';
// import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CheckIcon from '@mui/icons-material/Check';

export const CardSelectionMark = () => {
    return (
        <Box>
            <Box sx={{
                position: 'absolute', top: 0, right: 0, width: 36, height: 36, bgcolor: '#1976d2',
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                borderBottomLeftRadius: (theme) => theme.shape.borderRadius
            }} >
                {/* <CheckCircleOutlineIcon sx={{ color: 'white' }} /> */}
                <CheckIcon sx={{ color: 'white' }} />
            </Box>
        </Box>
    )
}
