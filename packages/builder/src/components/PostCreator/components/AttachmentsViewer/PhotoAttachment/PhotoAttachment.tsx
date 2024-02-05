/* eslint-disable @next/next/no-img-element */
import { Box, IconButton } from '@mui/material'
import React from 'react'
import { type FileDescription } from '~/types/ContentEditor'
import { usePhotoAttachmentStyles } from './PhotoAttachment.style';
import DeleteIcon from '@mui/icons-material/Delete';

export interface PhotoAttachmentProps {
    file: FileDescription;
    onDelete?: (file: FileDescription) => void;
}

export const PhotoAttachment = ({ file, onDelete }: PhotoAttachmentProps) => {
    const { classes } = usePhotoAttachmentStyles();

    return (
        <Box sx={{ height: 150, width: 150, marginRight: ({ spacing }) => spacing(1), flex: 'none', position: 'relative' }}>
            {onDelete && <IconButton onClick={() => { onDelete(file) }} aria-label="delete" size="small" sx={{ position: 'absolute', right: 5, top: 5 }} classes={{ root: classes.action }}>
                <DeleteIcon fontSize="small" />
            </IconButton>
            }
            <img className={classes.img} src={file.url} alt={file.name} title={file.name}/>
        </Box>
    )
}
