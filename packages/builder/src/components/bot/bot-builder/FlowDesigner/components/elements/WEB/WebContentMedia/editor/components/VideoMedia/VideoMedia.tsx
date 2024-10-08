import { VideoSource, WebVideoMediaDescription } from '@kickoffbot.com/types';
import { Box, Chip, IconButton, Typography } from '@mui/material';
import React, { useMemo } from 'react';
import { useVideoMediaStyles } from './VideoMedia.style';
import DeleteIcon from '@mui/icons-material/Delete';
import { getYoutubeIdFromUrl } from './VideoMedia.utils';


interface Props {
    video: WebVideoMediaDescription;
    onDelete?: (video: WebVideoMediaDescription) => void;
    selected: boolean;
    onSelect: (video: WebVideoMediaDescription) => void;
}

export const VideoMedia = ({ video, onDelete, selected, onSelect }: Props) => {
    const { classes, cx } = useVideoMediaStyles();

    const chipText = useMemo(() => {

        if (video.video.source === VideoSource.UPLOADED) {
            return 'Uploaded';
        }

        if (video.video.source === VideoSource.YOUTUBE) {
            return 'Youtube';
        }

        if (video.video.source === VideoSource.DIRECT_VIDEO_URL) {
            return 'URL';
        }

        return 'Unknown';
    }, [video.video.source]);

    const youtubeThumbnailUrl = useMemo(() => {
        if (video.video.source !== VideoSource.YOUTUBE) {
            return null;
        }
        const youtubeId = getYoutubeIdFromUrl(video.video.url);
        if (!youtubeId) {
            return null;
        }

        return `https://i1.ytimg.com/vi/${youtubeId}/default.jpg`;
    }, [video.video.source, video.video.url]);


    return (
        <Box className={cx(classes.root, selected && classes.selected)}>
            <Box className={cx(classes.videoRoot)}>

                {(video.video.source === VideoSource.UPLOADED || video.video.source === VideoSource.DIRECT_VIDEO_URL) &&
                    <>
                        <Chip sx={{ position: 'absolute', top: 5, left: 5, backgroundColor: 'white', color: 'black' }} label={chipText} size="small" variant="outlined" />
                        <video height={'100%'} width={'100%'} controls={false} preload="metadata" onClick={() => onSelect(video)}>
                            <source src={video.video.url + '#t=0.1'} type="video/mp4" />
                        </video>
                    </>

                }
                {video.video.source === VideoSource.YOUTUBE &&
                    <>
                        {youtubeThumbnailUrl && <>
                            <Chip sx={{ position: 'absolute', top: 5, left: 5, backgroundColor: 'white', color: 'black' }} label={chipText} size="small" variant="outlined" />
                            <img height={'100%'} style={{ objectFit: 'contain' }} width={'100%'} src={youtubeThumbnailUrl} onClick={() => onSelect(video)} />
                        </>}
                        {!youtubeThumbnailUrl && <Typography sx={{ textAlign: 'center', color: 'white' }}>Sorry, we can&apos;t parse video id from url</Typography>}
                    </>
                }
                {onDelete && <IconButton onClick={() => { onDelete(video) }} aria-label="delete" size="small" classes={{ root: classes.action }}>
                    <DeleteIcon fontSize="small" />
                </IconButton>
                }
            </Box>
        </Box>
    )
}
