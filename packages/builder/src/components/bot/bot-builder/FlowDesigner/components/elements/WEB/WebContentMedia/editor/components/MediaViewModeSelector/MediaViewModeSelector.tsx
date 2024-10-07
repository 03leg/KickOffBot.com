import { MediaViewMode } from '@kickoffbot.com/types';
import { FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material';
import React, { useCallback } from 'react';

interface Props {
    viewMode: MediaViewMode;
    onViewModeChange: (viewMode: MediaViewMode) => void;
}

export const MediaViewModeSelector = ({ viewMode, onViewModeChange }: Props) => {

    const handleViewModeChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        onViewModeChange(event.target.value as MediaViewMode);
    }, [onViewModeChange])

    return (
        <>
            <Typography variant='h5'>Media View Mode</Typography>
            <RadioGroup sx={{ mb: 2 }} value={viewMode} onChange={handleViewModeChange} row>
                <FormControlLabel value={MediaViewMode.HorizontalMediaList} control={<Radio />} label="Horizontal Media List" />
                <FormControlLabel value={MediaViewMode.VerticalMediaList} control={<Radio />} label="Vertical Media List" />
                <FormControlLabel value={MediaViewMode.WrappedHorizontalMediaList} control={<Radio />} label="Wrapped Horizontal Media List" />
                <FormControlLabel value={MediaViewMode.MasonryMediaList} control={<Radio />} label="Media Gallery" />
            </RadioGroup>
        </>

    )
}
