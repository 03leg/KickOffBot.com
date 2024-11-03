import { MediaMessageDescription, MediaViewMode } from '@kickoffbot.com/types';
import React from 'react';
import { MediaList } from './components/MediaList';
import { MasonryMediaList } from './components/MasonryMediaList';

interface Props {
    content: MediaMessageDescription;
    onContentHeightChange: () => void;
}

export const MediaMessage = ({ content, onContentHeightChange }: Props) => {
    return (
        <>
            {(content.viewMode == null || content.viewMode === MediaViewMode.HorizontalMediaList) && <MediaList direction="row" medias={content.medias} onContentHeightChange={onContentHeightChange}/>}
            {(content.viewMode === MediaViewMode.VerticalMediaList) && <MediaList direction="column" medias={content.medias} onContentHeightChange={onContentHeightChange}/>}
            {(content.viewMode === MediaViewMode.WrappedHorizontalMediaList) && <MediaList direction='row' medias={content.medias} wrapped={true} onContentHeightChange={onContentHeightChange} />}
            {(content.viewMode === MediaViewMode.MasonryMediaList) && <MasonryMediaList medias={content.medias} onContentHeightChange={onContentHeightChange}/>}
        </>
    )
}
