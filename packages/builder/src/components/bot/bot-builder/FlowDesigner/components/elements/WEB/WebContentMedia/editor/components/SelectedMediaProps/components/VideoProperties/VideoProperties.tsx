import { WebVideoMediaDescription } from '@kickoffbot.com/types';
import { Box } from '@mui/material';
import React from 'react';
import { useVideoPropertiesStyles } from './VideoProperties.style';
import { VideoPreview } from './VideoPreview';
import { VideoPropertyEditors } from './VideoPropertyEditors';

interface Props {
    video: WebVideoMediaDescription;
}

export const VideoProperties = ({ video }: Props) => {
    const { classes } = useVideoPropertiesStyles();
    return (
        <Box className={classes.root}>
            <Box className={classes.videoPreview}>
                <VideoPreview video={video.video} />
            </Box>
            <Box className={classes.propsContainer}>
                <VideoPropertyEditors video={video} />
            </Box>
        </Box>
    )
}