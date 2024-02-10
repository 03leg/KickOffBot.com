/* eslint-disable @next/next/no-img-element */
import { ContentType, FileDescription } from '@kickoffbot.com/types';
import { Box } from '@mui/material';
import React from 'react'
import { FileAttachment } from '~/components/PostCreator/components/AttachmentsViewer/FileAttachment';
import { makeStyles } from "tss-react/mui";

interface Props {
    file?: FileDescription;
}



const useStyles = makeStyles()((theme) => ({
    root: {
        marginTop: 5,
    },
    img: {
        height: "350px",
        width: "100%",
        borderRadius: theme.shape.borderRadius,
        objectFit: "contain",
    },
    fileAttachment: {
        marginRight: 0
    }
}));


export const AttachmentViewer = ({ file }: Props) => {
    const { classes } = useStyles();

    if (!file) {
        return;
    }

    return (
        <Box className={classes.root}>
            {file.typeContent === ContentType.Image && <img className={classes.img} src={file.url} alt={file.name} title={file.name} />}
            {file.typeContent === ContentType.Other && <FileAttachment file={file} className={classes.fileAttachment} />}
        </Box>
    )
}
