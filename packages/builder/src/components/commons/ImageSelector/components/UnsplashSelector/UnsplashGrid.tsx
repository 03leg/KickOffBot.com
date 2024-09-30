/* eslint-disable @next/next/no-img-element */
import { Alert, Box, ImageList, ImageListItem, LinearProgress } from '@mui/material';
import React, { useCallback, useEffect } from 'react';
import { Random } from 'unsplash-js/dist/methods/photos/types';
import { env } from '~/env.mjs';

interface UnsplashGridProps {
    images: Random[];
    isLoading: boolean;
    error: boolean;
    onNextPage: () => void;
    noMoreImages: boolean;
    onPhotoClick: (photo: Random) => void;
}

export const UnsplashGrid = ({ images, isLoading, error, onNextPage, noMoreImages, onPhotoClick }: UnsplashGridProps) => {
    const scrollableAreaRef = React.useRef<HTMLDivElement | null>(null);

    const onScrollChange = useCallback(() => {
        if (!scrollableAreaRef.current || isLoading) {
            return;
        }

        const { scrollTop, scrollHeight, clientHeight } = scrollableAreaRef.current;
        const isNearBottom = scrollTop + clientHeight >= scrollHeight - 10;

        if (isNearBottom && noMoreImages === false) {
            onNextPage();
        }
    }, [isLoading, noMoreImages, onNextPage]);

    useEffect(() => {
        const listInnerElement = scrollableAreaRef.current;

        if (listInnerElement) {
            listInnerElement.addEventListener("scroll", onScrollChange);

            return () => {
                listInnerElement.removeEventListener("scroll", onScrollChange);
            };
        }
    }, [onScrollChange]);

    // console.log('UnsplashGrid', images)
    return (
        <Box ref={scrollableAreaRef} sx={{ width: '100%', height: 450, overflowY: 'scroll' }}>
            <ImageList variant="masonry" cols={3} gap={8}>
                {images.map((item) => (
                    <ImageListItem key={item.urls.regular} sx={{ cursor: 'pointer' }} onClick={() => onPhotoClick(item)}>
                        <img
                            srcSet={`${item.urls.regular}`}
                            src={`${item.urls.regular}`}
                            alt={item.alt_description ?? ''}
                            loading="lazy"
                        />
                        <Box sx={{ position: 'absolute', bottom: 0, left: 0, color: 'white', backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: 0.5, '& a': { color: 'white' } }}>
                            Photo by <a target='_blank' href={`https://unsplash.com/${item.user.username}?utm_source=${env.NEXT_PUBLIC_UNSPLASH_APP_NAME}&utm_medium=referral`}>{item.user.name}</a> on <a target='_blank' href={`https://unsplash.com/?utm_source=${env.NEXT_PUBLIC_UNSPLASH_APP_NAME}&utm_medium=referral`}>Unsplash</a>
                        </Box>
                    </ImageListItem>
                ))}
            </ImageList>
            {noMoreImages && <Alert severity="info">No more images...</Alert>}
            {error && <Alert severity="error">Failed to load images...</Alert>}
            {isLoading && <LinearProgress sx={{ marginTop: 3 }} />}
        </Box>
    )
}
