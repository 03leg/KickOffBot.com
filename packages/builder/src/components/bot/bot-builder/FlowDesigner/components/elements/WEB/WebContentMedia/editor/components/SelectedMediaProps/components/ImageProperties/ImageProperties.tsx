import { WebImageMediaDescription } from '@kickoffbot.com/types';
import { FormControlLabel, Checkbox, TextField, Box } from '@mui/material'
import React, { useCallback } from 'react';
import { useImagePropertiesStyles } from './ImageProperties.style';

interface Props {
    image: WebImageMediaDescription;
}

export const ImageProperties = ({ image }: Props) => {
    const [imageIsLink, setImageIsLink] = React.useState(image.isLink ?? false);
    const [imageLink, setImageLink] = React.useState(image.imageLink ?? '');
    const { classes } = useImagePropertiesStyles();

    const [imageWidth, setImageWidth] = React.useState(image.imageWidth ?? '');
    const [imageHeight, setImageHeight] = React.useState(image.imageHeight ?? '');
    const [maxImageWidth, setMaxImageWidth] = React.useState(image.maxImageWidth ?? '');
    const [maxImageHeight, setMaxImageHeight] = React.useState(image.maxImageHeight ?? '');

    const handleImageIsLinkChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setImageIsLink(event.target.checked);
        image.isLink = event.target.checked;
    }, [image]);

    const handleImageLinkChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setImageLink(event.target.value);
        image.imageLink = event.target.value;
    }, [image]);

    const handleImageWidthChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setImageWidth(event.target.value);
        image.imageWidth = event.target.value.replace(/ /g,'') === "" ? undefined : event.target.value;
    }, [image]);

    const handleImageHeightChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setImageHeight(event.target.value);
        image.imageHeight = event.target.value.replace(/ /g,'') === "" ? undefined : event.target.value;
    }, [image]);

    const handleMaxImageWidthChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setMaxImageWidth(event.target.value);
        image.maxImageWidth = event.target.value.replace(/ /g,'') === "" ? undefined : event.target.value;
    }, [image]);

    const handleMaxImageHeightChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setMaxImageHeight(event.target.value);
        image.maxImageHeight = event.target.value.replace(/ /g,'') === "" ? undefined : event.target.value;
    }, [image]);

    return (
        <Box className={classes.root}>
            <FormControlLabel control={<Checkbox checked={imageIsLink} onChange={handleImageIsLinkChange} />} label="Image is link" />
            {imageIsLink && <TextField className={classes.editorField} placeholder='https://site1.com' label="Link" value={imageLink} onChange={handleImageLinkChange} />}
            <TextField className={classes.editorField} placeholder='e.g. 100, 200px, 50%' label="Image width (optional)" value={imageWidth} onChange={handleImageWidthChange} />
            <TextField className={classes.editorField} placeholder='e.g. 100, 200px, 50%' label="Image height (optional)" value={imageHeight} onChange={handleImageHeightChange} />
            <TextField className={classes.editorField} placeholder='e.g. 100, 200px, 50%' label="Max image width (optional)" value={maxImageWidth} onChange={handleMaxImageWidthChange} />
            <TextField className={classes.editorField} placeholder='e.g. 100, 200px, 50%' label="Max image height (optional)" value={maxImageHeight} onChange={handleMaxImageHeightChange} />
        </Box>
    )
}
