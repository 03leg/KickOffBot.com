import { VideoSource, WebVideoDescription } from '@kickoffbot.com/types';
import React from 'react';
import { getYoutubeIdFromUrl } from '../../../VideoMedia/VideoMedia.utils';

interface Props {
    video: WebVideoDescription;
}

export const VideoPreview = ({ video }: Props) => {
    return (
        <>
            {video.source === VideoSource.DIRECT_VIDEO_URL || video.source === VideoSource.UPLOADED && (
                <video width={'100%'} controls={true} preload="metadata">
                    <source src={video.url + '#t=0.1'} />
                </video>
            )}
            {video.source === VideoSource.YOUTUBE && (
                <iframe width="100%"  style={{ minHeight: '220px' }} src={`https://www.youtube.com/embed/${getYoutubeIdFromUrl(video.url)}?start=50&end=60`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; autoplay" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
            )}
        </>
    )
}
