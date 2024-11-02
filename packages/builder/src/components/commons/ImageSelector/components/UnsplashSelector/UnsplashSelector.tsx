import { Box, TextField } from '@mui/material';
import React, { useCallback, useEffect } from 'react';
import { useUnsplash } from './useUnsplash';
import { UnsplashGrid } from './UnsplashGrid';
import { Random } from 'unsplash-js/dist/methods/photos/types';
import { UnsplashPhoto } from '@kickoffbot.com/types';
import { env } from '~/env.mjs';

interface Props {
    onValueChange: (value: UnsplashPhoto) => void
}

export const UnsplashSelector = ({ onValueChange }: Props) => {
    const [searchText, setSearchText] = React.useState('');
    const [searchQuery, setSearchQuery] = React.useState<null | string>(null);
    const { images, isLoading, error, fetchNextPage, noMoreImages, trackPhotoDownload } = useUnsplash(searchQuery);

    const handleSearchTextChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(event.target.value);
    }, []);


    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            setSearchQuery(searchText);
        }, 1000)

        return () => clearTimeout(delayDebounceFn)
    }, [searchText]);


    const handleNextPageLoad = useCallback(() => {
        if (!isLoading) {
            fetchNextPage();
        }
    }, [fetchNextPage, isLoading]);

    const handleSelectPhoto = useCallback((photo: Random) => {
        const data: UnsplashPhoto = {
            regularSrc: photo.urls.regular,
            smallSrc: photo.urls.small,
            thumbSrc: photo.urls.thumb,
            id: photo.id,
            source: 'unsplash',
            authorName: photo.user.name,
            authorNickname: photo.user.username,
            appName: env.NEXT_PUBLIC_UNSPLASH_APP_NAME,
        }

        trackPhotoDownload(photo);

        onValueChange(data);

    }, [onValueChange, trackPhotoDownload]);

    return (
        <>
            <Box sx={{ marginBottom: 2, display: 'flex', alignItems: 'center' }}>
                <TextField sx={{ flex: 1 }} variant="outlined" required placeholder='Search your image...' value={searchText} onChange={handleSearchTextChange} />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', overflow: 'auto', height: '500px' }}>
                <UnsplashGrid images={images} isLoading={isLoading} error={error} onNextPage={handleNextPageLoad}
                    onPhotoClick={handleSelectPhoto}
                    noMoreImages={noMoreImages === true} />
            </Box>
        </>
    )
}
