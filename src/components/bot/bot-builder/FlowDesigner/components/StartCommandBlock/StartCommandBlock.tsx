import { Box } from '@mui/material'
import React from 'react'
import { Colors } from '~/themes/Colors'

export const StartCommandBlock = () => {
    return (
        <Box sx={{
            backgroundColor: Colors.WHITE,
            border: `1px solid ${Colors.BORDER}`,
            borderRadius: 1, minHeight: 100, width: 350, padding: 1,
            position: 'relative',
            userSelect: 'none',
        }}>
            /start
        </Box>
    )
}
