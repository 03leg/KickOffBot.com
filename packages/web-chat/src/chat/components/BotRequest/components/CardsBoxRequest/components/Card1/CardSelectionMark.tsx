import { Box } from '@mui/material'
import React from 'react';
// import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CheckIcon from '@mui/icons-material/Check';

export const CardSelectionMark = () => {
    return (
        <Box>
            <Box sx={{
                position: 'absolute', top: 0, right: 0, width: 36, height: 36, bgcolor: (theme) => theme.palette.primary.main,
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                borderBottomLeftRadius: (theme) => theme.shape.borderRadius,
                zIndex: 1
            }} >
                {/* <CheckCircleOutlineIcon sx={{ color: 'white' }} /> */}
                <CheckIcon sx={{ color: (theme) => theme.palette.primary.contrastText }} />
            </Box>
        </Box>
    )
}
