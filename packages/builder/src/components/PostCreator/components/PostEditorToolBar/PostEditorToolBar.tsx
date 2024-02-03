import { Box, Button } from '@mui/material'
import React from 'react'

interface PostEditorToolBarProps {
    onPublish: () => void;
}

export const PostEditorToolBar = ({ onPublish }: PostEditorToolBarProps) => {
    return (
        <Box sx={{ padding: (theme) => theme.spacing(), justifyContent: 'flex-end', display: 'flex' }}>
            <Button variant="outlined" onClick={onPublish}>Publish</Button>
        </Box>
    )
}
