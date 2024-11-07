import { Box } from '@mui/material';
import React from 'react';
import { UrlViewer } from '../UrlViewer';

interface Props {
    url: string
}

export const NotionInfo = ({ url }: Props) => {
    return (
        <Box>
            1. Command <code>/embed</code><br />
            2. Insert your bot url
            <UrlViewer text={url} />
        </Box>
    )
}
