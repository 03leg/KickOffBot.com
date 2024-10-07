import { WebImageMediaDescription, WebMediaDescription, WebMediaType } from '@kickoffbot.com/types';
import { Box, Typography } from '@mui/material';
import React from 'react';
import { ImageProperties } from './components/ImageProperties/ImageProperties';

interface Props {
    media: WebMediaDescription;
}

export const SelectedMediaProps = ({ media }: Props) => {
    return (
        <Box>
            {media.type === WebMediaType.IMAGE && <>
                <Typography variant='h5'>Image properties</Typography>
                <ImageProperties image={media as WebImageMediaDescription} />
            </>}
            {media.type === WebMediaType.VIDEO && <Typography variant='h5'>Video properties</Typography>}


        </Box>
    )
}
