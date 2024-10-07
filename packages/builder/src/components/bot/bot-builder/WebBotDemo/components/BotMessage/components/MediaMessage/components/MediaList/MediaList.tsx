import { WebImageMediaDescription, WebMediaDescription, WebMediaType } from '@kickoffbot.com/types';
import { Box } from '@mui/material';
import React from 'react';
import { useMediaListStyles } from './MediaList.style';
import { ImageMediaItem } from '../ImageMediaItem';

interface Props {
    medias: WebMediaDescription[];
    wrapped?: boolean;
    direction: 'row' | 'column';
}

export const MediaList = ({ medias, wrapped = false, direction }: Props) => {
    const { classes } = useMediaListStyles({ wrapped, direction });
    return (
        <Box className={classes.root}>
            {medias.map((media, index) => {

                if (media.type === WebMediaType.IMAGE) {
                    return <ImageMediaItem image={media as WebImageMediaDescription} count={medias.length} key={media.id} wrapped={wrapped} isLast={index + 1 === medias.length} direction={direction} />
                }

                if (media.type === WebMediaType.VIDEO) {
                    return <>Not implemented yet...</>
                }

                throw new Error('Unsupported media type');
            })}

        </Box>
    )
}
