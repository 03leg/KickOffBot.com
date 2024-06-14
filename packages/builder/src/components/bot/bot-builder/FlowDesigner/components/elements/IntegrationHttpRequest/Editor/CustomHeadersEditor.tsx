
import { HttpHeader } from '@kickoffbot.com/types';
import { Box, Button, Typography } from '@mui/material';
import React, { useCallback } from 'react'
import { CustomHeader } from './CustomHeader';

interface Props {
    headers: HttpHeader[];
    onHeadersChange: (headers: HttpHeader[]) => void;
}

export const CustomHeadersEditor = ({ headers, onHeadersChange }: Props) => {

    const handleAddHeader = useCallback(() => {
        onHeadersChange([...headers, { header: '', value: '' }]);

    }, [headers, onHeadersChange]);

    return (
        <Box sx={{ mt: 2 }}>
            {headers.length > 0 && <Typography sx={{ mb: 1.5 }} variant="h6">Headers</Typography>}
            {headers.map((header, index) => (
                <CustomHeader header={header} onDelete={(header) => onHeadersChange(headers.filter((h) => h !== header))} key={index} />
            ))}
            <Button size='small' variant="outlined" onClick={handleAddHeader}>Add header</Button>
        </Box>
    )
}
