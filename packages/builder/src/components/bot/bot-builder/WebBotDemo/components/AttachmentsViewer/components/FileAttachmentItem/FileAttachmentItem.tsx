import { FileDescription } from '@kickoffbot.com/types';
import { Box, Typography } from '@mui/material';
import React from 'react';
import AttachmentIcon from '@mui/icons-material/Attachment';
import { useFileAttachmentItemStyles } from './FileAttachmentItem.style';
import { getSizeString } from './FileAttachmentItem.utils';

interface Props {
    file: FileDescription;
    stretch: boolean;
}

export const FileAttachmentItem = ({ file, stretch }: Props) => {
    const { classes } = useFileAttachmentItemStyles();

    return (
        <Box title={file.name} className={classes.root} sx={{ width: stretch ? '100%' : undefined, overflow: stretch ? 'hidden' : undefined }} onClick={() => { window.open(file.url) }}>
            <AttachmentIcon sx={{ fontSize: '2rem', marginRight: ({ spacing }) => spacing(1) }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', maxWidth: stretch ? undefined : 150 }}>
                <Typography sx={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{file.name}</Typography>
                <Typography>{getSizeString(file.size, 1)}</Typography>
            </Box>
        </Box>
    )
}
