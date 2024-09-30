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

    const handleSearchTextChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
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
                <div style={{
                    height: '36px',
                    width: '101px',
                    backgroundRepeat: 'no-repeat',
                    backgroundImage: "url('data:image/png;base64,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')"
                }}></div>
                <TextField sx={{ ml: 2, flex: 1 }} variant="outlined" required placeholder='Search your gif...' value={searchText} onChange={handleSearchTextChange} />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', overflow: 'auto', height: '500px' }}>
                <Grid key={searchQuery} width={800} columns={4} onGifClick={(gif) => onValueChange(gif.images.downsized.url)} noLink fetchGifs={isEmpty(searchQuery) ? fetchGifs : searchGifs} />
            </Box>
        </>
    )
}
