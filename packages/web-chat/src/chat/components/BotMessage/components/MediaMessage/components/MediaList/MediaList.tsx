import { WebImageMediaDescription, WebMediaDescription, WebMediaType, WebVideoMediaDescription } from '@kickoffbot.com/types';
import { Box } from '@mui/material';
import React from 'react';
import { useMediaListStyles } from './MediaList.style';
import { ImageMediaItem } from '../ImageMediaItem';
import { VideoMediaItem } from '../VideoMediaItem';

interface Props {
    medias: WebMediaDescription[];
    wrapped?: boolean;
    direction: 'row' | 'column';
    onContentHeightChange: () => void;
}

export const MediaList = ({ medias, wrapped = false, direction, onContentHeightChange }: Props) => {
    const { classes } = useMediaListStyles({ wrapped, direction });

    return (
        <Box className={classes.root} data-testid="MediaList">
            {medias.map((media, index) => {

                if (media.type === WebMediaType.IMAGE) {
                    return <ImageMediaItem image={media as WebImageMediaDescription} count={medias.length} 
                    key={media.id} wrapped={wrapped} isLast={index + 1 === medias.length} direction={direction} 
                    onContentHeightChange={onContentHeightChange}
                    />
                }

                if (media.type === WebMediaType.VIDEO) {
                    return <VideoMediaItem  key={media.id} video={media as WebVideoMediaDescription} isLast={index + 1 === medias.length}></VideoMediaItem>
                }

                throw new Error('Unsupported media type');
            })}

        </Box>
    )
}
