import { VideoSource, WebVideoMediaDescription } from '@kickoffbot.com/types';
import { Box, Checkbox, FormControlLabel, TextField } from '@mui/material';
import React, { useCallback } from 'react';
import { useVideoPropertiesStyles } from './VideoProperties.style';

interface Props {
    video: WebVideoMediaDescription;
}

export const VideoPropertyEditors = ({ video }: Props) => {
    const { classes } = useVideoPropertiesStyles();
    const [showVideoControls, setShowVideoControls] = React.useState<boolean>(video.showVideoControls ?? true);
    const [autoPlay, setAutoPlay] = React.useState<boolean>(video.autoPlay ?? false);
    const [loop, setLoop] = React.useState<boolean>(video.loop ?? false);
    const [disabledAutoPlay, setDisabledAutoPlay] = React.useState<boolean>(video.showVideoControls === false);
    const [videoWidth, setVideoWidth] = React.useState(video.videoWidth ?? '');
    const [videoHeight, setVideoHeight] = React.useState(video.videoHeight ?? '');
    const [startTime, setStartTime] = React.useState(video.startTime ?? '');
    const [endTime, setEndTime] = React.useState(video.endTime ?? '');

    const handleVideoWidthChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setVideoWidth(event.target.value);
        video.videoWidth = event.target.value.replace(/ /g, '') === "" ? undefined : event.target.value;
    }, [video]);

    const handleVideoHeightChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setVideoHeight(event.target.value);
        video.videoHeight = event.target.value.replace(/ /g, '') === "" ? undefined : event.target.value;
    }, [video]);

    const handleVideoStartChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setStartTime(event.target.value);
        video.startTime = event.target.value.replace(/ /g, '') === "" ? undefined : Number(event.target.value);
    }, [video]);

    const handleVideoEndChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setEndTime(event.target.value);
        video.endTime = event.target.value.replace(/ /g, '') === "" ? undefined : Number(event.target.value);
    }, [video]);

    const handleShowVideoControlsChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setShowVideoControls(event.target.checked);
        video.showVideoControls = event.target.checked;

        if (!event.target.checked) {
            setAutoPlay(true);
            setDisabledAutoPlay(true);
            video.autoPlay = true;
        } else {
            setDisabledAutoPlay(false);
        }

    }, [video]);

    const handleAutoPlayChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setAutoPlay(event.target.checked);
        video.autoPlay = event.target.checked;
    }, [video]);
    
    
    const handleLoopChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setLoop(event.target.checked);
        video.loop = event.target.checked;
    }, [video]);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <FormControlLabel control={<Checkbox checked={showVideoControls} onChange={handleShowVideoControlsChange} />} label="Show video controls" />
            <FormControlLabel disabled={disabledAutoPlay} control={<Checkbox checked={autoPlay} onChange={handleAutoPlayChange} />} label="Auto play" />
            {(video.video.source === VideoSource.DIRECT_VIDEO_URL || video.video.source === VideoSource.UPLOADED) && <FormControlLabel control={<Checkbox checked={loop} onChange={handleLoopChange} />} label="Loop" />}

            <TextField className={classes.editorField} placeholder='e.g. 100, 200px, 50%' label="Video width (optional)" value={videoWidth} onChange={handleVideoWidthChange} />
            <TextField className={classes.editorField} placeholder='e.g. 100, 200px, 50%' label="Video height (optional)" value={videoHeight} onChange={handleVideoHeightChange} />

            {video.video.source === VideoSource.YOUTUBE &&
                <>
                    <TextField className={classes.editorField} type='number' placeholder='e.g. 50' label="Start time, sec (optional)" value={startTime} onChange={handleVideoStartChange} />
                    <TextField className={classes.editorField} type='number' placeholder='e.g. 130' label="End time, sec (optional)" value={endTime} onChange={handleVideoEndChange} />
                </>}
        </Box>
    )
}
