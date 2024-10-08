import { ElementType, WebContentMediaUIElement } from '@kickoffbot.com/types';
import React from 'react';
import { MediasViewer } from './editor/components/MediasViewer';
import { SingleMediaView } from './editor/components/SingleMediaView';

interface Props {
    element: WebContentMediaUIElement;
}

export const WebContentMedia = ({ element }: Props) => {
    const noConfiguredText = element.type === ElementType.WEB_CONTENT_IMAGES ? 'Configure "Image(s)" element...' : 'Configure "Video(s)" element...';

    return (
        <>
            {element.medias && element.medias.length > 1 && <MediasViewer medias={element.medias} />}
            {element.medias && element.medias.length === 1 && <SingleMediaView media={element.medias[0]!} />}
            {(element.medias == null || element.medias.length === 0) && <div>{noConfiguredText}</div>}
        </>
    )
}
