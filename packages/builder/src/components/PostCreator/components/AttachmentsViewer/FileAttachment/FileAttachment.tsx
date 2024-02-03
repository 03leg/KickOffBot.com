import { Box, IconButton, Typography } from '@mui/material'
import React from 'react'
import { type FileDescription } from '~/types/ContentEditor'
import AttachmentIcon from '@mui/icons-material/Attachment';
import { Colors } from '~/themes/Colors';
import DeleteIcon from '@mui/icons-material/Delete';
import { useFileAttachmentStyles } from './FileAttachment.style';

interface FileAttachmentProps {
    file: FileDescription;
    onDelete: (file: FileDescription) => void;
}

export const FileAttachment = ({ file, onDelete }: FileAttachmentProps) => {
    const { classes } = useFileAttachmentStyles();
    return (
        <Box title={file.name} sx={{ display: 'flex', alignItems: 'center', padding: ({ spacing }) => spacing(1), border: `1px solid ${Colors.BORDER}`, marginRight: ({ spacing }) => spacing(1) }}>
            <AttachmentIcon sx={{ fontSize: '2rem', marginRight: ({ spacing }) => spacing(1) }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', maxWidth: 150 }}>
                <Typography sx={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{file.name}</Typography>
                <Typography>{file.size}</Typography>
            </Box>
            <Box sx={{ marginLeft: ({ spacing }) => spacing(1) }}>
                <IconButton onClick={() => { onDelete(file) }} aria-label="delete" size="small" classes={{ root: classes.action }}>
                    <DeleteIcon fontSize="small" />
                </IconButton>
            </Box>
        </Box>
    )
}
