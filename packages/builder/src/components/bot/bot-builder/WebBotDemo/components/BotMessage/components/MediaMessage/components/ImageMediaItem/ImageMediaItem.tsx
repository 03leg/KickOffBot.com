import { WebImageMediaDescription } from '@kickoffbot.com/types';
import { Box } from '@mui/material';
import React, { useMemo } from 'react';
import { useImageMediaItemStyles } from './ImageMediaItem.style';
import { UnsplashAuthorBox } from '../UnsplashAuthorBox';

interface Props {
    image: WebImageMediaDescription;
    isLast: boolean;
    direction: 'row' | 'column';
    wrapped: boolean;
    count: number;
    onContentHeightChange: () => void;

}

export const ImageMediaItem = ({ image, isLast, direction, wrapped, count, onContentHeightChange }: Props) => {
    const { classes } = useImageMediaItemStyles({ image, isLast, direction, wrapped, count });
    const [showPhotoInfo, setShowPhotoInfo] = React.useState(false);

    const imageUrl = useMemo(() => {
        if (typeof image.image === 'string') {
            return image.image
        }

        if (image.image.source === 'unsplash') {
            return image.image.regularSrc
        }

        throw new Error('Unsupported image source');
    }, [image])

    return (
        <Box className={classes.imageContainer} onMouseEnter={() => setShowPhotoInfo(true)}
            onMouseLeave={() => setShowPhotoInfo(false)}>
            {typeof image.image !== "string" && image.image.source === 'unsplash' && showPhotoInfo && <UnsplashAuthorBox image={image.image} />}
            {image.isLink ? <a href={image.imageLink} target='_blank'> <img className={classes.img} src={imageUrl} onLoad={onContentHeightChange} /></a> : <img className={classes.img} src={imageUrl} onLoad={onContentHeightChange}/>}
        </Box>
    )
}
