import { VideoSource, WebVideoMediaDescription } from '@kickoffbot.com/types';
import React, { useMemo } from 'react';
import { useVideoMediaItemStyles } from './VideoMediaItem.style';
import { getYoutubeIdFromUrl } from './VideoMediaItem.utils';

interface Props {
    video: WebVideoMediaDescription;
    isLast: boolean;
}

export const VideoMediaItem = ({ video, isLast }: Props) => {
    const { classes } = useVideoMediaItemStyles({ video, isLast });
    const videoDescription = video.video;

    const youtubeVideoUrl = useMemo(() => {
        const videoId = getYoutubeIdFromUrl(videoDescription.url);
        const baseUrl = `https://www.youtube.com/embed/${videoId}`;
        const extraParams = [];

        if (video.autoPlay) {
            extraParams.push('autoplay=1');
            extraParams.push('mute=1');
        }

        if (video.startTime) {
            extraParams.push(`start=${video.startTime}`);
        }

        if (video.endTime) {
            extraParams.push(`end=${video.endTime}`);
        }

        if (video.showVideoControls === false) {
            extraParams.push('showinfo=0');
            extraParams.push('controls=0');
        }

        if (extraParams.length > 0) {
            return `${baseUrl}?${extraParams.join('&')}`;
        }

        return baseUrl;
    }, [video.autoPlay, video.endTime, video.showVideoControls, video.startTime, videoDescription.url])

    return (
        <>
            {videoDescription.source === VideoSource.DIRECT_VIDEO_URL || videoDescription.source === VideoSource.UPLOADED && (
                <video className={classes.video} controls={video.showVideoControls ?? true} autoPlay={video.autoPlay ?? false} muted={video.autoPlay ?? false} loop={video.loop ?? false} preload="metadata">
                    <source src={videoDescription.url + '#t=0.1'} />
                </video>
            )}

            {videoDescription.source === VideoSource.YOUTUBE && (
                <iframe className={classes.video} src={youtubeVideoUrl} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share;" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
            )}
        </>
    )
}
