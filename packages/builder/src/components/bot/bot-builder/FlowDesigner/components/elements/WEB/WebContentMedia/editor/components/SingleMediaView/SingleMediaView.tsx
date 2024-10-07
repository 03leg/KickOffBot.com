import React, { useMemo } from 'react'
import { useSingleMediaViewStyles } from './SingleMediaView.style';
import { Box } from '@mui/material';
import { WebImageMediaDescription, WebMediaDescription, WebMediaType } from '@kickoffbot.com/types';

interface Props {
    media: WebMediaDescription
}

export const SingleMediaView = ({ media }: Props) => {
    const { classes } = useSingleMediaViewStyles();

    const imageUrl = useMemo(() => {
        const item = media as WebImageMediaDescription;
        if (typeof item.image === 'string') {
            return item.image;
        }

        if (item.image.source === 'unsplash') {
            return item.image.regularSrc;
        }

        throw new Error('Unsupported image source');
    }, [media]);

    return (
        <Box className={classes.root}>
            {media.type === WebMediaType.IMAGE && <img className={classes.img} src={imageUrl} />}
            {media.type === WebMediaType.VIDEO && <>Not implemented yet...</>}
        </Box>
    )
}
