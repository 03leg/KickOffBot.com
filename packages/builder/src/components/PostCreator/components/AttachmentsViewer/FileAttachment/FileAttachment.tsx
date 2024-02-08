import { Box, IconButton, Typography } from '@mui/material'
import React from 'react'
import AttachmentIcon from '@mui/icons-material/Attachment';
import { Colors } from '~/themes/Colors';
import DeleteIcon from '@mui/icons-material/Delete';
import { useFileAttachmentStyles } from './FileAttachment.style';
import { getSizeString } from '../../AttachEditor/utility';
import { FileDescription } from '@kickoffbot.com/types';

interface FileAttachmentProps {
    file: FileDescription;
    onDelete?: (file: FileDescription) => void;
    className?: string;
}

export const FileAttachment = ({ file, onDelete, className }: FileAttachmentProps) => {
    const { classes, cx } = useFileAttachmentStyles();
    return (
        <Box title={file.name} className={cx(classes.root, className)}>
            <AttachmentIcon sx={{ fontSize: '2rem', marginRight: ({ spacing }) => spacing(1) }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', maxWidth: 150 }}>
                <Typography sx={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{file.name}</Typography>
                <Typography>{getSizeString(file.size, 1)}</Typography>
            </Box>
            {onDelete && <Box sx={{ marginLeft: ({ spacing }) => spacing(1) }}>
                <IconButton onClick={() => { onDelete(file) }} aria-label="delete" size="small" classes={{ root: classes.action }}>
                    <DeleteIcon fontSize="small" />
                </IconButton>
            </Box>}
        </Box>
    )
}
