import { GiphyFetch } from '@giphy/js-fetch-api';
import { Grid } from '@giphy/react-components';
import { Box, TextField } from '@mui/material';
import { isEmpty } from 'lodash';
import React, { useCallback, useEffect } from 'react';
import { env } from '~/env.mjs';

const gf = new GiphyFetch(env.NEXT_PUBLIC_GIPHY_API_KEY);

interface Props {
    onValueChange: (value: string) => void
}

export const GiphySelector = ({ onValueChange }: Props) => {
    const [searchText, setSearchText] = React.useState('');
    const [searchQuery, setSearchQuery] = React.useState('');

    const handleConnectionNameChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(event.target.value);
    }, []);

    const fetchGifs = useCallback((offset: number) => gf.trending({ offset, limit: 15 }), []);
    const searchGifs = useCallback((offset: number) => gf.search(searchQuery, { offset, limit: 15 }), [searchQuery]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            setSearchQuery(searchText);
        }, 1000)

        return () => clearTimeout(delayDebounceFn)
    }, [searchText])

    return (
        <>
            <Box sx={{ marginBottom: 2, display: 'flex', alignItems: 'center' }}>
                <TextField fullWidth variant="outlined" required placeholder='Search your Giphy...' value={searchText} onChange={handleConnectionNameChange} />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', overflow: 'auto', height: '500px' }}>
                <Grid key={searchQuery} width={800} columns={4} onGifClick={(gif) => onValueChange(gif.images.downsized.url)} noLink fetchGifs={isEmpty(searchQuery) ? fetchGifs : searchGifs} />
            </Box>
        </>
    )
}
