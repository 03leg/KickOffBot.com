import { WebImageMediaDescription } from '@kickoffbot.com/types';
import { Box, IconButton, Typography } from '@mui/material';
import React, { useMemo } from 'react';
import { useImageMediaStyles } from './ImageMedia.style';
import DeleteIcon from '@mui/icons-material/Delete';

interface Props {
    image: WebImageMediaDescription;
    onDelete?: (image: WebImageMediaDescription) => void;
    selected: boolean;
    onSelect: (image: WebImageMediaDescription) => void;
}

export const ImageMedia = ({ image, onDelete, selected, onSelect }: Props) => {
    const { classes, cx } = useImageMediaStyles();

    const imageUrl = useMemo(() => {
        if (typeof image.image === 'string') {
            return image.image;;
        }

        if (image.image.source === 'unsplash') {
            return image.image.regularSrc;
        }

        throw new Error('Unsupported image source');

    }, [image]);

    const hasVariableRef = useMemo(() => {
        if (typeof image.image === 'string' && /<%variables.(.*?)%>/g.test(image.image)) {
            return true;
        }

        return false;
    }, [image.image]);

    console.log(imageUrl, hasVariableRef);

    return (
        <Box className={cx(classes.root, selected && classes.selected)}>
            {onDelete && <IconButton onClick={() => { onDelete(image) }} aria-label="delete" size="small" classes={{ root: classes.action }}>
                <DeleteIcon fontSize="small" />
            </IconButton>
            }
            {!hasVariableRef && <img onClick={() => onSelect(image)} className={classes.img} src={imageUrl} />}
            {hasVariableRef && <Box className={classes.notImageBox} onClick={() => onSelect(image)}>Image URL has variable references</Box>}
        </Box>
    )
}
