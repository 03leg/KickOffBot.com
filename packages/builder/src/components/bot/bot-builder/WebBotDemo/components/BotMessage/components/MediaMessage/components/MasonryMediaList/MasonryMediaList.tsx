/* eslint-disable jsx-a11y/alt-text */
import { WebImageMediaDescription, WebMediaDescription, WebMediaType } from '@kickoffbot.com/types';
import { ImageList, ImageListItem } from '@mui/material'
import React, { useCallback } from 'react'
import { getCssSize } from '../ImageMediaItem/ImageMediaItem.style';
import { UnsplashAuthorBox } from '../UnsplashAuthorBox';

interface Props {
    medias: WebMediaDescription[];
    onContentHeightChange: () => void;
}


const getImageUrl = (image: WebImageMediaDescription) => {
    if (typeof image.image === 'string') {
        return image.image
    }

    if (image.image.source === 'unsplash') {
        return image.image.regularSrc
    }

    throw new Error('Unsupported image source');
};

export const MasonryMediaList = ({ medias, onContentHeightChange}: Props) => {
    const [selectedImage, setSelectedImage] = React.useState<WebImageMediaDescription | undefined>(undefined);

    const handleImageClick = useCallback((image: WebImageMediaDescription) => {
        if (image.isLink) {
            window.open(image.imageLink, '_blank');
        }
    }, []);

    const isVisibleUnsplashAuthorBox = useCallback((image: WebImageMediaDescription) => {
        return selectedImage === image;
    }, [selectedImage])

    return (
        <ImageList variant="masonry" cols={3} gap={8}>
            {medias.map((item) => {

                if (item.type === WebMediaType.IMAGE) {
                    const imgDescription = item as WebImageMediaDescription;
                    const url = getImageUrl(imgDescription);

                    const imgElement = (<img
                        srcSet={url}
                        src={url}
                        loading="lazy"
                        onClick={() => handleImageClick(imgDescription)}
                        style={{
                            maxWidth: getCssSize(imgDescription.maxImageWidth),
                            maxHeight: getCssSize(imgDescription.maxImageHeight),
                            height: getCssSize(imgDescription.imageHeight),
                            width: getCssSize(imgDescription.imageWidth),
                            objectFit: "cover",
                            cursor: imgDescription.isLink ? 'pointer' : 'default',
                        }}
                    />);

                    return <ImageListItem key={item.id} onLoad={onContentHeightChange}  onMouseEnter={() => setSelectedImage(imgDescription)} onMouseLeave={() => setSelectedImage(undefined)}>
                        {imgElement}
                        {typeof imgDescription.image !== "string" && imgDescription.image.source === 'unsplash' && isVisibleUnsplashAuthorBox(imgDescription) && <UnsplashAuthorBox image={imgDescription.image} />}
                    </ImageListItem>
                }

                if (item.type === WebMediaType.VIDEO) {
                    return <>Not implemented yet...</>
                }

                throw new Error('Unsupported media type');
            })}
        </ImageList>
    )
}
