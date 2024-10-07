import { WebImageMediaDescription, WebMediaDescription, WebMediaType, WebVideoMediaDescription } from '@kickoffbot.com/types';
import React, { ReactNode, useCallback, useMemo } from 'react';
import { ImageMedia } from '../ImageMedia';
import { VideoMedia } from '../VideoMedia';
import { useMediasViewerStyles } from './MediasViewer.style';
import { Box } from '@mui/material';

interface Props {
    medias: WebMediaDescription[];
    onDelete?: (item: WebMediaDescription) => void;
    selectedItem?: WebMediaDescription | null;
    onSelectItem?: (item: WebMediaDescription) => void;
}

export const MediasViewer = ({ medias, onDelete, selectedItem, onSelectItem }: Props) => {
    const { classes } = useMediasViewerStyles();

    const handleSelectElement = useCallback((element: WebMediaDescription) => {
        onSelectItem?.(element);
    }, [onSelectItem]);

    const elements = useMemo(() => {
        const result: ReactNode[] = [];

        for (const media of medias) {
            if (media.type === WebMediaType.IMAGE) {
                result.push((<ImageMedia onSelect={handleSelectElement} selected={selectedItem?.id === media.id} onDelete={onDelete} key={media.id} image={media as WebImageMediaDescription} />));
                continue;
            }

            if (media.type === WebMediaType.VIDEO) {
                result.push((<VideoMedia onDelete={onDelete} key={media.id} video={media as WebVideoMediaDescription} />));
                continue;
            }

            throw new Error('InvalidOperationError. Unknown media type.');
        }

        return result;
    }, [handleSelectElement, medias, onDelete, selectedItem?.id]);


    return (
        <Box className={classes.root}>
            {medias.length === 0 && <Box className={classes.empty}>No medias</Box>}
            {elements}
        </Box>
    )
}
