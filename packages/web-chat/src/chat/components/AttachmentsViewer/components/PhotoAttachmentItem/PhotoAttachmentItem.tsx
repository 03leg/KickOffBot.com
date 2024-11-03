/* eslint-disable @next/next/no-img-element */
import { FileDescription } from '@kickoffbot.com/types';
import { Box } from '@mui/material';
import React from 'react';
import { usePhotoAttachmentItemStyles } from './PhotoAttachmentItem.style';

interface Props {
  file: FileDescription;
}

export const PhotoAttachmentItem = ({ file }: Props) => {
  const { classes } = usePhotoAttachmentItemStyles();

  return (
    <Box sx={{ height: 150, width: 150, marginRight: ({ spacing }) => spacing(1), flex: 'none', position: 'relative' }}>
      <img className={classes.img} src={file.url} alt={file.name} title={file.name} />
    </Box>
  )
}

