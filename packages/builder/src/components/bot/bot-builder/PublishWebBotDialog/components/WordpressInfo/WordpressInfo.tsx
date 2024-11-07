import { Box } from '@mui/material'
import React from 'react';
import { UrlViewer } from '../UrlViewer';

interface Props {
    botId: string;
}

export const WordpressInfo = ({ botId }: Props) => {
    return (
        <Box>
            1. Go to the <a href="https://wordpress.org/plugins/kickoffbot/" target="_blank" rel="noreferrer">WordPress Plugin Page</a> and install the plugin.<br />
            2. Add your bot id to the plugin settings.<br />
            <UrlViewer text={botId} />
        </Box>
    )
}
