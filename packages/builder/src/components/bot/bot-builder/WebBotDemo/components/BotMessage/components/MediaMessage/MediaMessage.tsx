import { MediaMessageDescription, MediaViewMode } from '@kickoffbot.com/types';
import React from 'react';
import { MediaList } from './components/MediaList';
import { MasonryMediaList } from './components/MasonryMediaList';

interface Props {
    content: MediaMessageDescription;
}

export const MediaMessage = ({ content }: Props) => {
    return (
        <>
            {(content.viewMode == null || content.viewMode === MediaViewMode.HorizontalMediaList) && <MediaList direction="row" medias={content.medias} />}
            {(content.viewMode === MediaViewMode.VerticalMediaList) && <MediaList direction="column" medias={content.medias} />}
            {(content.viewMode === MediaViewMode.WrappedHorizontalMediaList) && <MediaList direction='row' medias={content.medias} wrapped={true} />}
            {(content.viewMode === MediaViewMode.MasonryMediaList) && <MasonryMediaList medias={content.medias} />}
        </>
    )
}
