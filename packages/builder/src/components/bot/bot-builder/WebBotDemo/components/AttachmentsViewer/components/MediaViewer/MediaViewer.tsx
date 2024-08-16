import { ContentType, FileDescription } from '@kickoffbot.com/types';
import { Box } from '@mui/material'
import React from 'react'
import { useMediaViewerStyles } from './MediaViewer.style';

interface Props {
    items: FileDescription[];
    onContentHeightChange: VoidFunction;
}

export const MediaViewer = ({ items, onContentHeightChange }: Props) => {
    const { classes } = useMediaViewerStyles();

    return (
        <Box>
            {items.map((item) => {
                switch (item.typeContent) {
                    case ContentType.Video: {
                        return (<video key={item.url} className={classes.img} src={item.url} title={item.name} controls autoPlay/>)
                    }
                    case ContentType.Image: {
                        return (<img key={item.url} onLoad={() => onContentHeightChange()} className={classes.img} src={item.url} alt={item.name} title={item.name} />)
                    }
                }
            })}
        </Box>
    )
}
