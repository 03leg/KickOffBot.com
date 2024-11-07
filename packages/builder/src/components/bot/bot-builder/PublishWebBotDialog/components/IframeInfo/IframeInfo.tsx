import { TextField } from '@mui/material'
import React from 'react';

interface Props {
    src: string;
}

export const IframeInfo = ({ src }: Props) => {
    return (
        <>
            <TextField multiline rows={4} inputProps={{ spellCheck: 'false' }} fullWidth value={`<iframe
src="${src}"
style="width: 100%; height: 500px; border: none;"
></iframe>`} />
        </>
    )
}
