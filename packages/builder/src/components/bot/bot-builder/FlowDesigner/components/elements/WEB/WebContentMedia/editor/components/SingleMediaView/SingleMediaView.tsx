import React, { useMemo } from 'react'
import { useSingleMediaViewStyles } from './SingleMediaView.style';
import { Box } from '@mui/material';
import { WebImageMediaDescription, WebMediaDescription, WebMediaType, WebVideoMediaDescription } from '@kickoffbot.com/types';
import { VideoPreview } from '../SelectedMediaProps/components/VideoProperties/VideoPreview';

interface Props {
    media: WebMediaDescription
}

export const SingleMediaView = ({ media }: Props) => {
    const { classes } = useSingleMediaViewStyles();

    const imageUrl = useMemo(() => {
        if (media.type === WebMediaType.VIDEO) {
            return null;
        }

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
            {media.type === WebMediaType.IMAGE && imageUrl && !/<%variables.(.*?)%>/g.test(imageUrl) && <img className={classes.img} src={imageUrl} />}
            {media.type === WebMediaType.IMAGE && imageUrl && /<%variables.(.*?)%>/g.test(imageUrl) && <Box className={classes.notImageBox}>Image URL has variable references</Box>}
            {media.type === WebMediaType.VIDEO &&
                <>
                    <VideoPreview video={(media as WebVideoMediaDescription).video} />
                </>}
        </Box>
    )
}
