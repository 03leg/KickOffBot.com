/* eslint-disable @next/next/no-img-element */
import { WebCardDescriptionClassic } from '@kickoffbot.com/types';
import React, { useCallback, useEffect } from 'react';
import { useCardDetailsViewStyles } from './CardDetailsView.style';
import { Box, Button, Typography } from '@mui/material';
import { useAppDialog } from '~/components/bot/bot-builder/Dialog/useAppDialog';
import { ImageSelector } from '~/components/commons/ImageSelector';
import { throwIfNil } from '~/utils/guard';
import { WebTextEditor } from '~/components/commons/WebTextEditor';

interface Props {
    item?: WebCardDescriptionClassic;
    onChange: () => void;
}

export const CardDetailsView = ({ item, onChange }: Props) => {
    const { classes } = useCardDetailsViewStyles();
    const { openDialog, closeDialog } = useAppDialog();
    const [imageUrl, setImageUrl] = React.useState<string | undefined>(item?.imgUrl);

    useEffect(() => {
        setImageUrl(item?.imgUrl);
    }, [item?.imgUrl]);


    const handleUpdateImageUrl = useCallback((imageUrl?: string) => {
        throwIfNil(item);

        closeDialog();

        if (imageUrl) {
            setImageUrl(imageUrl);
            item.imgUrl = imageUrl;
            onChange();
        }


    }, [closeDialog, item, onChange]);

    const handleSelectImage = useCallback(() => {
        let imageUrl: string | undefined;

        openDialog({
            content: <ImageSelector onImageUrlChange={(url: string) => {
                imageUrl = url;
            }} />,
            dialogMaxWidth: 'lg',
            title: 'Select image',
            buttons: [
                <Button variant='contained' key={'ok'} color='success' onClick={() => handleUpdateImageUrl(imageUrl)}>Select</Button>
            ],
        });

    }, [handleUpdateImageUrl, openDialog]);

    const handleDescriptionChange = useCallback((jsonState: string, htmlContent: string) => {
        throwIfNil(item);

        item.htmlDescription = htmlContent;
        item.jsonDescription = jsonState;

        onChange();
    }, [item, onChange]);

    if (!item) {
        return null
    }

    return (
        <Box className={classes.root}>
            <Box className={classes.content}>
                <Box className={classes.imagePreview}>
                    <Button variant='contained' color='success' onClick={handleSelectImage}>Select image</Button>
                    {imageUrl && <img className={classes.img} src={imageUrl} alt='image' />}
                    {!imageUrl && <Typography sx={{ textAlign: 'center', marginTop: 2 }}>No image</Typography>}
                </Box>
                <Box className={classes.textEditor}>
                    <WebTextEditor key={item.id} jsonState={item?.jsonDescription} onContentChange={handleDescriptionChange} />
                </Box>
            </Box>

        </Box>
    )
}
